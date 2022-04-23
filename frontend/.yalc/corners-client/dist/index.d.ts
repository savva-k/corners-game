declare const _default: {
    onopen: (f: () => void) => () => void;
    onclose: (f: (e: CloseEvent) => void) => (e: CloseEvent) => void;
    onerror: (f: (e: Event) => void) => (e: Event) => void;
    init: () => (event: MessageEvent<any>) => void;
    onIdentityCreated: (f: import("./ServerEvents").OnIdentityCreatedFunction) => import("./ServerEvents").OnIdentityCreatedFunction;
    onGameCreated: (f: import("./ServerEvents").OnGameCreatedFunction) => import("./ServerEvents").OnGameCreatedFunction;
    onGameUpdated: (f: import("./ServerEvents").OnGameUpdatedFunction) => import("./ServerEvents").OnGameUpdatedFunction;
    onError: (f: import("./ServerEvents").OnErrorFunction) => import("./ServerEvents").OnErrorFunction;
    makeTurn: (gameId: string, current: string, desired: string) => void;
    joinGame: (gameId: string) => void;
    registerPlayer: (name: string, refresh?: boolean | undefined) => void;
    createGame: () => void;
    connect: (protocol: string, host: string, port: string | number) => void;
};
export default _default;
