type topic = `/spotMarket/level2Depth50:${string}`;
const _topic = "/spotMarket/level2Depth50:" satisfies topic;
export type PublicLevel2Best50 = {
  topic: topic;
  Level2Depth50Message: Message;
  Level2Depth50Data: Level2Depth50Data;
  Order: Order;
};

export function is_public_level2_best50_message(
  message: unknown,
): message is Message {
  return (message as Message)?.subject === "level2" &&
    (message as Message)?.topic.slice(0, _topic.length) === _topic;
}

interface Message {
  type: "message";
  topic: topic;
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
