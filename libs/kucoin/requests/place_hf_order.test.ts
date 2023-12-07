import { Credentials } from "../kucoin_headers.ts";
import { place_hf_order } from "./place_hf_order.ts";
import { monotonicFactory } from "https://deno.land/x/ulid@v0.3.0/mod.ts";
import { load } from "https://deno.land/std@0.208.0/dotenv/mod.ts";
import { assert } from "https://deno.land/std@0.208.0/assert/assert.ts";

const credentials = await load() as Credentials;

Deno.test({
  name: "Kucoin http API: place_hf_order",
}, async (t) => {
  const ulid = monotonicFactory();

  await t.step("sandbox", async () => {
    const res = await place_hf_order(
      {
        clientOid: ulid(),
        type: "limit",
        side: "buy",
        symbol: "BTC-USDT",
        price: "0.1",
        size: "100",
      },
      credentials,
      true,
    );

    let success = true;

    try {
      assert(res.data.orderId);
    } catch (_) {
      console.warn(res);
      success = false;
    }

    assert(success, "fail to parse response");
  });
});
