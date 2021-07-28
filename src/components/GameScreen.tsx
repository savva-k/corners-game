import GameContext from "../context/GameContext";
import { useContext } from "react";
import { useParams, NavLink } from "react-router-dom";
import { Game } from "../model/Game";
import GameBoard from "./GameBoard";

interface ParamType {
  id: string;
}

function GameScreen() {
  const { games } = useContext(GameContext);
  const { id } = useParams<ParamType>();
  const game: Game | undefined = games.find((game) => game.id === id);

  return (
    <div>
      {game ? (
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
          <GameBoard game={game} />
        </div>
      ) : (
        <div>Game not found</div>
      )}
    </div>
  );
}

export default GameScreen;
