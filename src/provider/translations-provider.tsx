import React, { createContext, useContext, useEffect, useState } from 'react';
import { IntlProvider } from 'react-intl';

import { flattenObject } from '../utils';
import merge from 'lodash/merge';
import { LanguageProviderProps, TranslationsContextType, TranslationState, TranslationsType } from './types';

export const DEFAULT_LANGUAGE = window ? window.navigator.language.replace( /^([\w]+)(-.*)/ig, '$1' ) : 'en';

export const TranslationsContext = createContext<TranslationsContextType>( {
    translations: {},
    currentLanguage: DEFAULT_LANGUAGE,
    setLanguage: ( _: string ) => {
    },
    addTranslations: ( _: TranslationsType<any> ) => {
    }
} );

export const useCreateTranslations = ( initialLanguage: string, initialTranslations: TranslationsType ) => {
    const [ { translations, currentLanguage }, updateTranslationState ] = useState<TranslationState>( {
        translations: initialTranslations,
        currentLanguage: initialLanguage
    } );

    const addTranslations = ( translations: TranslationsType<any> ) => {
        const flattenedLang = Object.keys( translations ).reduce<TranslationsType>( ( stack, lang: string ) => {
            stack[ lang ] = flattenObject( translations[ lang ] );
            return stack;
        }, {} );
        updateTranslationState( {
            translations: merge( translations, flattenedLang ),
            currentLanguage
        } )
    };

    const setLanguage = ( lang: string ) => {
        updateTranslationState( {
            translations,
            currentLanguage: lang
        } )
    }

    useEffect( () => {
        addTranslations( initialTranslations );
    }, [ initialTranslations ] );

    return {
        translations,
        currentLanguage,
        setLanguage,
        addTranslations
    }
}

export const useTranslations = (): TranslationsContextType => {
    return useContext( TranslationsContext );
}


export const TranslationsProvider: React.FC<LanguageProviderProps> = ( { initialLanguage, defaultLocale, initialTranslations, children } ) => {
    const translations = useCreateTranslations(
        initialLanguage,
        initialTranslations );

    const { setLanguage } = useTranslations();

    useEffect( () => {
        if ( initialLanguage ) {
            setLanguage( initialLanguage );
        }
    }, [ initialLanguage ] );

    const { currentLanguage, translations: currentTranslations } = translations;

    const onIntlError = () => {

    }

    return (
        <TranslationsContext.Provider value={ translations }>
            <IntlProvider
                defaultLocale={ defaultLocale }
                locale={ currentLanguage }
                messages={ currentTranslations[ currentLanguage ] }
                onError={ onIntlError }
            >
                { children }
            </IntlProvider>
        </TranslationsContext.Provider>
    );
};
