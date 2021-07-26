import { Game } from "./Game";

export interface GameState {
    playerName: string,
    games: Array<Game>,
    makeTurn: (gameId: string, currentPosition: string, desiredPosition: string) => void
    createGame: () => void
}
