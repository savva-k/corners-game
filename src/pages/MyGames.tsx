import GameContext from "../context/GameContext";
import { useContext } from "react";
import styled from "styled-components";
import GameWidget from "../components/GameWidget";
import ActionButton from "../components/ActionButton";
import ActionsContainer from "../components/ActionsContainer";
import ContentContainer from "../components/ContentContainer";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";

const WidgetsContainer = styled.div`
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
  gap: 1rem;
`;

function MyGames() {
  const { t } = useTranslation();
  const { createGame, games, player } = useContext(GameContext);
  const history = useHistory();

  const openTutorial = () => {
    history.push("/tutorial");
  };

  const myGames = games.filter(
    (g) => g.player1.name === player.name || g.player2?.name === player.name
  );
  const joinableGames = games.filter(
    (g) =>
      (g.player1.name !== player.name && !g.player2) ||
      (g.player2?.name !== player.name && !g.player1)
  );
  const watchableGames = games.filter(
    (g) =>
      g.player1 &&
      g.player2 &&
      g.player1.name !== player.name &&
      g.player2?.name !== player.name
  );

  return (
    <>
      <ContentContainer>
        <h2>{t('my_games:myGames')}</h2>
        <div>
          <WidgetsContainer>
            {myGames.length > 0 ? (
              myGames.map((game, idx) => (
                <GameWidget
                  game={game}
                  player={player}
                  key={game.id}
                  dark={idx % 2 === 0}
                />
              ))
            ) : (
              <div>{t('my_games:myGamesEmpty')}</div>
            )}
          </WidgetsContainer>
        </div>

        <h2>{t('my_games:joinGame')}</h2>
        <div>
          <WidgetsContainer>
            {joinableGames.length > 0 ? (
              joinableGames.map((game, idx) => (
                <GameWidget
                  game={game}
                  player={player}
                  key={game.id}
                  dark={idx % 2 === 0}
                />
              ))
            ) : (
              <div>{t('my_games:joinGameEmpty')}</div>
            )}
          </WidgetsContainer>
        </div>

        <h2>{t('my_games:watchGame')}</h2>
        <div>
          <WidgetsContainer>
            {watchableGames.length > 0 ? (
              watchableGames.map((game, idx) => (
                <GameWidget
                  game={game}
                  player={player}
                  key={game.id}
                  dark={idx % 2 === 0}
                />
              ))
            ) : (
              <div>{t('my_games:watchGameEmpty')}</div>
            )}
          </WidgetsContainer>
        </div>
      </ContentContainer>
      <ActionsContainer>
        <ActionButton
          onClick={openTutorial}
          style={{ width: "13rem", height: "3rem", marginRight: "3rem" }}
        >
          {t('my_games:buttons.tutorial')}
        </ActionButton>
        <ActionButton
          onClick={createGame}
          style={{ width: "13rem", height: "3rem" }}
        >
          {t('my_games:buttons.newGame')}
        </ActionButton>
      </ActionsContainer>
    </>
  );
}

export default MyGames;
