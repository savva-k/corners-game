const WebSocket = require("ws");
const process = require("process");

process.title = "cornersServer";

const {
  createGame,
  validateTurn,
  checkWin,
  getNotStartedGame,
} = require("./services/GameService");
const { white, black } = require("./constants/InitialBoardState");

const server = new WebSocket.Server({
  port: 8080,
});

let sockets = [];
let players = [];
let games = [];

const createPlayer = (() => {
  let counter = 1;
  return (socket, name) => {
    let player = { name: name, id: counter++, socket: socket };
    players.push(player);
    return player;
  };
})();

const getPlayerBySocket = (socket) => players.find((p) => p.socket === socket);

const handleMessage = (socket, msg) => {
  if (msg.type === "GET_IDENTITY") {
    if (msg.payload && msg.payload.name) {
      if (players.find((p) => p.name === msg.payload.name) === undefined) {
        console.log("Registering a new user");
        let player = createPlayer(socket, msg.payload.name);
        let response = {
          type: "IDENTITY_CREATED",
          payload: {
            name: player.name,
            registered: true,
            games: games,
          },
        };
        socket.send(JSON.stringify(response));
      } else {
        console.log("name is already taken");
        socket.send(
          JSON.stringify({
            type: "ERROR",
            payload: {
              message: "This username is already taken",
            },
          })
        );
      }
    } else {
      console.log("name is not specified");
      socket.send(
        JSON.stringify({
          type: "ERROR",
          payload: {
            message: "Please introduce yourself!",
          },
        })
      );
    }
  }

  if (msg.type === "REFRESH_IDENTITY") {
    if (msg.payload && msg.payload.name) {
      let player = players.find((p) => p.name === msg.payload.name);
      if (player) {
        console.log("An existing player's socket has been updated");
        player.socket = socket;
      } else {
        console.log("A new player has been added to the list");
        players.push({
          name: msg.payload.name,
          socket: socket,
        });
      }
      socket.send(
        JSON.stringify({
          type: "IDENTITY_REFRESHED",
          name: player.name,
          registered: true,
          games: games,
        })
      );
    } else {
      console.error("Incorrect identity was received");
      socket.send(
        JSON.stringify({
          type: "ERROR",
          payload: {
            message: "I cannot recognize you... Please tell me your name!",
          },
        })
      );
    }
  }

  if (msg.type === "JOIN_GAME") {
    if (msg.payload && msg.payload.gameId) {
      const player = getPlayerBySocket(socket);
      const game = games.find((g) => g.id === msg.payload.gameId);
      if (player && game) {
        if (player.name !== game.player1.name && game.player2 === undefined) {
          console.log(
            `Player ${player.name} has joined to the game id: ${game.id}`
          );
          game.player2 = {
            name: player.name,
            pieceColor: black,
            registered: true,
          };
          game.isStarted = true;
          game.updatedAt = new Date();
          sockets.forEach((s) =>
            s.send(
              JSON.stringify({
                type: "GAME_UPDATED",
                payload: {
                  game: game,
                },
              })
            )
          );
        } else {
          console.error(
            `Cannot connect to your own game or someone's game in progress: gameId: ${game.gameId}, player name: ${player.name}, game players: ${game.player1}, ${game.player2}`
          );
          socket.send(
            JSON.stringify({
              type: "ERROR",
              payload: {
                message:
                  "Cannot connect to your own game or someone's game in progress",
              },
            })
          );
        }
      } else {
        console.error(`user or game not found, game id: ${msg.payload.gameId}`);
        socket.send(
          JSON.stringify({
            type: "ERROR",
            payload: {
              message: "User or game not found",
            },
          })
        );
      }
    } else {
      console.error("payload.gameId not specified");
      socket.send(
        JSON.stringify({
          type: "ERROR",
          payload: {
            message: "payload.gameId not specified",
          },
        })
      );
    }
  }

  if (msg.type === "CREATE_GAME") {
    const player = getPlayerBySocket(socket);
    if (player) {
      if (getNotStartedGame(games, player)) {
        console.error("user already has a not started game");
        socket.send(
          JSON.stringify({
            type: "ERROR",
            payload: {
              message: "The game is already created, let's wait for the opponent...",
            },
          })
        );
      } else {
        const game = createGame(player.name);
        console.log("A new game has been created: " + JSON.stringify(game));
        games.push(game);
        sockets.forEach((s) =>
          s.send(
            JSON.stringify({
              type: "GAME_CREATED",
              payload: {
                game: game,
              },
            })
          )
        );
      }
    } else {
      console.error("user is not registered");
      socket.send(
        JSON.stringify({
          type: "ERROR",
          payload: {
            message: "Please register a username first",
          },
        })
      );
    }
  }

  if (msg.type === "MAKE_TURN") {
    const { gameId, currentPosition, desiredPosition } = msg.payload;
    const game = games.find((g) => g.id === gameId);
    console.log(
      "Making turn: gameId=" +
        gameId +
        ", current=" +
        currentPosition +
        ", desired=" +
        desiredPosition
    );

    if (game) {
      const { validTurn, path, availableMoves } = validateTurn(
        game,
        currentPosition,
        desiredPosition
      );

      if (validTurn) {
        game.turns.push({
          from: currentPosition,
          to: desiredPosition,
          path: path,
        });
        game.field[desiredPosition] = game.field[currentPosition];
        game.field[currentPosition] = undefined;
        game.currentTurn = game.currentTurn === white ? black : white;
        game.mistakeAtField = null;

        const winner = checkWin(game);

        if (winner) {
          game.winner = winner;
          game.isFinished = true;
        }
      } else {
        game.mistakeAtField = desiredPosition;
      }

      game.updatedAt = new Date();
      game.availableMoves = availableMoves;
      game.validTurn = validTurn;

      sockets.forEach((s) =>
        s.send(
          JSON.stringify({
            type: "GAME_UPDATED",
            payload: {
              game: game,
            },
          })
        )
      );
    } else {
      console.error("Game not found!");
    }
  }
};

server.on("connection", function (socket) {
  sockets.push(socket);

  socket.on("message", function (msg) {
    console.log("got message: " + msg);
    handleMessage(socket, JSON.parse(msg));
  });

  socket.on("close", function () {
    const player = getPlayerBySocket(socket);
    if (player) {
      console.log(`${player.name} (${player.id}) left the game`);
      players = players.filter((p) => p.socket !== socket);

      sockets.forEach((s) =>
        s.send(
          JSON.stringify({
            type: "PLAYER_LEFT",
            payload: {
              name: player.name,
            },
          })
        )
      );
    }
    sockets = sockets.filter((s) => s !== socket);
  });
});

process.on("SIGINT", function () {
  console.log("\nGracefully shutting down from SIGINT");

  sockets.forEach((s) =>
    s.send(
      JSON.stringify({
        type: "SERVER_SHUTDOWN",
        payload: {
          message:
            "The server has been shut down for maintenance. Please try again later.",
        },
      })
    )
  );

  process.exit();
});
