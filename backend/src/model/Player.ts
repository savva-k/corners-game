import { Socket } from "socket.io";

export interface Player {
    name: string;
    id: number;
    socket: any
}
