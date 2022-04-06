import GameContext from "../context/GameContext";
import { useContext } from "react";
import { useParams } from "react-router-dom";
import { Game } from "../model/Game";
import GameBoard from "./GameBoard";
import { Piece } from "../model/Piece";
import GameTurns from "./GameTurns";
import styled from "styled-components";

interface ParamType {
  id: string;
}

const Container = styled.div`
  display: flex;
`;

const GameInfoPanel = styled.div`
  margin-left: 2rem;
`;

function GameScreen() {
  const { games } = useContext(GameContext);
  const { id } = useParams<ParamType>();
  const game: Game | undefined = games.find((game) => game.id === id);

  return game ? (
    <>
      <h2>
        ⚫️ {game.player1.name} ⚔️ ⚪️{" "}
        {game.player2 ? game.player2.name : "waiting..."}
      </h2>
      <Container>
        {game.player2 ? <GameBoard game={game} /> : "waiting for game update"}

        <GameInfoPanel>
          <p>
            Current turn: {Piece.White === game.currentTurn ? "⚫️" : "⚪️"}
          </p>

          <GameTurns turnsArray={game.turns} isGameOver={game.isFinished} />
        </GameInfoPanel>
      </Container>
    </>
  ) : (
    <div>Game not found</div>
  );
}

export default GameScreen;
