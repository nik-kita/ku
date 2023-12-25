import { Credentials, kucoin_headers } from "../kucoin_headers.ts";

/**
 * @description
 * https://www.kucoin.com/docs/rest/account/basic-info/get-account-list-spot-margin-trade_hf
 */
export async function accounts(credentials: Credentials) {
  const headers = await kucoin_headers({ endpoint, method }, credentials);
  const res = await fetch(host + endpoint, { headers });
  const json = await res.json();

  return json as AccountListResponse;
}

const host = "https://api.kucoin.com" as const;
const endpoint = "/api/v1/accounts" as const;
const method = "GET" as const;

interface AccountListResponse {
  data: Account[];
}

interface Account {
  id: string; // Account ID
  currency: string; // Currency
  type: "main" | "trade" | "margin" | "trade_hf"; // Account type
  balance: string; // Total assets of a currency
  available: string; // Available assets of a currency
  holds: string; // Hold assets of a currency
}
