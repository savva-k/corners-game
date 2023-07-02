import wsClient from "@corners-game/client";
import { Piece } from "@corners-game/common";

export interface ConnectionSettings {
  protocol: string;
  host: string;
  port: string;
}

export default (name: string, pieceColor: Piece, settings?: ConnectionSettings) => {
  const protocol = settings?.protocol || "ws";
  const host = settings?.host || "localhost";
  const port = settings?.port || "8080";
  const client = wsClient.connect(protocol, host, port);

  return {
    ...client,
    login: () => client.login(name),
    pieceColor,
    name,
  };
};
