import { FinishReason } from "./FinishReason";
import { Player } from "./Player";

export interface GameOverResponse {
    finishReason: FinishReason,
    winner: Player,
}
