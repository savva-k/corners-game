import { Game } from "../model/Game";
import { Player } from "../model/Player";
import styled from "styled-components";
import { ReactElement } from "react";
import { useHistory } from "react-router-dom";
import { useContext } from "react";
import GameContext from "../context/GameContext";
import GamePreview from "./GamePreview";

interface Props {
  player: Player;
  game: Game;
  dark?: boolean;
}

const DivWithPadding = styled.div`
  padding: 1rem;
`;

const Widget = styled.div<{ dark?: boolean }>`
  width: 20%;
  max-width: 20%;
  min-width: 180px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  background-color: ${(props) =>
    props.dark
      ? props.theme.colors.secondary
      : props.theme.colors.secondaryVariant};
`;

const ActionButton = styled.button`
  width: 10rem;
  border: 0;
  border-radius: 0.5rem;
  padding: 0.5rem;
  background-color: ${(props) => props.theme.colors.primary};
  color: ${(props) => props.theme.colors.fontLight};
  box-sizing: border-box;
  font-size: 1.5rem;
  cursor: pointer;
  &:hover {
    background-color: ${(props) => props.theme.colors.primaryVariant};
  }
`;

const Players = styled.h3``;
const Action = styled(DivWithPadding)``;
const CreatedAt = styled(DivWithPadding)``;
const UpdatedAt = styled(DivWithPadding)``;

const formatDate = (date: Date): string => {
  const d = new Date(date);
  return `${d.getDate()}.${d.getMonth()}.${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}`;
};

const GameWidget = ({ player, game, dark }: Props) => {
  const history = useHistory();
  const { joinGame } = useContext(GameContext);
  let action: ReactElement | null = null;
  let players: ReactElement | null = null;

  if (game.isStarted || game.isFinished) {
    if (
      game.player1.name === player.name ||
      game.player2.name === player.name
    ) {
      action = (
        <ActionButton onClick={() => history.push(`/games/${game.id}`)}>
          Open
        </ActionButton>
      );
    } else {
      action = (
        <ActionButton onClick={() => history.push(`/games/${game.id}`)}>
          Watch
        </ActionButton>
      );
    }
  } else {
    if (game.player1.name === player.name) {
      action = <>Waiting for the opponent...</>;
    } else {
      action = (
        <ActionButton
          onClick={() => {
            joinGame(game.id);
            history.push(`/games/${game.id}`);
          }}
        >
          Join
        </ActionButton>
      );
    }
  }

  if (game.player1 && game.player1.name === player.name) {
    players = <div>You ⚔️ {game.player2 ? game.player2.name : "???"}</div>;
  } else if (game.player2 && game.player2.name === player.name) {
    players = <div>{game.player1 ? game.player1.name : "???"} ⚔️ you</div>;
  } else {
    players = (
      <div>
        {game.player1 ? game.player1.name : "???"} ⚔️{" "}
        {game.player2 ? game.player2.name : "???"}
      </div>
    );
  }

  return (
    <Widget dark={dark}>
      <Players>{players}</Players>
      <GamePreview game={game} />
      <Action>{action}</Action>
      <CreatedAt>Created at: {formatDate(game.createdAt)}</CreatedAt>
      <UpdatedAt>Updated at: {formatDate(game.updatedAt)}</UpdatedAt>
    </Widget>
  );
};

export default GameWidget;
