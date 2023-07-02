let testGameData = [
  {
    from: "c2",
    to: "c4",
    path: ["c4", "c2"],
  },
  {
    from: "f7",
    to: "f5",
    path: ["f5", "f7"],
  },
  {
    from: "b2",
    to: "d4",
    path: ["d4", "b4", "b2"],
  },
  {
    from: "g7",
    to: "e5",
    path: ["e5", "g5", "g7"],
  },
  {
    from: "d3",
    to: "d5",
    path: ["d5", "d3"],
  },
  {
    from: "f8",
    to: "f7",
    path: ["f7", "f8"],
  },
  {
    from: "d2",
    to: "e2",
    path: ["e2", "d2"],
  },
  {
    from: "f6",
    to: "f4",
    path: ["f4", "f6"],
  },
  {
    from: "c1",
    to: "e3",
    path: ["e3", "e1", "c1"],
  },
  {
    from: "f4",
    to: "f3",
    path: ["f3", "f4"],
  },
  {
    from: "e3",
    to: "g3",
    path: ["g3", "e3"],
  },
  {
    from: "h8",
    to: "d2",
    path: ["d2", "f2", "f4", "f6", "f8", "h8"],
  },
  {
    from: "a1",
    to: "e3",
    path: ["e3", "e1", "c1", "a1"],
  },
  {
    from: "h6",
    to: "f2",
    path: ["f2", "f4", "f6", "f8", "h8", "h6"],
  },
  {
    from: "c4",
    to: "c5",
    path: ["c5", "c4"],
  },
  {
    from: "e6",
    to: "c2",
    path: ["c2", "c4", "e4", "e6"],
  },
  {
    from: "d5",
    to: "d6",
    path: ["d6", "d5"],
  },
  {
    from: "e8",
    to: "c4",
    path: ["c4", "e4", "e6", "e8"],
  },
  {
    from: "b3",
    to: "d7",
    path: ["d7", "d5", "d3", "b3"],
  },
  {
    from: "f5",
    to: "b5",
    path: ["b5", "d5", "f5"],
  },
  {
    from: "e3",
    to: "e4",
    path: ["e4", "e3"],
  },
  {
    from: "e5",
    to: "a1",
    path: ["a1", "c1", "e1", "e3", "e5"],
  },
  {
    from: "a2",
    to: "b2",
    path: ["b2", "a2"],
  },
  {
    from: "h7",
    to: "g7",
    path: ["g7", "h7"],
  },
  {
    from: "b1",
    to: "d5",
    path: ["d5", "d3", "b3", "b1"],
  },
  {
    from: "g7",
    to: "g5",
    path: ["g5", "g7"],
  },
  {
    from: "g3",
    to: "e5",
    path: ["e5", "e3", "g3"],
  },
  {
    from: "g5",
    to: "g4",
    path: ["g4", "g5"],
  },
  {
    from: "d4",
    to: "h4",
    path: ["h4", "f4", "d4"],
  },
  {
    from: "e7",
    to: "c1",
    path: ["c1", "e1", "e3", "g3", "g5", "g7", "e7"],
  },
  {
    from: "a3",
    to: "b3",
    path: ["b3", "a3"],
  },
  {
    from: "g8",
    to: "g7",
    path: ["g7", "g8"],
  },
  {
    from: "b2",
    to: "b6",
    path: ["b6", "b4", "b2"],
  },
  {
    from: "g7",
    to: "e1",
    path: ["e1", "e3", "g3", "g5", "g7"],
  },
  {
    from: "d1",
    to: "d3",
    path: ["d3", "d1"],
  },
  {
    from: "f7",
    to: "g7",
    path: ["g7", "f7"],
  },
  {
    from: "e5",
    to: "e6",
    path: ["e6", "e5"],
  },
  {
    from: "g7",
    to: "e3",
    path: ["e3", "g3", "g5", "g7"],
  },
  {
    from: "d6",
    to: "h6",
    path: ["h6", "f6", "d6"],
  },
  {
    from: "g6",
    to: "g5",
    path: ["g5", "g6"],
  },
  {
    from: "d3",
    to: "d4",
    path: ["d4", "d3"],
  },
  {
    from: "d2",
    to: "b2",
    path: ["b2", "d2"],
  },
  {
    from: "d4",
    to: "f6",
    path: ["f6", "d6", "d4"],
  },
  {
    from: "f3",
    to: "b1",
    path: ["b1", "d1", "f1", "f3"],
  },
  {
    from: "b3",
    to: "f3",
    path: ["f3", "d3", "b3"],
  },
  {
    from: "f2",
    to: "d2",
    path: ["d2", "f2"],
  },
  {
    from: "e2",
    to: "f2",
    path: ["f2", "e2"],
  },
  {
    from: "g5",
    to: "g3",
    path: ["g3", "g5"],
  },
  {
    from: "f2",
    to: "f4",
    path: ["f4", "f2"],
  },
  {
    from: "g4",
    to: "g2",
    path: ["g2", "g4"],
  },
  {
    from: "f3",
    to: "f7",
    path: ["f7", "f5", "f3"],
  },
  {
    from: "b5",
    to: "b4",
    path: ["b4", "b5"],
  },
  {
    from: "c5",
    to: "g7",
    path: ["g7", "e7", "e5", "c5"],
  },
  {
    from: "c2",
    to: "a2",
    path: ["a2", "c2"],
  },
  {
    from: "c3",
    to: "e7",
    path: ["e7", "e5", "c5", "c3"],
  },
  {
    from: "c4",
    to: "c3",
    path: ["c3", "c4"],
  },
  {
    from: "e6",
    to: "e8",
    path: ["e8", "e6"],
  },
  {
    from: "g3",
    to: "f3",
    path: ["f3", "g3"],
  },
  {
    from: "f4",
    to: "f8",
    path: ["f8", "d8", "d6", "d4", "f4"],
  },
  {
    from: "b4",
    to: "b3",
    path: ["b3", "b4"],
  },
  {
    from: "d5",
    to: "e5",
    path: ["e5", "d5"],
  },
  {
    from: "b3",
    to: "a3",
    path: ["a3", "b3"],
  },
  {
    from: "e4",
    to: "g8",
    path: ["g8", "g6", "e6", "e4"],
  },
  {
    from: "f3",
    to: "b3",
    path: ["b3", "d3", "f3"],
  },
  {
    from: "b6",
    to: "c6",
    path: ["c6", "b6"],
  },
  {
    from: "g2",
    to: "f2",
    path: ["f2", "g2"],
  },
  {
    from: "f7",
    to: "h7",
    path: ["h7", "f7"],
  },
  {
    from: "f2",
    to: "e2",
    path: ["e2", "f2"],
  },
  {
    from: "h6",
    to: "h8",
    path: ["h8", "h6"],
  },
  {
    from: "e2",
    to: "c2",
    path: ["c2", "e2"],
  },
  {
    from: "d7",
    to: "f7",
    path: ["f7", "d7"],
  },
  {
    from: "e1",
    to: "d1",
    path: ["d1", "e1"],
  },
  {
    from: "c6",
    to: "d6",
    path: ["d6", "c6"],
  },
  {
    from: "e3",
    to: "d3",
    path: ["d3", "e3"],
  },
];

export default testGameData;
