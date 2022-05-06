import { Game } from "corners-common/dist/model/Game";
import { Player } from "corners-common/dist/model/Player";
import { Socket } from "socket.io-client";
import ClientToServerEvents from "corners-common/dist/socket.io/ClientToServerEvents";
import ServerToClientEvents from "corners-common/dist/socket.io/ServerToClientEvents";
export interface OnLoginFunction {
    (games: Game[], player: Player): void;
}
export interface OnGameCreatedFunction {
    (game: Game): void;
}
export interface OnGameUpdatedFunction {
    (game: Game): void;
}
export interface OnErrorFunction {
    (message: string): void;
}
declare const _default: (socket: Socket<ServerToClientEvents, ClientToServerEvents>) => {
    onLogin: (f: OnLoginFunction) => OnLoginFunction;
    onGameCreated: (f: OnGameCreatedFunction) => OnGameCreatedFunction;
    onGameUpdated: (f: OnGameUpdatedFunction) => OnGameUpdatedFunction;
    onError: (f: OnErrorFunction) => OnErrorFunction;
};
export default _default;