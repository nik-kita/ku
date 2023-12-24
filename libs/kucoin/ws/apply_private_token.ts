import { Credentials, kucoin_headers } from "../kucoin_headers.ts";

/**
 * @description
 * https://www.kucoin.com/docs/websocket/basic-info/apply-connect-token/private-channels-authentication-request-required-
 */
export async function apply_private_token(credentials: Credentials) {
  const headers = await kucoin_headers(
    { endpoint, method },
    credentials,
  );
  const res = await fetch(url, { method, headers });
  const json = await res.json();

  return json as ApiResponse;
}

const host = "https://api.kucoin.com" as const;
const endpoint = "/api/v1/bullet-private" as const;
const url = `${host}${endpoint}`;
const method = "POST" as const;

// Main response type
interface ApiResponse {
  code: string;
  data: ResponseData;
}

// Data field in the response
interface ResponseData {
  token: string;
  instanceServers: InstanceServer[];
}

// Instance server structure in the data field
interface InstanceServer {
  endpoint: string;
  encrypt: boolean;
  protocol: string;
  pingInterval: number;
  pingTimeout: number;
}
