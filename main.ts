import * as dotenv from "https://deno.land/std@0.210.0/dotenv/mod.ts";
import { aggregated_order_book } from "./libs/kucoin/http/aggregated_order_book.ts";
import { symbols } from "./libs/kucoin/http/symbols.ts";
import { place_hf_order } from "./libs/kucoin/http/place_hf_order.ts";
import { Credentials } from "./libs/kucoin/kucoin_headers.ts";
import { ku_ws_private } from "./libs/kucoin/ws/socket.ts";
import { gen_file_logger } from "./libs/logger/file_logger.ts";
import { monotonicFactory } from "https://deno.land/x/ulid@v0.3.0/mod.ts";
import { details_by_order_id } from "./libs/kucoin/http/details_by_order_id.ts";

const LOGGER = gen_file_logger();
const credentials = await dotenv.load() as Credentials;
const BTC_USDT = "BTC-USDT";
const ulid = monotonicFactory();
const [symbol_data, top_20] = await Promise.all([
  symbols("BTC-USDT"),
  aggregated_order_book(BTC_USDT),
]);
const btc_min_size = symbol_data.data.baseMinSize;
const my_btc_bid = top_20.data.bids.at(0)![0];
LOGGER.info("symbol_data", symbol_data);
LOGGER.info("top_20.data.bids, my_btc_bid", top_20.data.bids, my_btc_bid);

const socket = await ku_ws_private(credentials);

socket.on("message", ({ data }) => {
  const jData = JSON.parse(data);
  LOGGER.info("on message", jData);
  console.log("on message", jData);
});

await socket.wait_for("open");

socket.subscribe_private_order_change_v2();

const order = await place_hf_order(
  {
    symbol: BTC_USDT,
    type: "limit",
    clientOid: ulid(),
    side: "buy",
    price: my_btc_bid,
    size: btc_min_size,
  },
  credentials,
);

console.log(order);

setInterval(async () => {
  socket.send_if_open(JSON.stringify({
    id: Date.now(),
    type: "ping",
  }));
  // const order_details = await details_by_order_id(order.data.orderId, credentials);
  // console.log(order_details);
}, 10_000);

LOGGER.info("order", order);
