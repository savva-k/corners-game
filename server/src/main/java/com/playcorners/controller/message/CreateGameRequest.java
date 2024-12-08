package com.playcorners.controller.message;

import com.playcorners.util.ValidationConstants;
import jakarta.validation.constraints.Pattern;

public record CreateGameRequest(
        @Pattern(regexp = ValidationConstants.MAP_NAME, message = ValidationConstants.INVALID_MAP_NAME)
        String mapName) {}
