/**
 * @description
 * https://www.kucoin.com/docs/websocket/basic-info/apply-connect-token/public-token-no-authentication-required-
 */
export async function apply_public_token() {
  const res = await fetch(url, { method });
  const json = await res.json();

  return json as ApiResponse;
}

const host = "https://api.kucoin.com" as const;
const endpoint = "/api/v1/bullet-public" as const;
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
