import i18next from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import en from "./translations/en.json";
import ru from "./translations/ru.json";
import cz from "./translations/cz.json";

const resources = { en, ru, cz };

const defaultCountryCode = "US";

const countryCodesByLanguage: Record<string, string> = {
  en: "US",
  ru: "RU",
  cz: "CZ",
};

export const getCountryCodeByLanguage = (language: string): string =>
  countryCodesByLanguage[language] || defaultCountryCode;

export const availableLanguages = Object.keys(resources);

i18next.use(initReactI18next).use(LanguageDetector).init({
  resources,
  fallbackLng: "en",
  debug: true,
});
