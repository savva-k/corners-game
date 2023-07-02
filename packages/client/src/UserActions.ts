import { Socket } from "socket.io-client";
import { ClientToServerEvents, ServerToClientEvents }from "@corners-game/common";

export default (socket: Socket<ServerToClientEvents, ClientToServerEvents>) => {
  const createGame = () => {
    console.log("Creating a new game");
    socket.emit("createGame");
  };

  const login = (name: string) => {
    console.log("Logging in to the game as " + name);
    socket.emit("login", name);
  };

  const joinGame = (gameId: string) => {
    console.log("Joining the game " + gameId);
    socket.emit("joinGame", gameId);
  };

  const makeTurn = (gameId: string, current: string, desired: string) => {
    console.log(
      "Let's pretend that we've validated the input before sending to the server for now..."
    );
    console.log(
      `Making a turn: gameId: ${gameId}, current: ${current}, desired: ${desired}`
    );
    socket.emit("makeTurn", gameId, current, desired);
  };

  return { makeTurn, joinGame, login, createGame };
};
