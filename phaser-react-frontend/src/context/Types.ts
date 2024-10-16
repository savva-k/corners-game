import { Game, Player } from "../model"

export enum MessageType {
    LOGIN_MESSAGE_RESPONSE,
    JOIN_GAME_MESSAGE_RESPONSE,
    NEW_GAME_MESSAGE_RESPONSE,
    MAKE_TURN_MESSAGE_RESPONSE,
    ERROR_RESPONSE
}

interface IncomingMessage {
    type: MessageType
}

interface ErrorMessage extends IncomingMessage {
    message: string
}

export interface LoginMessageResponse extends IncomingMessage {
    games: Game[],
    player: Player
}
