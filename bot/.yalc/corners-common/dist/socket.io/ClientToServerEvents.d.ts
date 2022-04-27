export default interface ClientToServerEvents {
    createGame: () => void;
    login: (name: string) => void;
    joinGame: (gameId: string) => void;
    makeTurn: (gameId: string, currentPosition: string, desiredPosition: string) => void;
}
