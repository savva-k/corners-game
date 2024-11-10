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

export { getFiles, getRanks, getCurrentPlayerPieceColor };
