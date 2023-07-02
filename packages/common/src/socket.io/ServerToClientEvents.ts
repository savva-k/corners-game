import { Game } from "../model/Game"
import { Player } from "../model/Player"

export default interface ServerToClientEvents {
    identityCreated: (games: Game[], player: Player) => void;
    secondPlayerJoined: (game: Game) => void;
    gameCreated: (game: Game) => void;
    gameUpdated: (game: Game) => void;
    error: (message: string) => void;
    playerLeft: (name: string) => void;
}
