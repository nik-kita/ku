import { crypto } from "@std/crypto";
import { encodeBase64 } from "@std/encoding";

const te = new TextEncoder();

function stringify({
  endpoint,
  method,
  timestamp,
  body,
}: {
  endpoint: string;
  timestamp: number;
  method: "POST" | "GET" | "DELETE";
  body?: object | string;
}) {
  let _body: string | object = body ?? "";

  if (Object(body) === body) {
    _body = JSON.stringify(body);
  }

  return `${timestamp}${method}${endpoint}${_body}`;
}

async function sign({
  apiSecret,
  payload,
}: {
  payload: string;
  apiSecret: string;
}): Promise<string> {
  const tePayload = te.encode(payload);
  const cryptoKey = await crypto
    .subtle
    .importKey(
      "raw",
      te.encode(apiSecret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"],
    );
  const result = encodeBase64(
    await crypto.subtle.sign("HMAC", cryptoKey, tePayload),
  );

  return result;
}

export async function kucoin_headers(
  {
    method,
    endpoint,
    query,
    body,
  }: {
    method: "POST" | "GET" | "DELETE";
    endpoint: string;
    query?: Record<string, unknown>;
    body?: Record<string, unknown>;
  },
  {
    key,
    secret,
    passphrase,
  }: Credentials,
) {
  const _endpoint = query && Object.keys(query).length
    ? `${endpoint}?${new URLSearchParams(query as Record<string, string>)}`
    : endpoint;
  const timestamp = Date.now();
  const stringToSign = stringify({
    endpoint: _endpoint,
    timestamp,
    method,
    body,
  });
  const [signature, signedPassphrase] = await Promise.all([
    sign({
      payload: stringToSign,
      apiSecret: secret,
    }),
    sign({
      payload: passphrase,
      apiSecret: secret,
    }),
  ]);
  const headers = {
    "KC-API-SIGN": signature,
    "KC-API-TIMESTAMP": timestamp.toString(),
    "KC-API-KEY": key,
    "KC-API-PASSPHRASE": signedPassphrase,
    "KC-API-KEY-VERSION": "2",
    "Content-Type": "application/json",
  } as const;

  return headers;
}

export type Credentials = Record<"key" | "secret" | "passphrase", string>;
