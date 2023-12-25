import { Credentials, kucoin_headers } from "../kucoin_headers.ts";

/**
 * @description
 * https://www.kucoin.com/docs/rest/spot-trading/spot-hf-trade-pro-account/get-hf-completed-order-list
 */
export async function hf_completed_orders(
  credentials: Credentials,
  params?: HfCompletedOrderListRequest,
) {
  const _endpoint = `${endpoint}${
    params ? "?" + new URLSearchParams(params).toString() : ""
  }`;
  const headers = await kucoin_headers({
    method,
    endpoint,
    ...(params && { query: params }),
  }, credentials);
  const res = await fetch(host + _endpoint, { headers });
  const json = await res.json();

  return json as HfCompletedOrderListResponse;
}

const method = "GET" as const;
const host = "https://api.kucoin.com" as const;
const endpoint = "/api/v1/hf/orders/done" as const;

interface HfCompletedOrderListResponse {
  code: string;
  data: {
    lastId: number;
    items: HfOrderItem[];
  };
}

interface HfOrderItem {
  id: string;
  symbol: string;
  opType: string;
  type: string;
  side: "buy" | "sell";
  price: string;
  size: string;
  funds: string;
  dealSize: string;
  dealFunds: string;
  fee: string;
  feeCurrency: string;
  stp: string;
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
  cancelExist: boolean;
  createdAt: number;
  lastUpdatedAt: number;
  tradeType: string;
  inOrderBook: boolean;
  active: boolean;
  cancelledSize: string;
  cancelledFunds: string;
  remainSize: string;
  remainFunds: string;
}

type HfCompletedOrderListRequest = {
  symbol: string; // Mandatory: Only returns order information for the specified trading pair
  side?: "buy" | "sell"; // Optional: buy or sell
  type?: "limit" | "market"; // Optional: limit (limit order), market (market order)
  startAt?: string; // Optional: Start time (ms), last update (filled) time of the limit order
  endAt?: string; // Optional: End time (ms), last update (filled) time of limit order
  lastId?: string; // Optional: The id of the last data item from the previous batch, defaults to obtaining the latest data
  limit?: string; // Optional: Default 20, maximum 100
};
