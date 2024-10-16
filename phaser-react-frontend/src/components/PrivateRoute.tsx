import { useContext, ReactNode } from "react";
import GameContext from "../context/GameContext";
import { Redirect, Route } from "react-router-dom";

interface Props {
  children: ReactNode;
  path: string;
}

const PrivateRoute = ({ children, ...rest }: Props) => {
  const { player } = useContext(GameContext);
  console.log(player);
  return (
    <Route
      {...rest}
      render={(props) => (player.registered ? children : <Redirect to={"/"} />)}
    />
  );
};

export default PrivateRoute;
