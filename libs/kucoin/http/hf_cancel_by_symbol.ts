import { Credentials, kucoin_headers } from "../kucoin_headers.ts";

/**
 * @description
 * https://www.kucoin.com/docs/rest/spot-trading/spot-hf-trade-pro-account/cancel-all-hf-orders-by-symbol
 */
export async function hf_cancel_by_symbol(
  symbol: string,
  credentials: Credentials,
) {
  const query = { symbol };
  const _endpoint = `${endpoint}?${new URLSearchParams(query).toString()}`;
  const headers = await kucoin_headers({
    method,
    endpoint,
    query,
  }, credentials);
  const res = await fetch(host + _endpoint, { headers, method });
  const json = await res.json();

  return json as CancelAllHfOrdersBySymbolResponse;
}

const host = "https://api.kucoin.com" as const;
const endpoint = "/api/v1/hf/orders" as const;
const method = "DELETE" as const;

interface CancelAllHfOrdersBySymbolResponse {
  code: string;
  data: string; // The response data is a string indicating success, as no specific return value is required for batch cancellation.
}
