import { Game } from "../model/Game";
import { Piece } from "../model/Piece";
import { GameStatusResponse } from "../model/GameStatusResponse";
export declare const MAX_TURNS_NUMBER = 80;
declare const createGame: (initiatedBy: string) => Game;
declare const validateTurn: (game: Game, currentPosition: string, desiredPosition: string) => {
    validTurn: boolean;
    path: string[] | null;
    availableMoves: string[];
};
declare const checkGameStatus: (game: Game) => GameStatusResponse | undefined;
declare const getPiecesOfColor: (field: Record<string, Piece | undefined>, pieceType: Piece) => string[];
declare const getNotStartedGame: (games: Game[], playerName: string) => Game | undefined;
export { createGame, validateTurn, checkGameStatus, getNotStartedGame, getPiecesOfColor };
