import { assert } from "@std/assert";
import { hf_actual_fee } from "./hf_actual_fee.ts";
import { load } from "@std/dotenv";
import { Credentials } from "../kucoin_headers.ts";

const credentials = await load() as Credentials;

Deno.test("Kucoin http API: hf_actual_fee", async (t) => {
  await t.step("_", async () => {
    const res = await hf_actual_fee(["BTC-USDT"], credentials);

    console.log(res);

    assert(Array.isArray(res.data));
  });
});
