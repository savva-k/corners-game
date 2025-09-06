package com.playcorners.websocket.message.handler;

import com.playcorners.model.Game;
import com.playcorners.service.CornersGameService;
import com.playcorners.websocket.handler.WsMessageSender;
import com.playcorners.websocket.message.MessageType;
import com.playcorners.websocket.message.SessionUtil;
import com.playcorners.websocket.message.incoming.GetGame;
import com.playcorners.websocket.message.outgoing.GameResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketSession;

import java.util.Optional;

@Component
public class GetGameHandler implements IncomingMessageHandler<GetGame> {

    private final Logger log = LoggerFactory.getLogger(GetGameHandler.class);

    private final CornersGameService gameService;

    public GetGameHandler(CornersGameService gameService) {
        this.gameService = gameService;
    }

    @Override
    public void handle(WebSocketSession session, WsMessageSender wsMessageSender, GetGame message) {
        String gameId = SessionUtil.getGameId(session);
        Optional<Game> maybeGame = gameService.getGameById(gameId);

        if (maybeGame.isPresent()) {
            wsMessageSender.sendResponseToParticularPlayer(session, new GameResponse<>(MessageType.GET_GAME_OK, maybeGame.get()));
        } else {
            log.error("Game not found, id={}", gameId);
        }
    }

    @Override
    public MessageType getMessageType() {
        return MessageType.GET_GAME;
    }

    @Override
    public Class<GetGame> getMessageClass() {
        return GetGame.class;
    }
}
