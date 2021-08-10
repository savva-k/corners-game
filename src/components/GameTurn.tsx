import styled from "styled-components";
import { GameTurnInfo } from "../model/GameTurnInfo";
import { Piece } from "../model/Piece";

interface TurnProps {
  piece: Piece;
  isLatest: boolean;
}

const Turn = styled.div`
  padding: 0.4rem;
  display: flex;
  font-family: Helvetica;
  font-size: 0.75rem;
`;

const whiteColorIfWhite = (piece: Piece) =>
  piece === Piece.White ? "white" : "black";
const blackColorIfWhite = (piece: Piece) =>
  piece === Piece.White ? "black" : "white";

const PositionBox = styled.div`
  padding: 0.4rem;
  width: 2rem;
  text-align: center;
`;

const Order = styled(PositionBox)`
  color: "white";
`;

const From = styled(PositionBox)`
  color: ${(props: TurnProps) =>
    props.isLatest ? "black" : blackColorIfWhite(props.piece)};
  background-color: ${(props: TurnProps) =>
    props.isLatest ? "cyan" : whiteColorIfWhite(props.piece)};
  border-radius: 0.5rem 0 0 0.5rem;
`;

const To = styled(PositionBox)`
  color: ${(props: TurnProps) =>
    props.isLatest ? "black" : whiteColorIfWhite(props.piece)};
  background-color: ${(props: TurnProps) =>
    props.isLatest ? "magenta" : blackColorIfWhite(props.piece)};
  border-radius: 0 0.5rem 0.5rem 0;
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
    <Turn>
      <Order>{isGameOver && isLatest ? "🏆" : isLatest ? "➡️" : `${order}.`}</Order>
      <From piece={piece} isLatest={isLatest}>
        {from}
      </From>
      <To piece={piece} isLatest={isLatest}>
        {to}
      </To>
    </Turn>
  );
};

export default GameTurn;
