import Canvas from "./Canvas";
import { Piece, Game, Player, FinishReason } from "../model";
import whitePieceBase64 from "../images/white_piece.png";
import blackPieceBase64 from "../images/black_piece.png";
import arrow from "../images/arrow.svg";
import arrowTurn from "../images/arrow-turn.svg";
import { useState, useContext, useEffect } from "react";
import GameContext from "../context/GameContext";
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
  makeTurn: (from: string, to: string) => void;
}

const whitePieceImg = new Image();
whitePieceImg.src = whitePieceBase64;
const blackPieceImg = new Image();
blackPieceImg.src = blackPieceBase64;
const arrowImg = new Image();
arrowImg.src = arrow;
const arrowTurnImg = new Image();
arrowTurnImg.src = arrowTurn;

const TO_RADIANS = Math.PI / 180;
const NOT_TRANSPARENT = 1;
const TRANSPARENT = 0.3;

const checkMyTurn = (game: Game, player: Player): boolean => {
  return (
    (game.currentTurn === Piece.White && player.name === game.player1.name) ||
    (game.currentTurn === Piece.Black && player.name === game.player2?.name)
  );
};

const GameBoard = ({ game, containerId, makeTurn }: Props) => {
  const { player } = useContext(GameContext);
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
      const drawFigure = (
        image: HTMLImageElement,
        opacity?: number,
        rotationAngle?: number,
        flipHorizontal?: boolean
      ) => {
        let pieceW = cellWidth * 0.75;
        let pieceH = cellHeight * 0.75;
        let pieceX = x + cellWidth / 2;
        let pieceY = y + cellHeight / 2;
        ctx.save();
        ctx.globalAlpha = opacity || 1;
        ctx.translate(pieceX, pieceY);
        if (rotationAngle) {
          ctx.rotate(rotationAngle * TO_RADIANS);
        }
        if (flipHorizontal) {
          ctx.scale(-1, 1);
        }
        ctx.drawImage(image, -pieceW / 2, -pieceH / 2, pieceW, pieceH);
        ctx.restore();
      };

      const calculateDirection = (current: string, path: string[]) => {
        const currentPosition = path.indexOf(current);
        const reverseDirection = currentPlayerPieceColor === Piece.Black;
        if (path.length < 3 || currentPosition === -1) return null;

        let prev = currentPosition + 1 > 0 ? path[currentPosition + 1] : null;
        let next =
          currentPosition - 1 < path.length ? path[currentPosition - 1] : null;

        if (!prev || !next) return null;

        const getDirectionFrom = (from: string, to: string) => {
          if (from[0] < to[0]) return reverseDirection ? "right" : "left";
          if (from[0] > to[0]) return reverseDirection ? "left" : "right";
          if (from[1] < to[1]) return reverseDirection ? "up" : "down";
          if (from[1] > to[1]) return reverseDirection ? "down" : "up";
        };

        const getDirectionTo = (from: string, to: string) => {
          if (from[0] < to[0]) return reverseDirection ? "left" : "right";
          if (from[0] > to[0]) return reverseDirection ? "right" : "left";
          if (from[1] < to[1]) return reverseDirection ? "down" : "up";
          if (from[1] > to[1]) return reverseDirection ? "up" : "down";
        };

        const result = [
          getDirectionFrom(prev, current),
          getDirectionTo(current, next),
        ];
        return result;
      };

      const isDirectArrow = (from: string, to: string) => {
        return (
          (from === "up" && to === "down") ||
          (from === "down" && to === "up") ||
          (from === "left" && to === "right") ||
          (from === "right" && to === "left")
        );
      };

      const getRotationDegreeForArrow = (from: string, to: string) => {
        let rotation = 0;
        let flipHorizontal = false;

        // turn arrow, from=right, to=up case is default
        if (from === "left" && to === "down") rotation = 180;
        if (from === "down" && to === "right") rotation = 90;
        if (from === "up" && to === "left") rotation = 270;

        if (from === "left" && to === "up") {
          rotation = 0;
          flipHorizontal = true;
        }
        if (from === "up" && to === "right") {
          rotation = 90;
          flipHorizontal = true;
        }
        if (from === "right" && to === "down") {
          rotation = 180;
          flipHorizontal = true;
        }
        if (from === "down" && to === "left") {
          rotation = 270;
          flipHorizontal = true;
        }

        // direct arrow, from=down, to=up case is default
        if (from === "left" && to === "right") rotation = 90;
        if (from === "up" && to === "down") rotation = 180;
        if (from === "right" && to === "left") rotation = 270;

        return { rotation, flipHorizontal };
      };

      ctx.fillStyle = cellColor;
      ctx.fillRect(x, y, cellWidth, cellHeight);

      drawFieldName(ctx, x, y, fieldName, fontColor);

      if (selectedCell === fieldName) {
        highlightCell(ctx, x, y, theme.colors.primaryVariant);
      }

      if (lastMove && lastMove.to === fieldName) {
        highlightCell(ctx, x, y, theme.colors.primaryVariant);
      }

      if (lastMove && lastMove.path.includes(fieldName)) {
        ctx.beginPath();

        if (lastMove.from === fieldName) {
          drawFigure(
            game.field[lastMove.to] === Piece.White
              ? whitePieceImg
              : blackPieceImg,
            TRANSPARENT
          );
          ctx.fillStyle = "#FF0000";
        } else if (game.field[fieldName] === undefined) {
          const directions = calculateDirection(fieldName, lastMove.path);

          if (directions && directions.length === 2) {
            const from = directions[0]!;
            const to = directions[1]!;
            const transform = getRotationDegreeForArrow(from, to);

            if (isDirectArrow(from, to)) {
              drawFigure(arrowImg, NOT_TRANSPARENT, transform.rotation);
            } else {
              drawFigure(
                arrowTurnImg,
                NOT_TRANSPARENT,
                transform.rotation,
                transform.flipHorizontal
              );
            }
          }
        }

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

      if (game.field[fieldName] !== undefined) {
        drawFigure(
          game.field[fieldName] === Piece.White ? whitePieceImg : blackPieceImg
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

      if (game.isFinished) {
        ctx.fillStyle = "rgba(255, 200, 87, 1)";
        ctx.font = "normal bold 30px Helvetica";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        let text;

        if (
          (game.finishReason === FinishReason.BlackWon ||
            game.finishReason === FinishReason.WhiteWon) &&
          game.winner
        ) {
          text = game.winner.name + " wins!";
        } else {
          text = "Draw!";
        }

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
        makeTurn(selectedCell, cellName);
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
