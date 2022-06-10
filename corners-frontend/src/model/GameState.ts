import { Game, Player } from "corners-common";

export interface GameState {
    player: Player,
    theme: any,
    games: Array<Game>,
    error: string | null,
    clearError: () => void,
    registerPlayer: (name: string) => void,
    makeTurn: (gameId: string, currentPosition: string, desiredPosition: string) => void,
    createGame: () => void,
    joinGame: (gameId: string) => void,
}
