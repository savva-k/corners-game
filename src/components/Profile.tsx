import { useContext } from "react";
import { Link } from "react-router-dom";
import styled, { useTheme } from "styled-components";
import GameContext from "../context/GameContext";
import NoAvatar from "../images/no_avatar.png";

const Container = styled.div`
  display: flex;
  align-items: center;
`;

const UserPic = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-right: 0.5rem;
`;

const Profile = () => {
  const theme: any = useTheme();
  const { player } = useContext(GameContext);

  const linkStyle = {
    color: theme.colors.fontLight,
    textDecoration: "none",
  };

  return (
    <Link to="/settings" style={linkStyle}>
      <Container>
        <UserPic src={NoAvatar} />
        {player.name}
      </Container>
    </Link>
  );
};

export default Profile;
