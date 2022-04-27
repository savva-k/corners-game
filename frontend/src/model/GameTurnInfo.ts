import { Piece } from "corners-common/dist/model/Piece";

export interface GameTurnInfo {
    from: string;
    to: string;
    isLatest: boolean;
    piece: Piece;
    order: number;
    isGameOver: boolean;
}
