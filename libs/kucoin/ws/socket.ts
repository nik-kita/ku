import { Credentials } from "../kucoin_headers.ts";
import { apply_private_token } from "./apply_private_token.ts";
import { SugarWs } from "https://deno.land/x/sugar_ws@v0.9.10/mod.ts";
import { PrivateOrderChangeV2 } from "./private_order_change_v2.ts";

export async function ku_ws_private(credentials: Credentials) {
  const { data: { instanceServers, token } } = await apply_private_token(
    credentials,
  );

  return new KuWsPrivate(`${instanceServers[0].endpoint}?token=${token}`);
}

class KuWsPrivate extends SugarWs {
  subscribe_private_order_change_v2() {
    const id = "// TODO".replace(" ", "_") + Date.now();

    this.send_if_open(JSON.stringify(
      {
        id,
        privateChannel: true,
        response: true,
        type: "subscribe",
        topic: "/spotMarket/tradeOrdersV2",
      } satisfies Subscription<PrivateOrderChangeV2["topic"]>,
    ));

    return () => {
      this.send_if_open(JSON.stringify(
        {
          id,
          type: "unsubscribe",
          response: true,
          topic: "/spotMarket/tradeOrdersV2",
          privateChannel: true,
        } satisfies Subscription<PrivateOrderChangeV2["topic"]>,
      ));
    };
  }
}

type Subscription<T> = {
  id: string;
  type: "subscribe" | "unsubscribe";
  topic: T;
  privateChannel: boolean;
  response: boolean;
};
