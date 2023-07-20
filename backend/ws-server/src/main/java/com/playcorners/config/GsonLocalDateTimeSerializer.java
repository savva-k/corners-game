package com.playcorners.config;

import com.google.gson.*;

import java.lang.reflect.Type;
import java.time.LocalDateTime;

public class GsonLocalDateTimeSerializer implements JsonSerializer<LocalDateTime> {
    @Override
    public JsonElement serialize(LocalDateTime localDateTime, Type type, JsonSerializationContext jsonSerializationContext) {
        return new JsonPrimitive(localDateTime.toString());
    }
}
