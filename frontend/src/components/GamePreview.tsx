import { useTheme } from "styled-components";
import { Game, Piece } from "../model";
import Canvas from "./Canvas";
import {
  getRanks,
  getFiles,
  getCurrentPlayerPieceColor,
} from "../utils/GameBoardUtils";

import { useContext } from "react";
import GameContext from "../context/GameContext";

interface Props {
  game: Game;
}

const colorSwitcher = (color1: string, color2: string) => {
  return (color: string) => {
    return color === color1 ? color2 : color1;
  };
};

const GamePreview = ({ game }: Props) => {
  const theme: any = useTheme();
  const { player } = useContext(GameContext);
  const cellWidth = 20;
  const cellHeight = 20;
  const renderForPieceColor = getCurrentPlayerPieceColor(game, player);
  const files = getFiles(renderForPieceColor);
  const ranks = getRanks(renderForPieceColor);
  const width = cellWidth * files.length;
  const height = cellHeight * ranks.length;

  const lightSquareColor = theme.colors.board.lightCell;
  const darkSquareColor = theme.colors.board.darkCell;
  const switchCellLightDarkColor = colorSwitcher(lightSquareColor, darkSquareColor);

  const getPieceColor = (piece: Piece) => {
    return piece === Piece.White ? theme.colors.board.whitePiece : theme.colors.board.blackPiece;
  };

  const draw = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = theme.colors.primary;
    ctx.fillRect(0, 0, width, height);

    let currentCellColor = lightSquareColor;
    for (let file = 0; file < files.length; file++) {
      currentCellColor = switchCellLightDarkColor(currentCellColor);

      for (let rank = 0; rank < ranks.length; rank++) {
        currentCellColor = switchCellLightDarkColor(currentCellColor);
        ctx.fillStyle = currentCellColor;
        let x = cellWidth * file;
        let y = cellHeight * rank;
        ctx.fillStyle = currentCellColor;
        ctx.fillRect(x, y, cellWidth, cellHeight);

        let pieceType = game.field[`${files[file]}${ranks[rank]}`];

        if (pieceType) {
          let pieceW = cellWidth * 0.75;
          let pieceH = cellHeight * 0.75;
          let pieceX = x + cellWidth / 2 - pieceW / 2;
          let pieceY = y + cellHeight / 2 - pieceH / 2;
          ctx.fillStyle = getPieceColor(pieceType);
          ctx.fillRect(pieceX, pieceY, pieceW, pieceH);
        }
      }
    }
  }

  return (
    <Canvas
      draw={draw}
      width={`${width}px`}
      height={`${height}px`}
      style={{ alignSelf: "center" }}
    />
  );
}

export default GamePreview;