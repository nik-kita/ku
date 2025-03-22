import { load } from "@std/dotenv";
import { monotonicUlid } from "@std/ulid";
import { inner_transfer } from "../../libs/kucoin/http/inner_transfer.ts";
import { Credentials } from "../../libs/kucoin/kucoin_headers.ts";

let currency = "BTC";
let from: null | "trade_hf" | "trade" = null;
let to: null | "trade_hf" | "trade" = null;
let amount: null | number = null;
currency = prompt(`("${currency}" by default)\nCurrency:`) || currency;
do {
  from = prompt(
    `("trade" or "trade_hf", the <to> is become opposite)\nFrom:`,
  ) as null;
} while (!from || from !== "trade_hf" && from !== "trade");
to = from === "trade_hf" ? "trade" : "trade_hf";
do {
  amount = Number(prompt("Amount:"));
} while (typeof amount !== "number" || Number.isNaN(amount));

const credentials = await load() as Credentials;
const body = {
  amount: amount.toString(),
  currency,
  from,
  to,
  clientOid: monotonicUlid(),
} as const;
console.log("body", body);
const res = await inner_transfer(body, credentials);

console.log(res);
