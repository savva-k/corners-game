import { useHistory } from "react-router-dom";
import ActionButton from "../components/ActionButton";
import ActionsContainer from "../components/ActionsContainer";
import ContentContainer from "../components/ContentContainer";

const Tutorial = () => {
  const history = useHistory();
  return (
    <>
      <ContentContainer>
        <h2>Tutorial</h2>
        <div>
          <p>Coming soon...</p>
        </div>
      </ContentContainer>
      <ActionsContainer>
        <ActionButton onClick={() => history.goBack()}
        style={{ width: "13rem", height: "3rem" }}
        >Go back</ActionButton>
      </ActionsContainer>
    </>
  );
};

export default Tutorial;
