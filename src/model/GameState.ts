import { Game } from "./Game";
import { Player } from "./Player";

export interface GameState {
    player: Player,
    games: Array<Game>,
    registerPlayer: (name: string) => void,
    makeTurn: (gameId: string, currentPosition: string, desiredPosition: string) => void,
    createGame: () => void,
    joinGame: (gameId: string) => void,
}
