import React, { createContext, FC, useCallback, useContext, useMemo, useState } from 'react';
import { IntlProvider } from 'react-intl';
import merge from 'lodash/merge';

import { flattenTranslations } from '../utils';
import type { LanguageProviderProps, TranslationsContextType, TranslationsType } from '../types';

export const DEFAULT_LANGUAGE = window ? window.navigator.language.replace(/^([\w]+)(-.*)/gi, '$1') : 'en';

export const TranslationsContext = createContext<TranslationsContextType | undefined>(undefined);

export const useTranslations = (): TranslationsContextType => {
  const context = useContext(TranslationsContext);
  if (!context) {
    throw new Error('useTranslations must be used within a TranslationsProvider');
  }
  return context;
};

export const TranslationsProvider: FC<LanguageProviderProps> = ({
  initialLanguage,
  defaultLocale,
  initialTranslations,
  children,
}) => {
  const parentContext = useContext(TranslationsContext);
  const [translations, setTranslations] = useState<TranslationsType>(() => {
    if (parentContext) {
      parentContext.addTranslations(initialTranslations);
    }
    return flattenTranslations(initialTranslations);
  });
  const [language, setLanguage] = useState<string>(
    parentContext?.currentLanguage || initialLanguage || DEFAULT_LANGUAGE,
  );

  const addTranslations = useCallback(
    (newTranslations: TranslationsType<unknown>) => {
      if (parentContext && parentContext.addTranslations) {
        parentContext.addTranslations(newTranslations);
      }
      setTranslations(merge(translations, flattenTranslations(newTranslations)));
    },
    [parentContext, translations],
  );

  const setCurrentLanguage = useCallback(
    (lang: string) => {
      if (parentContext && parentContext.setLanguage) {
        parentContext.setLanguage(lang);
      }
      setLanguage(lang);
    },
    [parentContext],
  );

  const mergedValue = useMemo(
    () => ({
      translations: parentContext?.translations ?? translations,
      currentLanguage: parentContext?.currentLanguage || language,
      setLanguage: setCurrentLanguage,
      addTranslations,
    }),
    [
      parentContext?.translations,
      parentContext?.currentLanguage,
      translations,
      language,
      setCurrentLanguage,
      addTranslations,
    ],
  );

  return (
    <TranslationsContext.Provider value={mergedValue}>
      <IntlProvider
        defaultLocale={defaultLocale}
        locale={mergedValue.currentLanguage}
        messages={mergedValue.translations[language]}
      >
        {children}
      </IntlProvider>
    </TranslationsContext.Provider>
  );
};
