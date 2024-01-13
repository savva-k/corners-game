import styled from "styled-components";
import ActionButton from "../components/ActionButton";
import logo from "../images/logo.svg";
import ContentContainer from "../components/ContentContainer";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

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

const ButtonsContainer = styled.div`
  display: flex;
  @media (max-width: 767px) {
    flex-direction: column;
  } ;
`;

const LoginFormButton = styled(ActionButton)`
  @media (min-width: 768px) {
    margin-right: 2rem;
  }
  @media (max-width: 767px) {
    margin-bottom: 1rem;
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
  const { t } = useTranslation();
  const history = useHistory();
  return (
    <>
      <ContentContainer>
        <LoginForm>
          <Logo>
            <GranddadImg src={logo} alt="Play Corners game" />
          </Logo>
          <ButtonsContainer>
            <LoginFormButton onClick={() => history.push("/signin")}>
              {t("index:login")}
            </LoginFormButton>
            <LoginFormButton
              onClick={() => history.push("/signup")}
              style={{
                marginRight: 0,
                marginBottom: 0,
              }}
            >
              {t("index:signup")}
            </LoginFormButton>
          </ButtonsContainer>
        </LoginForm>
      </ContentContainer>
    </>
  );
}

export default Welcome;
