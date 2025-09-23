package com.playcorners.websocket.message.handler;

import com.playcorners.service.CornersGameService;
import com.playcorners.service.exception.CommonGameException;
import com.playcorners.service.exception.TurnValidationException;
import com.playcorners.websocket.handler.WsMessageSender;
import com.playcorners.websocket.message.MessageType;
import com.playcorners.websocket.message.SessionUtil;
import com.playcorners.websocket.message.incoming.TurnRequest;
import com.playcorners.websocket.message.outgoing.GameResponse;
import com.playcorners.websocket.message.validator.TurnRequestValidator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketSession;

@Component
public class GameTurnHandler implements IncomingMessageHandler<TurnRequest> {

    private static final Logger log = LoggerFactory.getLogger(GameTurnHandler.class);

    private final CornersGameService gameService;
    private final TurnRequestValidator validator;

    public GameTurnHandler(CornersGameService gameService, TurnRequestValidator validator) {
        this.gameService = gameService;
        this.validator = validator;
    }

    @Override
    public void handle(WebSocketSession session, WsMessageSender ws, TurnRequest turnRequest) {
        String gameId = SessionUtil.getGameId(session);
        String username = SessionUtil.getUsername(session);

        if (!validator.validate(turnRequest)) {
            log.error("Invalid turn request from {}", session.getRemoteAddress());
            return;
        }

        log.info(turnRequest.toString());

        try {
            var player = gameService.getGameById(gameId).map(game -> game.getPlayerByUserName(username)).orElseThrow();
            var turn = gameService.makeTurn(gameId, player, turnRequest.from(), turnRequest.to());
            ws.toAll(gameId, new GameResponse<>(MessageType.TURN_OK, turn));
            gameService.checkForGameOver(gameId)
                    .ifPresent(gameOver -> ws.toAll(gameId, new GameResponse<>(MessageType.GAME_OVER, gameOver)));

        } catch (TurnValidationException turnValidationException) {
            ws.toParticular(session, new GameResponse<>(MessageType.INVALID_TURN, turnValidationException.getTurnValidation()));
        } catch (CommonGameException e) {
            ws.toParticular(session, new GameResponse<>(MessageType.GAME_EXCEPTION, e.getReason().toString()));
        }

    }

    @Override
    public MessageType getMessageType() {
        return MessageType.TURN_REQUEST;
    }

    @Override
    public Class<TurnRequest> getMessageClass() {
        return TurnRequest.class;
    }
}
