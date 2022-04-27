import wsClient from "corners-client";

export interface ConnectionSettings {
  protocol: string;
  host: string;
  port: string;
}

export default (settings?: ConnectionSettings) => {
  const protocol = settings?.protocol || "ws";
  const host = settings?.host || "localhost";
  const port = settings?.port || "8080";
  const client = wsClient.connect(protocol, host, port);

  return {
    ...client,
  };
};
