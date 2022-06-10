import styled from "styled-components";
import { GameTurnInfo } from "../model/GameTurnInfo";
import { Piece, Turn } from "corners-common";
import GameTurn from "./GameTurn";

interface Props {
  turnsArray: Turn[];
  isGameOver: boolean;
}

const Container = styled.div`
  padding: 0.4rem;
  display: flex;
  height: 5rem;
  flex-direction: column;
  overflow: auto;
`;

const GameTurns = ({ turnsArray, isGameOver }: Props) => {
  if (!Array.isArray(turnsArray) || turnsArray.length === 0)
    return <Container>White pieces start the game</Container>;

  let currentPiece = Piece.White;
  let turns: GameTurnInfo[] = [];
  let key = 0;

  for (let i = 0; i < turnsArray.length; i++) {
    turns.push({
      from: turnsArray[i].from,
      to: turnsArray[i].to,
      isLatest: i === turnsArray.length - 1,
      piece: currentPiece,
      order: i + 1,
      isGameOver: isGameOver,
    });
    currentPiece = currentPiece === Piece.White ? Piece.Black : Piece.White;
  }

  turns.reverse();

  return (
    <Container>
      {turns.map((t) => (
        <GameTurn key={`turn_${++key}`} {...t} />
      ))}
    </Container>
  );
};

export default GameTurns;
