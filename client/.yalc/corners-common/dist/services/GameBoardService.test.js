"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GameBoardService_1 = require("./GameBoardService");
describe("getPositionAbove", function () {
    it("should return d3 for d2", function () {
        expect((0, GameBoardService_1.getPositionAbove)("d2")).toBe("d3");
    });
    it("should return undefined for XY, as it's out of range", function () {
        expect((0, GameBoardService_1.getPositionAbove)("XY")).toBe(undefined);
    });
    it("should return undefined for d8, as there is no d9", function () {
        expect((0, GameBoardService_1.getPositionAbove)("d8")).toBe(undefined);
    });
});
describe("getPositionLeft", function () {
    it("should return a8 for b8", function () {
        expect((0, GameBoardService_1.getPositionLeft)("b8")).toBe("a8");
    });
    it("should return undefined for a8, as there is no ?8", function () {
        expect((0, GameBoardService_1.getPositionLeft)("a8")).toBe(undefined);
    });
});
describe("getPositionRight", function () {
    it("should return b8 for a8", function () {
        expect((0, GameBoardService_1.getPositionRight)("a8")).toBe("b8");
    });
    it("should return undefined for h8", function () {
        expect((0, GameBoardService_1.getPositionRight)("h8")).toBe(undefined);
    });
});
describe("getPositionBelow", function () {
    it("should return c4 for c5", function () {
        expect((0, GameBoardService_1.getPositionBelow)("c5")).toBe("c4");
    });
    it("should return undefined for h1", function () {
        expect((0, GameBoardService_1.getPositionBelow)("h1")).toBe(undefined);
    });
});
test("getNeighbours should return { left: 'a2', top: 'b3', right: 'c2', bottom: 'b1' } for b2", function () {
    var neighbours = (0, GameBoardService_1.getNeighbours)("b2");
    expect(neighbours).toMatchObject({
        left: "a2",
        top: "b3",
        right: "c2",
        bottom: "b1",
    });
});
test("getNeighbours should return { left: undefined, top: 'a2', right: 'b1', bottom: undefined } for a1", function () {
    var neighbours = (0, GameBoardService_1.getNeighbours)("a1");
    expect(neighbours).toMatchObject({
        left: undefined,
        top: "a2",
        right: "b1",
        bottom: undefined,
    });
});
describe("getJumpsPath", function () {
    it("should return [ 'g4', 'e4', 'c4', 'c2' ] for current=c2, desired=g4 and game allows to jump there", function () {
        var field = {
            c2: 1,
            c3: 1,
            d4: 1,
            f4: 1,
        };
        var path = (0, GameBoardService_1.getJumpsPath)(field, "c2", "g4");
        expect(path).toEqual(["g4", "e4", "c4", "c2"]);
    });
    it("should return [ 'c4', 'c2' ] for current=c2, desired=c4 and game allows to jump there", function () {
        var field = {
            c2: 1,
            c3: 1,
        };
        var path = (0, GameBoardService_1.getJumpsPath)(field, "c2", "c4");
        expect(path).toEqual(["c4", "c2"]);
    });
    it("should return [ 'c4', 'c3' ] for current=c3, desired=c4 and game allows to move there", function () {
        var field = {
            c3: 1,
        };
        var path = (0, GameBoardService_1.getJumpsPath)(field, "c3", "c4");
        expect(path).toEqual(["c4", "c3"]);
    });
    it("should return [ 'g6', 'g4', 'e4', 'e2', 'c2', 'c4', 'a4', 'a2' ] for current=a2, desired=g6 and game allows to move there", function () {
        var field = {
            a2: 1,
            a3: 1,
            b4: 1,
            c3: 1,
            d2: 1,
            e3: 1,
            f4: 1,
            g5: 1,
        };
        var path = (0, GameBoardService_1.getJumpsPath)(field, "a2", "g6");
        expect(path).toEqual(["g6", "g4", "e4", "e2", "c2", "c4", "a4", "a2"]);
    });
});
