import * as dotenv from "https://deno.land/std@0.210.0/dotenv/mod.ts";
import { monotonicFactory } from "https://deno.land/x/ulid@v0.3.0/mod.ts";
import { place_hf_order } from "./libs/kucoin/http/place_hf_order.ts";
import { symbols } from "./libs/kucoin/http/symbols.ts";
import { Credentials } from "./libs/kucoin/kucoin_headers.ts";
import { ku_ws } from "./libs/kucoin/ws/ku_ws.ts";
import { is_private_order_change_v2_message } from "./libs/kucoin/ws/private_order_change_v2.ts";
import { is_public_level2_best50_message } from "./libs/kucoin/ws/public_level2_50best.ts";
import { gen_file_logger } from "./libs/logger/file_logger.ts";
import * as process from "node:process";

const LOGGER = gen_file_logger();
const credentials = await dotenv.load() as Credentials;
const BTC_USDT = "BTC-USDT";
const ulid = monotonicFactory();
const [
  symbol_data,
  socket,
] = await Promise.all([symbols("BTC-USDT"), ku_ws(credentials)]);
const btc_min_size = symbol_data.data.baseMinSize;
let side: "buy" | "sell" = "buy";
let processing_order = false;
let last_price: number | null = null;

const best_50 = {
  bids: [] as [string, string][] | [number, number][],
  asks: [] as [string, string][] | [number, number][],
};
socket.on("message", async ({ data }) => {
  process.stdout.write(".");

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
      throw new Error("Unexpected order cancelation");
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
          (side === "buy" && last_price! <= price) ||
          (side === "sell" && last_price! >= price)
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
      clientOid: ulid(),
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

socket.subscribe_level2_50best([BTC_USDT], ulid());
socket.subscribe_private_order_change_v2(ulid());

setInterval(() => {
  socket.send_if_open(JSON.stringify({
    id: Date.now(),
    type: "ping",
  }));
}, 10_000);
