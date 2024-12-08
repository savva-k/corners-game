package com.playcorners.websocket;

import com.playcorners.service.CornersGameService;
import com.playcorners.service.PlayerService;
import com.playcorners.websocket.handler.GameWsHandler;
import com.playcorners.websocket.handler.LobbyWsHandler;
import com.playcorners.websocket.validator.GameRequestValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;
import org.springframework.web.socket.server.HandshakeInterceptor;

import java.util.Map;

@Configuration
@EnableWebSocket
@EnableMethodSecurity(prePostEnabled = true)
public class WsConfig implements WebSocketConfigurer {

    private final CornersGameService gameService;
    private final PlayerService playerService;
    private final GameRequestValidator gameRequestValidator;

    @Autowired
    public WsConfig(CornersGameService gameService, PlayerService playerService, GameRequestValidator gameRequestValidator) {
        this.gameService = gameService;
        this.playerService = playerService;
        this.gameRequestValidator = gameRequestValidator;
    }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry
                .addHandler(gameWsHandler(), "/ws/game/{gameId}")
                .addInterceptors(getHandshakeInterceptor())
                .setAllowedOrigins("http://localhost:3000");

        registry
                .addHandler(lobbyWsHandler(), "/ws/lobby")
                .setAllowedOrigins("http://localhost:3000");
    }

    @Bean
    public LobbyWsHandler lobbyWsHandler() {
        return new LobbyWsHandler();
    }

    @Bean
    public GameWsHandler gameWsHandler() {
        return new GameWsHandler(gameService, playerService, gameRequestValidator);
    }

    private HandshakeInterceptor getHandshakeInterceptor() {
        return new HandshakeInterceptor() {
            @Override
            public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler wsHandler, Map<String, Object> attributes) throws Exception {
                String path = request.getURI().getPath();
                String gameId = path.substring(path.lastIndexOf('/') + 1);
                if (!gameRequestValidator.validateGameId(gameId)) {
                    return false;
                }
                attributes.put("gameId", gameId);
                return true;
            }

            @Override
            public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler wsHandler, Exception exception) {
            }
        };
    }

}
