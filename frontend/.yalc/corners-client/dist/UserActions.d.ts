import { Socket } from "socket.io-client";
import ClientToServerEvents from "corners-common/dist/socket.io/ClientToServerEvents";
import ServerToClientEvents from "corners-common/dist/socket.io/ServerToClientEvents";
declare const _default: (socket: Socket<ServerToClientEvents, ClientToServerEvents>) => {
    makeTurn: (gameId: string, current: string, desired: string) => void;
    joinGame: (gameId: string) => void;
    login: (name: string) => void;
    createGame: () => void;
};
export default _default;
