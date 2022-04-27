import { Game } from "../model/Game";
import { Piece } from "../model/Piece";

type Neighbours = {
  top: string | undefined;
  bottom: string | undefined;
  left: string | undefined;
  right: string | undefined;
};

const files = ["a", "b", "c", "d", "e", "f", "g", "h"];
const ranks = [1, 2, 3, 4, 5, 6, 7, 8];

const getJumpsPath = (
  field: any,
  currentPosition: string,
  desiredPosition: string,
  checkedCells?: string[] | undefined
): string[] | null => {
  checkedCells = checkedCells ? checkedCells : [];

  if (checkedCells.includes(currentPosition)) {
    return null;
  }

  checkedCells.push(currentPosition);

  const neighbours = getNeighbours(currentPosition);

  if (Object.values(neighbours).includes(desiredPosition)) {
    return [desiredPosition, currentPosition];
  }

  const jumpableNeighbours = getJumpableNeighbours(
    field,
    neighbours,
    currentPosition,
    checkedCells
  );

  if (jumpableNeighbours.includes(desiredPosition)) {
    return [desiredPosition, currentPosition];
  }

  if (jumpableNeighbours.length > 0) {
    const recursiveCheck = jumpableNeighbours.map((jumpableNeighbour) =>
      getJumpsPath(field, jumpableNeighbour!, desiredPosition, checkedCells)
    );

    for (let i = 0; i < recursiveCheck.length; i++) {
      const checkResult = recursiveCheck[i];
      if (Array.isArray(checkResult)) {
        return [...checkResult, currentPosition];
      }
    }
  }

  return null;
};

const getAvailableMoves = (game: Game, piecePosition: string): string[] => {
  const field = game.field;
  const availableMoves = [];

  if (field[piecePosition] !== undefined) {
    const neighbours = getNeighbours(piecePosition);
    const singleMoves = Object.values(neighbours).filter(
      (p) => p && field[p] === undefined
    );
    const jumpableCells = getJumpableCells(field, piecePosition);
    availableMoves.push(...singleMoves, ...jumpableCells);
  }

  // todo remove "as string[]"
  return availableMoves as string[];
};

const getJumpableNeighbours = (
  field: Record<string, Piece | undefined>,
  neighbours: Neighbours,
  fromPosition: string,
  checkedCells: string[]
) => {
  return Object.values(neighbours)
    .filter(p => p !== undefined)
    .filter((p) => field[p!] !== undefined)
    .flatMap((p) => whereCanJump(field, fromPosition, p!))
    .filter((p) => p !== undefined && !checkedCells.includes(p));
};

const getJumpableCells = (
  field: Record<string, Piece | undefined>,
  fromPosition: string,
  checkedCells?: string[]
): string[] => {
  checkedCells = checkedCells ? checkedCells : [];
  const neighbours = getNeighbours(fromPosition);
  checkedCells.push(fromPosition);
  const jumpableNeighbours = getJumpableNeighbours(
    field,
    neighbours,
    fromPosition,
    checkedCells
  );
  return [
    ...jumpableNeighbours,
    ...jumpableNeighbours.flatMap((p) =>
      getJumpableCells(field, p, checkedCells)
    ),
  ];
};

const whereCanJump = (field: Record<string, Piece | undefined>, from: string, over: string): string[] => {
  const overNeighbours = getNeighbours(over);
  const canJumpTo = [];
  if (
    overNeighbours.left === from &&
    overNeighbours.right &&
    field[overNeighbours.right] === undefined
  ) {
    canJumpTo.push(overNeighbours.right);
  }
  if (
    overNeighbours.right === from &&
    overNeighbours.left &&
    field[overNeighbours.left] === undefined
  ) {
    canJumpTo.push(overNeighbours.left);
  }
  if (
    overNeighbours.top === from &&
    overNeighbours.bottom &&
    field[overNeighbours.bottom] === undefined
  ) {
    canJumpTo.push(overNeighbours.bottom);
  }
  if (
    overNeighbours.bottom === from &&
    overNeighbours.top &&
    field[overNeighbours.top] === undefined
  ) {
    canJumpTo.push(overNeighbours.top);
  }
  return canJumpTo;
};

const getNeighbours = (position: string): Neighbours => {
  return {
    top: getPositionAbove(position),
    bottom: getPositionBelow(position),
    left: getPositionLeft(position),
    right: getPositionRight(position),
  };
};

const getPositionAbove = (position: string) => {
  return getPosition(position, 0, 1);
};

const getPositionBelow = (position: string) => {
  return getPosition(position, 0, -1);
};

const getPositionLeft = (position: string) => {
  return getPosition(position, -1, 0);
};

const getPositionRight = (position: string) => {
  return getPosition(position, 1, 0);
};

const getPosition = (
  position: string,
  fileOffset: number,
  rankOffset: number
): string | undefined => {
  const file = position[0];
  const rank = position[1];
  const currentFileIndex = files.findIndex((f) => f === file);

  if (currentFileIndex !== -1) {
    const currentRankIndex = ranks.findIndex((r) => r === parseInt(rank));

    if (currentRankIndex !== -1) {
      if (fileOffset !== 0) {
        const newFile = files[currentFileIndex + fileOffset];
        return newFile ? `${newFile}${rank}` : undefined;
      } else if (rankOffset !== 0) {
        const newRank = ranks[currentRankIndex + rankOffset];
        return newRank ? `${file}${newRank}` : undefined;
      }
    }
  }
};

export {
  getNeighbours,
  getPositionAbove,
  getPositionBelow,
  getPositionLeft,
  getPositionRight,
  getAvailableMoves,
  getJumpsPath,
};
