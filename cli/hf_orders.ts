import { load } from "@std/dotenv";
import { Credentials } from "../libs/kucoin/kucoin_headers.ts";
import { hf_active_orders } from "../libs/kucoin/http/hf_active_orders.ts";
import { hf_completed_orders } from "../libs/kucoin/http/hf_completed_orders.ts";

const params = { symbol: "BTC-USDT" };
const credentials = await load() as Credentials;
const [active, completed] = await Promise.all([
  hf_active_orders(params, credentials),
  hf_completed_orders(params, credentials),
]);
const banner = "=".repeat(20);
console.log(banner, "active", banner);
console.log(active);
console.log(banner, "completed", banner);
console.log(completed);
