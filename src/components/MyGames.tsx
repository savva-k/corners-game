import GameContext from "../context/GameContext";
import { useContext } from "react";
import styled from "styled-components";
import GameWidget from "./GameWidget";

//todo Move pages to a separate folder

const NewGameButton = styled.button`
  box-shadow: inset 0px 1px 0px 0px #97c4fe;
  background: linear-gradient(to bottom, #3d94f6 5%, #1e62d0 100%);
  background-color: #3d94f6;
  border-radius: 6px;
  border: 1px solid #337fed;
  display: inline-block;
  cursor: pointer;
  color: #ffffff;
  font-family: Arial;
  font-size: 2em;
  font-weight: bold;
  padding: 1rem 2rem;
  text-decoration: none;
  text-shadow: 0px 1px 0px #1570cd;
`;

const WidgetsContainer = styled.div`
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
  gap: 1rem;
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
      <h1>Welcome, {player.name}</h1>
      <div style={{ marginBottom: "1rem" }}>
        <NewGameButton onClick={createGame}>New game</NewGameButton>
      </div>
      <h1>My games</h1>
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

      <h1>Join a game</h1>
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

      <h1>Watch a game</h1>
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
