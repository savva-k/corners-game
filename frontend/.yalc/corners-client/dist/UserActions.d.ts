declare const _default: (getWs: () => WebSocket) => {
    makeTurn: (gameId: string, current: string, desired: string) => void;
    joinGame: (gameId: string) => void;
    registerPlayer: (name: string, refresh?: boolean | undefined) => void;
    createGame: () => void;
};
export default _default;
