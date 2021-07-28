import GameContext from "../context/GameContext";
import { useContext, useState } from "react";
import styled from "styled-components";

const LoginForm = styled.div`
  display: flex;
  flex-direction: column;
  width: 40%;
  margin-left: auto;
  margin-right: auto;
  font-size: 2rem;
`;

const Label = styled.div``;

function Login() {
  const { registerPlayer } = useContext(GameContext);
  const [name, setName] = useState<string>("");
  return (
    <LoginForm>
      <Label>Enter your name:</Label>
      <div>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && registerPlayer(name)}
        />
      </div>
      <div>
        <button disabled={name === ""} onClick={() => registerPlayer(name)}>
          {name ? "Login as " + name : "Please introduce yourself"}
        </button>
      </div>
    </LoginForm>
  );
}

export default Login;
