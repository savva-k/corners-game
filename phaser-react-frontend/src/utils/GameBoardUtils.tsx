import { Game, Piece, Player } from "../model";

const getFiles = (currentPlayerPieceColor: Piece): string[] => {
  const files = ["a", "b", "c", "d", "e", "f", "g", "h"];
  return currentPlayerPieceColor === Piece.White ? files : files.reverse();
};

const getRanks = (currentPlayerPieceColor: Piece): number[] => {
  const ranks = [1, 2, 3, 4, 5, 6, 7, 8];
  return currentPlayerPieceColor === Piece.White ? ranks.reverse() : ranks;
};

const getCurrentPlayerPieceColor = (game: Game, player: Player) => {
  if (game.player1?.name === player.name) {
    return game.player1Piece;
  } else if (game.player2?.name === player.name) {
    return game.player2Piece;
  }
  return Piece.White;
};

const colorSwitcher = (color1: string, color2: string) => {
  return (color: string) => {
    return color === color1 ? color2 : color1;
  };
};

const getDummyGame = (): Game => {
  return {
    id: "xxxxx",
    player1: {
      name: "Test1",
      registered: true
    },
    player2: {
      name: "Test2",
      registered: true
    },
    turns: [],
    currentTurn: Piece.White,
    player1Piece: Piece.White,
    player2Piece: Piece.Black,
    field: {
      "a1": Piece.White,
      "h8": Piece.Black
    },
    isStarted: true,
    isFinished: false,
    finishReason: undefined,
    winner: undefined,
    createdAt: '',
    updatedAt: '',
    mistakeAtField: undefined,
    availableMoves: undefined,
  }
}

export { getFiles, getRanks, colorSwitcher, getCurrentPlayerPieceColor, getDummyGame };
