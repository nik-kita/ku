import { Credentials, kucoin_headers } from "../kucoin_headers.ts";

/**
 * @description
 * https://www.kucoin.com/docs/rest/spot-trading/orders/get-order-details-by-orderid
 */
export async function details_by_order_id(
  id: string,
  credentials: Credentials,
) {
  const endpoint = gen_endpoint(id);
  const headers = await kucoin_headers({
    method,
    endpoint,
  }, credentials);
  const res = await fetch(host + endpoint, {
    headers,
  });
  const json = await res.json();

  return json as OrderDetailsResponse;
}

const host = "https://api.kucoin.com" as const;
const gen_endpoint = (id: string) => "/api/v1/orders/" + id;
const method = "GET" as const;

interface OrderDetailsResponse {
  id: string;
  symbol: string;
  opType: string;
  type: string;
  side: "buy" | "sell";
  price: string;
  size: string;
  funds: string;
  dealFunds: string;
  dealSize: string;
  fee: string;
  feeCurrency: string;
  stp: string;
  stop: string;
  stopTriggered: boolean;
  stopPrice: string;
  timeInForce: string;
  postOnly: boolean;
  hidden: boolean;
  iceberg: boolean;
  visibleSize: string;
  cancelAfter: number;
  channel: string;
  clientOid: string;
  remark: string;
  tags: string;
  isActive: boolean;
  cancelExist: boolean;
  createdAt: number;
  tradeType: string;
}
