import { assert } from "https://deno.land/std@0.210.0/assert/assert.ts";
import { load } from "https://deno.land/std@0.210.0/dotenv/mod.ts";
import { Credentials } from "../kucoin_headers.ts";
import { apply_private_token } from "./apply_private_token.ts";

const credentials = await load() as Credentials;

Deno.test({
  name: "Kucoin http API: apply_public_token",
}, async (t) => {
  await t.step("_", async () => {
    const res = await apply_private_token(credentials);

    assert(Array.isArray(res.data.instanceServers));
  });
});
