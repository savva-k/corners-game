import GameContext from "../context/GameContext";
import { useContext } from "react";
import styled from "styled-components";
import GameWidget from "./GameWidget";
import ActionButton from "./ActionButton";

//todo Move pages to a separate folder

const WidgetsContainer = styled.div`
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
  gap: 1rem;
`;

const GamesPanelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

function MyGames() {
  const { createGame, games, player } = useContext(GameContext);
  const myGames = games.filter(
    (g) => g.player1.name === player.name || g.player2?.name === player.name
  );
  const joinableGames = games.filter(
    (g) =>
      (g.player1.name !== player.name && !g.player2) ||
      (g.player2?.name !== player.name && !g.player1)
  );
  const watchableGames = games.filter(
    (g) =>
      g.player1 &&
      g.player2 &&
      g.player1.name !== player.name &&
      g.player2?.name !== player.name
  );

  return (
    <>
      <GamesPanelHeader>
        <h2>My games</h2>
        <ActionButton onClick={createGame}>New game</ActionButton>
      </GamesPanelHeader>
      <WidgetsContainer>
        {myGames.length > 0 ? (
          myGames.map((game, idx) => (
            <GameWidget
              game={game}
              player={player}
              key={game.id}
              dark={idx % 2 === 0}
            />
          ))
        ) : (
          <div>No games for now. Create or join one!</div>
        )}
      </WidgetsContainer>

      <h2>Join a game</h2>
      <WidgetsContainer>
        {joinableGames.length > 0 ? (
          joinableGames.map((game, idx) => (
            <GameWidget
              game={game}
              player={player}
              key={game.id}
              dark={idx % 2 === 0}
            />
          ))
        ) : (
          <div>There are no games to join currently.</div>
        )}
      </WidgetsContainer>

      <h2>Watch a game</h2>
      <WidgetsContainer>
        {watchableGames.length > 0 ? (
          watchableGames.map((game, idx) => (
            <GameWidget
              game={game}
              player={player}
              key={game.id}
              dark={idx % 2 === 0}
            />
          ))
        ) : (
          <div>Currently there are no games to watch.</div>
        )}
      </WidgetsContainer>
    </>
  );
}

export default MyGames;
