import { createContext } from "react";
import { GameState } from "../model/GameState";

export default createContext<GameState>({
  player: {},
  setPlayer: (v) => {},
  theme: {},
  error: null,
  clearError: () => {},
} as GameState);
