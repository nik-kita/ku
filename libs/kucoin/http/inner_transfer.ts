import { Credentials, kucoin_headers } from "../kucoin_headers.ts";

/**
 * @description
 * https://www.kucoin.com/docs/rest/funding/transfer/inner-transfer
 */
export async function inner_transfer(
  body: InnerTransferRequest,
  credentials: Credentials,
) {
  const headers = await kucoin_headers({
    endpoint,
    method,
    body,
  }, credentials);
  const res = await fetch(host + endpoint, {
    headers,
    body: JSON.stringify(body),
    method,
  });
  const json = await res.json();

  return json as InnerTransferResponse;
}

const host = "https://api.kucoin.com" as const;
const endpoint = "/api/v2/accounts/inner-transfer" as const;
const method = "POST" as const;

interface InnerTransferResponse {
  orderId: string; // The order ID of the funds transfer
}

type InnerTransferRequest = {
  clientOid: string; // Unique identifier created by the client
  currency: string; // Currency
  from:
    | "main"
    | "trade"
    | "trade_hf"
    | "margin"
    | "isolated"
    | "margin_v2"
    | "isolated_v2";
  to:
    | "main"
    | "trade"
    | "trade_hf"
    | "margin"
    | "isolated"
    | "margin_v2"
    | "isolated_v2"
    | "contract";
  amount: string; // Transfer amount
  fromTag?: string; // Trading pair, required if 'from' is 'isolated'
  toTag?: string; // Trading pair, required if 'to' is 'isolated'
};
