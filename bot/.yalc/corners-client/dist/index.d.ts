import { Socket } from "socket.io-client";
declare const _default: {
    connect: (protocol: string, host: string, port: string | number) => {
        onopen: (f: () => void) => Socket<import("@socket.io/component-emitter").DefaultEventsMap, import("@socket.io/component-emitter").DefaultEventsMap>;
        onclose: (f: (e: string) => void) => Socket<import("@socket.io/component-emitter").DefaultEventsMap, import("@socket.io/component-emitter").DefaultEventsMap>;
        onerror: (f: (e: string) => void) => Socket<import("@socket.io/component-emitter").DefaultEventsMap, import("@socket.io/component-emitter").DefaultEventsMap>;
        onLogin: (f: import("./ServerEvents").OnLoginFunction) => import("./ServerEvents").OnLoginFunction;
        onGameCreated: (f: import("./ServerEvents").OnGameCreatedFunction) => import("./ServerEvents").OnGameCreatedFunction;
        onGameUpdated: (f: import("./ServerEvents").OnGameUpdatedFunction) => import("./ServerEvents").OnGameUpdatedFunction;
        onError: (f: import("./ServerEvents").OnErrorFunction) => import("./ServerEvents").OnErrorFunction;
        makeTurn: (gameId: string, current: string, desired: string) => void;
        joinGame: (gameId: string) => void;
        login: (name: string) => void;
        createGame: () => void;
    };
};
export default _default;
