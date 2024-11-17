package com.playcorners.controller.serialization;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.playcorners.model.Cell;
import com.playcorners.model.Point;

import java.io.IOException;
import java.util.Map;

public class GameFieldSerializer extends JsonSerializer<Map<Point, Cell>> {
    @Override
    public void serialize(Map<Point, Cell> field, JsonGenerator gen, SerializerProvider serializers) throws IOException {
        gen.writeStartObject();
        for (Map.Entry<Point, Cell> e : field.entrySet()) {
            gen.writeObjectField(e.getKey().toString(), e.getValue());
        }
        gen.writeEndObject();
    }
}
