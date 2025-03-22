import { load } from "@std/dotenv";
import { Credentials } from "../libs/kucoin/kucoin_headers.ts";
import { get_order_list } from "../libs/kucoin/http/order_list.ts";

const credentials = await load() as Credentials;

const res = await get_order_list(credentials);

console.log(res);
