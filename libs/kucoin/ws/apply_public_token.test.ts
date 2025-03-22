import { assert } from "@std/assert";
import { apply_public_token } from "./apply_public_token.ts";

Deno.test({
  name: "Kucoin http API: apply_public_token",
}, async (t) => {
  await t.step("_", async () => {
    const res = await apply_public_token();

    assert(Array.isArray(res.data.instanceServers));
  });
});
