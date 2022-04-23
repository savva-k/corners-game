const files = ["a", "b", "c", "d", "e", "f", "g", "h"];
const ranks = [1, 2, 3, 4, 5, 6, 7, 8];

const getJumpsPath = (
  field,
  currentPosition,
  desiredPosition,
  checkedCells
) => {
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
      getJumpsPath(field, jumpableNeighbour, desiredPosition, checkedCells)
    );

    for (let i = 0; i < recursiveCheck.length; i++) {
      if (Array.isArray(recursiveCheck[i])) {
        return [...recursiveCheck[i], currentPosition];
      }
    }
  }

  return null;
};

const getAvailableMoves = (game, piecePosition) => {
  const field = game.field;
  const availableMoves = [];

  if (field[piecePosition] !== undefined) {
    const neighbours = getNeighbours(piecePosition);
    const singleMoves = Object.values(neighbours).filter(
      (p) => field[p] === undefined
    );
    const jumpableCells = getJumpableCells(field, piecePosition);
    availableMoves.push(...singleMoves, ...jumpableCells);
  }

  return availableMoves;
};

const getJumpableNeighbours = (
  field,
  neighbours,
  fromPosition,
  checkedCells
) => {
  return Object.values(neighbours)
    .filter((p) => field[p] !== undefined)
    .flatMap((p) => whereCanJump(field, fromPosition, p))
    .filter((p) => p !== undefined && !checkedCells.includes(p));
};

const getJumpableCells = (field, fromPosition, checkedCells) => {
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

const whereCanJump = (field, from, over) => {
  const overNeighbours = getNeighbours(over);
  const canJumpTo = [];
  if (
    overNeighbours.left === from &&
    field[overNeighbours.right] === undefined
  ) {
    canJumpTo.push(overNeighbours.right);
  }
  if (
    overNeighbours.right === from &&
    field[overNeighbours.left] === undefined
  ) {
    canJumpTo.push(overNeighbours.left);
  }
  if (
    overNeighbours.top === from &&
    field[overNeighbours.bottom] === undefined
  ) {
    canJumpTo.push(overNeighbours.bottom);
  }
  if (
    overNeighbours.bottom === from &&
    field[overNeighbours.top] === undefined
  ) {
    canJumpTo.push(overNeighbours.top);
  }
  return canJumpTo;
};

const getNeighbours = (position) => {
  return {
    top: getPositionAbove(position),
    bottom: getPositionBelow(position),
    left: getPositionLeft(position),
    right: getPositionRight(position),
  };
};

const getPositionAbove = (position) => {
  return getPosition(position, 0, 1);
};

const getPositionBelow = (position) => {
  return getPosition(position, 0, -1);
};

const getPositionLeft = (position) => {
  return getPosition(position, -1, 0);
};

const getPositionRight = (position) => {
  return getPosition(position, 1, 0);
};

const getPosition = (position, fileOffset, rankOffset) => {
  const [file, rank] = position;
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

module.exports = {
  getNeighbours,
  getPositionAbove,
  getPositionBelow,
  getPositionLeft,
  getPositionRight,
  getAvailableMoves,
  getJumpsPath,
};
