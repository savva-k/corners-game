import GameContext from "../context/GameContext";
import { useContext } from "react";
import { NavLink } from "react-router-dom"

function MyGames() {
  const { games } = useContext(GameContext);
  return (
    <div>
      {games.map((game) => (
        <div style={{ border: "1px solid red", marginBottom: "2rem" }}>
          <p>Id: {game.id}</p>
          <p>Current turn: {game.currentTurn}</p>
          <p>
            P1 ({game.player1}) vs P2({game.player2})
          </p>
          <p>Started: {game.isStarted}</p>
          <p>Finished: {game.isFinished}</p>
          <p>
            <NavLink to={`/games/${game.id}`}>{game.id}</NavLink>
          </p>
        </div>
      ))}
    </div>
  );
}

export default MyGames;
