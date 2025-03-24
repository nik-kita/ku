import { load } from "@std/dotenv";
import { monotonicUlid } from "@std/ulid";
import { accounts } from "../libs/kucoin/http/accounts.ts";
import { hf_active_orders } from "../libs/kucoin/http/hf_active_orders.ts";
import { hf_actual_fee } from "../libs/kucoin/http/hf_actual_fee.ts";
import { hf_cancel_by_symbol } from "../libs/kucoin/http/hf_cancel_by_symbol.ts";
import { place_hf_order } from "../libs/kucoin/http/place_hf_order.ts";
import { symbols } from "../libs/kucoin/http/symbols.ts";
import { Credentials } from "../libs/kucoin/kucoin_headers.ts";
import { ku_ws } from "../libs/kucoin/ws/ku_ws.ts";
import { is_private_order_change_v2_message } from "../libs/kucoin/ws/private_order_change_v2.ts";
import { is_public_level2_best50_message } from "../libs/kucoin/ws/public_level2_50best.ts";

export async function first() {
  const credentials = await load() as Credentials;
  console.info(
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
  const {
    baseMinSize,
    baseIncrement,
  } = symbol_data.data;
  const btc_min_size_float = parseFloat(baseMinSize);
  let side: "buy" | "sell" = "buy";
  let processing_order = false;
  let last_price: number | null = null;
  const { data: prev_active_orders } = await hf_active_orders({
    symbol: BTC_USDT,
  }, credentials);
  if (prev_active_orders && prev_active_orders.length > 0) {
    await hf_cancel_by_symbol(BTC_USDT, credentials);
  }
  socket.on("message", async ({ data }) => {
    const jData = JSON.parse(data);

    if (is_private_order_change_v2_message(jData)) {
      console.info("order_change_v2 message", jData);
      if (jData.data.type === "filled" || jData.data.type === "done") {
        processing_order = false;
        side = side === "buy" ? "sell" : "buy";
        console.info(jData);
      } else if (jData.data.type === "canceled") {
        processing_order = false;
        last_price = null;
        console.warn(jData);
        return;
      }
    } else if (is_public_level2_best50_message(jData) && !processing_order) {
      const { asks, bids } = jData.data;

      if (processing_order) {
        return;
      }
      let price_attempt: number;

      if (side === "buy") {
        const best_big_bid = parseFloat(bids[0][0]);
        const better_big_bid = parseFloat(bids[1][0]);
        price_attempt = best_big_bid + (best_big_bid - better_big_bid),
          baseIncrement;
      } else {
        const best_small_ask = parseFloat(asks[0][0]);
        const better_small_ask = parseFloat(asks[1][0]);
        price_attempt = best_small_ask - (better_small_ask - best_small_ask),
          baseIncrement;
      }

      if (last_price) {
        if (side === "buy") {
          if (last_price - price_attempt < fee * 2) {
            return;
          }
        } else {
          if (price_attempt - last_price < fee * 2) {
            return;
          }
        }
      }

      last_price = price_attempt;

      const body = {
        symbol: BTC_USDT,
        type: "limit",
        clientOid: monotonicUlid(),
        side,
        price: roundedPrice(last_price, baseIncrement),
        size: String(btc_min_size_float + btc_min_size_float),
      } as const;
      processing_order = true;
      await place_hf_order(
        body,
        credentials,
      );
      console.info(`ASKS: ${asks.map(([p, a]) => `${p}:${a}`).join(" ")}`);
      console.info(`BIDS: ${bids.map(([p, a]) => `${p}:${a}`).join(" ")}`);
      console.info("order body", body);
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

function roundedPrice(price: number, priceIncrement: string) {
  return price.toFixed(priceIncrement.split(".")[1]?.length || 0);
}
