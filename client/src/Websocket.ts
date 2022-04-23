export default (getWs: () => WebSocket) => {
  return {
    onopen: (f: () => void) => getWs().onopen = f,
    onclose: (f: (e: CloseEvent) => void) => getWs().onclose = f,
    onerror: (f: (e: Event) => void) => getWs().onerror = f,
  }
};
