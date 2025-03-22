import { load } from "@std/dotenv";
import { Credentials } from "../libs/kucoin/kucoin_headers.ts";
import { accounts } from "../libs/kucoin/http/accounts.ts";

const credentials = await load() as Credentials;
const [usdt_res, btc_res] = await Promise.all([
  accounts(credentials, {
    currency: "USDT",
    type: "trade_hf",
  }),
  accounts(credentials, {
    currency: "BTC",
    type: "trade_hf",
  }),
]);

const banner = "=".repeat(20);
console.log(banner, "BTC", banner);
console.log(btc_res);
console.log(banner, "USDT", banner);
console.log(usdt_res);
