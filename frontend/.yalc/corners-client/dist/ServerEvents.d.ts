import { Game } from "./model/Game";
import { Player } from "./model/Player";
export interface OnIdentityCreatedFunction {
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
declare const _default: (getWs: () => WebSocket) => {
    init: () => (event: MessageEvent<any>) => void;
    onIdentityCreated: (f: OnIdentityCreatedFunction) => OnIdentityCreatedFunction;
    onGameCreated: (f: OnGameCreatedFunction) => OnGameCreatedFunction;
    onGameUpdated: (f: OnGameUpdatedFunction) => OnGameUpdatedFunction;
    onError: (f: OnErrorFunction) => OnErrorFunction;
};
export default _default;
