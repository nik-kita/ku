import { assert } from "https://deno.land/std@0.208.0/assert/assert.ts";
import { symbols } from "./symbols.ts";

Deno.test({
  name: "Kucoin http API: symbols",
}, async (t) => {
  await t.step("all", async () => {
    const res = await symbols();

    let success = true;

    try {
      assert(Array.isArray(res.data));
    } catch (_) {
      console.warn(res);
      success = false;
    }

    assert(success, "fail to parse response");
  });

  await t.step("BTC-USDT", async () => {
    const res = await symbols("BTC-USDT");

    let success = true;

    try {
      assert(res.data);
      assert(!Array.isArray(res.data));
    } catch (_) {
      console.warn(res);
      success = false;
    }

    assert(success, "fail to parse response");
  });
});
