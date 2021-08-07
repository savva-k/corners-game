import { useState, useEffect, useRef } from "react";

import { Game } from "../model/Game";
import { GameState } from "../model/GameState";
import { Player } from "../model/Player";
import { NodeProps } from "../model/ReactPropsInterfaces";
import GameContext from "./GameContext";
import process from "process";

const protocol = process.env.REACT_APP_SECURE_PROTOCOL ? "wss" : "ws";
const host = process.env.REACT_APP_BACKEND_HOST || "localhost";
const port = process.env.REACT_APP_BACKEND_PORT || 8080;
const server = `${protocol}://${host}:${port}`;

console.log(process)
console.log(server)

export const GameContextProvider = ({ children }: NodeProps) => {
  const ws = useRef<WebSocket | null>(null);
  const [games, setGames] = useState<Game[]>([]);
  const [player, setPlayer] = useState<Player>({
    name: "New Player",
    registered: false,
  });

  const onMessage = (event: MessageEvent<any>) => {
    let msg = JSON.parse(event.data);
    if (msg.type === "IDENTITY_CREATED") {
      setPlayer({ name: msg.payload.name, registered: msg.payload.registered });
      setGames(msg.payload.games);
      console.log(
        "I've just registered and ready to play now! I'm " + msg.payload.name
      );
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
      if (games.find((g) => g.id === msg.payload.game.id)) {
        setGames([
          { ...msg.payload.game },
          ...games.filter((g) => g.id !== msg.payload.game.id),
        ]);
        console.log("Game was updated");
      }
    }

    if (msg.type === "ERROR") {
      console.error(msg.payload.message);
    }
  };

  useEffect(() => {
    ws.current = new WebSocket(server);

    ws.current.onopen = () => {
      console.log("Connected to the server");
    };

    ws.current.onmessage = onMessage;

    ws.current.onerror = (e) => console.log("an error occurred: " + e);
    ws.current.onclose = (e) =>
      console.log("Socket closed: ", e.code, e.reason);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    ws.current && (ws.current.onmessage = onMessage);
    // eslint-disable-next-line
  }, [games]);

  const createGame = () => {
    ws.current &&
      ws.current.send(
        JSON.stringify({
          type: "CREATE_GAME",
        })
      );
  };

  const registerPlayer = (name: string) => {
    ws.current &&
      ws.current.send(
        JSON.stringify({
          payload: {
            name: name,
          },
          type: "GET_IDENTITY",
        })
      );
  };

  const joinGame = (gameId: string) => {
    ws.current &&
      ws.current.send(
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
    player: player,
    games: games,
    registerPlayer: registerPlayer,
    makeTurn: makeTurn,
    createGame: createGame,
    joinGame: joinGame,
  };
  return (
    <GameContext.Provider value={value}> {children} </GameContext.Provider>
  );
};
