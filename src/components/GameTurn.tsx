import styled from "styled-components";
import { GameTurnInfo } from "../model/GameTurnInfo";
import { ColorTheme } from "../model/ColorTheme";

interface SomethingThatCouldBeLatest {
  isLatest: boolean;
}

const Turn = styled.div`
  display: flex;
  font-family: Helvetica;
  font-size: 0.75rem;
`;

const PositionBox = styled.div`
  color: ${(props) => props.theme.colors.fontLight};
  padding: 0.4rem;
  width: 6rem;
  font-weight: bold;
`;

const Order = styled(PositionBox)`
  width: 3rem;
  color: "white";
`;

const From = styled(PositionBox)`
  color: ${(props: SomethingThatCouldBeLatest & ColorTheme) =>
    props.isLatest ? "cyan" : props.theme.colors.fontLight};
`;

const To = styled(PositionBox)`
  color: ${(props: SomethingThatCouldBeLatest & ColorTheme) =>
    props.isLatest ? "#ff46d7" : props.theme.colors.fontLight};
`;

const GameTurn = ({ from, to, isLatest, order, isGameOver }: GameTurnInfo) => {
  return (
    <Turn>
      <Order>
        {isGameOver && isLatest ? "🏆" : isLatest ? "➡️" : `${order}.`}
      </Order>
      <From isLatest={isLatest}>{from}</From>
      <To isLatest={isLatest}>{to}</To>
    </Turn>
  );
};

export default GameTurn;
