import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import GameContext from "../context/GameContext";
import ContentContainer from "../components/ContentContainer";
import ActionsContainer from "../components/ActionsContainer";
import ActionButton from "../components/ActionButton";
import { useHistory } from "react-router-dom";
import { login } from "../api";

const NameField = styled.input`
  font-size: 2rem;
  width: 50%;
  margin-bottom: 2rem;
`;

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
  }
`;

const Label = styled.div`
  font-size: 1.8rem;
  margin-bottom: 2rem;
`;

const SignIn = () => {
  const { t } = useTranslation();
  const { setPlayer } = useContext(GameContext);
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const history = useHistory();

  const performLogin = () => {
    login(name, password).then(response => {
      setPlayer({
        name: response.data.username,
        registered: true
      });
      history.push("/");
    }).catch(e => console.error(e));
  };

  return (
    <>
      <ContentContainer>
        <LoginForm>
          <Label>{t("login:enterYourName")}</Label>
          <NameField
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && performLogin()}
            autoFocus={true}
          />
        </LoginForm>
      </ContentContainer>
      <ActionsContainer>
        <ActionButton
          disabled={name === ""}
          onClick={() => performLogin()}
          style={{ width: "13rem", height: "3rem" }}
        >
          {t("login:enterTheGame")}
        </ActionButton>
      </ActionsContainer>
    </>
  );
};

export default SignIn;
