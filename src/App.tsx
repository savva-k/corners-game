import styled, { ThemeProvider } from "styled-components";
import MyGames from "./components/MyGames";
import GameScreen from "./components/GameScreen";
import { Switch, Route, Link, useHistory } from "react-router-dom";
import { useContext } from "react";
import GameContext from "./context/GameContext";
import Login from "./components/Login";
import Profile from "./components/Profile";
import ActionButton from "./components/ActionButton";

const Container = styled.div`
  display: flex;
  min-height: 100%;
  flex-direction: column;
  align-items: center;
  background-color: ${(props) => props.theme.colors.backgroundMain};
`;

const Content = styled.div`
  width: 70%;
  @media (max-width: 980px) {
    width: 100%;
  }
`;

const HeaderContent = styled(Content)`
  display: flex;
  justify-content: space-between;
`;

const MainContent = styled(Content)`
  flex: 2;
  display: flex;
`;

const Main = styled.main`
  flex: 2;
  padding: 1rem;
  background-color: ${(props) => props.theme.colors.backgroundContent};
  color: ${(props) => props.theme.colors.fontLight};
  width: 100%;
  min-height: 100%;
`;

const Header = styled.nav`
  background: ${(props) => props.theme.colors.primary};
  color: ${(props) => props.theme.colors.fontLight};
  font-size: 1.5em;
  width: 100%;
  height: 3rem;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ErrorContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: ${(props) => props.theme.colors.backgroundMain};
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Error = styled.div`
  background-color: ${(props) => props.theme.colors.backgroundContent};
  color: ${(props) => props.theme.colors.fontLight};
  padding: 5rem;
  font-size: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Message = styled.div`
  margin-bottom: 2rem;
`;

function App() {
  const { player, theme, error, clearError } = useContext(GameContext);
  const history = useHistory();

  const linkStyle = {
    color: theme.colors.fontLight,
    textDecoration: "none",
  };

  return (
    <ThemeProvider theme={theme}>
      {error && (
        <ErrorContainer>
          <Error>
            <Message>{error}</Message>
            <ActionButton onClick={clearError}>Close</ActionButton>
          </Error>
        </ErrorContainer>
      )}
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
                    <h2>User preferences</h2>
                    <div>
                      <p>This section is under construction</p>
                    </div>
                    <ActionButton onClick={() => history.goBack()}>
                      Go back
                    </ActionButton>
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
