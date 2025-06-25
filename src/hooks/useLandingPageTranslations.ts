import { useTranslation } from "react-i18next";
import enLandingPage from "@/locales/en/landingpage.json";
import viLandingPage from "@/locales/vi/landingpage.json";

const translations = {
  en: enLandingPage,
  vi: viLandingPage,
};

export const useLandingPageTranslations = () => {
  const { i18n } = useTranslation();
  const language = i18n.language || "en";

  const t = (key: string): string => {
    const keys = key.split(".");
    let value: any = translations[language as keyof typeof translations];

    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k];
      } else {
        console.warn(
          `Translation key "${key}" not found for language "${language}"`
        );
        return key;
      }
    }

    return typeof value === "string" ? value : key;
  };

  return { t, language };
};
