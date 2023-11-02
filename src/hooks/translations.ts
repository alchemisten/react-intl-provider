import { useIntl } from 'react-intl';
import { useContext, useMemo } from 'react';
import { TranslationsContext } from '../provider';

export const useTranslationsInfo = (languageNamePrefix = '__lang.', languageNameKey = '__lang.__name') => {
  const intl = useIntl();
  const context = useContext(TranslationsContext);
  if (!context) {
    throw new Error('useTranslationsInfo must be used within a TranslationsProvider');
  }

  const { currentLanguage: languageKey, setLanguage, translations } = context;

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
