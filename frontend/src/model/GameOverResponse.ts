import { FinishReason } from "./FinishReason";
import { type Player } from "./Player";

export interface GameOverResponse {
    finishReason: FinishReason,
    winner: Player,
}
