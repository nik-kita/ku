import { load } from "@std/dotenv";
import { Credentials } from "../libs/kucoin/kucoin_headers.ts";
import { account_summary } from "../libs/kucoin/http/account_summary.ts";

const credentials = await load() as Credentials;
const res = await account_summary(credentials);

console.log(res);
