import { type Game, Piece, type Player } from "../model";
import { type Point } from "../model/Point";

const stringifyPoint = (point: Point) => `${point.x},${point.y}`;

const pointifyString = (val: string): Point => {
  const splitted = val.split(',');
  return {
    x: parseInt(splitted[0]),
    y: parseInt(splitted[1])
  };
}

const getPlayersPieceColor = (game: Game, player: Player) => {
  if (game.player1?.name === player.name) {
    return game.player1Piece;
  } else if (game.player2?.name === player.name) {
    return game.player2Piece;
  }
  return Piece.White;
};

const getOpponentPlayerPieceColor = (game: Game, player: Player) => {
  const currentPlayerPiece = getPlayersPieceColor(game, player);
  return getOppositePieceColor(currentPlayerPiece);
};

const getOppositePieceColor = (piece: Piece) => {
  return piece === Piece.White ? Piece.Black : Piece.White;
}

const getPieceTexture = (piece: Piece) => {
  return piece == Piece.White ? 'piece_white' : 'piece_black';
}

export { getPlayersPieceColor, getOpponentPlayerPieceColor, getOppositePieceColor, stringifyPoint, pointifyString, getPieceTexture };
