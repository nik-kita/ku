import { load } from "https://deno.land/std@0.210.0/dotenv/mod.ts";
import { Credentials } from "../libs/kucoin/kucoin_headers.ts";
import { accounts } from "../libs/kucoin/http/accounts.ts";

const credentials = await load() as Credentials;
const res = await accounts(credentials);

console.log(res);
