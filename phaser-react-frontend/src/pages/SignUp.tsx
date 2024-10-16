import { Redirect } from "react-router-dom";
import { useContext } from "react";
import GameContext from "../context/GameContext";

const SignUp = () => {
  const { player } = useContext(GameContext);
  if (player.registered) return <Redirect to={"/games"} />;

  return <>Signup page is gonna be great</>;
};

export default SignUp;
