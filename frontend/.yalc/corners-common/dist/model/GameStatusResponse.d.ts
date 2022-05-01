import { FinishReason } from "./FinishReason";
import { Player } from "./Player";
export interface GameStatusResponse {
    finishReason: FinishReason;
    player: Player | undefined;
}
