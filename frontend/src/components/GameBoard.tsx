import Canvas from "./Canvas";
import { Piece } from "../model/Piece";
import whitePieceBase64 from "../images/white_piece.png";
import blackPieceBase64 from "../images/black_piece.png";
import { Game } from "../model/Game";
import { useState, useContext, useEffect } from "react";
import GameContext from "../context/GameContext";
import { Player } from "../model/Player";
import { useTheme } from "styled-components";
import {
  getRanks,
  getFiles,
  getCurrentPlayerPieceColor,
  colorSwitcher,
} from "../utils/GameBoardUtils";
import useAudio from "../hooks/useAudio";
import turnMp3 from "../sounds/turn.mp3";

interface Props {
  game: Game;
  containerId: string;
}

const whitePieceImg = new Image();
whitePieceImg.src = whitePieceBase64;
const blackPieceImg = new Image();
blackPieceImg.src = blackPieceBase64;

const checkMyTurn = (game: Game, player: Player): boolean => {
  return (
    (game.currentTurn === Piece.White && player.name === game.player1.name) ||
    (game.currentTurn === Piece.Black && player.name === game.player2.name)
  );
};

const GameBoard = ({ game, containerId }: Props) => {
  const { makeTurn, player } = useContext(GameContext);
  const [play] = useAudio({ url: turnMp3 });
  const theme: any = useTheme();
  const [selectedCell, setSelectedCell] = useState<string | null>(null);
  const [isMyTurn, setMyTurn] = useState<boolean>(checkMyTurn(game, player));
  const [lastMovedPiece, setLastMovedPiece] = useState<Piece | null>(null);
  const lastMove =
    game.turns.length > 0 ? game.turns[game.turns.length - 1] : null;
  const currentPlayerPieceColor = getCurrentPlayerPieceColor(game, player);
  const files = getFiles(currentPlayerPieceColor);
  const ranks = getRanks(currentPlayerPieceColor);
  const [cellWidth, setCellWidth] = useState<number>(50);
  const [cellHeight, setCellHeight] = useState<number>(50);

  useEffect(() => {
    if (lastMovedPiece !== null && lastMovedPiece !== game.currentTurn) {
      play();
    }
    setLastMovedPiece(game.currentTurn);
  }, [lastMovedPiece, game.currentTurn, play]);

  useEffect(() => {
    const onResize = () => {
      const cellSideSize = Math.floor(
        document.getElementById(containerId)?.offsetWidth!! / files.length
      );
      setCellWidth(cellSideSize);
      setCellHeight(cellSideSize);
    };
    window.addEventListener("resize", onResize);
    onResize();
    return () => window.removeEventListener("resize", onResize);
  }, [containerId, files.length]);

  useEffect(() => {
    setMyTurn(checkMyTurn(game, player));
  }, [game, player]);

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

  const draw = (ctx: CanvasRenderingContext2D) => {
    const lightSquareColor = theme.colors.board.lightCell;
    const darkSquareColor = theme.colors.board.darkCell;
    const { width, height } = ctx.canvas;

    const switchLightDarkColor = colorSwitcher(
      lightSquareColor,
      darkSquareColor
    );

    const drawFieldName = (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      fieldName: string,
      fontColor: string
    ) => {
      const bottomLeftCorner =
        currentPlayerPieceColor === Piece.White ? "a1" : "h8";
      ctx.fillStyle = fontColor;
      ctx.font = "14px serif";
      let text = null;
      if (fieldName === bottomLeftCorner) {
        text = fieldName;
      } else if (fieldName.startsWith(bottomLeftCorner.charAt(0))) {
        text = fieldName.substr(1, 1);
      } else if (fieldName.endsWith(bottomLeftCorner.charAt(1))) {
        text = fieldName.substr(0, 1);
      }

      text && ctx.fillText(text, x + 1, y + cellHeight - 1);
    };

    const drawCell = (
      x: number,
      y: number,
      cellColor: string,
      fontColor: string,
      fieldName: string
    ) => {
      ctx.fillStyle = cellColor;
      ctx.fillRect(x, y, cellWidth, cellHeight);

      drawFieldName(ctx, x, y, fieldName, fontColor);

      if (selectedCell === fieldName) {
        highlightCell(ctx, x, y, "#ffff00");
      }

      if (lastMove && lastMove.from === fieldName) {
        highlightCell(ctx, x, y, "cyan");
      }

      if (lastMove && lastMove.to === fieldName) {
        highlightCell(ctx, x, y, "magenta");
      }

      if (lastMove && lastMove.path.includes(fieldName)) {
        const circleX = x + cellWidth / 2;
        const circleY = y + cellHeight / 2;
        const radius = cellWidth / 10;

        ctx.beginPath();
        ctx.arc(circleX, circleY, radius, 0, 2 * Math.PI, false);
        ctx.fillStyle = "#ccc";
        ctx.fill();
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
        currentColor = switchLightDarkColor(currentColor);

        for (let rank = 0; rank < ranks.length; rank++) {
          currentColor = switchLightDarkColor(currentColor);
          let fontColor = switchLightDarkColor(currentColor);
          ctx.fillStyle = currentColor;
          let x = cellWidth * file;
          let y = cellHeight * rank;
          drawCell(
            x,
            y,
            currentColor,
            fontColor,
            `${files[file]}${ranks[rank]}`
          );
        }
      }

      if (game.isFinished && game.winner) {
        ctx.fillStyle = "rgba(255, 200, 87, 1)";
        ctx.font = "normal bold 30px Helvetica";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        const text = game.winner.name + " wins!";
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
        play();
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
