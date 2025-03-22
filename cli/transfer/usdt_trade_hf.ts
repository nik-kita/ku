import { load } from "@std/dotenv";
import { Credentials } from "../../libs/kucoin/kucoin_headers.ts";
import { inner_transfer } from "../../libs/kucoin/http/inner_transfer.ts";
import { monotonicUlid } from "@std/ulid/monotonic-ulid";

const credentials = await load() as Credentials;
const arg = Number.parseFloat(Deno.args.at(-1)!);
const amount = Number.isNaN(arg) ? 1 : arg;
const body = {
  amount: amount.toString(),
  currency: "USDT",
  from: "trade",
  to: "trade_hf",
  clientOid: monotonicUlid(),
} as const;
console.log("body", body);
const res = await inner_transfer(body, credentials);

console.log(res);
