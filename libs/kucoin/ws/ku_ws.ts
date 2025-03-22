import { SugarWs } from "@nik-kita/sugar-ws";
import { Credentials } from "../kucoin_headers.ts";
import { apply_private_token } from "./apply_private_token.ts";
import { PrivateOrderChangeV2 } from "./private_order_change_v2.ts";
import { PublicLevel2Best50 } from "./public_level2_50best.ts";

export async function ku_ws(credentials: Credentials) {
  const { data: { instanceServers, token } } = await apply_private_token(
    credentials,
  );

  return new KuWs(`${instanceServers[0].endpoint}?token=${token}`);
}

class KuWs extends SugarWs {
  subscribe_level2_50best(symbols: string[], id: string) {
    this.send_if_open(JSON.stringify(
      {
        id,
        type: "subscribe",
        privateChannel: false,
        response: true,
        topic: `/spotMarket/level2Depth50:${symbols.join()}`,
      } satisfies Subscription<PublicLevel2Best50["topic"]>,
    ));
  }
  subscribe_private_order_change_v2(id: string) {
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
