import { useTheme } from "styled-components";
import { Game, Piece } from "../model";
import Canvas from "./Canvas";

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
  const cellWidth = 20;
  const cellHeight = 20;
  const width = cellWidth * game.gameMap.size.width;
  const height = cellHeight * game.gameMap.size.height;

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
    for (let gameMapX = 0; gameMapX < game.gameMap.size.width; gameMapX++) {
      currentCellColor = switchCellLightDarkColor(currentCellColor);

      for (let gameMapY = 0; gameMapY < game.gameMap.size.height; gameMapY++) {
        currentCellColor = switchCellLightDarkColor(currentCellColor);
        ctx.fillStyle = currentCellColor;
        let x = cellWidth * gameMapX;
        let y = cellHeight * gameMapY;
        ctx.fillStyle = currentCellColor;
        ctx.fillRect(x, y, cellWidth, cellHeight);

        let cell = game.gameMap.field[`${gameMapX},${gameMapY}`];

        if (cell.piece) {
          let pieceW = cellWidth * 0.75;
          let pieceH = cellHeight * 0.75;
          let pieceX = x + cellWidth / 2 - pieceW / 2;
          let pieceY = y + cellHeight / 2 - pieceH / 2;
          ctx.fillStyle = getPieceColor(cell.piece);
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