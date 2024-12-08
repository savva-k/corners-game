package com.playcorners.controller.message;

import com.playcorners.util.ValidationConstants;
import jakarta.validation.constraints.Pattern;

public record LoginRequest(
        @Pattern(regexp = ValidationConstants.LOGIN_REGEXP, message = ValidationConstants.INVALID_LOGIN_MESSAGE)
        String username,
        @Pattern(regexp = ValidationConstants.PASSWORD_REGEXP, message = ValidationConstants.INVALID_PASSWORD_MESSAGE)
        String password) {}
