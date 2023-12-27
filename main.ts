import { first } from "./bots/first.ts";

const BOTS = {
  first,
} as const;

const name = Deno.args.at(-1);

const [_, bot] = Object.entries(BOTS).find(([n]) => n === name) || [];

if (bot) {
  await bot();
} else {
  console.warn("Available bots:", Object.keys(BOTS));
  console.info("Usage:");
  console.warn("deno task bot /available_bot_name/");
}
