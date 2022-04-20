import i18next from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import en from "./translations/en.json";
import ru from "./translations/ru.json";

const resources = { en, ru };

export const availableLanguages = Object.keys(resources);

i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    resources,
    fallbackLng: "en",
    debug: true,
  });

