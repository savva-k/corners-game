package com.playcorners.websocket.message;

import com.google.gson.*;

import java.lang.reflect.Type;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class LocalDateTimeTypeAdapter implements JsonSerializer<LocalDateTime>, JsonDeserializer<LocalDateTime> {

    private final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd.MM.yyyy");

    @Override
    public LocalDateTime deserialize(JsonElement date, Type type, JsonDeserializationContext context) throws JsonParseException {
        return LocalDateTime.parse(date.getAsString(), formatter);
    }

    @Override
    public JsonElement serialize(LocalDateTime date, Type type, JsonSerializationContext context) {
        return new JsonPrimitive(date.format(formatter));
    }

}
