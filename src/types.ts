/**
 * @description A map of translations, which should have a key for each language, and each language should have a key for each translation
 */
export interface TranslationsType<T = string> {
  [key: string]: {
    [key: string]: T;
  };
}

/**
 * @description TranslationsContextType is the type of the context that is created by the LanguageProvider
 */
export interface TranslationsContextType {
  /**
   * @description A map of all translations
   */
  translations: TranslationsType;
  /**
   * @description The current language of the application which should always be a key of the translations object, though this is not enforced
   */
  currentLanguage: string;
  /**
   * @description Used to change the current language of the application
   * @param key The new language key, which should be a key of the translations object
   */
  setLanguage: (key: string) => void;
  /**
   * @description Used to add new translations to the translations object at runtime
   * @param translations The new translations to add to the translations object
   */
  addTranslations: (translations: TranslationsType<unknown>) => void;
}
