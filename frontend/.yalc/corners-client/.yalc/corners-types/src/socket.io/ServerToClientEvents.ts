import { Game } from "../model/Game"
import { Player } from "../model/Player"

export default interface ServerToClientEvents {
    identityCreated: (games: Game[], player: Player) => void;
    gameCreated: (game: Game) => void;
    gameUpdated: (game: Game) => void;
    error: (message: string) => void;
}
