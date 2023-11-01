import { PropsWithChildren } from 'react';

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

export interface LanguageProviderProps extends PropsWithChildren {
  defaultLocale?: string;
  initialLanguage?: string;
  initialTranslations: TranslationsType;
}
