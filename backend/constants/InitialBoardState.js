const white = 0;
const black = 1;

const whiteStartPositions = [
  "a1",
  "b1",
  "c1",
  "d1",
  "a2",
  "b2",
  "c2",
  "d2",
  "a3",
  "b3",
  "c3",
  "d3",
].sort();
const blackStartPositions = [
  "h8",
  "g8",
  "f8",
  "e8",
  "h7",
  "g7",
  "f7",
  "e7",
  "h6",
  "g6",
  "f6",
  "e6",
].sort();

const initialBoardState = (() => {
  const state = {};

  whiteStartPositions.forEach((p) => {
    state[p] = white;
  });

  blackStartPositions.forEach((p) => {
    state[p] = black;
  });

  return state;
})();

module.exports = { initialBoardState, white, black, whiteStartPositions, blackStartPositions };
