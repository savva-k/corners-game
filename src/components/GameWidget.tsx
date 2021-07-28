import { Game } from "../model/Game";
import { Player } from "../model/Player";
import styled from "styled-components";
import { ReactElement } from "react";
import { useHistory } from "react-router-dom";
import { useContext } from "react";
import GameContext from "../context/GameContext";

interface Props {
  player: Player;
  game: Game;
}

const Widget = styled.div`
  display: flex;
`;
const Element = styled.div`
  padding: 1rem;
`;

const GameWidget = ({ player, game }: Props) => {
  const history = useHistory();
  const { joinGame } = useContext(GameContext);
  let action: ReactElement | null = null;

  if (game.isStarted || game.isFinished) {
    if (game.player1 === player.name || game.player2 === player.name) {
      action = (
        <button onClick={() => history.push(`/games/${game.id}`)}>Open</button>
      );
    } else {
      action = (
        <button onClick={() => history.push(`/games/${game.id}`)}>Watch</button>
      );
    }
  } else {
    if (game.player1 === player.name) {
      action = <>Waiting...</>;
    } else {
      action = <button onClick={() => joinGame(game.id)}>Join</button>;
    }
  }

  return (
    <Widget>
      <Element>{game.player1}</Element>
      <Element>{action}</Element>
    </Widget>
  );
};

export default GameWidget;
