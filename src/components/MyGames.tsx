import GameContext from "../context/GameContext";
import { useContext } from "react";
import styled from "styled-components";
import GameWidget from "./GameWidget";

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
  diplay: flex;
`;

function MyGames() {
  const { createGame, games, player } = useContext(GameContext);
  return (
    <>
      <div style={{ marginBottom: "1rem" }}>
        <NewGameButton onClick={createGame}>New game</NewGameButton>
      </div>
      <WidgetsContainer>
        {games
          .filter(
            (g) =>
              g.player1.name === player.name || g.player2.name === player.name
          )
          .map((game) => (
            <GameWidget game={game} player={player} key={game.id} />
          ))}
      </WidgetsContainer>
    </>
  );
}

export default MyGames;
