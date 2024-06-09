import styled from "styled-components";
import logo from "../images/logo.svg";
import ContentContainer from "../components/ContentContainer";

const LoginForm = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  @media (min-width: 768px) {
    margin-left: auto;
    margin-right: auto;
    width: 50%;
  } ;
`;

const Logo = styled.div`
  max-width: 450px;
  border: 1px solid #393f47ff;
  margin-bottom: 2rem;
`;

const GranddadImg = styled.img`
  width: 100%;
  display: block;
`;

const Welcome = () => {
  return (
    <>
      <ContentContainer>
        <LoginForm>
          <Logo>
            <GranddadImg src={logo} alt="Play Corners game" />
          </Logo>
        </LoginForm>
      </ContentContainer>
    </>
  );
}

export default Welcome;
