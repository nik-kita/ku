import { load } from "https://deno.land/std@0.210.0/dotenv/mod.ts";
import { Credentials } from "../libs/kucoin/kucoin_headers.ts";
import { account_summary } from "../libs/kucoin/http/account_summary.ts";

const credentials = await load() as Credentials;
const res = await account_summary(credentials);

console.log(res);
