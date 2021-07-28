import GameContext from "../context/GameContext";
import { useContext } from "react";
import GameWidget from "./GameWidget";

function SearchGame() {
  const { games, player } = useContext(GameContext);
  return (
    <>
      <div>
        {games.map((game) => (
          <GameWidget game={game} player={player} key={game.id} />
        ))}
      </div>
    </>
  );
}

export default SearchGame;
