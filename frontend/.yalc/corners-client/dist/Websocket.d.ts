declare const _default: (getWs: () => WebSocket) => {
    onopen: (f: () => void) => () => void;
    onclose: (f: (e: CloseEvent) => void) => (e: CloseEvent) => void;
    onerror: (f: (e: Event) => void) => (e: Event) => void;
};
export default _default;
