import styled from "styled-components";

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
  height: 5vh;
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
  flex: 3;
`;
const NavBar = styled.div`
  padding: 1rem;
  background: #9aaab7;
  width: 100%;
  flex: 1;
`;
const Footer = styled.footer`
  background: #ff9637;
  width: 100%;
  height: 5vh;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

function App() {
  return (
    <Container>
      <Header>
        <Content>Corners</Content>
      </Header>
      <MainContent>
        <NavBar>
          Navigation
        </NavBar>
        <Main>Main</Main>
      </MainContent>
      <Footer>
        <Content>Footer</Content>
      </Footer>
    </Container>
  );
}

export default App;
