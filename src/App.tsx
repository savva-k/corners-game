import styled, { ThemeProvider } from "styled-components";
import MyGames from "./components/MyGames";
import GameScreen from "./components/GameScreen";
import { Switch, Route, Link } from "react-router-dom";
import { useContext } from "react";
import GameContext from "./context/GameContext";
import Login from "./components/Login";
import Profile from "./components/Profile";

const Container = styled.div`
  display: flex;
  min-height: 100vh;
  flex-direction: column;
  align-items: center;
  background-color: ${(props) => props.theme.colors.backgroundMain};
`;

const Content = styled.div`
  width: 70%;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const HeaderContent = styled(Content)`
  display: flex;
  justify-content: space-between;
`;

const MainContent = styled(Content)`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const Main = styled.main`
  padding: 1rem;
  background-color: ${(props) => props.theme.colors.backgroundContent};
  width: 100%;
  color: white;
`;

const Header = styled.nav`
  background: ${(props) => props.theme.colors.primary};
  color: ${(props) => props.theme.colors.fontLight};
  font-size: 1.5em;
  width: 100%;
  height: 3rem;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

function App() {
  const { player, theme } = useContext(GameContext);

  const linkStyle = {
    color: theme.colors.backgroundMain,
    textDecoration: "none",
  };

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <Header>
          <HeaderContent>
            <Link to="/" style={linkStyle}>
              Corners
            </Link>
            {player.registered && <Profile />}
          </HeaderContent>
        </Header>
        <MainContent>
          <Main>
            {player.registered ? (
              <>
                <Switch>
                  <Route exact path="/">
                    <MyGames />
                  </Route>
                  <Route path="/games/:id">
                    <GameScreen />
                  </Route>
                  <Route path="/settings">
                    <div>You've logged in as {player.name}</div>
                  </Route>
                </Switch>
              </>
            ) : (
              <Login />
            )}
          </Main>
        </MainContent>
      </Container>
    </ThemeProvider>
  );
}

export default App;
