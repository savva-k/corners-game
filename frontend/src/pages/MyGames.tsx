import GameContext from "../context/GameContext";
import { useContext, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import GameWidget from "../components/GameWidget";
import ActionButton from "../components/ActionButton";
import ActionsContainer from "../components/ActionsContainer";
import ContentContainer from "../components/ContentContainer";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Game } from "../model";
import { getAllGames, createGame, wsUrl } from "../api";
import { isOwnGame, isJoinableGame } from "src/utils/GameListUtils";

const WidgetsContainer = styled.div`
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
  gap: 1rem;
`;

const sortByUpdatedAtDesc = (games: Game[]) => games.sort((g1, g2) =>new Date(g2.updatedAt).getTime() - new Date(g1.updatedAt).getTime());

function MyGames() {
  const { t } = useTranslation();
  const [ allGames, setAllGames ] = useState<Game[]>([]);
  const { player } = useContext(GameContext);
  const history = useHistory();
  const ws = useRef<WebSocket | null>(null);
  let initialized = false;

  useEffect(() => {
    if (!initialized) {
      getAllGames(player.name)
        .then(response => setAllGames(sortByUpdatedAtDesc(response.data)))
        .catch(e => console.error(e));

      ws.current = new WebSocket(wsUrl + "/lobby");
      ws.current.addEventListener("open", () => {
        console.log("WS connection opened");
      });
      ws.current.addEventListener("close", () => {
        console.log("WS connection closed");
      });
      ws.current.addEventListener("error", (error) => {
        console.error(error);
      });
    }
    initialized = true;
  }, []);

  useEffect(() => {
    if (!ws.current) return;

    ws.current.addEventListener("message", (event) => {
      if (event.data) {
        const updatedGame = JSON.parse(event.data);
        setAllGames(sortByUpdatedAtDesc([updatedGame, ...allGames.filter(g => g.id !== updatedGame.id)]));
      }
    });
  }, [allGames])

  const handleCreateGame = () => {
    createGame(player.name).catch(e => console.error(e));
  }

  const openTutorial = () => {
    console.log(allGames);
    // history.push("/tutorial");
  };

  // const myGames = games.filter(
  //   (g) => g.player1.name === player.name || g.player2?.name === player.name
  // )
  // const joinableGames = games.filter(
  //   (g) =>
  //     (g.player1.name !== player.name && !g.player2) ||
  //     (g.player2?.name !== player.name && !g.player1)
  // );
  // const watchableGames = games.filter(
  //   (g) =>
  //     g.player1 &&
  //     g.player2 &&
  //     g.player1.name !== player.name &&
  //     g.player2?.name !== player.name
  // );

  return (
    <>
      <ContentContainer>
        <h2>{t('my_games:myGames')}</h2>
        <div>
          <WidgetsContainer>
            {allGames.some(g => isOwnGame(g, player.name)) ? (
              allGames.filter(g => isOwnGame(g, player.name)).map((game, idx) => (
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
            {allGames.some(g => isJoinableGame(g, player.name)) ? (
              allGames.filter(g => isJoinableGame(g, player.name)).map((game, idx) => (
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
        {/*
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
        </div> */}
      </ContentContainer>
      <ActionsContainer>
        <ActionButton
          onClick={openTutorial}
          style={{ width: "13rem", height: "3rem", marginRight: "3rem" }}
        >
          {t('my_games:buttons.tutorial')}
        </ActionButton>
        <ActionButton
          onClick={handleCreateGame}
          style={{ width: "13rem", height: "3rem" }}
        >
          {t('my_games:buttons.newGame')}
        </ActionButton>
      </ActionsContainer>
    </>
  );
}

export default MyGames;
