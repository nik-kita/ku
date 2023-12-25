import { load } from "https://deno.land/std@0.210.0/dotenv/mod.ts";
import { Credentials } from "../kucoin_headers.ts";
import { hf_completed_orders } from "./hf_completed_orders.ts";
import { assert } from "https://deno.land/std@0.210.0/assert/assert.ts";

const credentials = await load() as Credentials;

Deno.test("Kucoin API: hf_completed_orders", async (t) => {
  await t.step("_", async () => {
    const res = await hf_completed_orders(credentials, {
      symbol: "BTC-USDT",
    });

    assert(Array.isArray(res?.data?.items));
  });
});
