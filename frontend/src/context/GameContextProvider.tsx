import { useState, ReactNode } from "react";
import { Player, Piece } from "../model";
import { GameState } from "../model/GameState";
import GameContext from "./GameContext";
import DefaultTheme from "../themes/DefaultTheme";

interface NodeProps {
  children: ReactNode;
}

export const GameContextProvider = ({ children }: NodeProps) => {
  const [player, setPlayer] = useState<Player>({
    name: "New Player",
    registered: false,
  });
  const [error, setError] = useState<string | null>(null);
  const clearError = () => setError(null);

  const context: GameState = {
    player: player,
    setPlayer: setPlayer,
    theme: DefaultTheme,
    error: error,
    clearError: clearError,
  };
  return (
    <GameContext.Provider value={context}> {children} </GameContext.Provider>
  );
};
