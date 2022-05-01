import {
  initialBoardState,
  white,
  black,
  whiteStartPositions,
  blackStartPositions,
} from "../constants/InitialBoardState";
import { getAvailableMoves, getJumpsPath, getCurrentPlayer } from "../services/GameBoardService";
import uuid4 from "uuid4"; 
import _ from "lodash";
import { Game } from "../model/Game"
import { Piece } from "../model/Piece";
import { GameStatusResponse } from "../model/GameStatusResponse";
import { FinishReason } from "../model/FinishReason";

export const MAX_TURNS_NUMBER = 80;

const createGame = (initiatedBy: string): Game => {
  return {
    id: uuid4(),
    player1: {
      name: initiatedBy,
      pieceColor: white,
      registered: true,
    },
    player2: undefined,
    turns: [],
    currentTurn: white,
    field: { ...initialBoardState },
    isStarted: false,
    isFinished: false,
    finishReason: undefined,
    winner: undefined,
    createdAt: new Date(),
    updatedAt: new Date(),
    mistakeAtField: undefined,
    availableMoves: [],
  };
};

const validateTurn = (game: Game, currentPosition: string, desiredPosition: string) => {
  const availableMoves = getAvailableMoves(game, currentPosition);
  const validTurn = availableMoves.includes(desiredPosition);
  const path = validTurn
    ? getJumpsPath(game.field, currentPosition, desiredPosition)
    : null;
  console.log(path);
  return {
    validTurn: validTurn,
    path: path,
    availableMoves: availableMoves,
  };
};

const checkGameStatus = (game: Game): GameStatusResponse | undefined => {
  const whitePositions = getPiecesOfColor(game.field, white);
  const blackPositions = getPiecesOfColor(game.field, black);
  const whiteIsHome = _.isEqual(whitePositions.sort(), blackStartPositions);
  const blackIsHome = _.isEqual(blackPositions.sort(), whiteStartPositions);
  const currentPlayer = getCurrentPlayer(game);

  if (whiteIsHome && blackIsHome) {
    console.log("Both players got home, it's a draw");
    return {
      finishReason: FinishReason.DrawBothHome,
      player: undefined,
    }
  }


  if (whiteIsHome && !blackIsHome && game.currentTurn === Piece.White) {
    console.log("White wins");
    return {
      finishReason: FinishReason.WhiteWon,
      player: game.player1,
    }
  }

  if (blackIsHome && !whiteIsHome) {
    console.log("Black wins");
    return {
      finishReason: FinishReason.BlackWon,
      player: game.player2,
    }
  }

  if (game.turns.length >= MAX_TURNS_NUMBER) {
    console.log("Over " + MAX_TURNS_NUMBER + " turns done, it's a draw");
    return {
      finishReason: FinishReason.DrawMoreThan80Moves,
      player: undefined,
    }
  }

  const currentPlayersPositions = game.currentTurn === Piece.White ? whitePositions : blackPositions;
  const hasNoMoves = currentPlayersPositions.flatMap((position) => getAvailableMoves(game, position)).length === 0;

  if (hasNoMoves) {
    console.log(currentPlayer?.name + " cannot move, it's a draw");
    return {
      finishReason: game.currentTurn === Piece.White ? FinishReason.DrawWhiteCantMove : FinishReason.DrawBlackCantMove,
      player: undefined,
    }    
  }

};

const getPiecesOfColor = (field: Record<string, Piece | undefined>, pieceType: Piece) => {
  return Object.keys(_.pickBy(field, (value: Piece | undefined) => value === pieceType));
};

const getNotStartedGame = (games: Game[], playerName: string) => {
  const game = games.find((g) => g.player1.name === playerName && !g.player2);
  return game;
};

export { createGame, validateTurn, checkGameStatus, getNotStartedGame, getPiecesOfColor };
