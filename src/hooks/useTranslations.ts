import { useTranslation } from 'react-i18next';

export const useTranslations = (namespace = 'common') => {
  const { t, i18n } = useTranslation(namespace);
  
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const currentLanguage = i18n.language;

  return {
    t,
    changeLanguage,
    currentLanguage,
    isVietnamese: currentLanguage === 'vi',
    isEnglish: currentLanguage === 'en',
  };
};

export default useTranslations;
