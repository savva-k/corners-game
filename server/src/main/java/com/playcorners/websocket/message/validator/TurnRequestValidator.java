package com.playcorners.websocket.message.validator;

import com.playcorners.websocket.message.incoming.TurnRequest;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;

@Component
public class TurnRequestValidator implements MessageValidator<TurnRequest> {

    private final Validator validator;
    private Set<ConstraintViolation<TurnRequest>> errors;

    @Autowired
    public TurnRequestValidator(Validator validator) {
        this.validator = validator;
    }


    public boolean validate(TurnRequest request) {
        Set<ConstraintViolation<?>> errors = new HashSet<>(validator.validate(request));

        if (!errors.isEmpty()) {
            return false;
        }

        errors.addAll(validator.validate(request.from()));
        errors.addAll(validator.validate(request.to()));
        return errors.isEmpty();
    }

    @Override
    public Set<ConstraintViolation<TurnRequest>> getErrors() {
        return this.errors;
    }
}
