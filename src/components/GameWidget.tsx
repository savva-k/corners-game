import { Game } from "../model/Game";
import { Player } from "../model/Player";
import styled from "styled-components";
import { ReactElement } from "react";
import { useHistory } from "react-router-dom";
import { useContext } from "react";
import GameContext from "../context/GameContext";
import GamePreview from "./GamePreview";
import ActionButton from "./ActionButton";
import { useTranslation } from "react-i18next";

interface Props {
  player: Player;
  game: Game;
  dark?: boolean;
}

const Widget = styled.div<{ dark?: boolean }>`
  width: 20%;
  max-width: 20%;
  min-width: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  background-color: ${(props) =>
    props.dark
      ? props.theme.colors.secondary
      : props.theme.colors.secondaryVariant};
`;

const Players = styled.h3`
  padding: 0;
  margin: 0;
  margin-bottom: 1rem;
`;

const Action = styled.div`
  padding: 1rem;
`;

const UpdatedAt = styled.div`
  font-size: 0.8rem;
  padding-bottom: 0;
  margin-left: auto;
`;

const formatDate = (date: Date): string => {
  const d = new Date(date);
  return `${d.getDate()}.${
    d.getMonth() + 1
  }.${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}`;
};

const GameWidget = ({ player, game, dark }: Props) => {
  const { t } = useTranslation();
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
          {t('my_games:gameWidget.open')}
        </ActionButton>
      );
    } else {
      action = (
        <ActionButton onClick={() => history.push(`/games/${game.id}`)}>
          {t('my_games:gameWidget.watch')}
        </ActionButton>
      );
    }
  } else {
    if (game.player1.name === player.name) {
      action = <>{t('my_games:gameWidget.waitingForOpponent')}</>;
    } else {
      action = (
        <ActionButton
          onClick={() => {
            joinGame(game.id);
            history.push(`/games/${game.id}`);
          }}
        >
          {t('my_games:gameWidget.join')}
        </ActionButton>
      );
    }
  }

  if (game.player1 && game.player1.name === player.name) {
    players = <div>{t('my_games:gameWidget.youFirst')} ⚔️ {game.player2 ? game.player2.name : "???"}</div>;
  } else if (game.player2 && game.player2.name === player.name) {
    players = <div>{game.player1 ? game.player1.name : "???"} ⚔️ {t('my_games:gameWidget.youSecond')}</div>;
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
      <UpdatedAt>
        <div>{t('my_games:gameWidget.updatedAt')}</div>
        <div>{formatDate(game.updatedAt)}</div>
      </UpdatedAt>
    </Widget>
  );
};

export default GameWidget;
