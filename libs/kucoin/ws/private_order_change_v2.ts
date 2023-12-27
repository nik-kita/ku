export type PrivateOrderChangeV2 = {
  topic: "/spotMarket/tradeOrdersV2";
  Message: Message;
  OrderData: BaseData;
  ReceivedMessage: ReceivedMessage;
  OpenMessage: OpenMessage;
  MatchMessage: MatchMessage;
  FilledMessage: FilledMessage;
  CanceledMessage: CanceledMessage;
  UpdateMessage: UpdateMessage;
  TradeOrderMessage: OrderData;
};

export function is_private_order_change_v2_message(
  message: unknown,
): message is Message {
  return (message as Message)?.subject === "orderChange" &&
    (message as Message)?.topic === "/spotMarket/tradeOrdersV2";
}

// Base message type
interface Message {
  type: "message";
  topic: "/spotMarket/tradeOrdersV2";
  subject: "orderChange";
  channelType: "private";
  data: OrderData;
}

// Common fields in OrderData
interface BaseData {
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
interface ReceivedMessage extends BaseData {
  type: "received";
}

interface OpenMessage extends BaseData {
  type: "open";
  size: string;
  filledSize: string;
  remainSize: string;
  canceledSize: string;
  canceledFunds: string;
}

interface MatchMessage extends BaseData {
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

interface FilledMessage extends BaseData {
  type: "filled" | "done";
  size: string;
  filledSize: string;
  remainSize: string;
  canceledSize: string;
  canceledFunds: string;
}

interface CanceledMessage extends BaseData {
  type: "canceled";
  size: string;
  filledSize: string;
  remainSize: string;
  canceledSize: string;
  canceledFunds: string;
}

interface UpdateMessage extends BaseData {
  type: "update";
  oldSize: string;
  size: string;
  filledSize: string;
  remainSize: string;
  canceledSize: string;
  canceledFunds: string;
}

// Union type for all message types
type OrderData =
  | ReceivedMessage
  | OpenMessage
  | MatchMessage
  | FilledMessage
  | CanceledMessage
  | UpdateMessage;
