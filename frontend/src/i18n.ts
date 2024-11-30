import i18next from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import en from "./translations/en.json";
import ru from "./translations/ru.json";
import cn from "./translations/cn.json";

const resources = { en, ru, cn };

const defaultCountryCode = "US";

const countryCodesByLanguage: Record<string, string> = {
  en: "US",
  ru: "RU",
  cn: "CN",
};

export const getCountryCodeByLanguage = (language: string): string =>
  countryCodesByLanguage[language] || defaultCountryCode;

export const availableLanguages = Object.keys(resources);

i18next.use(initReactI18next).use(LanguageDetector).init({
  resources,
  fallbackLng: "en",
  debug: true,
});
