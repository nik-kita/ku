import { assert } from "@std/assert";
import { load } from "@std/dotenv";
import { Credentials } from "../kucoin_headers.ts";
import { details_by_order_id } from "./details_by_order_id.ts";
import { place_hf_order } from "./place_hf_order.ts";

const credentials = await load() as Credentials;

Deno.test({
  name: "Kucoin http API: details_by_order_id",
}, async (t) => {
  await t.step("_", async () => {
    const order = await place_hf_order(
      {
        type: "limit",
        side: "buy",
        symbol: "BTC-USDT",
        size: "1",
        price: "10",
        clientOid: "TEST" + Date.now(),
      },
      credentials,
      true,
    );
    const res = await details_by_order_id(order.data.orderId, credentials);

    assert((res as unknown as Record<string, string>).code === "400100"); // test impossible without real order (here the sandbox feature is using)
  });
});
