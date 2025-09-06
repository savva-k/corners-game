package com.playcorners.websocket.message.validator;

import jakarta.validation.ConstraintViolation;

import java.util.Set;

public interface MessageValidator<T> {
    boolean validate(T message);
    Set<ConstraintViolation<T>> getErrors();
}
