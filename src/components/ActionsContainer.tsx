import styled from "styled-components";

const ActionsContainer = styled.div`
  height: 5rem;
  max-height: 5rem;
  padding: 1rem;
  padding-bottom: 0;
  display: flex;
  flex: 2;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.theme.colors.backgroundContent};
  @media (max-width: 980px) {
    width: 100%;
    margin: 0;
  }
`;

export default ActionsContainer;
