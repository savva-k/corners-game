package com.playcorners.service;

import com.playcorners.model.Player;
import com.playcorners.websocket.message.SessionUtil;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.WebSocketSession;

@Service
public class PlayerService {

    public Player getPlayer(WebSocketSession session) {
        return new Player(SessionUtil.getUsername(session));
    }

}
