export const PEER_GATEWAY_ROUTE_NAME = 'peers' as const;
export const PEER_GATEWAY_ROUTES = {
  REQUEST_RTP_CAPABILITIES: 'request-rtp-capabilities',
  CREATE_TRANSPORT: 'create-transport',
  CONNECT_TRANSPORT: 'connect-transport',
  PRODUCE: 'produce',
  CONSUME: 'consume',
} as const;
