import { Socket } from "socket.io-client";

export default (socket: Socket) => {
  return {
    onopen: (f: () => void) => socket.on("connection", () => f()),
    onclose: (f: (e: string) => void) =>
      socket.on("disconnect", (reason) => f(reason)),
    onerror: (f: (e: string) => void) =>
      socket.on("error", (reason) => f(reason)),
  };
};
