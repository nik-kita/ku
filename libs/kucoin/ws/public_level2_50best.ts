export type PublicLevel2Best50 = {
  topic: `/spotMarket/level2Depth50:${string}`;
  Level2Depth50Message: Level2Depth50Message;
  Level2Depth50Data: Level2Depth50Data;
  Order: Order;
};

interface Level2Depth50Message {
  type: "message";
  topic: string;
  subject: "level2";
  data: Level2Depth50Data;
}

interface Level2Depth50Data {
  asks: Order[]; // Array of ask orders, each order is [price, size]
  bids: Order[]; // Array of bid orders, each order is [price, size]
  timestamp: number;
}

// Define a type for an order, which is a tuple of price and size
type Order = [string, string];
