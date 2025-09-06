package com.playcorners.websocket.message.handler;

import com.playcorners.websocket.handler.WsMessageSender;
import com.playcorners.websocket.message.MessageType;
import org.springframework.web.socket.WebSocketSession;

public interface IncomingMessageHandler<T> {
    void handle(WebSocketSession session, WsMessageSender wsMessageSender, T message);
    MessageType getMessageType();
    Class<T> getMessageClass();
}
