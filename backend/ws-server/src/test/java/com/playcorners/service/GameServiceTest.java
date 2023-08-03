package com.playcorners.service;

import com.playcorners.model.Game;
import io.quarkus.test.junit.QuarkusMock;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;

@QuarkusTest
public class GameServiceTest {

    private static final String TEST_GAME_ID = "test-game-id";

    @Inject
    GameService gameService;

    private static final List<Game> singleGameList = Collections.singletonList(new Game(TEST_GAME_ID));

    @BeforeAll
    public static void setup() {
        GameService mock = Mockito.mock(GameService.class);
        Mockito.doReturn(singleGameList).when(mock).getGames();
        Mockito.doCallRealMethod().when(mock).getGameById(any());
        QuarkusMock.installMockForType(mock, GameService.class);
    }

    @Test
    public void givenNonExistingGameId_whenGetGameById_thenReturnEmpty() {
        Optional<Game> maybeGame = gameService.getGameById("non-existent-game-id");
        assertTrue(maybeGame.isEmpty());
    }

    @Test
    public void givenExistingGameId_whenGetGameById_thenReturnGame() {
        Optional<Game> maybeGame = gameService.getGameById(TEST_GAME_ID);
        assertTrue(maybeGame.isPresent());
    }
}
