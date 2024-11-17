import { Game, Piece, Player } from "../model";
import { Point } from "../model/Point";

const stringifyPoint = (point: Point) => `${point.x},${point.y}`;

const pointifyString = (val: string): Point => {
  const splitted = val.split(',');
  return {
    x: parseInt(splitted[0]),
    y: parseInt(splitted[1])
  };
}

const getCurrentPlayerPieceColor = (game: Game, player: Player) => {
  if (game.player1?.name === player.name) {
    return game.player1Piece;
  } else if (game.player2?.name === player.name) {
    return game.player2Piece;
  }
  return Piece.White;
};

export { getCurrentPlayerPieceColor, stringifyPoint, pointifyString };
