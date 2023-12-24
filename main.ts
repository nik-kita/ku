import * as std from "https://deno.land/std@0.210.0/dotenv/mod.ts";
import { aggregated_order_book } from "./libs/kucoin/http/aggregated_order_book.ts";
import { symbols } from "./libs/kucoin/http/symbols.ts";
import { place_hf_order } from "./libs/kucoin/http/place_hf_order.ts";
import { Credentials } from "./libs/kucoin/kucoin_headers.ts";

const env = await std.load() as Credentials;
const BTC_USDT = "BTC-USDT";

const [symbol_data, top_20] = await Promise.all([
  symbols("BTC-USDT"),
  aggregated_order_book(BTC_USDT),
]);
const btc_min_size = symbol_data.data.baseMinSize;
const my_btc_bid = top_20.data.bids.at(-1)![0];
console.log(symbol_data);
console.log(top_20.data.bids, my_btc_bid);

const order = await place_hf_order(
  {
    symbol: BTC_USDT,
    type: "limit",
    clientOid: "ku",
    side: "buy",
    price: my_btc_bid,
    size: btc_min_size,
  },
  env,
  true,
);

console.log(order);
