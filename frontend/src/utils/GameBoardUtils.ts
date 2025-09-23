import { Piece, type Player } from "../model";
import { type Point } from "../model/Point";

const stringifyPoint = (point: Point) => `${point.x},${point.y}`;

const pointifyString = (val: string): Point => {
  const splitted = val.split(',');
  return {
    x: parseInt(splitted[0]),
    y: parseInt(splitted[1])
  };
}

const getOpponentPlayerPieceColor = (player: Player) => {
  return getOppositePieceColor(player.piece);
};

const getOppositePieceColor = (piece: Piece) => {
  return piece === Piece.White ? Piece.Black : Piece.White;
}

const getPieceTexture = (piece: Piece) => {
  return piece == Piece.White ? 'piece_white' : 'piece_black';
}

export { getOpponentPlayerPieceColor, getOppositePieceColor, stringifyPoint, pointifyString, getPieceTexture };
