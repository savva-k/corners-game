import { Piece } from './Piece';
export interface Player {
    name: string;
    pieceColor: Piece;
    registered: boolean;
}
