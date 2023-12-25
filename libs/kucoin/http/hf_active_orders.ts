import { Credentials, kucoin_headers } from "../kucoin_headers.ts";

/**
 * @description
 * https://www.kucoin.com/docs/rest/spot-trading/spot-hf-trade-pro-account/get-active-hf-orders-list
 */
export async function hf_active_orders(
  credentials: Credentials,
  params?: ActiveHfOrdersListRequest,
) {
  const _endpoint = `${endpoint}${
    params ? "?" + new URLSearchParams(params).toString() : ""
  }`;
  const headers = await kucoin_headers({
    method,
    endpoint,
    ...(params && { query: params }),
  }, credentials);
  const res = await fetch(host + _endpoint, {
    headers,
  });
  const json = await res.json();

  return json as ActiveHfOrdersListResponse;
}

const host = "https://api.kucoin.com" as const;
const endpoint = "/api/v1/hf/orders/active" as const;
const method = "GET" as const;

type ActiveHfOrdersListRequest = {
  symbol: string; // Mandatory: Only returns order information for the specified trading pair
};

interface ActiveHfOrdersListResponse {
  code: string;
  data: Array<{
    id: string; // Unique identifier of the order
    symbol: string; // Trading pair
    opType: string; // Operation type
    type: string; // Order type
    side: "buy" | "sell"; // Buy or sell
    price: string; // Order price
    size: string; // Order size
    dealSize: string; // Number of filled transactions
    cancelledSize: string; // Number of canceled transactions
    remainSize: string; // Number of remain transactions
    funds: string; // Order amount
    dealFunds: string; // Number of filled funds
    cancelledFunds: string; // Number of canceled funds
    remainFunds: string; // Number of remain funds
    fee: string; // Service fee
    feeCurrency: string; // Currency used to calculate fees
    stp: string; // Self trade protection
    timeInForce: string; // Time in force
    postOnly: boolean; // Is it post only?
    hidden: boolean; // Is it a hidden order?
    iceberg: boolean; // Is it an iceberg order?
    visibleSize: string; // Visible size of iceberg order in order book
    cancelAfter: number; // A GTT timeInForce that expires in n seconds
    channel: string; // Source of orders
    clientOid: string; // Identifier created by the client
    remark: string; // Order description
    tags: string; // Order identifier
    active: boolean; // Order status
    inOrderBook: boolean; // Whether to enter the orderbook
    cancelExist: boolean; // Are there any cancellation records?
    createdAt: number; // Order creation time
    lastUpdatedAt: number; // Last update time of order
    tradeType: string; // Trade type
  }>;
}
