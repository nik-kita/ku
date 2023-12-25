import { load } from "https://deno.land/std@0.210.0/dotenv/mod.ts";
import { accounts } from "./accounts.ts";
import { Credentials } from "../kucoin_headers.ts";
import { assert } from "https://deno.land/std@0.210.0/assert/assert.ts";

const credentials = await load() as Credentials;

Deno.test({
  name: "Kucoin http API: accounts",
}, async (t) => {
  await t.step("_", async () => {
    const res = await accounts(credentials);

    assert(Array.isArray(res.data));
  });
});
