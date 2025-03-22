import { load } from "@std/dotenv";
import { inner_transfer } from "./inner_transfer.ts";
import { Credentials } from "../kucoin_headers.ts";
import { assert } from "@std/assert";

const credentials = await load() as Credentials;

Deno.test({
  name: "Kucoin http API: inner_transfer",
}, async (t) => {
  await t.step("_", async () => {
    const res = await inner_transfer({
      amount: "0",
      clientOid: "test",
      currency: "BTC-USDT",
      from: "trade",
      to: "trade_hf",
    }, credentials) as unknown as Record<string, string>;
    console.log(res);
    // to avoid real resource transfer test make incorrect request
    // but error should be according to mistake (zero amount in this case)
    assert(res.msg === "amount must be greater than 0");
  });
});
