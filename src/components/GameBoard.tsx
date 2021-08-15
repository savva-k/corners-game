import Canvas from "./Canvas";
import { Piece } from "../model/Piece";
import whitePieceBase64 from "../images/white_piece.png";
import blackPieceBase64 from "../images/black_piece.png";
import { Game } from "../model/Game";
import { useState, useContext, useEffect } from "react";
import GameContext from "../context/GameContext";
import { Player } from "../model/Player";

interface Props {
  game: Game;
}

const whitePieceImg = new Image();
whitePieceImg.src = whitePieceBase64;
const blackPieceImg = new Image();
blackPieceImg.src = blackPieceBase64;

const files: string[] = ["a", "b", "c", "d", "e", "f", "g", "h"];
const ranks: number[] = [1, 2, 3, 4, 5, 6, 7, 8].reverse();

const cellWidth = 50;
const cellHeight = 50;

const checkMyTurn = (game: Game, player: Player): boolean => {
  return (
    (game.currentTurn === Piece.White && player.name === game.player1) ||
    (game.currentTurn === Piece.Black && player.name === game.player2)
  );
};

const highlightCell = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  color: string
): void => {
  const oldStyle = ctx.strokeStyle;
  ctx.strokeStyle = color;
  ctx.strokeRect(x, y, cellWidth - 1, cellHeight - 1);
  ctx.strokeRect(x + 1, y + 1, cellWidth - 2, cellHeight - 2);
  ctx.strokeStyle = oldStyle;
};

const GameBoard = ({ game }: Props) => {
  const { makeTurn, player } = useContext(GameContext);
  const [selectedCell, setSelectedCell] = useState<string | null>(null);
  const [isMyTurn, setMyTurn] = useState<boolean>(checkMyTurn(game, player));
  const lastMove =
    game.turns.length > 0 ? game.turns[game.turns.length - 1] : null;

  useEffect(() => {
    setMyTurn(checkMyTurn(game, player));
  }, [game, player]);

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

      if (selectedCell === fieldName) {
        highlightCell(ctx, x, y, "#ffff00");
      }

      if (lastMove && lastMove.from === fieldName) {
        highlightCell(ctx, x, y, "cyan");
      }

      if (lastMove && lastMove.to === fieldName) {
        highlightCell(ctx, x, y, "magenta");
      }

      if (game.mistakeAtField === fieldName) {
        highlightCell(ctx, x, y, "coral");
      }

      if (
        game.mistakeAtField &&
        game.availableMoves &&
        game.availableMoves.includes(fieldName)
      ) {
        const w = cellWidth / 2;
        const h = cellHeight / 2;
        ctx.fillStyle = "rgba(0, 255, 0, 0.3)";
        ctx.fillRect(x + w / 2, y + h / 2, w, h);
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

      if (game.isFinished) {
        ctx.fillStyle = "rgba(255, 200, 87, 1)";
        ctx.font = "normal bold 30px Helvetica";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        const text = game.winner + " wins!";
        const textW = ctx.measureText(text).width;
        const textH = 40;
        const x = width / 2;
        const y = height / 2;

        ctx.fillStyle = "#F9564F";
        ctx.fillRect(x - textW / 2 - 5, y - textH / 2, textW + 10, textH);
        ctx.fillStyle = "#FFF";
        ctx.fillText(text, x, y);
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
    if (!isMyTurn || game.isFinished) return;

    const rect = (event.target as HTMLCanvasElement).getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const cellName = getFieldNameAt(x, y);

    if (cellName && selectedCell) {
      if (
        game.field[selectedCell] === game.currentTurn &&
        game.field[cellName] === undefined
      ) {
        setSelectedCell(null);
        makeTurn(game.id, selectedCell, cellName);
      } else {
        setSelectedCell(cellName);
      }
    } else {
      setSelectedCell(cellName);
    }
  };

  return (
    <Canvas
      draw={draw}
      clickHandler={clickHandler}
      width={`${cellWidth * files.length}px`}
      height={`${cellHeight * ranks.length}px`}
      style={{ alignSelf: "start" }}
    />
  );
};

export default GameBoard;
