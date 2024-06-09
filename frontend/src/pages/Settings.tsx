import { useHistory } from "react-router-dom";
import ActionButton from "../components/ActionButton";
import ActionsContainer from "../components/ActionsContainer";
import ContentContainer from "../components/ContentContainer";
import Language from "../components/Language";
import { useTranslation } from "react-i18next";
import keycloak from "../context/Keycloak";

const Settings = () => {
  const { t } = useTranslation();
  const history = useHistory();
  return (
    <>
      <ContentContainer>
        <h2>{t('preferences:pageName')}</h2>
        <div>
          <p>{t('preferences:language')}</p>
          <Language />
        </div>
      </ContentContainer>
      <ActionsContainer>
        <ActionButton
          onClick={() => history.goBack()}
          style={{ width: "13rem", height: "3rem" }}
        >
          {t("common:goBack")}
        </ActionButton>
        <ActionButton
          onClick={() => keycloak.logout({ redirectUri: "/" })}
          style={{ width: "13rem", height: "3rem", marginLeft: "2rem" }}
        >
          {t("profile:logout")}
        </ActionButton>
      </ActionsContainer>
    </>
  );
};

export default Settings;
