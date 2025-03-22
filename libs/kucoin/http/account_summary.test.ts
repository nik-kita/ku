import { load } from "@std/dotenv";
import { account_summary } from "./account_summary.ts";
import { assert } from "@std/assert";
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
