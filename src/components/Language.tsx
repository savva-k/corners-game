import { i18n, TFunction } from "i18next";
import { availableLanguages } from "../i18n";

interface Props {
  i18n: i18n;
  t: TFunction;
}

const Language = ({ i18n, t }: Props) => (
  <select
    defaultValue={i18n.language}
    onChange={(e) => {
      i18n.changeLanguage(e.target.value);
    }}
  >
    {availableLanguages.map((language) => (
      <option key={language} value={language}>{t(`languages:${language}`)}</option>
    ))}
  </select>
);

export default Language;
