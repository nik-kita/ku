const host = "https://api.kucoin.com" as const;

/**
 * @description
 * https://www.kucoin.com/docs/rest/spot-trading/market-data/get-part-order-book-aggregated-
 */
export async function aggregated_order_book(
  symbol: string,
  top: 20 | 50 | 100 = 100,
) {
  const res = await fetch(
    `${host}/api/v1/market/orderbook/level2_${top}?=symbol=${symbol}`,
  );
  const json = await res.json() as SuccessRes;

  return json;
}

type SuccessRes = {
  code: "20000";
  data: {
    sequence: string; // Sequence "number"
    time: number; // Timestamp
    bids: [string, string][]; // Bids
    asks: [string, string][]; // Asks
  };
};
