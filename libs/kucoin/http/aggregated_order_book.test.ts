import { assert } from "@std/assert";
import { aggregated_order_book } from "./aggregated_order_book.ts";

Deno.test({
  name: "Kucoin http API: aggregated_order_book",
}, async (t) => {
  for await (const top of [20, 50, 100, undefined]) {
    await t.step(`${top || "default(100)"}`, async () => {
      const res = await aggregated_order_book("BTC-USDT", 20);

      let success = true;

      try {
        assert(res.data.asks);
      } catch (_) {
        console.warn(res);
        success = false;
      }

      assert(Array.isArray(res.data.bids), "Array is expected");
      assert(success, "fail to parse response");
    });
  }
});
