package com.playcorners.websocket.validator;

import com.playcorners.util.ValidationConstants;
import com.playcorners.websocket.message.GameTurnRequest;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;

@Component
public class GameRequestValidator {

    private final Validator validator;

    @Autowired
    public GameRequestValidator(Validator validator) {
        this.validator = validator;
    }

    public boolean validateGameId(String gameId) {
        if (gameId == null) return false;
        return gameId.matches(ValidationConstants.UUID_REGEXP);
    }

    public boolean validateGameTurnRequest(GameTurnRequest request) {
        Set<ConstraintViolation<?>> errors = new HashSet<>(validator.validate(request));

        if (!errors.isEmpty()) {
            return false;
        }

        errors.addAll(validator.validate(request.from()));
        errors.addAll(validator.validate(request.to()));
        return errors.isEmpty();
    }
}
