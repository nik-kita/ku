import { load } from "@std/dotenv";
import { Credentials } from "../kucoin_headers.ts";
import { hf_completed_orders } from "./hf_completed_orders.ts";
import { assert } from "@std/assert";

const credentials = await load() as Credentials;

Deno.test("Kucoin http API: hf_completed_orders", async (t) => {
  await t.step("_", async () => {
    const res = await hf_completed_orders({
      symbol: "BTC-USDT",
    }, credentials);

    assert(res.code === "200000");
    assert(res.data === null || Array.isArray(res?.data?.items));
  });
});
