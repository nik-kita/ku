import { load } from "@std/dotenv";
import { accounts } from "./accounts.ts";
import { Credentials } from "../kucoin_headers.ts";
import { assert } from "@std/assert";

const credentials = await load() as Credentials;

Deno.test({
  name: "Kucoin http API: accounts",
}, async (t) => {
  await t.step("_", async () => {
    const res = await accounts(credentials);

    assert(Array.isArray(res.data));
  });
});
