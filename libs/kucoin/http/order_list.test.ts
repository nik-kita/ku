import { assert } from "https://deno.land/std@0.210.0/assert/assert.ts";
import { load } from "https://deno.land/std@0.210.0/dotenv/mod.ts";
import { Credentials } from "../kucoin_headers.ts";
import { get_order_list } from "./order_list.ts";

const credentials = await load() as Credentials;

Deno.test({
  name: "Kucoin http API: order_list",
}, async (t) => {
  await t.step("_", async () => {
    const res = await get_order_list(credentials);

    assert(Array.isArray(res?.data?.items));
  });
});
