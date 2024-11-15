package com.playcorners.model;

import java.util.List;

public class TurnValidation {
    private boolean valid;
    private String mistakeAtField;
    private List<String> availableMoves;

    public TurnValidation() {

    }

    public TurnValidation(boolean valid, String mistakeAtField) {
        this.valid = valid;
        this.mistakeAtField = mistakeAtField;
    }

    public void setValid(boolean valid) {
        this.valid = valid;
    }

    public void setMistakeAtField(String mistakeAtField) {
        this.mistakeAtField = mistakeAtField;
    }

    public void setAvailableMoves(List<String> availableMoves) {
        this.availableMoves = availableMoves;
    }

    public boolean isValid() {
        return valid;
    }

    public String getMistakeAtField() {
        return mistakeAtField;
    }

    public List<String> getAvailableMoves() {
        return availableMoves;
    }
}
