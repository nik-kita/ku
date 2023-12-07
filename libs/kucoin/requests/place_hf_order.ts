import { Credentials, kucoin_headers } from "../kucoin_headers.ts";

const host = "https://api.kucoin.com" as const;
const endpoint = "/api/v1/hf/orders" as const;
const sandbox_endpoint = endpoint + "/test";
const url = host + endpoint;
const sandbox_url = host + sandbox_endpoint;
const method = "POST" as const;

export async function place_hf_order(
  body: Body,
  credentials: Credentials,
  sandbox = false,
) {
  const _url = sandbox ? sandbox_url : url;
  const _endpoint = sandbox ? sandbox_endpoint : endpoint;
  const headers = await kucoin_headers(
    { endpoint: _endpoint, method, body },
    credentials,
  );
  const res = await fetch(_url, {
    method,
    headers,
    body: JSON.stringify(body),
  });
  const json = await res.json() as SuccessRes;

  return json;
}

type Body =
  | (OrderGeneralParams<"limit"> & OrderLimitParams)
  | (OrderGeneralParams<"market"> & OrderMarketParams);
type OrderGeneralParams<T extends "limit" | "market"> = {
  clientOid: string; // Client Order Id, unique identifier created by the user, the use of UUID is recommended
  symbol: string; // Symbol, such as, ETH-BTC
  type: T; // Order type limit and market
  side: "buy" | "sell"; // Buy or sell
  stp?: string; // Self-trade prevention is divided into four strategies: CN, CO, CB, and DC
  tags?: string; // Order tag, length cannot exceed 20 characters (ASCII)
  remark?: string; // Order placement remarks, length cannot exceed 20 characters (ASCII)
};
type OrderLimitParams = {
  price: string; // Specify price for currency
  size: string; // Specify quantity for currency
  timeInForce?: string; // Order timing strategy GTC, GTT, IOC, FOK (The default is GTC)
  cancelAfter?: number; // Cancel after n seconds, the order timing strategy is GTT
  postOnly?: boolean; // Passive order labels, this is disabled when the order timing strategy is IOC or FOK
  hidden?: boolean; // Hidden or not (not shown in order book)
  iceberg?: boolean; // Whether or not only visible portions of orders are shown in iceberg orders
  visibleSize?: string; // Maximum visible quantity in iceberg orders
};
type OrderMarketParams = {
  size: string;
} | {
  funds: string;
};
type SuccessRes = {
  code: "20000";
  data: {
    orderId: string;
  };
};
