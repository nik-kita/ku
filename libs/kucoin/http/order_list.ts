import { Credentials, kucoin_headers } from "../kucoin_headers.ts";

const host = "https://api.kucoin.com" as const;
const endpoint = "/api/v3/oco/orders" as const;
const url = host + endpoint;
const method = "GET" as const;

/**
 * @description
 * https://www.kucoin.com/docs/rest/spot-trading/oco-order/get-order-list
 */
export async function get_order_list(credentials: Credentials) {
  const headers = await kucoin_headers({
    endpoint,
    method,
  }, credentials);
  const res = await fetch(url, { headers });
  const json = await res.json() as GetOrderListResponse;

  return json;
}

interface GetOrderListResponse {
  data: GetOrderListData;
}

interface GetOrderListData {
  currentPage: number;
  pageSize: number;
  totalNum: number;
  totalPage: number;
  items: OrderItem[];
}

interface OrderItem {
  orderId: string;
  symbol: string;
  clientOid: string;
  orderTime: number;
  status: "NEW" | "DONE" | "TRIGGERED" | "CANCELLED";
}
