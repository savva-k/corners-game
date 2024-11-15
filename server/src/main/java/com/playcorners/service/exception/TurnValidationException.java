package com.playcorners.service.exception;

import com.playcorners.model.TurnValidation;

public class TurnValidationException extends CommonGameException {

    private final TurnValidation turnValidation;

    public TurnValidationException(Reason reason, TurnValidation turnValidation) {
        super(reason);
        this.turnValidation = turnValidation;
    }

    public TurnValidation getTurnValidation() {
        return turnValidation;
    }

}
