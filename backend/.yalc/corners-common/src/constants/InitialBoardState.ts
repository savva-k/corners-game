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
  const state: any = {};

  whiteStartPositions.forEach((p) => {
    state[p] = black;
  });

  blackStartPositions.forEach((p) => {
    state[p] = white;
  });

  state["g6"] = undefined;
  state["g5"] = white;

  state["b3"] = undefined;
  state["b4"] = black;

  return state;
})();

export { initialBoardState, white, black, whiteStartPositions, blackStartPositions };
