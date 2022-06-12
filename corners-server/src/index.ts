import { Server, Socket } from "socket.io";
import { white, black } from "corners-common/dist/constants";
import { Game } from "corners-common/dist/model";
import {
  createGame,
  validateTurn,
  checkGameStatus,
  getNotStartedGame,
} from "corners-common/dist/services";
import { Piece } from "corners-common/dist/model/Piece";
import ClientToServerEvents from "corners-common/dist/socket.io/ClientToServerEvents";
import ServerToClientEvents from "corners-common/dist/socket.io/ServerToClientEvents";
import { Player } from "./model/Player";
import uuid4 from "uuid4";

process.title = "cornersServer";
const server = new Server<ClientToServerEvents, ServerToClientEvents>(8080, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

let sockets: Socket[] = [];
let players: Player[] = [];
let games: Game[] = [];

const createPlayer = (() => {
  let counter = 1;
  return (socket: Socket, name: string): Player => {
    let player = { name: name, id: counter++, socket: socket };
    players.push(player);
    return player;
  };
})();

const getPlayerBySocket = (socket: Socket) =>
  players.find((p) => p.socket === socket);

server.on("connection", (socket) => {
  console.log("New socket connection: " + socket.id);
  sockets.push(socket);

  socket.on("login", (name) => {
    if (name) {
      if (players.find((p) => p.name === name) === undefined) {
        console.log("Registering a new user: " + name);
        let player = createPlayer(socket, name);
        socket.emit("identityCreated", games, {
          name: player.name,
          registered: true,
          pieceColor: Piece.White,
        });
      } else {
        console.log("name is already taken: " + name);
        socket.emit("error", "This username is already taken");
      }
    } else {
      console.log("name is not specified");
      socket.emit("error", "Please introduce yourself!");
    }
  });

  socket.on("joinGame", (gameId) => {
    if (gameId) {
      const player = getPlayerBySocket(socket);
      const game = games.find((g) => g.id === gameId);
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
          server.emit("secondPlayerJoined", game);
        } else {
          console.error(
            `Cannot connect to your own game or someone's game in progress: gameId: ${game.id}, player name: ${player.name}, game players: ${game.player1?.name}, ${game.player2?.name}`
          );
          socket.emit(
            "error",
            "Cannot connect to your own game or someone's game in progress"
          );
        }
      } else {
        console.error(`user or game not found, game id: ${gameId}`);
        socket.emit("error", "User or game not found");
      }
    } else {
      console.error("Game ID is not specified");
      socket.emit("error", "Game ID is not specified");
    }
  });

  socket.on("createGame", () => {
    const player = getPlayerBySocket(socket);
    if (player) {
      if (getNotStartedGame(games, player.name)) {
        console.error("user already has a not started game");
        socket.emit(
          "error",
          "The game is already created, let's wait for the opponent..."
        );
      } else {
        const game = createGame(uuid4(), player.name);
        console.log("A new game has been created: " + JSON.stringify(game) + ' by ' + player.name);
        games.push(game);
        server.emit("gameCreated", game);
      }
    } else {
      console.error("user is not registered");
      socket.emit("error", "Please register a username first");
    }
  });

  socket.on("makeTurn", (gameId, currentPosition, desiredPosition) => {
    const game = games.find((g) => g.id === gameId);
    console.log(
      "Making turn: gameId=" +
        gameId +
        ", current=" +
        currentPosition +
        ", desired=" +
        desiredPosition
    );

    if (game && !game.isFinished) {
      const { validTurn, path, availableMoves } = validateTurn(
        game,
        currentPosition,
        desiredPosition
      );

      if (validTurn && path) {
        game.turns.push({
          from: currentPosition,
          to: desiredPosition,
          path: path,
        });
        game.field[desiredPosition] = game.field[currentPosition];
        game.field[currentPosition] = undefined;
        game.currentTurn = game.currentTurn === white ? black : white;
        game.mistakeAtField = undefined;

        const gameStatus = checkGameStatus(game);

        if (gameStatus) {
          game.winner = gameStatus.player;
          game.finishReason = gameStatus.finishReason;
          game.isFinished = true;
        }
      } else {
        game.mistakeAtField = desiredPosition;
      }

      game.updatedAt = new Date();
      game.availableMoves = availableMoves;

      server.emit("gameUpdated", game);
    } else {
      console.error("Game not found!");
    }
  });

  socket.on("disconnect", (reason) => {
    const player = getPlayerBySocket(socket);
    if (player) {
      console.log(`${player.name} (${player.id}) left the game, reason: ${reason}`);
      players = players.filter((p) => p.socket !== socket);
      server.emit("playerLeft", player.name);
    }
    sockets = sockets.filter((s) => s !== socket);
  });
});

process.on("SIGINT", function () {
  console.log("\nGracefully shutting down from SIGINT");
  sockets.forEach((s) => s.emit("serverShutdown"));
  process.exit();
});

console.log("Corners server successfully started!");
