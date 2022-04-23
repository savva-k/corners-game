const {
  getNeighbours,
  getPositionAbove,
  getPositionLeft,
  getPositionRight,
  getPositionBelow,
  getJumpsPath,
} = require("./GameBoardService");

describe("getPositionAbove", () => {
  it("should return d3 for d2", () => {
    expect(getPositionAbove("d2")).toBe("d3");
  });
  it("should return undefined for XY, as it's out of range", () => {
    expect(getPositionAbove("XY")).toBe(undefined);
  });
  it("should return undefined for d8, as there is no d9", () => {
    expect(getPositionAbove("d8")).toBe(undefined);
  });
});

describe("getPositionLeft", () => {
  it("should return a8 for b8", () => {
    expect(getPositionLeft("b8")).toBe("a8");
  });
  it("should return undefined for a8, as there is no ?8", () => {
    expect(getPositionLeft("a8")).toBe(undefined);
  });
});

describe("getPositionRight", () => {
  it("should return b8 for a8", () => {
    expect(getPositionRight("a8")).toBe("b8");
  });
  it("should return undefined for h8", () => {
    expect(getPositionRight("h8")).toBe(undefined);
  });
});

describe("getPositionBelow", () => {
  it("should return c4 for c5", () => {
    expect(getPositionBelow("c5")).toBe("c4");
  });
  it("should return undefined for h1", () => {
    expect(getPositionBelow("h1")).toBe(undefined);
  });
});

test("getNeighbours should return { left: 'a2', top: 'b3', right: 'c2', bottom: 'b1' } for b2", () => {
  const neighbours = getNeighbours("b2");
  expect(neighbours).toMatchObject({
    left: "a2",
    top: "b3",
    right: "c2",
    bottom: "b1",
  });
});

test("getNeighbours should return { left: undefined, top: 'a2', right: 'b1', bottom: undefined } for a1", () => {
  const neighbours = getNeighbours("a1");
  expect(neighbours).toMatchObject({
    left: undefined,
    top: "a2",
    right: "b1",
    bottom: undefined,
  });
});

describe("getJumpsPath", () => {
  it("should return [ 'g4', 'e4', 'c4', 'c2' ] for current=c2, desired=g4 and game allows to jump there", () => {
    const field = {
      c2: 1,
      c3: 1,
      d4: 1,
      f4: 1,
    };
    const path = getJumpsPath(field, "c2", "g4");
    expect(path).toEqual(["g4", "e4", "c4", "c2"]);
  });

  it("should return [ 'c4', 'c2' ] for current=c2, desired=c4 and game allows to jump there", () => {
    const field = {
      c2: 1,
      c3: 1,
    };
    const path = getJumpsPath(field, "c2", "c4");
    expect(path).toEqual(["c4", "c2"]);
  });

  it("should return [ 'c4', 'c3' ] for current=c3, desired=c4 and game allows to move there", () => {
    const field = {
      c3: 1,
    };
    const path = getJumpsPath(field, "c3", "c4");
    expect(path).toEqual(["c4", "c3"]);
  });

  it("should return [ 'g6', 'g4', 'e4', 'e2', 'c2', 'c4', 'a4', 'a2' ] for current=a2, desired=g6 and game allows to move there", () => {
    const field = {
      a2: 1,
      a3: 1,
      b4: 1,
      c3: 1,
      d2: 1,
      e3: 1,
      f4: 1,
      g5: 1,
    };
    const path = getJumpsPath(field, "a2", "g6");
    expect(path).toEqual(["g6", "g4", "e4", "e2", "c2", "c4", "a4", "a2"]);
  });
});
