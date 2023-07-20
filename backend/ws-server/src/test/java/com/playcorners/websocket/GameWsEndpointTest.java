package com.playcorners.websocket;

import io.quarkus.test.common.http.TestHTTPResource;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.websocket.*;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import java.net.URI;
import java.util.concurrent.LinkedBlockingDeque;
import java.util.concurrent.TimeUnit;

@QuarkusTest
public class GameWsEndpointTest {

    private static final LinkedBlockingDeque<String> MESSAGES = new LinkedBlockingDeque<>();

    @TestHTTPResource("/ws/game/1")
    URI uri;

    @Test
    public void testWebSocketFlow() throws Exception {
        try (Session session = ContainerProvider.getWebSocketContainer().connectToServer(Client.class, uri)) {
            Assertions.assertEquals("hey", MESSAGES.poll(10, TimeUnit.SECONDS));
        }
    }

    @ClientEndpoint
    public static class Client {
        @OnOpen
        public void onOpen(Session session) {
            session.getAsyncRemote().sendText("hello");
        }

        @OnMessage
        public void onMessage(String message) {
            MESSAGES.add(message);
        }
    }
}
