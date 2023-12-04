const host = "https://api.kucoin.com" as const;
const endpoint = "/api/v2/symbols" as const;
const url = host + endpoint;

export async function symbols(pair: string): Promise<SuccessRes<ResData>>;
export async function symbols(): Promise<SuccessRes<ResData[]>>;
export async function symbols(pair?: string) {
  const res = await fetch(pair ? `${url}/${pair}` : url);
  const json = await res.json() as SuccessRes;

  return json;
}

type SuccessRes<T = ResData | ResData[]> = {
  code: "20000";
  data: T;
};
type ResData = {
  symbol: string; // Unique code of a symbol, it would not change after renaming
  name: string; // Name of trading pairs, it would change after renaming
  baseCurrency: string; // Base currency, e.g., BTC.
  quoteCurrency: string; // Quote currency, e.g., USDT.
  market: string; // The trading market.
  baseMinSize: string; // The minimum order quantity required to place an order.
  quoteMinSize: string; // The minimum order funds required to place a market order.
  baseMaxSize: string; // The maximum order size required to place an order.
  quoteMaxSize: string; // The maximum order funds required to place a market order.
  baseIncrement: string; // The increment of the order size. The value shall be a positive multiple of the baseIncrement.
  quoteIncrement: string; // The increment of the funds required to place a market order. The value shall be a positive multiple of the quoteIncrement.
  priceIncrement: string; // The increment of the price required to place a limit order. The value shall be a positive multiple of the priceIncrement.
  feeCurrency: string; // The currency of charged fees.
  enableTrading: boolean; // Available for transaction or not.
  isMarginEnabled: boolean; // Available for margin or not.
  priceLimitRate: string; // Threshold for price protection.
  minFunds: string; // The minimum spot and margin trading amounts.
};
