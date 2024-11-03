import { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Game } from "../model";
import GameContext from "../context/GameContext";
import GameBoard from "./GameBoard";
import GameTurns from "./GameTurns";
import styled from "styled-components";
import { ColorTheme } from "../model/ColorTheme";
import { getGameById, wsUrl } from "../api";

interface ParamType {
  id: string;
}

interface HasCurrentTurn {
  isCurrentTurn: boolean;
}

interface PlayerNameProps {
  isCurrentTurn: boolean;
  isOpponent: boolean;
  name: string;
}

const PlayerName = ({ isCurrentTurn, isOpponent, name }: PlayerNameProps) => {
  if (isOpponent) {
    return isCurrentTurn ? <>🎮 {name}</> : <>😴 {name}</>;
  } else {
    return isCurrentTurn ? <>{name} 🎮</> : <>{name} 😴</>;
  }
};

const Container = styled.div`
  display: flex;
  width: 70%;
  height: 100%;
  margin-left: auto;
  margin-right: auto;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
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
    props.isCurrentTurn
      ? props.theme.colors.primary
      : props.theme.colors.backgroundMain};
  padding: 0.4rem;
  padding-left: 1rem;
  padding-right: 1rem;
`;

const GameBoardContainer = styled.div`
  width: 60%;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const GameInfoPanel = styled.div`
  width: 100%;
  margin-top: 5rem;
  border-top: 1px solid ${(props) => props.theme.colors.primary};
`;

function GameScreen() {
  const { player } = useContext(GameContext);
  const { id } = useParams<ParamType>();
  const [game, setGame] = useState<Game | null>(null);
  const ws = useRef<WebSocket | null>(null);
  const containerId = "GameBoardContainer";
  const initialized = useRef<boolean>(false);
  const connected = useRef<boolean>(false);

  useEffect(() => {
    if (!initialized.current) {
      getGameById(id)
        .then(response => {
          setGame(response.data);
          ws.current = new WebSocket(wsUrl + '/game/' + response.data.id);
          ws.current.addEventListener('open', () => {
            connected.current = true;
            console.log('Connected: game WS');
          });
          ws.current.addEventListener('close', () => {
            connected.current = false;
            console.log('Disconnected: game WS');
          });
          ws.current.addEventListener('error', (error) => {
            console.error('Error: game WS');
            console.error(error);
          });
        })
        .catch(e => console.error(e));
    }
    initialized.current = true;

    return () => { ws.current && connected.current && ws.current.close() };
  }, [id]);

  useEffect(() => {
    if (!ws.current) return;

    ws.current.addEventListener('message', (event) => {
      if (event.data) {
        const updatedGame = JSON.parse(event.data);
        console.log(updatedGame);
        setGame(updatedGame);
      }
    });
  }, [game]);

  const makeTurn = (from: string, to: string) => {
    if (!ws.current) return;
    ws.current.send(JSON.stringify({ from, to, userName: player.name}));
  }

  let currentPlayerName, opponentName;
  let currentPlayersTurn: boolean;

  if (!game) return <>"waiting for game update"</>;

  if (game?.player1?.name === player.name) {
    currentPlayerName = game.player1.name;
    opponentName = game.player2?.name || "waiting...";
    currentPlayersTurn = game.player1Piece === game.currentTurn;
  } else if (game?.player2?.name === player.name) {
    currentPlayerName = game.player2?.name || "waiting...";
    opponentName = game.player1?.name || "waiting...";
    currentPlayersTurn = game.player2Piece === game.currentTurn;
  } else {
    currentPlayerName = game?.player1.name || "waiting...";
    opponentName = game?.player2?.name || "waiting...";
    currentPlayersTurn = game?.player1Piece === game?.currentTurn;
  }

  return game ? (
    <>
      <Container>
        <GameBoardContainer id={containerId}>
          <OpponentContainer>
            <Player isCurrentTurn={!currentPlayersTurn && !game.isFinished}>
              <PlayerName
                name={opponentName}
                isCurrentTurn={!currentPlayersTurn}
                isOpponent={true}
              />
            </Player>
          </OpponentContainer>
          <GameBoard game={game} containerId={containerId} makeTurn={makeTurn} />
          <CurrentPlayerContainer>
            <Player isCurrentTurn={currentPlayersTurn && !game.isFinished}>
              <PlayerName
                name={currentPlayerName}
                isCurrentTurn={currentPlayersTurn}
                isOpponent={false}
              />
            </Player>
          </CurrentPlayerContainer>
          <GameInfoPanel>
            <GameTurns turnsArray={game.turns} isGameOver={game.isFinished} />
          </GameInfoPanel>
        </GameBoardContainer>
      </Container>
    </>
  ) : (
    <div>Game not found</div>
  );
}

export default GameScreen;
