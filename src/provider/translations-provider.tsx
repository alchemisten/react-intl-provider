import React, { createContext, FC, PropsWithChildren, useCallback, useContext, useMemo, useState } from 'react';
import { IntlProvider } from 'react-intl';
import merge from 'lodash/merge';

import { flattenTranslations } from '../utils';
import type { TranslationsContextType, TranslationsType } from '../types';

export const DEFAULT_LANGUAGE = window ? window.navigator.language.replace(/^([\w]+)(-.*)/gi, '$1') : 'en';

export const TranslationsContext = createContext<TranslationsContextType | undefined>(undefined);

/**
 * @description Hook to access the TranslationsContext. Can only be used within a TranslationsProvider.
 * @returns {TranslationsContextType} The translations context
 */
export const useTranslations = (): TranslationsContextType => {
  const context = useContext(TranslationsContext);
  if (!context) {
    throw new Error('useTranslations must be used within a TranslationsProvider');
  }
  return context;
};

/**
 * @description Properties to set up a language provider
 */
export interface TranslationsProviderProps extends PropsWithChildren {
  /**
   * @description Default locale that is passed to react-intl
   */
  defaultLocale?: string;
  /**
   * @description Initial language to use in the provider. If not set and there is no parent provider, the browser
   * language is used or 'en' as fallback if no browser language can be detected
   */
  initialLanguage?: string;
  /**
   * @description Initial translations to use in the provider.
   */
  initialTranslations: TranslationsType;
}

export const TranslationsProvider: FC<TranslationsProviderProps> = ({
  children,
  defaultLocale,
  initialLanguage,
  initialTranslations,
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
