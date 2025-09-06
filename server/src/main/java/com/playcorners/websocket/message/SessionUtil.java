package com.playcorners.websocket.message;

import org.springframework.util.StringUtils;
import org.springframework.web.socket.WebSocketSession;

import static com.playcorners.websocket.WsConfig.GAME_ID;
import static com.playcorners.websocket.WsConfig.USERNAME;

public class SessionUtil {

    public static String getGameId(WebSocketSession session) {
        return getAttr(session, GAME_ID);
    }

    public static String getUsername(WebSocketSession session) {
        return getAttr(session, USERNAME);
    }

    public static String getAttr(WebSocketSession session, String name) {
        String value = (String) session.getAttributes().get(name);

        if (StringUtils.hasLength(value)) {
            return value;
        }

        throw new RuntimeException("Empty attr " + name);
    }

}
