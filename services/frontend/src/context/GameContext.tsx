import { createContext } from "react";

import { Game } from "@corners-game/common";
import { GameState } from "../model/GameState";

export default createContext<GameState>({
  player: { name: "New Player", registered: false },
  games: [] as Game[],
  theme: {},
  error: null,
  clearError: () => {},
  registerPlayer: (n) => {},
  makeTurn: (a, b, c) => {},
  createGame: () => {},
  joinGame: (i) => {},
} as GameState);
