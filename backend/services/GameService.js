const {
  initialBoardState,
  white,
  black,
  whiteStartPositions,
  blackStartPositions,
} = require("../constants/InitialBoardState");
const { getAvailableMoves, getJumpsPath } = require("./GameBoardService");
const uuid4 = require("uuid4");
const _ = require("lodash");

const createGame = (initiatedBy) => {
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

const validateTurn = (game, currentPosition, desiredPosition) => {
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

const checkWin = (game) => {
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

const getPiecesOfColor = (field, pieceType) => {
  return Object.keys(_.pickBy(field, (value) => value === pieceType));
};

const getNotStartedGame = (games, player) => {
  const game = games.find((g) => g.player1.name === player.name && !g.player2);
  return game;
};

module.exports = { createGame, validateTurn, checkWin, getNotStartedGame };
