import { load } from "https://deno.land/std@0.210.0/dotenv/mod.ts";
import { Credentials } from "../../libs/kucoin/kucoin_headers.ts";
import { inner_transfer } from "../../libs/kucoin/http/inner_transfer.ts";
import { monotonicFactory } from "https://deno.land/x/ulid@v0.3.0/mod.ts";

const ulid = monotonicFactory();
const credentials = await load() as Credentials;
const arg = Number.parseFloat(Deno.args.at(-1)!);
const amount = Number.isNaN(arg) ? 0.00001 : arg;
const body = {
  amount: amount.toString(),
  currency: "BTC",
  from: "trade",
  to: "trade_hf",
  clientOid: ulid(),
} as const;
console.log("body", body);
const res = await inner_transfer(body, credentials);

console.log(res);
