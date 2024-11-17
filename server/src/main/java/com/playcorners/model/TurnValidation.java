package com.playcorners.model;

import java.util.List;

public class TurnValidation {
    private boolean valid;
    private Point mistakeAtField;
    private List<Point> availableMoves;

    public TurnValidation() {

    }

    public TurnValidation(boolean valid, Point mistakeAtField) {
        this.valid = valid;
        this.mistakeAtField = mistakeAtField;
    }

    public void setValid(boolean valid) {
        this.valid = valid;
    }

    public void setMistakeAtField(Point mistakeAtField) {
        this.mistakeAtField = mistakeAtField;
    }

    public void setAvailableMoves(List<Point> availableMoves) {
        this.availableMoves = availableMoves;
    }

    public boolean isValid() {
        return valid;
    }

    public Point getMistakeAtField() {
        return mistakeAtField;
    }

    public List<Point> getAvailableMoves() {
        return availableMoves;
    }
}
