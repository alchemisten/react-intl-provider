# react-intl-provider

The react-intl-provider is a React component that provides a context for the react-intl library.
It stores the current locale and messages for all languages in the context and provides a function to change the locale 
and add new messages at runtime. Nested providers have access to the parent context and add their messages to the parent
messages. This way all providers have access to all messages and can change the locale, making it possible to use the
react-intl-provider in libraries and applications.

## Installation

```
npm install react-intl-provider
```

## Usage

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { TranslationsProvider } from 'react-intl-provider';
import { FormattedMessage } from 'react-intl';

const translations = {
  de: {
    'app': 'Dies ist eine App',
    'buttons': 'Sprache wechseln'
  },
  en: {
    'app': 'This is an app',
    'buttons': 'Change language'
  }
}
const initialLanguage = 'en';
const root = document.getElementById('root');
if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <TranslationsProvider initialLanguage={initialLanguage} initialTranslations={translations}>
        <div>
          <FormattedMessage id="app" />
          <App />
        </div>
      </TranslationsProvider>
    </React.StrictMode>,
  );
}

export const App = () => {
  const { setLanguage, translations } = useTranslations();

  return (
    <div>
      <FormattedMessage id="buttons" />
      {Object.keys(translations).map((language) => (
        <button key={language} onClick={() => setLanguage(language)}>
          {language}
        </button>
      ))}
    </div>
  );
};
```

## Development

### Build
Run `npm run build` to create a new build.

### New release
Merging to the `main` branch will automatically create a new release via
semantic-release.
