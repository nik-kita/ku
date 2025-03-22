import { Hono } from "hono";
import { first } from "./bots/first.ts";
import { DenoRegion } from "./deno-region.const.ts";

const app = new Hono();
const region = Deno.env.get("DENO_REGION");
const is_perfect_region = DenoRegion.Singapore === region;
const self_url = "https://kubot.deno.dev";

Deno.cron(
  "im not sleep",
  {
    [is_perfect_region ? "minute" : "hour"]: {
      every: is_perfect_region ? 1 : 100,
    },
  },
  is_perfect_region ? () => {} : async () => {
    await fetch(self_url).catch(console.warn);
  },
);

if (is_perfect_region) {
  const state = {
    on: false,
    stop: null as null | (() => Promise<void>),
  };
  app.get("on", async (c) => {
    if (!state.on) {
      state.on = true;
      state.stop = (await first()).stop;
      return c.text("ok");
    }

    return c.text("already on");
  }).get("off", async (c) => {
    if (state.on) {
      await state.stop!();
      state.stop = null;
      state.on = false;

      return c.text("ok");
    }

    return c.text("already off");
  });
} else {
  app.use("*", async (c) => {
    const res = await c.text(region!);
    return res;
  });
}

Deno.serve(app.fetch);
