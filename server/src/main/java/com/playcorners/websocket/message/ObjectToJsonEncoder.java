package com.playcorners.websocket.message;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.playcorners.config.GsonLocalDateTimeSerializer;
import jakarta.websocket.Encoder;

import java.time.LocalDateTime;

public class ObjectToJsonEncoder implements Encoder.Text<Object> {

    private static final Gson gson = new GsonBuilder()
            .registerTypeAdapter(LocalDateTime.class, new GsonLocalDateTimeSerializer())
            .create();

    @Override
    public String encode(Object responseMessage) {
        return gson.toJson(responseMessage);
    }
}
