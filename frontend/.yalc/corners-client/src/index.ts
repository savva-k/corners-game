import UserActions from "./UserActions";
import ServerEvents from "./ServerEvents";
import WebSocketLifecycle from "./Websocket";
import { io, Socket } from "socket.io-client";

const client = () => {
  const connect = (protocol: string, host: string, port: string | number) => {
    const server = `${protocol}://${host}:${port}`;
    console.log('connecting to ' + server);
    const socket = io(server, { forceNew: true });

    return {
      ...UserActions(socket),
      ...ServerEvents(socket),
      ...WebSocketLifecycle(socket),
    }
  };

  return {
    connect
  };
};

export default client();
