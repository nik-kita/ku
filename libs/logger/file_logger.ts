import { FileHandler } from "https://deno.land/std@0.210.0/log/handlers.ts";
import * as log from "https://deno.land/std@0.210.0/log/mod.ts";
import { setup } from "https://deno.land/std@0.210.0/log/mod.ts";

export function gen_file_logger() {
  const now = new Date();

  Deno.addSignalListener("SIGINT", () => {
    log.getLogger().handlers.forEach((l) => {
      (l as FileHandler).flush();
    });
    Deno.exit();
  });

  setup({
    handlers: {
      default: new log.handlers.FileHandler("DEBUG", {
        mode: "w",
        filename:
          `log__${now.getMonth()}_${now.getDay()}__${now.getHours()}:${now.getMinutes()}::${now.getSeconds()}.txt`,
        formatter: ({ args, msg }) => {
          return `${"=".repeat(20)} ${msg} ${"=".repeat(20)}\n\n${args
              .map((arg) => JSON.stringify(arg, null, 2))
              .join("\n")
            }\n\n`;
        },
      }),
    },
  });

  return log;
}
