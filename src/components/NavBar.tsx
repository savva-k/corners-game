import styled from "styled-components";
import chessBoardImg from "../images/chess_board.svg";
import searchImg from "../images/search.svg";
import settingsImg from "../images/settings.svg";
import { NavLink } from "react-router-dom"

const NavBarContainer = styled.div`
  padding: 1rem;
  background: #9aaab7;
  width: 100%;
  flex: 0.5;
  margin-bottom: 1rem;
`;

const Menu = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  margin: 0;
  padding: 0;
  padding-top: 0.5rem;
`;

const MenuItem = styled(NavLink)`
    padding: 0.5rem;
    display: block;
    text-align: center;
    text-decoration: none;
    color: #1f2128;
    border: 0.2rem solid rgba(0,0,0,0);
    width: 20rem;
    &.active {
        border: 0.2rem solid #1f2128;
    }
`;

const Icon = styled.img<{ src: string }>`
  width: 32px;
  height: 32px;
  background-image: ${(props) => props.src};
`;

function NavBar() {
  return (
    <NavBarContainer>
      <Menu>
        <MenuItem exact to="/">
          <Icon src={searchImg} />
          <br />
          Search
        </MenuItem>
        <MenuItem to="/games">
          <Icon src={chessBoardImg} />
          <br />
          Games
        </MenuItem>
        <MenuItem to="/settings">
          <Icon src={settingsImg} />
          <br />
          Settings
        </MenuItem>
      </Menu>
    </NavBarContainer>
  );
}

export default NavBar;
