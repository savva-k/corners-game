import { useHistory } from "react-router-dom";
import ActionButton from "../components/ActionButton";
import ActionsContainer from "../components/ActionsContainer";
import ContentContainer from "../components/ContentContainer";

const Settings = () => {
  const history = useHistory();
  return (
    <>
      <ContentContainer>
        <h2>User preferences</h2>
        <div>
          <p>This section is under construction</p>
        </div>
      </ContentContainer>
      <ActionsContainer>
        <ActionButton onClick={() => history.goBack()}>Go back</ActionButton>
      </ActionsContainer>
    </>
  );
};

export default Settings;
