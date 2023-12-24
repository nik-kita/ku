// Base message type
interface BaseMessage {
  type: "message";
  topic: "/spotMarket/tradeOrdersV2";
  subject: "orderChange";
  channelType: "private";
  data: OrderData;
}

// Common fields in OrderData
interface OrderData {
  symbol: string;
  orderType: string;
  side: string;
  orderId: string;
  orderTime: number;
  price: string;
  clientOid: string;
  status: string;
  originSize: string;
  originFunds: string;
  ts: number;
}

// Specific message types extending OrderData
interface ReceivedMessage extends OrderData {
  type: "received";
}

interface OpenMessage extends OrderData {
  type: "open";
  size: string;
  filledSize: string;
  remainSize: string;
  canceledSize: string;
  canceledFunds: string;
}

interface MatchMessage extends OrderData {
  type: "match";
  liquidity: string;
  size: string;
  filledSize: string;
  matchPrice: string;
  matchSize: string;
  tradeId: string;
  remainSize: string;
  canceledSize: string;
  canceledFunds: string;
}

interface FilledMessage extends OrderData {
  type: "filled";
  size: string;
  filledSize: string;
  remainSize: string;
  canceledSize: string;
  canceledFunds: string;
}

interface CanceledMessage extends OrderData {
  type: "canceled";
  size: string;
  filledSize: string;
  remainSize: string;
  canceledSize: string;
  canceledFunds: string;
}

interface UpdateMessage extends OrderData {
  type: "update";
  oldSize: string;
  size: string;
  filledSize: string;
  remainSize: string;
  canceledSize: string;
  canceledFunds: string;
}

// Union type for all message types
type TradeOrderMessage =
  | ReceivedMessage
  | OpenMessage
  | MatchMessage
  | FilledMessage
  | CanceledMessage
  | UpdateMessage;
