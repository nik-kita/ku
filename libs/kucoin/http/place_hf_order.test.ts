import { Credentials } from "../kucoin_headers.ts";
import { place_hf_order } from "./place_hf_order.ts";
import { monotonicUlid } from "@std/ulid";
import { load } from "@std/dotenv";
import { assert } from "@std/assert";

const credentials = await load() as Credentials;

Deno.test({
  name: "Kucoin http API: place_hf_order",
}, async (t) => {
  await t.step("sandbox", async () => {
    const res = await place_hf_order(
      {
        clientOid: monotonicUlid(),
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
