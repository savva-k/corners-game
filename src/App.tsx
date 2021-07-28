import styled from "styled-components";
import NavBar from "./components/NavBar";
import SearchGame from "./components/SearchGame";
import MyGames from "./components/MyGames";
import GameScreen from "./components/GameScreen";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

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
  return (
    <Router>
      <Container>
        <Header>
          <Content>Corners</Content>
        </Header>
        <MainContent>
          <NavBar />
          <Main>
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
              <Route path="/settings">settings</Route>
            </Switch>
          </Main>
        </MainContent>
        <Footer>
          <Content>Footer</Content>
        </Footer>
      </Container>
    </Router>
  );
}

export default App;
