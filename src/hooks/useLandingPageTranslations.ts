import { useTranslation } from "react-i18next";

export const useLandingPageTranslations = () => {
  const { t, i18n } = useTranslation("landingpage");

  return {
    t,
    locale: i18n.language,
    changeLanguage: i18n.changeLanguage,
  };
};

export default useLandingPageTranslations;
