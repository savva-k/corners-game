package com.playcorners.websocket.handler;

import com.playcorners.websocket.message.outgoing.GameResponse;
import org.springframework.web.socket.WebSocketSession;

public interface WsMessageSender {
    <T> void toAll(String gameId, GameResponse<T> response);
    <T> void toAllExceptCurrent(String gameId, WebSocketSession session, GameResponse<T> response);
    <T> void toParticular(WebSocketSession session, GameResponse<T> response);
}
