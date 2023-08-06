package com.playcorners.service;

import com.playcorners.controller.message.GameError;
import com.playcorners.controller.message.Reason;
import com.playcorners.model.Game;
import com.playcorners.model.Piece;
import com.playcorners.model.Player;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@QuarkusTest
public class CornersGameServiceTest {

    @Inject
    CornersGameService cornersGameService;

    @BeforeEach
    public void setup() {
        cornersGameService.cleanGames();
    }

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
        fail();
    }

    @Test
    public void givenPlayersTurn_whenPlayerCallsMakeTurnWithIncorrectMove_thenExceptionIsThrown() {
        fail();
    }

    @Test
    public void givenOpponentsTurn_whenPlayerCallsMakeTurn_thenExceptionIsThrown() {
        Game game = startGame();
        Exception e = assertThrows(GameError.class, () -> cornersGameService.makeTurn(game.getId(), getTestPlayer("2"), "f6", "f5"));
        assertEquals(Reason.CANNOT_MAKE_TURN.toString(), e.getMessage());
    }

    @Test
    public void givenWhiteHasOneMoveToWin_whenWhiteMakesWinningMove_thenBlackStillHaveOneMoveToMakeDraw() {
        fail();
    }

    @Test
    public void givenBlackHasOneMoveToWin_whenBlackMakesWinningMove_thenBlackWins() {
        fail();
    }

    @Test
    public void fullGameScenarioWhiteWins() {
        fail();
    }

    @Test
    public void fullGameScenarioBlackWins() {
        fail();
    }

    private Game startGame() {
        return cornersGameService.joinGame(getTestPlayer("2"), createGame().getId());
    }

    private Game createGame() {
        Optional<Game> game = cornersGameService.createGame(getTestPlayer("1"));
        assertTrue(game.isPresent());
        return game.get();
    }

    private Player getTestPlayer(String id) {
        return new Player("Test Player " + id);
    }
}
