import { Game } from "../model/Game";
declare const createGame: (initiatedBy: string) => Game;
declare const validateTurn: (game: Game, currentPosition: string, desiredPosition: string) => {
    validTurn: boolean;
    path: string[] | null;
    availableMoves: string[];
};
declare const checkWin: (game: Game) => import("../model/Player").Player | undefined;
declare const getNotStartedGame: (games: Game[], playerName: string) => Game | undefined;
export { createGame, validateTurn, checkWin, getNotStartedGame };
