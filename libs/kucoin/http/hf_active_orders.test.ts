import { load } from "@std/dotenv";
import { hf_active_orders } from "./hf_active_orders.ts";
import { Credentials } from "../kucoin_headers.ts";
import { assert } from "@std/assert";

const credentials = await load() as Credentials;

Deno.test("Kucoin http API: hf_active_orders", async (t) => {
  await t.step("_", async () => {
    const res = await hf_active_orders({
      symbol: "BTC-USDT",
    }, credentials);

    assert(Array.isArray(res.data) || res.data === null);
  });
});
