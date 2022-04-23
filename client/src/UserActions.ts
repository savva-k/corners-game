export default (getWs: () => WebSocket) => {
  const createGame = () => {
    getWs().send(
      JSON.stringify({
        type: "CREATE_GAME",
      })
    );
  };

  const registerPlayer = (name: string, refresh?: boolean) => {
    getWs().send(
      JSON.stringify({
        payload: {
          name: name,
        },
        type: refresh ? "REFRESH_IDENTITY" : "GET_IDENTITY",
      })
    );
  };

  const joinGame = (gameId: string) => {
    getWs().send(
      JSON.stringify({
        payload: {
          gameId: gameId,
        },
        type: "JOIN_GAME",
      })
    );
  };

  const makeTurn = (gameId: string, current: string, desired: string) => {
    console.log(
      "Let's pretend that we've validated the input before sending to the server for now..."
    );
    getWs().send(
      JSON.stringify({
        type: "MAKE_TURN",
        payload: {
          gameId: gameId,
          currentPosition: current,
          desiredPosition: desired,
        },
      })
    );
  };

  return { makeTurn, joinGame, registerPlayer, createGame };
};
