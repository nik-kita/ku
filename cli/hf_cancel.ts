import { load } from "@std/dotenv";
import { Credentials } from "../libs/kucoin/kucoin_headers.ts";
import { hf_cancel_by_symbol } from "../libs/kucoin/http/hf_cancel_by_symbol.ts";

const credentials = await load() as Credentials;
const res = await hf_cancel_by_symbol("BTC-USDT", credentials);
console.log(res);
