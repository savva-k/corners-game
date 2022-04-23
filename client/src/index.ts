import UserActions from "./UserActions";
import ServerEvents from "./ServerEvents";
import WebSocketLifecycle from "./Websocket";

const client = () => {
  let ws: WebSocket;

  const connect = (protocol: string, host: string, port: string | number) => {
    const server = `${protocol}://${host}:${port}`;
    if (ws) ws.close();
    ws = new WebSocket(server);
  };

  const getWs = (): WebSocket => {
    if (!ws) throw "Please connect to a server first";
    return ws;
  };

  return {
    connect,
    ...UserActions(getWs),
    ...ServerEvents(getWs),
    ...WebSocketLifecycle(getWs),
  };
};

export default client();
