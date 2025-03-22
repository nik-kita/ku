import * as log from "@std/log";
import { FileHandler, setup } from "@std/log";

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
      default: new log.FileHandler("DEBUG", {
        mode: "w",
        filename:
          `log__${now.getMonth()}_${now.getDay()}__${now.getHours()}:${now.getMinutes()}::${now.getSeconds()}.txt`,
        formatter: ({ args, msg }) => {
          return `${"=".repeat(20)} ${msg} ${"=".repeat(20)}\n\n${
            args
              .map((arg) => JSON.stringify(arg, null, 2))
              .join("\n")
          }\n\n`;
        },
      }),
    },
  });

  return log;
}
