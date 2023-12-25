import { load } from "https://deno.land/std@0.210.0/dotenv/mod.ts";
import { hf_cancel_by_symbol } from "./hf_cancel_by_symbol.ts";
import { Credentials } from "../kucoin_headers.ts";
import { assert } from "https://deno.land/std@0.210.0/assert/assert.ts";

const credentials = await load() as Credentials;

Deno.test("Kucoin API: hf_cancel_by_symbol", async (t) => {
  await t.step("_", async () => {
    const res = await hf_cancel_by_symbol("BTC-USDT", credentials);

    assert(typeof res.data === "string");
  });
});
