import { useIntl } from 'react-intl';
import { useMemo } from 'react';
import { useTranslations } from '../provider';

export const useTranslationsInfo = (languageNamePrefix = '__lang.', languageNameKey = '__lang.__name') => {
  const { currentLanguage: languageKey, setLanguage, translations } = useTranslations();
  const intl = useIntl();

  const { languageName, currentLanguage } = useMemo(() => {
    return {
      languageName: intl.formatMessage({ id: languageNameKey }),
      currentLanguage: intl.formatMessage({ id: `${languageNamePrefix}${languageKey}` }),
    };
  }, [intl, languageKey, languageNameKey, languageNamePrefix]);

  const languages = useMemo(() => {
    return Object.keys(translations).map((language) => {
      return {
        key: language,
        name: intl.formatMessage({ id: `${languageNamePrefix}${language}` }),
      };
    });
  }, [translations, intl, languageNamePrefix]);

  return {
    languageKey,
    languageName,
    currentLanguage,
    setLanguage,
    languages,
  };
};
