import { Game } from "corners-common/dist/model/Game";
import { Player } from "corners-common/dist/model/Player";
import { Socket } from "socket.io-client";
import ClientToServerEvents from "corners-common/dist/socket.io/ClientToServerEvents";
import ServerToClientEvents from "corners-common/dist/socket.io/ServerToClientEvents";

export interface OnLoginFunction {
  (games: Game[], player: Player): void;
}

export interface OnGameCreatedFunction {
  (game: Game): void;
}

export interface OnGameUpdatedFunction {
  (game: Game): void;
}

export interface OnErrorFunction {
  (message: string): void;
}

export default (socket: Socket<ServerToClientEvents, ClientToServerEvents>) => {
  let onLogin: OnLoginFunction = () => {};
  let onGameCreated: OnGameCreatedFunction = () => {};
  let onGameUpdated: OnGameUpdatedFunction = () => {};
  let onError: OnErrorFunction = () => {};

  // todo implement player initiation on backend
  socket.on("identityCreated", (games, player) => {
    console.log("User joined: " + player.name);
    onLogin(games, player);
  });

  socket.on("gameCreated", (game) => {
    console.log("Game created: " + game);
    onGameCreated(game);
  });

  
  socket.on("gameUpdated", (game) => {
    console.log("Game updated: " + game.id);
    onGameUpdated(game);
  });

  
  socket.on("error", (message) => {
    console.error("Error: " + message);
    onError(message);
  });

  return {
    onLogin: (f: OnLoginFunction) => (onLogin = f),
    onGameCreated: (f: OnGameCreatedFunction) => (onGameCreated = f),
    onGameUpdated: (f: OnGameUpdatedFunction) => (onGameUpdated = f),
    onError: (f: OnErrorFunction) => (onError = f),
  };
};
