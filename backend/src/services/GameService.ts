import {
  initialBoardState,
  white,
  black,
  whiteStartPositions,
  blackStartPositions,
} from "../constants/InitialBoardState";
import { getAvailableMoves, getJumpsPath } from "./GameBoardService";
import uuid4 from "uuid4"; 
import _ from "lodash";
import { Game } from "corners-types/dist/model/Game"
import { Piece } from "corners-types/dist/model/Piece";
import { Player } from "../model/Player";

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

const checkWin = (game: Game) => {
  const whitePositions = getPiecesOfColor(game.field, white);
  const blackPositions = getPiecesOfColor(game.field, black);

  const whiteWins = _.isEqual(whitePositions.sort(), blackStartPositions);
  const blackWins = _.isEqual(blackPositions.sort(), whiteStartPositions);

  console.log("white wins " + whiteWins + ", blackWins " + blackWins);

  if (whiteWins) {
    return game.player1;
  } else if (blackWins) {
    return game.player2;
  }
};

const getPiecesOfColor = (field: Record<string, Piece | undefined>, pieceType: Piece) => {
  return Object.keys(_.pickBy(field, (value: Piece | undefined) => value === pieceType));
};

const getNotStartedGame = (games: Game[], player: Player) => {
  const game = games.find((g) => g.player1.name === player.name && !g.player2);
  return game;
};

export { createGame, validateTurn, checkWin, getNotStartedGame };
