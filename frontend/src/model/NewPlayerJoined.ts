import type { Player } from "./Player";


export interface NewPlayerJoined {
    player: Player,
    isStarted: boolean,
}
