import { Dispatch, SetStateAction } from "react";
import { Game, Player } from "../model";

export interface GameState {
    player: Player,
    setPlayer: Dispatch<SetStateAction<Player>>,
    theme: any,
    error: string | null,
    clearError: () => void,
}
