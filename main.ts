import { parseArgs } from "@std/cli";
import { first } from "./bots/first.ts";

const {
  bot_name,
} = await parseArgs(Deno.args, {
  string: ["bot_name"],
});
const BOTS = {
  first,
} as const;

const [_, bot] = Object.entries(BOTS).find(([n]) => n === bot_name) || [];

if (bot) {
  await bot();
} else {
  console.warn("Available bots:", Object.keys(BOTS));
  console.info("Usage:");
  console.warn("deno task bot --bot_name=<available_bot_name>");
}
