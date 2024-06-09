package com.playcorners.websocket.config;

import io.quarkus.vertx.web.RouteFilter;
import io.vertx.ext.web.RoutingContext;
import jakarta.inject.Singleton;

@Singleton
public class WebSocketAuthFilter {

    private static final String SEC_WEB_SOCKET_PROTOCOL = "Sec-WebSocket-Protocol";

    /*
     * Actually, almost any number fits but with the default 10 it wouldn't catch the websocket requests..
     */
    @RouteFilter(401)
    public void filter(RoutingContext context) {
        try {
            if (context.request().headers().get(SEC_WEB_SOCKET_PROTOCOL) != null) {
                var token = context.request().headers().get(SEC_WEB_SOCKET_PROTOCOL).split(" ")[1];
                context.request().headers().add("Authorization", "Bearer " + token);
            }
        } finally {
            context.next();
        }
    }

}
