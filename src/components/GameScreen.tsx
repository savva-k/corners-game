import GameContext from "../context/GameContext";
import { useContext } from "react";
import { useParams } from "react-router-dom";
import { Game } from "../model/Game";
import GameBoard from "./GameBoard";
import { Piece } from "../model/Piece";

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
        <div>
          <p>
            Current turn: {Piece.White === game.currentTurn ? "⚪️" : "⚫️"}
          </p>
          <p>
            ⚪️ {game.player1} ⚔️ ⚫️ {game.player2}
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
