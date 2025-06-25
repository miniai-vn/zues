import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Import translation files
import enCommon from "../locales/en/common.json";
import viCommon from "../locales/vi/common.json";
import enLandingPage from "../locales/en/landingpage.json";
import viLandingPage from "../locales/vi/landingpage.json";

const resources = {
  en: {
    common: enCommon,
    landingpage: enLandingPage,
  },
  vi: {
    common: viCommon,
    landingpage: viLandingPage,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "vi", // Default to Vietnamese
    debug: process.env.NODE_ENV === "development",

    detection: {
      order: ["localStorage", "navigator", "htmlTag"],
      caches: ["localStorage"],
    },

    interpolation: {
      escapeValue: false, // React already escapes values
    },

    ns: ["common", "landingpage"], // Add namespaces
    defaultNS: "common", // Default namespace
  });

export default i18n;
