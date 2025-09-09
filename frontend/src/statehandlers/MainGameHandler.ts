import type { WebSocketConnection } from "../WebSocket";
import { EventBus } from "../EventBus";
import type { Game, TurnRequest } from "../scenes/Game";
import type { Turn } from "../model";
import type { TurnValidationResponse } from "../model/TurnValidationResponse";
import type { GameOverResponse } from "../model/GameOverResponse";

export class MainGameHandler {
    ws: WebSocketConnection;
    mainScene: Game;

    constructor(ws: WebSocketConnection, mainScene: Game) {
        this.ws = ws;
        this.mainScene = mainScene;
    }

    public makeTurn(turnRequest: TurnRequest) {
        this.ws.send("TURN_REQUEST", turnRequest);
    }

    public activate() {
        EventBus.on('TURN_OK', (turn: Turn) => {
            this.mainScene.handleNewTurn(turn);
        });
        EventBus.on('INVALID_TURN', (response: TurnValidationResponse) => {
            this.mainScene.handleInvalidTurn(response);
        });
        EventBus.on('GAME_EXCEPTION', (message: string) => {
            this.mainScene.handleException(message);
        });
        EventBus.on('GAME_OVER', (response: GameOverResponse) => {
            this.mainScene.handleGameOver(response.finishReason, response.winner);
        });
    }

    public deactivate() {
        EventBus.off('TURN_OK');
        EventBus.off('INVALID_TURN');
        EventBus.off('GAME_EXCEPTION');
        EventBus.off('GAME_OVER');
    }
}