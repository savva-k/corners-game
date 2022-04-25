import { Piece } from "corners-types/dist/model/Piece";

export interface GameTurnInfo {
    from: string;
    to: string;
    isLatest: boolean;
    piece: Piece;
    order: number;
    isGameOver: boolean;
}
