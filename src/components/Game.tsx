import GameContext from "../context/GameContext";
import { useContext } from "react";
import { useParams, NavLink } from "react-router-dom";
import { Interface } from "readline";

interface ParamType {
  id: string;
}

function MyGames() {
  const { games } = useContext(GameContext);
  const { id } = useParams<ParamType>();
  console.log(id);
  return (
    <div>
      {games
        .filter((game) => game.id === id)
        .map((game) => (
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
