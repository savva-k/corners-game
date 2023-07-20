import { Piece } from "../model";

export interface GameTurnInfo {
    from: string;
    to: string;
    isLatest: boolean;
    piece: Piece;
    order: number;
    isGameOver: boolean;
}
