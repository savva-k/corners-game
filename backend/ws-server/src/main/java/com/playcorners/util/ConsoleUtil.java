package com.playcorners.util;

import com.playcorners.model.Game;
import com.playcorners.model.Piece;

public class ConsoleUtil {
    public static void printGame(Game game) {
        var files = "abcdefgh";
        StringBuilder b = new StringBuilder();
        for (int rank = 8; rank >= 1; rank--) {
            b.append(rank).append(" ");
            for (int file = 0; file < files.length(); file++) {
                var position = String.valueOf(files.charAt(file)) + rank;
                var pieceAtPosition = game.getField().get(position);
                if (pieceAtPosition == null) {
                    b.append("-");
                } else {
                    b.append(pieceAtPosition == Piece.WHITE ? "w" : "b");
                }
                b.append(" ");
            }
            b.append("\n");
        }
        b.append(" ");
        for (int file = 0; file < files.length(); file++) {
            b.append(files.charAt(file)).append(" ");
        }
        b.append("\n").append(game.getCurrentTurn().name()).append("'s turn").append("\n");
        if (game.isFinished()) {
            b.append("Game finished: ").append(game.getFinishReason().name());
        } else {
            b.append("Game is in progress");
        }
        System.out.println(b.append("\n"));
    }
}
