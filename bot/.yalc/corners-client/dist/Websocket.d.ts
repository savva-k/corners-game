import { Socket } from "socket.io-client";
declare const _default: (socket: Socket) => {
    onopen: (f: () => void) => Socket<import("@socket.io/component-emitter").DefaultEventsMap, import("@socket.io/component-emitter").DefaultEventsMap>;
    onclose: (f: (e: string) => void) => Socket<import("@socket.io/component-emitter").DefaultEventsMap, import("@socket.io/component-emitter").DefaultEventsMap>;
    onerror: (f: (e: string) => void) => Socket<import("@socket.io/component-emitter").DefaultEventsMap, import("@socket.io/component-emitter").DefaultEventsMap>;
};
export default _default;
