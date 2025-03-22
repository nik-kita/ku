import { load } from "@std/dotenv";
import { monotonicUlid } from "@std/ulid";
import { place_hf_order } from "../libs/kucoin/http/place_hf_order.ts";
import { symbols } from "../libs/kucoin/http/symbols.ts";
import { Credentials } from "../libs/kucoin/kucoin_headers.ts";
import { ku_ws } from "../libs/kucoin/ws/ku_ws.ts";
import { is_private_order_change_v2_message } from "../libs/kucoin/ws/private_order_change_v2.ts";
import { is_public_level2_best50_message } from "../libs/kucoin/ws/public_level2_50best.ts";
import { gen_file_logger } from "../libs/logger/file_logger.ts";
import { hf_actual_fee } from "../libs/kucoin/http/hf_actual_fee.ts";
import { accounts } from "../libs/kucoin/http/accounts.ts";
import { hf_active_orders } from "../libs/kucoin/http/hf_active_orders.ts";
import { hf_cancel_by_symbol } from "../libs/kucoin/http/hf_cancel_by_symbol.ts";

export async function first() {
  const LOGGER = gen_file_logger();
  const credentials = await load() as Credentials;
  LOGGER.info(
    "before bot starting",
    await accounts(credentials, { type: "trade_hf" }),
  );
  const BTC_USDT = "BTC-USDT";
  const [
    symbol_data,
    fees,
    socket,
  ] = await Promise.all([
    symbols(BTC_USDT),
    hf_actual_fee([BTC_USDT], credentials),
    ku_ws(credentials),
  ]);
  const { makerFeeRate } = fees.data[0];
  const fee = parseFloat(makerFeeRate);
  const btc_min_size = symbol_data.data.baseMinSize;
  let side: "buy" | "sell" = "buy";
  let processing_order = false;
  let last_price: number | null = null;
  const { data: prev_active_orders } = await hf_active_orders({
    symbol: BTC_USDT,
  }, credentials);
  if (prev_active_orders.length > 1) {
    await hf_cancel_by_symbol(BTC_USDT, credentials);
  } else if (prev_active_orders.length === 1) {
    const prev = prev_active_orders[0];
    processing_order = true;
    last_price = parseFloat(prev.price);
    side = prev.side;
  }
  const best_50 = {
    bids: [] as [string, string][] | [number, number][],
    asks: [] as [string, string][] | [number, number][],
  };
  const te = new TextEncoder();
  socket.on("message", async ({ data }) => {
    Deno.stdout.write(te.encode("."));

    const jData = JSON.parse(data);

    if (is_private_order_change_v2_message(jData)) {
      LOGGER.info("order_change_v2 message", jData);
      if (jData.data.type === "filled" || jData.data.type === "done") {
        processing_order = false;
        side = side === "buy" ? "sell" : "buy";
        console.log(jData);
      } else if (jData.data.type === "canceled") {
        processing_order = false;
        console.log(jData);
        throw new Error("Unexpected order cancellation");
      }
    } else if (is_public_level2_best50_message(jData) && !processing_order) {
      best_50.asks = jData.data.asks;
      best_50.bids = jData.data.bids;

      if (processing_order) {
        return;
      }
      let top: Array<[string, string] | [number, number]> = side === "buy"
        ? best_50.bids
        : best_50.asks;
      if (top.length === 0) {
        return;
      }
      if (last_price !== null) {
        top = (top as [string, string][]).reduce((acc, [p, a]) => {
          const price = parseFloat(p);
          if (
            (side === "buy" && (price + fee * 2) >= last_price!) ||
            (side === "sell" && price <= (last_price! + fee * 2))
          ) {
            return acc;
          }

          acc.push([price, parseFloat(a)]);

          return acc;
        }, [] as [number, number][]);
      }
      if (top.length === 0) {
        return;
      }
      const sorted_top = (top as [number, number][])
        .sort(([p, a], [p2, a2]) => {
          return side === "buy" ? a2 - a : p2 - p;
        });
      last_price = sorted_top.at(0)![0];
      const body = {
        symbol: BTC_USDT,
        type: "limit",
        clientOid: monotonicUlid(),
        side,
        price: last_price.toString(),
        size: btc_min_size,
      } as const;
      processing_order = true;
      console.log(body);
      await place_hf_order(
        body,
        credentials,
      );
      LOGGER.info("order body", body);
    }
  });

  await socket.wait_for("open");

  socket.subscribe_level2_50best([BTC_USDT], monotonicUlid());
  socket.subscribe_private_order_change_v2(monotonicUlid());

  const stop_ping_pong = setInterval(() => {
    socket.send_if_open(JSON.stringify({
      id: Date.now(),
      type: "ping",
    }));
  }, 10_000);

  return {
    stop: async () => {
      clearInterval(stop_ping_pong);
      await socket.wait_for("close").and_close();
    },
  };
}
