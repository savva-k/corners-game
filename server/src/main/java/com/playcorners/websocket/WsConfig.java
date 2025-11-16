package com.playcorners.websocket;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.Claim;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.playcorners.websocket.handler.GameWsHandler;
import com.playcorners.websocket.message.handler.IncomingMessageHandler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
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

import java.util.List;
import java.util.Map;

@Configuration
@EnableWebSocket
@EnableMethodSecurity(prePostEnabled = true)
public class WsConfig implements WebSocketConfigurer {

    public static final String USERNAME = "username";
    public static final String USER_ID = "userId";
    public static final String GAME_ID = "gameId";
    public static final String INLINE_MESSAGE_ID = "inlineMessageId";

    @Value("${allowed_origin}")
    private String allowedOrigin;

    @Value("${jwt_secret}")
    private String jwtSecret;

    private final List<IncomingMessageHandler<?>> messageHandlers;

    @Autowired
    public WsConfig(List<IncomingMessageHandler<?>> messageHandlers) {
        this.messageHandlers = messageHandlers;
    }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry
                .addHandler(gameWsHandler(), "/ws")
                .addInterceptors(getHandshakeInterceptor())
                .setAllowedOrigins(allowedOrigin);
    }

    @Bean
    public GameWsHandler gameWsHandler() {
        return new GameWsHandler(messageHandlers);
    }

    private HandshakeInterceptor getHandshakeInterceptor() {
        final Logger log = LoggerFactory.getLogger(HandshakeInterceptor.class);

        return new HandshakeInterceptor() {

            @Override
            public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler wsHandler, Map<String, Object> attributes) throws Exception {
                return verifyAndHandleToken(request, attributes);
            }

            @Override
            public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler wsHandler, Exception exception) {
            }

            private boolean verifyAndHandleToken(ServerHttpRequest request, Map<String, Object> attributes) {
                String[] tokenSplit = request.getURI().getQuery().split("token=");

                if (tokenSplit.length != 2) {
                    log.error("Incorrect WS URL");
                    return false;
                }

                JWTVerifier verifier = JWT.require(Algorithm.HMAC256(jwtSecret)).build();

                try {
                    DecodedJWT jwt = verifier.verify(tokenSplit[1]);
                    Map<String, Claim> claims = jwt.getClaims();

                    String userName = claims.get(USERNAME).asString();
                    String userId = claims.get(USER_ID).asString();
                    String gameId = claims.get(INLINE_MESSAGE_ID).asString();

                    attributes.put(USERNAME, userName);
                    attributes.put(USER_ID, userId);
                    attributes.put(GAME_ID, gameId);
                    return true;
                } catch (JWTVerificationException e) {
                    log.error("Error verifying token", e);
                    return false;
                }
            }
        };
    }

}
