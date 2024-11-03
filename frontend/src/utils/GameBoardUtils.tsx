import { Game, Piece, Player } from "../model";

const getFiles = (currentPlayerPieceColor: Piece): string[] => {
  const files = ["a", "b", "c", "d", "e", "f", "g", "h"];
  return currentPlayerPieceColor === Piece.White ? files : files.reverse();
};

const getRanks = (currentPlayerPieceColor: Piece): number[] => {
  const ranks = [1, 2, 3, 4, 5, 6, 7, 8];
  return currentPlayerPieceColor === Piece.White ? ranks.reverse() : ranks;
};

const getCurrentPlayerPieceColor = (game: Game, player: Player) => {
  if (game.player1?.name === player.name) {
    return game.player1Piece;
  } else if (game.player2?.name === player.name) {
    return game.player2Piece;
  }
  return Piece.White;
};

const colorSwitcher = (color1: string, color2: string) => {
  return (color: string) => {
    return color === color1 ? color2 : color1;
  };
};

const getDummyGame = (): Game => {
  return {
    id: "xxxxx",
    player1: {
      name: "Test1",
      registered: true,
      roles: ['test'],
    },
    player2: {
      name: "Test2",
      registered: true,
      roles: ['test'],
    },
    initiator: {
      name: "Test1",
      registered: true,
      roles: ['test'],
    },
    turns: [],
    currentTurn: Piece.White,
    player1Piece: Piece.White,
    player2Piece: Piece.Black,
    field: {
      "a1": Piece.White,
      "h8": Piece.Black
    },
    isStarted: true,
    isFinished: false,
    finishReason: undefined,
    winner: undefined,
    createdAt: '',
    updatedAt: '',
    mistakeAtField: undefined,
    availableMoves: undefined,
  }
}

const getTestGame = (): Game => {
  return {
    id: "e38121c5-20a8-4cab-8dbf-bb21b0a21e01",
    player1: {
        "name": "test1",
        registered: true,
        "roles": [
            "ROLE_USER"
        ]
    },
    player2: {
        "name": "test2",
        registered: true,
        "roles": [
            "ROLE_USER"
        ]
    },
    initiator: {
        "name":"test1",
        registered: true,
        "roles":[
            "ROLE_USER"
        ]
    },
    turns: [
        {
            from:"c2",
            to:"c4",
            path:[
                "c4",
                "c2"
            ]
        },
        {
            from:"f7",
            to:"f5",
            path:[
                "f5",
                "f7"
            ]
        },
        {
            from:"a2",
            to:"e2",
            path:[
                "e2",
                "c2",
                "a2"
            ]
        },
        {
            from:"g7",
            to:"g5",
            path:[
                "g5",
                "g7"
            ]
        },
        {
            from:"d3",
            to:"e3",
            path:[
                "e3",
                "d3"
            ]
        },
        {
            from:"f5",
            to:"f4",
            path:[
                "f4",
                "f5"
            ]
        },
        {
            from:"b2",
            to:"d4",
            path:[
                "d4",
                "b4",
                "b2"
            ]
        },
        {
            from:"f6",
            to:"d6",
            path:[
                "d6",
                "f6"
            ]
        },
        {
            from:"b1",
            to:"b2",
            path:[
                "b2",
                "b1"
            ]
        },
        {
            from:"e7",
            to:"d7",
            path:[
                "d7",
                "e7"
            ]
        },
        {
            from: "b3",
            to: "b4",
            path: [
                "b4",
                "b3"
            ]
        },
        {
            from: "d6",
            to: "c6",
            path: [
                "c6",
                "d6"
            ]
        },
        {
            from: "c4",
            to: "c5",
            path: [
                "c5",
                "c4"
            ]
        },
        {
            from: "f8",
            to: "b6",
            path: [
                "b6",
                "d6",
                "d8",
                "f8"
            ]
        },
        {
            from: "d1",
            to: "d5",
            path: [
                "d5",
                "d3",
                "d1"
            ]
        },
        {
            from: "b6",
            to: "a6",
            path: [
                "a6",
                "b6"
            ]
        }
    ],
    currentTurn:Piece.White,
    player1Piece:Piece.White,
    player2Piece:Piece.Black,
    field:{
        "d2":Piece.White,
        "h6":Piece.Black,
        "f4":Piece.Black,
        "h7":Piece.Black,
        "b2":Piece.White,
        "h8":Piece.Black,
        "d4":Piece.White,
        "d5":Piece.White,
        "b4":Piece.White,
        "d7":Piece.Black,
        "e2":Piece.White,
        "c1":Piece.White,
        "g5":Piece.Black,
        "e3":Piece.White,
        "g6":Piece.Black,
        "a1":Piece.White,
        "c3":Piece.White,
        "g8":Piece.Black,
        "e6":Piece.Black,
        "a3":Piece.White,
        "c5":Piece.White,
        "e8":Piece.Black,
        "c6":Piece.Black,
        "a6":Piece.Black
    },
    isStarted:true,
    isFinished:false,
    createdAt:"03.11.2024",
    updatedAt:"03.11.2024",
    mistakeAtField:"g3",
    availableMoves:[
        "b5",
        "b7",
        "a6",
        "d6",
        "d8",
        "f6",
        "f8"
    ],
    finishReason: undefined,
    winner: undefined,
  }
}

export { getFiles, getRanks, colorSwitcher, getCurrentPlayerPieceColor, getDummyGame, getTestGame };
