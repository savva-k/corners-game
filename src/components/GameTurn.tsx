import styled from "styled-components";
import { GameTurnInfo } from "../model/GameTurnInfo";
import { Piece } from "../model/Piece";

const textColor = "white";
interface SomethingThatCouldBeLatest {
  isLatest: boolean;
}
interface TurnProps extends SomethingThatCouldBeLatest {
  piece: Piece;
}

const Turn = styled.div`
  padding: 0.4rem;
  display: flex;
  font-family: Helvetica;
  font-size: 0.75rem;
  background-color: ${(props: TurnProps) =>
    props.piece === Piece.White ? "#9aaab7" : "#8693AB"};
`;

const PositionBox = styled.div`
  color: ${textColor};
  padding: 0.4rem;
  width: 6rem;
  font-weight: bold;
`;

const Order = styled(PositionBox)`
  width: 3rem;
  color: "white";
`;

const From = styled(PositionBox)`
  color: ${(props: SomethingThatCouldBeLatest) =>
    props.isLatest ? "cyan" : textColor};
`;

const To = styled(PositionBox)`
  color: ${(props: SomethingThatCouldBeLatest) =>
    props.isLatest ? "#ff46d7" : textColor};
`;

const GameTurn = ({
  from,
  to,
  isLatest,
  piece,
  order,
  isGameOver,
}: GameTurnInfo) => {
  return (
    <Turn piece={piece} isLatest={isLatest}>
      <Order>
        {isGameOver && isLatest ? "🏆" : isLatest ? "➡️" : `${order}.`}
      </Order>
      <From isLatest={isLatest}>{from}</From>
      <To isLatest={isLatest}>{to}</To>
    </Turn>
  );
};

export default GameTurn;
