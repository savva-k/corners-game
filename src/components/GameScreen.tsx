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
  width: 70%;
  height: 100%;
  margin-left: auto;
  margin-right: auto;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const PlayersPanel = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-content: center;
  width: 100%;
`;

const Player = styled.div`
  font-size: 1.2rem;
  border-radius: 1rem;
  background-color: ${(props) => props.theme.colors.secondaryVariant};
  padding: 0.4rem;
  padding-left: 1rem;
  padding-right: 1rem;
`;

const Versus = styled.div`
  font-size: 2rem;
`;

const Player1 = styled(Player)`
  font-size: 1.5rem;
`;

const Player2 = styled(Player)`
  font-size: 1.5rem;
`;

const GameBoardContainer = styled.div`
  width: 50%;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const GameInfoPanel = styled.div`
  width: 100%;
`;

function GameScreen() {
  const { games } = useContext(GameContext);
  const { id } = useParams<ParamType>();
  const game: Game | undefined = games.find((game) => game.id === id);
  const containerId = "GameBoardContainer";

  return game ? (
    <>
      {game.player2 ? (
        <Container>
          <PlayersPanel>
            <Player1>⚫️ {game.player1.name}</Player1>
            <Versus>⚔️</Versus>
            <Player2>
              ⚪️ {game.player2 ? game.player2.name : "waiting..."}
            </Player2>
          </PlayersPanel>
          <GameBoardContainer id={containerId}>
            <GameBoard game={game} containerId={containerId} />
          </GameBoardContainer>
          <GameInfoPanel>
            <p>
              Current turn: {Piece.White === game.currentTurn ? "⚫️" : "⚪️"}
            </p>

            <GameTurns turnsArray={game.turns} isGameOver={game.isFinished} />
          </GameInfoPanel>
        </Container>
      ) : (
        "waiting for game update"
      )}
    </>
  ) : (
    <div>Game not found</div>
  );
}

export default GameScreen;
