import { Game } from "corners-common/dist/model/Game";
import { Piece } from "corners-common/dist/model/Piece";
import { Player } from "corners-common/dist/model/Player";

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
    return game.player1.pieceColor || Piece.White;
  } else if (game.player2?.name === player.name) {
    return game.player2.pieceColor || Piece.Black;
  }
  return Piece.White;
};

const colorSwitcher = (color1: string, color2: string) => {
  return (color: string) => {
    return color === color1 ? color2 : color1;
  };
};

export { getFiles, getRanks, getCurrentPlayerPieceColor, colorSwitcher };
