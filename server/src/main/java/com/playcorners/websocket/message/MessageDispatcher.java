package com.playcorners.websocket.message;

import com.google.gson.Gson;
import com.playcorners.websocket.handler.WsMessageSender;
import com.playcorners.websocket.message.handler.IncomingMessageHandler;
import com.playcorners.websocket.message.incoming.IncomingMessage;
import com.playcorners.websocket.message.json.GsonInstance;
import org.springframework.web.socket.WebSocketSession;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class MessageDispatcher {

    private final Map<MessageType, IncomingMessageHandler<?>> handlers = new HashMap<>();
    private final WsMessageSender wsMessageSender;
    private final Gson gson = GsonInstance.gson;

    public MessageDispatcher(WsMessageSender wsMessageSender, List<IncomingMessageHandler<?>> messageHandlers) {
        this.wsMessageSender = wsMessageSender;
        messageHandlers.forEach(handler -> handlers.put(handler.getMessageType(), handler));
    }

    public <T> void dispatch(WebSocketSession session, IncomingMessage message) {
        IncomingMessageHandler<T> handler = getHandler(message.type());
        T payload = gson.fromJson(message.payload(), handler.getMessageClass());
        invokeHandler(session, handler, payload);
    }

    @SuppressWarnings("unchecked")
    private <T> IncomingMessageHandler<T> getHandler(MessageType type) {
        return (IncomingMessageHandler<T>) handlers.get(type);
    }

    private <T> void invokeHandler(WebSocketSession session, IncomingMessageHandler<T> handler, T message) {
        handler.handle(session, wsMessageSender, message);
    }
}
