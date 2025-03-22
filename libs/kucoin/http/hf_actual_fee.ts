import { Credentials, kucoin_headers } from "../kucoin_headers.ts";

/**
 * @description
 * https://www.kucoin.com/docs/rest/funding/trade-fee/trading-pair-actual-fee-spot-margin-trade_hf
 */
export async function hf_actual_fee(
  symbols: string[],
  credentials: Credentials,
) {
  const headers = await kucoin_headers({
    method,
    endpoint,
    query: {
      symbols,
    },
  }, credentials);
  const url = `${host}${endpoint}?symbols=${symbols.join()}`;
  const res = await fetch(url, { headers });
  const json = await res.json();

  return json as TradingPairActualFeeResponse;
}

const host = "https://api.kucoin.com" as const;
const endpoint = "/api/v1/trade-fees" as const;
const method = "GET" as const;

interface TradingPairActualFeeResponse {
  data: FeeRate[];
}

interface FeeRate {
  symbol: string; // Unique identity of the trading pair
  takerFeeRate: string; // Actual taker fee rate of the trading pair
  makerFeeRate: string; // Actual maker fee rate of the trading pair
}
