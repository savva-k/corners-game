import { useState, useEffect, useRef, useCallback } from "react";

import { Game } from "../model/Game";
import { GameState } from "../model/GameState";
import { NodeProps } from "../model/ReactPropsInterfaces";
import GameContext from "./GameContext";

const server = "ws://192.168.0.102:8080";

export const GameContextProvider = ({ children }: NodeProps) => {
  const ws = useRef<WebSocket | null>(null);
  const [games, setGames] = useState<Game[]>([]);

  const onMessage = useCallback(
    (event: MessageEvent<any>) => {
      let msg = JSON.parse(event.data);
      if (msg.type === "IDENTITY_CREATED") {
        console.log("I've got a name! " + msg.payload.name);
      }

      if (msg.type === "GAME_CREATED") {
        if (
          games.filter((game) => game.id === msg.payload.game.id).length === 0
        ) {
          console.log("Adding a new game");
          setGames([msg.payload.game, ...games]);
        } else {
          console.log("This game has already been added");
        }
      }

      if (msg.type === "GAME_UPDATED") {
        const gameToUpdate = {
          ...games.find((g) => g.id === msg.payload.game.id),
        } as Game;
        if (gameToUpdate) {
          gameToUpdate.field = { ...msg.payload.game.field };
          gameToUpdate.currentTurn = msg.payload.game.currentTurn;
          gameToUpdate.isFinished = msg.payload.game.isFinished;
          gameToUpdate.isStarted = msg.payload.game.isStarted;
          setGames([
            gameToUpdate,
            ...games.filter((g) => g.id !== gameToUpdate.id),
          ]);
          console.log("Game was updated");
        }
      }
    },
    [games]
  );

  useEffect(() => {
    ws.current = new WebSocket(server);

    ws.current.onopen = () => {
      console.log("sending get identity");
      ws.current &&
        ws.current.send(
          JSON.stringify({
            type: "GET_IDENTITY",
          })
        );
    };

    ws.current.onmessage = onMessage;

    ws.current.onerror = (e) => console.log("an error occurred: " + e);
    ws.current.onclose = (e) =>
      console.log("Socket closed: ", e.code, e.reason);
  }, [onMessage]);

  useEffect(() => {
    ws.current && (ws.current.onmessage = onMessage);
  }, [games, onMessage]);

  const createGame = () => {
    ws.current &&
      ws.current.send(
        JSON.stringify({
          type: "CREATE_GAME",
        })
      );
  };

  const makeTurn = (gameId: string, current: string, desired: string) => {
    console.log(
      "Let's pretend that we've validated the input before sending to the server for now..."
    );
    ws.current &&
      ws.current.send(
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

  const value: GameState = {
    playerName: "New Player",
    games: games,
    makeTurn: makeTurn,
    createGame: createGame,
  };
  return (
    <GameContext.Provider value={value}> {children} </GameContext.Provider>
  );
};
