import { assert } from "https://deno.land/std@0.210.0/assert/assert.ts";
import { hf_actual_fee } from "./hf_actual_fee.ts";
import { load } from "https://deno.land/std@0.210.0/dotenv/mod.ts";
import { Credentials } from "../kucoin_headers.ts";

const credentials = await load() as Credentials;

Deno.test("Kucoin API: hf_actual_fee", async (t) => {
  await t.step("_", async () => {
    const res = await hf_actual_fee(["BTC-USDT"], credentials);

    console.log(res);

    assert(Array.isArray(res.data));
  });
});
