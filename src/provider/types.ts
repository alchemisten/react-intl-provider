export interface TranslationsType<T = string> {
    [key: string]: {
        [key: string]: T;
    };
}

export interface TranslationsContextType {
    translations: TranslationsType;
    currentLanguage: string;
    setLanguage: (key: string) => void;
    addTranslations: (translations: TranslationsType<unknown>) => void;
}

export type TranslationState = {
    translations: TranslationsType;
    currentLanguage: string;
};

export type LanguageProviderProps = {
    defaultLocale?: string;
    initialLanguage: string;
    initialTranslations: TranslationsType;
};
