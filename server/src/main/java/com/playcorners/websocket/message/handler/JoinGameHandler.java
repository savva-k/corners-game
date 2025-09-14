package com.playcorners.websocket.message.handler;

import com.playcorners.model.Game;
import com.playcorners.model.Player;
import com.playcorners.service.CornersGameService;
import com.playcorners.websocket.handler.WsMessageSender;
import com.playcorners.websocket.message.MessageType;
import com.playcorners.websocket.message.SessionUtil;
import com.playcorners.websocket.message.incoming.JoinGame;
import com.playcorners.websocket.message.outgoing.GameResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketSession;

@Component
public class JoinGameHandler implements IncomingMessageHandler<JoinGame> {

    private final Logger log = LoggerFactory.getLogger(JoinGameHandler.class);

    private final CornersGameService gameService;

    public JoinGameHandler(CornersGameService gameService) {
        this.gameService = gameService;
    }

    @Override
    public void handle(WebSocketSession session, WsMessageSender wsMessageSender, JoinGame message) {
        String gameId = SessionUtil.getGameId(session);
        Game game = gameService.createOrGet(gameId, new Player(SessionUtil.getUsername(session)), "default");
        wsMessageSender.sendResponseToAllGamePlayers(gameId, new GameResponse<>(MessageType.JOIN_GAME_OK, game));
    }

    @Override
    public MessageType getMessageType() {
        return MessageType.JOIN_GAME;
    }

    @Override
    public Class<JoinGame> getMessageClass() {
        return JoinGame.class;
    }
}
