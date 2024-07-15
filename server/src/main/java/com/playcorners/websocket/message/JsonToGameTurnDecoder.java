package com.playcorners.websocket.message;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.playcorners.websocket.message.records.GameTurn;
import jakarta.websocket.DecodeException;
import jakarta.websocket.Decoder;

public class JsonToGameTurnDecoder implements Decoder.Text<GameTurn> {

    private static final Gson gson = new GsonBuilder().create();

    @Override
    public GameTurn decode(String s) throws DecodeException {
        return gson.fromJson(s, GameTurn.class);
    }

    @Override
    public boolean willDecode(String s) {
        return s.contains("from");
    }
}
