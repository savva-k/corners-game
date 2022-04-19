import styled from "styled-components";

const ActionsContainer = styled.div`
  height: 5rem;
  max-height: 20%;
  padding: 1rem;
  display: flex;
  flex: 2;
  align-items: top;
  justify-content: center;
  background-color: ${(props) => props.theme.colors.backgroundContent};
  @media (max-width: 980px) {
    width: 100%;
    margin: 0;
  }
`;

export default ActionsContainer;
