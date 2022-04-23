import { Game } from "./model/Game";
import { Piece } from "./model/Piece";
import { Player } from "./model/Player";

export interface OnIdentityCreatedFunction {
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

export default (getWs: () => WebSocket) => {
  let onIdentityCreated: OnIdentityCreatedFunction = () => {};
  let onGameCreated: OnGameCreatedFunction = () => {};
  let onGameUpdated: OnGameUpdatedFunction = () => {};
  let onError: OnErrorFunction = () => {};

  const onMessage = (event: MessageEvent<any>) => {
    let msg = JSON.parse(event.data);

    // todo move player initiation to backend
    if (msg.type === "IDENTITY_CREATED") {
      console.log("User joined: " + msg.payload.name);
      onIdentityCreated(msg.payload.games, {
        name: msg.payload.name,
        pieceColor: Piece.White,
        registered: msg.payload.registered,
      });
    }

    if (msg.type === "GAME_CREATED") {
      console.log("Game created: " + msg.payload.game);
      onGameCreated(msg.payload.game);
    }

    if (msg.type === "GAME_UPDATED") {
      console.log("Game updated: " + msg.payload.game.id);
      onGameUpdated(msg.payload.game);
    }

    if (msg.type === "ERROR") {
      console.error("Error: " + msg.payload.message);
      onError(msg.payload.message);
    }
  };

  return {
    init: () => getWs().onmessage = onMessage,
    onIdentityCreated: (f: OnIdentityCreatedFunction) => (onIdentityCreated = f),
    onGameCreated: (f: OnGameCreatedFunction) => (onGameCreated = f),
    onGameUpdated: (f: OnGameUpdatedFunction) => (onGameUpdated = f),
    onError: (f: OnErrorFunction) => (onError = f),
  };
};
