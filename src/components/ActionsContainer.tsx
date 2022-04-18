import styled from "styled-components";

const ActionsContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  height: 5rem;
  width: 70%;
  margin-left: 15%;
  margin-right: 15%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.theme.colors.backgroundContent};
  @media (max-width: 980px) {
    width: 100%;
    margin: 0;
  }
`;

export default ActionsContainer;
