import GameContext from "../context/GameContext";
import { useContext } from "react";
import { useParams } from "react-router-dom";
import { Game } from "../model/Game";
import GameBoard from "./GameBoard";
import GameTurns from "./GameTurns";
import styled from "styled-components";
import { ColorTheme } from "../model/ColorTheme";

interface ParamType {
  id: string;
}

interface HasCurrentTurn {
  isCurrentTurn: boolean;
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

const OpponentContainer = styled.div`
  margin-bottom: 0.5rem;
  display: flex;
  justify-content: right;
`;

const CurrentPlayerContainer = styled.div`
  margin-top: 0.5rem;
  display: flex;
`;

const Player = styled.div`
  font-size: 1.5rem;
  border-radius: 1rem;
  background-color: ${(props: HasCurrentTurn & ColorTheme) =>
    props.isCurrentTurn ? props.theme.colors.primary : "transparent"};
  padding: 0.4rem;
  padding-left: 1rem;
  padding-right: 1rem;
`;

const GameBoardContainer = styled.div`
  margin-top: 2rem;
  width: 60%;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const GameInfoPanel = styled.div`
  width: 100%;
`;

function GameScreen() {
  const { games, player } = useContext(GameContext);
  const { id } = useParams<ParamType>();
  const game: Game | undefined = games.find((game) => game.id === id);
  const containerId = "GameBoardContainer";

  let currentPlayerName, opponentName;
  let currentPlayersTurn: boolean;

  if (game?.player1?.name === player.name) {
    currentPlayerName = game.player1.name;
    opponentName = game.player2?.name || "waiting...";
    currentPlayersTurn = game.player1.pieceColor === game.currentTurn;
  } else if (game?.player2.name === player.name) {
    currentPlayerName = game.player2.name;
    opponentName = game.player1?.name || "waiting...";
    currentPlayersTurn = game.player2.pieceColor === game.currentTurn;
  } else {
    currentPlayerName = game?.player1.name || "waiting...";
    opponentName = game?.player2?.name || "waiting...";
    currentPlayersTurn = game?.player1.pieceColor === game?.currentTurn;
  }

  return game ? (
    <>
      {game.player2 ? (
        <Container>
          <GameBoardContainer id={containerId}>
            <OpponentContainer>
              <Player isCurrentTurn={!currentPlayersTurn}>
                {opponentName}
              </Player>
            </OpponentContainer>
            <GameBoard game={game} containerId={containerId} />
            <CurrentPlayerContainer>
              <Player isCurrentTurn={currentPlayersTurn}>
                {currentPlayerName}
              </Player>
            </CurrentPlayerContainer>
          </GameBoardContainer>
          <GameInfoPanel>
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
