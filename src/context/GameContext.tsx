import { createContext } from "react";

import { Game } from "../model/Game";
import { GameState } from "../model/GameState";

export default createContext<GameState>({
  playerName: "New Player",
  games: [] as Game[],
  makeTurn: (a, b, c) => {},
  createGame: () => {},
} as GameState);
