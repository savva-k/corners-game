import { Game } from "corners-types/dist/model/Game";
import { Player } from "corners-types/dist/model/Player";
import { Socket } from "socket.io-client";
import ClientToServerEvents from "corners-types/dist/socket.io/ClientToServerEvents";
import ServerToClientEvents from "corners-types/dist/socket.io/ServerToClientEvents";
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
