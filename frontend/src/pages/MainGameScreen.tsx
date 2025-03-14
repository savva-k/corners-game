import styled from "styled-components";
import PhaserGame from "../phaser/PhaserGame";

const Container = styled.div`
  display: flex;
  width: 70%;
  height: 100%;
  margin-left: auto;
  margin-right: auto;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const GameBoardContainer = styled.div`
  width: 100%;
`;

const PhaserGameScreen = () => {
  const containerId = "GameBoardContainer";

  return <>
    <Container>
      <GameBoardContainer id={containerId}>
        <PhaserGame />
      </GameBoardContainer>
    </Container>
  </>
}

export default PhaserGameScreen;
