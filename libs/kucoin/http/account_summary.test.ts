import { load } from "https://deno.land/std@0.210.0/dotenv/mod.ts";
import { account_summary } from "./account_summary.ts";
import { assert } from "https://deno.land/std@0.210.0/assert/assert.ts";
import { Credentials } from "../kucoin_headers.ts";

const credentials = await load() as Credentials;

Deno.test({
  name: "Kucoin http API: account_summary_info",
}, async (t) => {
  await t.step("_", async () => {
    const res = await account_summary(credentials);

    assert(!Number.isNaN(res?.data?.level));
  });
});
