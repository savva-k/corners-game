import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import GameContext from "../context/GameContext";
import ContentContainer from "../components/ContentContainer";
import ActionsContainer from "../components/ActionsContainer";
import ActionButton from "../components/ActionButton";
import { useHistory } from "react-router-dom";

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
  const { registerPlayer } = useContext(GameContext);
  const [name, setName] = useState<string>("");
  const history = useHistory();

  const doSignIn = () => {
    registerPlayer(name);
    history.push("/");
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
            onKeyDown={(e) => e.key === "Enter" && doSignIn()}
            autoFocus={true}
          />
        </LoginForm>
      </ContentContainer>
      <ActionsContainer>
        <ActionButton
          disabled={name === ""}
          onClick={() => doSignIn()}
          style={{ width: "13rem", height: "3rem" }}
        >
          {t("login:enterTheGame")}
        </ActionButton>
      </ActionsContainer>
    </>
  );
};

export default SignIn;
