package com.playcorners.util;

import com.playcorners.model.Game;
import com.playcorners.model.Piece;

public class ConsoleUtil {
    public static void printGame(Game game) {
        var files = "abcdefgh";
        for (int rank = 8; rank >= 1; rank--) {
            System.out.print(rank + " ");
            for (int file = 0; file < files.length(); file++) {
                var position = String.valueOf(files.charAt(file)) + rank;
                var pieceAtPosition = game.getField().get(position);
                if (pieceAtPosition == null) {
                    System.out.print("-");
                } else {
                    System.out.print(pieceAtPosition == Piece.WHITE ? "w" : "m");
                }
                System.out.print(" ");
            }
            System.out.print("\n");
        }
        System.out.print("  ");
        for (int file = 0; file < files.length(); file++) {
            System.out.print(files.charAt(file) + " ");
        }
        System.out.print("\n");
    }
}
