import GameContext from "../context/GameContext";
import { useContext, useState } from "react";
import styled from "styled-components";
import ActionButton from "./ActionButton";

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

const NameField = styled.input`
  font-size: 2rem;
  width: 50%;
  margin-bottom: 2rem;
`;

function Login() {
  const { registerPlayer } = useContext(GameContext);
  const [name, setName] = useState<string>("");
  return (
    <LoginForm>
      <Label>Please introduce yourself:</Label>
      <NameField
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && registerPlayer(name)}
        autoFocus={true}
      />
      <ActionButton
        disabled={name === ""}
        onClick={() => registerPlayer(name)}
        style={{ width: "13rem" }}
      >
        Enter the game
      </ActionButton>
    </LoginForm>
  );
}

export default Login;
