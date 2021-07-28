import styled from "styled-components";
import NavBar from "./components/NavBar";
import SearchGame from "./components/SearchGame";
import MyGames from "./components/MyGames";
import GameScreen from "./components/GameScreen";
import { Switch, Route } from "react-router-dom";
import { useContext } from "react";
import GameContext from "./context/GameContext";
import Login from "./components/Login";

const Container = styled.div`
  display: flex;
  height: 100vh;
  flex-direction: column;
  align-items: center;
`;

const Content = styled.div`
  width: 70%;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const MainContent = styled(Content)`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const Header = styled.nav`
  background: #3a3a55;
  color: white;
  font-size: 1.5em;
  width: 100%;
  height: 3rem;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Main = styled.main`
  padding: 1rem;
  background: #1f2128;
  width: 100%;
  color: white;
  flex: 5;
`;

const Footer = styled.footer`
  background: #ff9637;
  width: 100%;
  height: 3rem;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

function App() {
  const { player } = useContext(GameContext);
  console.log(player);
  return (
    <Container>
      <Header>
        <Content>Corners</Content>
      </Header>
      <MainContent>
        <Main>
          {player.registered ? (
            <>
              <NavBar />
              <Switch>
                <Route exact path="/">
                  <SearchGame />
                </Route>
                <Route exact path="/games">
                  <MyGames />
                </Route>
                <Route path="/games/:id">
                  <GameScreen />
                </Route>
                <Route path="/settings">
                  <div>
                    You've logged in as {player.name}
                  </div>
                </Route>
              </Switch>
            </>
          ) : (
            <Login />
          )}
        </Main>
      </MainContent>
      <Footer>
        <Content>Footer</Content>
      </Footer>
    </Container>
  );
}

export default App;
