import { Socket } from "socket.io-client";
import ClientToServerEvents from "corners-types/dist/socket.io/ClientToServerEvents";
import ServerToClientEvents from "corners-types/dist/socket.io/ServerToClientEvents";

export default (socket: Socket<ServerToClientEvents, ClientToServerEvents>) => {
  const createGame = () => {
    socket.emit("createGame");
  };

  const login = (name: string) => {
    socket.emit("login", name);
  };

  const joinGame = (gameId: string) => {
    socket.emit("joinGame", gameId);
  };

  const makeTurn = (gameId: string, current: string, desired: string) => {
    console.log(
      "Let's pretend that we've validated the input before sending to the server for now..."
    );
    socket.emit("makeTurn", gameId, current, desired);
  };

  return { makeTurn, joinGame, login, createGame };
};
