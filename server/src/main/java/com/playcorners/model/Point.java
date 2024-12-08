package com.playcorners.model;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

public record Point(
        @Min(0)
        @Max(10000)
        int x,
        @Min(0)
        @Max(10000)
        int y
) {
    @Override
    public String toString() {
        return x + "," + y;
    }
}
