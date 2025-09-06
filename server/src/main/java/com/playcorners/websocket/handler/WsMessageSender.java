package com.playcorners.websocket.handler;

import com.playcorners.websocket.message.outgoing.GameResponse;
import org.springframework.web.socket.WebSocketSession;

public interface WsMessageSender {
    <T> void sendResponseToAllGamePlayers(String gameId, GameResponse<T> response);
    <T> void sendResponseToParticularPlayer(WebSocketSession session, GameResponse<T> response);
}
