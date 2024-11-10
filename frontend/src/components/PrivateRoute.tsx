import { useContext, ReactNode } from "react";
import GameContext from "../context/GameContext";
import { Redirect, Route } from "react-router-dom";

interface Props {
  children: ReactNode;
  path: string;
  exact?: boolean;
}

const PrivateRoute = ({ children, ...rest }: Props) => {
  const { player } = useContext(GameContext);

  return (
    <Route
      {...rest}
      render={(_props) => (player.registered ? children : <Redirect to={"/"} />)}
    />
  );
};

export default PrivateRoute;
