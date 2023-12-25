import { Credentials, kucoin_headers } from "../kucoin_headers.ts";

/**
 * @description
 * https://www.kucoin.com/docs/rest/account/basic-info/get-account-summary-info
 */
export async function account_summary_info(credentials: Credentials) {
  const headers = await kucoin_headers({ endpoint, method }, credentials);
  const res = await fetch(url, { headers });
  const json = await res.json();

  return json as GetAccountSummaryInfoResponse;
}

const host = "https://api.kucoin.com" as const;
const endpoint = "/api/v2/user-info" as const;
const method = "GET" as const;
const url = host + endpoint;

interface GetAccountSummaryInfoResponse {
  data: AccountSummaryInfo;
  code: string;
}

interface AccountSummaryInfo {
  level: number;
  subQuantity: number;
  maxDefaultSubQuantity: number;
  maxSubQuantity: number;
  spotSubQuantity: number;
  marginSubQuantity: number;
  futuresSubQuantity: number;
  maxSpotSubQuantity: number;
  maxMarginSubQuantity: number;
  maxFuturesSubQuantity: number;
}
