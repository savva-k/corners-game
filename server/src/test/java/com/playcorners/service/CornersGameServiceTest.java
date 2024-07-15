package com.playcorners.service;

import com.google.common.collect.Maps;
import com.playcorners.controller.message.GameError;
import com.playcorners.controller.message.Reason;
import com.playcorners.model.FinishReason;
import com.playcorners.model.Game;
import com.playcorners.model.Piece;
import com.playcorners.model.Player;
import com.playcorners.util.CollectionsUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;

public class CornersGameServiceTest {

    CornersGameService cornersGameService;

    @BeforeEach
    public void init() {
        cornersGameService = new CornersGameService(new PathService());
    }

    private static final List<String> someEarlyGameMoves = List.of("c2", "c4", "f7", "f5", "b2", "d4", "g7",
            "e5", "d3", "d5", "h7", "h5", "d5", "d6", "f8", "d8", "d1", "f7");
    private static final List<String> fullGameWhiteWins = List.of("c2", "c4", "f7", "f5", "c4", "c5", "f8",
            "f7", "c1", "c2", "f6", "f4", "c3", "c4", "f4", "f3", "c5", "c6", "f7", "d7", "a3", "g3", "g7", "g5", "a1",
            "c7", "h6", "f2", "c2", "g4", "h8", "b6", "g4", "h4", "g6", "c2", "d2", "d4", "f2", "e2", "d4", "e4", "e7",
            "f7", "b2", "h8", "b6", "a6", "a2", "b2", "a6", "a5", "b2", "f8", "a5", "b5", "b1", "b2", "g5", "g6", "b2",
            "h6", "h7", "g7", "c7", "e7", "g7", "c1", "b3", "c3", "g8", "g7", "c3", "e5", "g7", "g5", "d1", "d2", "f7",
            "f6", "g3", "h3", "f6", "b4", "d2", "f6", "e8", "d8", "h3", "h7", "d8", "b6", "c6", "c7", "b5", "b3", "e7",
            "e8", "e6", "d6", "d3", "d4", "f3", "f2", "c7", "e7", "b4", "b2", "e8", "g8", "b2", "a2", "e4", "e8", "g6",
            "g4", "c4", "g6", "f5", "d3", "d4", "d5", "d6", "b2", "d5", "f7", "f2", "f3", "e5", "e6", "g5", "e1", "h4",
            "h5", "g4", "f4", "h7", "g7", "f4", "d2", "h5", "h7", "b6", "b5");

    private static final List<String> fullGameBlackWins = List.of("c2", "c4", "f7", "d7", "b2", "d4", "d7",
            "d6", "d4", "e4", "h7", "d5", "c1", "e1", "f8", "f7", "e1", "e2", "f6", "f5", "a1", "e1", "h8", "b2", "e2",
            "f2", "d5", "c5", "d1", "f3", "f7", "d5", "a2", "a4", "c5", "b5", "a3", "a2", "g7", "a1", "d2", "f4", "e7",
            "a3", "c3", "c5", "d6", "d2", "a4", "a5", "d2", "d1", "a2", "a4", "h6", "d2", "b1", "c1", "g8", "g7", "b3",
            "b4", "b5", "b1", "e1", "f1", "g7", "c3", "c1", "g1", "e8", "e7", "g1", "g2", "e7", "c1", "c4", "c6", "g6",
            "g5", "a5", "a6", "e6", "d6", "a6", "a7", "g5", "e3", "d3", "d4", "d5", "b3", "b4", "b5", "d6", "b4", "f3",
            "d5", "f5", "d3", "d5", "d6", "c3", "c2", "e4", "e5", "e3", "c3", "e5", "e6", "b2", "a2", "f1", "f5", "b4",
            "b2");

    private static final List<String> fullGameDrawBothHome = List.of("c2", "c4",
            "f7", "f5", "b2", "d4", "g7", "e5", "d4", "d5", "h7", "h5", "c3", "e3", "f8", "f7", "c1", "c2", "f7", "d7",
            "c2", "e2", "h8", "b2", "d3", "f3", "e5", "c3", "d2", "f4", "f6", "d4", "a1", "e1", "h6", "d6", "e2", "g4",
            "e7", "c5", "f4", "h6", "g8", "f8", "e3", "g7", "d6", "f2", "b1", "c1", "f8", "d6", "f3", "g3", "d4", "d3",
            "d1", "h3", "d6", "d2", "b3", "b4", "e8", "d8", "c4", "d4", "d8", "f4", "a2", "e4", "d7", "e7", "g7", "g8",
            "e7", "e3", "g3", "g7", "d3", "b1", "c1", "d1", "f5", "b3", "a3", "a4", "g6", "g5", "d1", "f5", "e3", "d3",
            "e4", "e5", "g5", "g3", "e1", "e2", "e6", "a2", "a4", "e6", "h5", "h4", "h3", "h7", "h4", "h3", "b4", "c4",
            "c5", "b5", "e6", "e7", "h3", "f1", "c4", "e8", "f1", "e1", "g4", "g5", "b5", "a5", "e2", "g6", "g3", "f3",
            "d4", "e4", "a5", "a4", "e8", "f8", "f3", "d1", "g8", "h8", "f4", "f3", "e4", "g8", "e1", "a1", "f5", "f6",
            "f2", "e2", "d5", "f7", "f3", "e3", "e7", "e8", "e3", "c1", "e5", "e6", "a4", "b4", "g5", "f5", "b3", "a3",
            "f5", "e5", "e2", "c2", "e5", "e7", "b4", "b3");


    @Test
    public void givenNonExistingGameId_whenGetGameById_thenReturnEmpty() {
        Optional<Game> maybeGame = cornersGameService.getGameById("non-existent-game-id");
        assertTrue(maybeGame.isEmpty());
    }

    @Test
    public void givenExistingGameId_whenGetGameById_thenReturnGame() {
        Optional<Game> game = cornersGameService.createGame(getTestPlayer("1"));
        assertTrue(game.isPresent());
        Optional<Game> gameById = cornersGameService.getGameById(game.get().getId());
        assertTrue(gameById.isPresent());
    }

    @Test
    public void givenPlayerDoesNotHaveNotStartedGames_whenCreateGame_thenInitialPositionOfPiecesIsCorrect() {
        Game game = createGame();
        for (String whitePos : cornersGameService.getWhiteStartPositions()) {
            assertEquals(Piece.WHITE, game.getField().get(whitePos));
        }
        for (String blackPos : cornersGameService.getBlackStartPositions()) {
            assertEquals(Piece.BLACK, game.getField().get(blackPos));
        }
        assertEquals(game.getField().size(), cornersGameService.getWhiteStartPositions().size() + cornersGameService.getBlackStartPositions().size());
    }

    @Test
    public void givenPlayerHasNotStartedGame_whenCreateGame_thenNewGameNotCreated() {
        createGame();
        assertTrue(cornersGameService.createGame(getTestPlayer("1")).isEmpty());
    }

    @Test
    public void givenPlayerHasStartedGames_whenCreateGame_thenNewGameCreated() {
        startGame();
        assertTrue(cornersGameService.createGame(getTestPlayer("1")).isPresent());
    }

    @Test
    public void givenGameAvailableToJoin_whenJoinGame_thenGameContainsTwoPlayersAndIsStarted() {
        Game game = startGame();
        assertTrue(game.isStarted());
        assertNotNull(game.getPlayer1());
        assertNotNull(game.getPlayer2());
    }

    @Test
    public void givenPlayersTurn_whenPlayerCallsMakeTurnWithCorrectMove_thenPieceIsMoved() {
        Game game = startGame();
        makeMoves(game, someEarlyGameMoves);
        var fieldCopy = CollectionsUtil.copyMap(game.getField());
        cornersGameService.makeTurn(game.getId(), game.getCurrentPlayer(), "e8", "c8");

        assertNull(game.getMistakeAtField());
        var diff = Maps.difference(fieldCopy, game.getField());
        assertNull(diff.entriesDiffering().get("e8").rightValue());
        assertEquals(1, diff.entriesOnlyOnRight().size());
        assertEquals(fieldCopy.get("e8"), diff.entriesOnlyOnRight().get("c8"));
    }

    @Test
    public void givenPlayersTurn_whenPlayerCallsMakeTurnWithIncorrectMove_thenGameIsInErrorStateAndTurnDeclined() {
        Game game = startGame();
        makeMoves(game, someEarlyGameMoves);
        var fieldCopy = CollectionsUtil.copyMap(game.getField());
        cornersGameService.makeTurn(game.getId(), game.getCurrentPlayer(), "e8", "a1");
        assertNotNull(game.getMistakeAtField());
        assertTrue(Maps.difference(fieldCopy, game.getField()).areEqual());
    }

    @Test
    public void givenPlayersTurn_whenPlayerCallsMakeTurnWithIncorrectMove_thenAvailableMovesArePresent() {
        Game game = startGame();
        makeMoves(game, someEarlyGameMoves);
        var expectedAvailableMoves = List.of("c8", "f8");
        cornersGameService.makeTurn(game.getId(), game.getCurrentPlayer(), "e8", "a1");
        assertNotNull(game.getAvailableMoves());
        assertTrue(game.getAvailableMoves().containsAll(expectedAvailableMoves));
        assertEquals(expectedAvailableMoves.size(), game.getAvailableMoves().size());
    }

    @Test
    public void givenOpponentsTurn_whenPlayerCallsMakeTurn_thenExceptionIsThrown() {
        Game game = startGame();
        Exception e = assertThrows(GameError.class, () -> cornersGameService.makeTurn(game.getId(), getTestPlayer("2"), "f6", "f5"));
        assertEquals(Reason.CANNOT_MAKE_TURN.toString(), e.getMessage());
    }

    @Test
    public void givenWhiteHasOneMoveToWin_whenWhiteMakesWinningMove_thenBlackStillHaveOneMoveToMakeDraw() {
        Game game = startGame();
        assertDoesNotThrow(() -> makeMoves(game, fullGameDrawBothHome));
        assertTrue(game.isFinished());
        assertNull(game.getWinner());
        assertEquals(FinishReason.DrawBothHome, game.getFinishReason());
    }

    @Test
    public void fullGameScenarioWhiteWins() {
        Game game = startGame();
        assertDoesNotThrow(() -> makeMoves(game, fullGameWhiteWins));
        assertTrue(game.isFinished());
        assertNotNull(game.getWinner());
        assertEquals(FinishReason.WhiteWon, game.getFinishReason());
    }

    @Test
    public void fullGameScenarioBlackWins() {
        Game game = startGame();
        assertDoesNotThrow(() -> makeMoves(game, fullGameBlackWins));
        assertTrue(game.isFinished());
        assertNotNull(game.getWinner());
        assertEquals(FinishReason.BlackWon, game.getFinishReason());
    }

    private Game startGame() {
        return cornersGameService.joinGame(getTestPlayer("2"), createGame().getId());
    }

    private Game createGame() {
        Optional<Game> game = cornersGameService.createGame(getTestPlayer("1"));
        assertTrue(game.isPresent());
        return game.get();
    }

    private void makeMoves(Game game, List<String> moves) {
        Deque<String> movesDequeue = new LinkedList<>(moves);
        assertEquals(0, movesDequeue.size() % 2);
        Player currentPlayer = game.getInitiator();
        Player opponent = Objects.equals(game.getInitiator(), game.getPlayer1()) ? game.getPlayer2() : game.getPlayer1();
        String moveFrom;

        while ((moveFrom = movesDequeue.pollFirst()) != null) {
            String moveTo = movesDequeue.pollFirst();
            cornersGameService.makeTurn(game.getId(), currentPlayer, moveFrom, moveTo);
            Player buf = currentPlayer;
            currentPlayer = opponent;
            opponent = buf;
        }
    }

    private Player getTestPlayer(String id) {
        return new Player("Test Player " + id, Set.of("user"));
    }
}
