import { useState } from "react";
import ReactCountryFlag from "react-country-flag";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { availableLanguages, getCountryCodeByLanguage } from "../i18n";

const flagStyle = {
  fontSize: "2rem",
};

const CurrentLanguage = styled.div`
  cursor: pointer;
`;

const LanguageSettingsContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  padding: 1rem;
  width: 100%;
  height: 100%;
  background-color: ${(props) => props.theme.colors.backgroundMain};
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex-direction: column;
  z-index: 99;
`;

const LanguageOption = styled.div`
  display: flex;
  flex: 1;
  width: 100%;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const LanguageName = styled.div`
  margin-left: 1rem;
`;

const supportedLanguages: Record<string, string> = {
  en: "English",
  ru: "Русский",
  cn: "中文",
};

const Language = () => {
  const { i18n } = useTranslation();
  const [displaySettings, setDisplaySettings] = useState<boolean>(false);

  return (
    <>
      {displaySettings && (
        <LanguageSettingsContainer>
          {availableLanguages.map((language) => (
            <LanguageOption
              key={language}
              onClick={() => {
                i18n.changeLanguage(language);
                setDisplaySettings(false);
              }}
            >
              <ReactCountryFlag
                svg
                style={flagStyle}
                countryCode={getCountryCodeByLanguage(language)}
              />
              <LanguageName>{supportedLanguages[language]}</LanguageName>
            </LanguageOption>
          ))}
        </LanguageSettingsContainer>
      )}
      <CurrentLanguage>
        <ReactCountryFlag
          svg
          style={flagStyle}
          countryCode={getCountryCodeByLanguage(i18n.language)}
          onClick={() => setDisplaySettings(true)}
        />
      </CurrentLanguage>
    </>
  );
};

export default Language;
