import { assert } from "https://deno.land/std@0.210.0/assert/assert.ts";
import { apply_public_token } from "./apply_public_token.ts";

Deno.test({
  name: "Kucoin http API: apply_public_token",
}, async (t) => {
  await t.step("_", async () => {
    const res = await apply_public_token();

    assert(Array.isArray(res.data.instanceServers));
  });
});
