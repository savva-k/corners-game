import { useTheme } from "styled-components";
import { Game, Piece } from "../model";
import Canvas from "./Canvas";
import {
  getRanks,
  getFiles,
  colorSwitcher,
  getCurrentPlayerPieceColor,
} from "../utils/GameBoardUtils";

import whitePieceBase64 from "../images/white_piece.png";
import blackPieceBase64 from "../images/black_piece.png";
import { useContext } from "react";
import GameContext from "../context/GameContext";

interface Props {
    game: Game;
}

const whitePieceImg = new Image();
whitePieceImg.src = whitePieceBase64;
const blackPieceImg = new Image();
blackPieceImg.src = blackPieceBase64;

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
    const switchLightDarkColor = colorSwitcher(lightSquareColor, darkSquareColor);

    const draw = (ctx: CanvasRenderingContext2D) => {
        ctx.fillStyle = theme.colors.primary;
        ctx.fillRect(0, 0, width, height);

        let currentColor = lightSquareColor;
        for (let file = 0; file < files.length; file++) {
          currentColor = switchLightDarkColor(currentColor);
  
          for (let rank = 0; rank < ranks.length; rank++) {
            currentColor = switchLightDarkColor(currentColor);
            ctx.fillStyle = currentColor;
            let x = cellWidth * file;
            let y = cellHeight * rank;
            ctx.fillStyle = currentColor;
            ctx.fillRect(x, y, cellWidth, cellHeight);
            
            let figure = game.field[`${files[file]}${ranks[rank]}`];

            if (figure !== undefined) {
              let pieceW = cellWidth * 0.75;
              let pieceH = cellHeight * 0.75;
              let pieceX = x + cellWidth / 2 - pieceW / 2;
              let pieceY = y + cellHeight / 2 - pieceH / 2;
              ctx.drawImage(
                figure === Piece.White ? whitePieceImg : blackPieceImg,
                pieceX,
                pieceY,
                pieceW,
                pieceH
              );
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