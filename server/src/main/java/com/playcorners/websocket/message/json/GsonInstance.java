package com.playcorners.websocket.message.json;

import com.google.gson.GsonBuilder;

import java.time.LocalDateTime;

public class GsonInstance {

    public static final com.google.gson.Gson gson = new GsonBuilder()
            .registerTypeAdapter(LocalDateTime.class, new LocalDateTimeTypeAdapter())
            .create();

}
