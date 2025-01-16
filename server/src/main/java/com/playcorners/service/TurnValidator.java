package com.playcorners.service;

import com.playcorners.model.Game;
import com.playcorners.model.Player;
import com.playcorners.model.Point;
import com.playcorners.model.TurnValidation;
import com.playcorners.service.exception.CommonGameException;
import com.playcorners.service.exception.Reason;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@Service
public class TurnValidator {

    private final PathService pathService;

    @Autowired
    public TurnValidator(PathService pathService) {
        this.pathService = pathService;
    }

    public void validateTurnConditions(Game game, Player player) {
        if (game.isFinished()) {
            throw new CommonGameException(Reason.GAME_IS_FINISHED);
        }

        if (Objects.equals(game.getPlayer1(), player)) {
            if (game.getPlayer1Piece() != game.getCurrentTurn()) {
                throw new CommonGameException(Reason.OPPONENTS_TURN_NOW);
            }
        } else if (Objects.equals(game.getPlayer2(), player)) {
            if (game.getPlayer2Piece() != game.getCurrentTurn()) {
                throw new CommonGameException(Reason.OPPONENTS_TURN_NOW);
            }
        } else {
            throw new CommonGameException(Reason.NOT_USERS_GAME);
        }
    }

    public TurnValidation validatePlayersTurn(Game game, Point from, Point to) {
        if (
                isFromFieldInvalid(game, from) ||
                        isCurrentPlayerDoesNotOwnFromPiece(game, from)
        ) {
            return new TurnValidation(false, from);
        }

        List<Point> availableMoves = pathService.getAvailableMoves(game.getField(), game.getMapSize(), from);
        var valid = availableMoves.contains(to);
        var turnValidation = new TurnValidation();
        turnValidation.setValid(valid);

        if (!valid) {
            turnValidation.setMistakeAtField(to);
            turnValidation.setAvailableMoves(availableMoves);
        }

        return turnValidation;
    }

    private boolean isFromFieldInvalid(Game game, Point from) {
        return game.getField().get(from) == null || game.getField().get(from).isEmpty();
    }

    private boolean isCurrentPlayerDoesNotOwnFromPiece(Game game, Point from) {
        return game.getCurrentTurn() != game.getField().get(from).getPiece();
    }

}
