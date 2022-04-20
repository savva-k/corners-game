import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import ActionButton from "../components/ActionButton";
import ActionsContainer from "../components/ActionsContainer";
import ContentContainer from "../components/ContentContainer";

const Tutorial = () => {
  const { t } = useTranslation();
  const history = useHistory();
  return (
    <>
      <ContentContainer>
        <h2>{t("tutorial:tutorial")}</h2>
        <div>
          <p>{t("tutorial:comingSoon")}</p>
        </div>
      </ContentContainer>
      <ActionsContainer>
        <ActionButton
          onClick={() => history.goBack()}
          style={{ width: "13rem", height: "3rem" }}
        >
          {t("common:goBack")}
        </ActionButton>
      </ActionsContainer>
    </>
  );
};

export default Tutorial;
