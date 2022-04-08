import styled from "styled-components";

const ActionButton = styled.button`
  width: 10rem;
  border: 3px solid ${(props) => props.theme.colors.primary};
  border-radius: 0.5rem;
  padding: 0.5rem;
  background-color: rgba(0, 0, 0, 0);
  color: ${(props) => props.theme.colors.fontLight};
  font-size: 1.3rem;
  cursor: pointer;
  &:hover {
    background-color: ${(props) => props.theme.colors.primary};
  }
  &:disabled {
    border: 3px solid ${(props) => props.theme.colors.backgroundMain};
    &:hover {
      background-color: ${(props) => props.theme.colors.backgroundContent};
    }
  }
`;

export default ActionButton;
