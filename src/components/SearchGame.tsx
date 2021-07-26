import GameContext from "../context/GameContext";
import { useContext } from "react";

function SearchGame() {
  const { createGame } = useContext(GameContext);
  return (
    <>
      <button onClick={createGame}>New game</button>
    </>
  );
}

export default SearchGame;
