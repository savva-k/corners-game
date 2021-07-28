import Canvas from "./Canvas";
import { Piece } from "../model/Piece";
import whitePieceBase64 from "../images/white_piece.png";
import blackPieceBase64 from "../images/black_piece.png";
import { Game } from "../model/Game";
import { useState, useContext } from "react";
import GameContext from "../context/GameContext";

interface Props {
  game: Game;
}

interface State {
  selectedCell: string | null;
}

const whitePieceImg = new Image();
whitePieceImg.src = whitePieceBase64;
const blackPieceImg = new Image();
blackPieceImg.src = blackPieceBase64;

const files: string[] = ["a", "b", "c", "d", "e", "f", "g", "h"];
const ranks: number[] = [1, 2, 3, 4, 5, 6, 7, 8].reverse();

const cellWidth = 50;
const cellHeight = 50;

const GameBoard = ({ game }: Props) => {
  const [state, setState] = useState<State>({ selectedCell: null });
  const { makeTurn } = useContext(GameContext);
console.log('rendering gameboard ' + JSON.stringify(state))
  const draw = (ctx: CanvasRenderingContext2D) => {
    const lightSquareColor = "#ccac7e";
    const darkSquareColor = "#744c2f";
    const { width, height } = ctx.canvas;

    const switchCellColor = (color: string) => {
      return color === lightSquareColor ? darkSquareColor : lightSquareColor;
    };

    const drawCell = (
      x: number,
      y: number,
      cellColor: string,
      fieldName: string
    ) => {
      ctx.fillStyle = cellColor;
      ctx.fillRect(x, y, cellWidth, cellHeight);

      if (state.selectedCell === fieldName) {
        ctx.strokeStyle = "#ffff00";
        ctx.strokeRect(x, y, cellWidth - 1, cellHeight - 1);
        ctx.strokeRect(x + 1, y + 1, cellWidth - 2, cellHeight - 2);
      }

      let figure = game.field[fieldName];

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
    };

    const drawField = () => {
      ctx.fillStyle = "#000000";
      ctx.clearRect(0, 0, width, height);
      let currentColor = lightSquareColor;
      for (let file = 0; file < files.length; file++) {
        currentColor = switchCellColor(currentColor);

        for (let rank = 0; rank < ranks.length; rank++) {
          currentColor = switchCellColor(currentColor);
          ctx.fillStyle = currentColor;
          let x = cellWidth * file;
          let y = cellHeight * rank;
          drawCell(x, y, currentColor, `${files[file]}${ranks[rank]}`);
        }
      }
    };

    drawField();
  };

  const getFieldNameAt = (x: number, y: number): string | null => {
    const file = files[Math.floor(x / cellWidth)];
    const rank = ranks[Math.floor(y / cellHeight)];
    return file && rank ? `${file}${rank}` : null;
  };

  const clickHandler = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = (event.target as HTMLCanvasElement).getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const cellName = getFieldNameAt(x, y);
    console.log('click: ' + cellName)

    if (cellName && state.selectedCell) {
      if (
        game.field[state.selectedCell] !== undefined &&
        game.field[cellName] === undefined
      ) {
        makeTurn(game.id, state.selectedCell, cellName);
        setState({ selectedCell: null });
      } else {
        setState({ selectedCell: cellName });
      }
    } else {
      setState({ selectedCell: cellName });
    }
  };

  return (
    <Canvas
      draw={draw}
      clickHandler={clickHandler}
      width="599px"
      height="600px"
    />
  );
};

export default GameBoard;
