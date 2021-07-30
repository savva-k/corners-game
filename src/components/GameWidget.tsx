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

const DivWithPadding = styled.div`
  padding: 1rem;
`;

const Widget = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  padding: 1rem;
`;
const Players = styled(DivWithPadding)``;
const Action = styled(DivWithPadding)``;
const CreatedAt = styled(DivWithPadding)``;
const UpdatedAt = styled(DivWithPadding)``;

const formatDate = (date: Date): string => {
    const d = new Date(date);
    return `${d.getDate()}.${d.getMonth()}.${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}`;
}

const GameWidget = ({ player, game }: Props) => {
  const history = useHistory();
  const { joinGame } = useContext(GameContext);
  let action: ReactElement | null = null;
  let players: ReactElement | null = null;

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

  if (game.player1 === player.name) {
    players = <div>You ⚔️ {game.player2 ? game.player2 : "???"}</div>;
  } else if (game.player2 === player.name) {
    players = <div>{game.player1 ? game.player1 : "???"} ⚔️ you</div>;
  } else {
    players = (
      <div>
        {game.player1 ? game.player1 : "???"} ⚔️{" "}
        {game.player2 ? game.player2 : "???"}
      </div>
    );
  }

  return (
    <Widget>
      <Players>{players}</Players>
      <Action>{action}</Action>
      <CreatedAt>Created at: {formatDate(game.createdAt)}</CreatedAt>
      <UpdatedAt>Updated at: {formatDate(game.updatedAt)}</UpdatedAt>
    </Widget>
  );
};

export default GameWidget;
