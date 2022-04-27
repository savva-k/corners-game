import { Game } from "corners-common/dist/model/Game";
import { Player } from "corners-common/dist/model/Player";

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
