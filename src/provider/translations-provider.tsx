import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { IntlProvider } from 'react-intl';

import merge from 'lodash/merge';
import { flattenObject } from '../utils';
import { LanguageProviderProps, TranslationsContextType, TranslationState, TranslationsType } from './types';

export const DEFAULT_LANGUAGE = window ? window.navigator.language.replace(/^([\w]+)(-.*)/gi, '$1') : 'en';

export const TranslationsContext = createContext<TranslationsContextType>({
    translations: {},
    currentLanguage: DEFAULT_LANGUAGE,
    setLanguage: () => undefined,
    addTranslations: () => undefined,
});

export const useCreateTranslations = (initialLanguage: string, initialTranslations: TranslationsType) => {
    const [{ translations, currentLanguage }, updateTranslationState] = useState<TranslationState>({
        translations: initialTranslations,
        currentLanguage: initialLanguage,
    });

    const addTranslations = useCallback(
        (newTranslations: TranslationsType<unknown>) => {
            const flattenedLang = Object.keys(newTranslations).reduce<TranslationsType>((acc, lang: string) => {
                acc[lang] = flattenObject(newTranslations[lang]);
                return acc;
            }, {});
            updateTranslationState({
                translations: merge(newTranslations, flattenedLang),
                currentLanguage,
            });
        },
        [currentLanguage]
    );

    const setLanguage = (lang: string) => {
        updateTranslationState({
            translations,
            currentLanguage: lang,
        });
    };

    useEffect(() => {
        addTranslations(initialTranslations);
    }, [addTranslations, initialTranslations]);

    return {
        translations,
        currentLanguage,
        setLanguage,
        addTranslations,
    };
};

export const useTranslations = (): TranslationsContextType => {
    return useContext(TranslationsContext);
};

export const TranslationsProvider: React.FC<LanguageProviderProps> = ({
    initialLanguage,
    defaultLocale,
    initialTranslations,
    children,
}) => {
    const translations = useCreateTranslations(initialLanguage, initialTranslations);

    const { setLanguage } = useTranslations();

    useEffect(() => {
        if (initialLanguage) {
            setLanguage(initialLanguage);
        }
    }, [initialLanguage, setLanguage]);

    const { currentLanguage, translations: currentTranslations } = translations;

    return (
        <TranslationsContext.Provider value={translations}>
            <IntlProvider
                defaultLocale={defaultLocale}
                locale={currentLanguage}
                messages={currentTranslations[currentLanguage]}
            >
                {children}
            </IntlProvider>
        </TranslationsContext.Provider>
    );
};
