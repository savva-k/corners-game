import { Game } from "../model/Game";
declare type Neighbours = {
    top: string | undefined;
    bottom: string | undefined;
    left: string | undefined;
    right: string | undefined;
};
declare const getJumpsPath: (field: any, currentPosition: string, desiredPosition: string, checkedCells?: string[] | undefined) => string[] | null;
declare const getAvailableMoves: (game: Game, piecePosition: string) => string[];
declare const getNeighbours: (position: string) => Neighbours;
declare const getPositionAbove: (position: string) => string | undefined;
declare const getPositionBelow: (position: string) => string | undefined;
declare const getPositionLeft: (position: string) => string | undefined;
declare const getPositionRight: (position: string) => string | undefined;
export { getNeighbours, getPositionAbove, getPositionBelow, getPositionLeft, getPositionRight, getAvailableMoves, getJumpsPath, };
