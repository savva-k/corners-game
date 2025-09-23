package com.playcorners.websocket.message.handler;

import com.playcorners.model.Game;
import com.playcorners.model.Player;
import com.playcorners.service.CornersGameService;
import com.playcorners.service.PlayerService;
import com.playcorners.websocket.handler.WsMessageSender;
import com.playcorners.websocket.message.MessageType;
import com.playcorners.websocket.message.SessionUtil;
import com.playcorners.websocket.message.incoming.CreateOrLoadGame;
import com.playcorners.websocket.message.outgoing.GameResponse;
import com.playcorners.websocket.message.outgoing.PlayerJoined;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketSession;

@Component
public class CreateOrLoadGameHandler implements IncomingMessageHandler<CreateOrLoadGame> {

    private final Logger log = LoggerFactory.getLogger(CreateOrLoadGameHandler.class);

    private final CornersGameService gameService;
    private final PlayerService playerService;

    public CreateOrLoadGameHandler(CornersGameService gameService, PlayerService playerService) {
        this.gameService = gameService;
        this.playerService = playerService;
    }

    @Override
    public void handle(WebSocketSession session, WsMessageSender wsMessageSender, CreateOrLoadGame message) {
        String gameId = SessionUtil.getGameId(session);
        Game game = gameService.getGameById(gameId).orElse(null);
        Player player = playerService.getPlayer(session);

        if (game == null) {
            game = gameService.createGame(gameId, player, "default");
        } else if (!game.playerAlreadyJoined(player)) {
            gameService.joinGame(player, gameId);
            wsMessageSender.toAllExceptCurrent(gameId, session, new GameResponse<>(MessageType.PLAYER_JOINED, new PlayerJoined(player, game.isStarted())));
        }

        wsMessageSender.toParticular(session, new GameResponse<>(MessageType.CREATE_OR_LOAD_GAME_OK, game));
    }

    @Override
    public MessageType getMessageType() {
        return MessageType.CREATE_OR_LOAD_GAME;
    }

    @Override
    public Class<CreateOrLoadGame> getMessageClass() {
        return CreateOrLoadGame.class;
    }
}
