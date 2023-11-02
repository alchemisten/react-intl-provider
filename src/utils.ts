import type { TranslationsType } from './types';

export const flattenObject = (obj: any) => {
  const toReturn: any = {};

  for (const i in obj) {
    // eslint-disable-next-line no-continue
    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;

    if (typeof obj[i] === 'object') {
      const flatObject = flattenObject(obj[i]);
      for (const x in flatObject) {
        // eslint-disable-next-line no-continue
        if (!Object.prototype.hasOwnProperty.call(flatObject, x)) continue;

        toReturn[`${i}.${x}`] = flatObject[x];
      }
    } else {
      toReturn[i] = obj[i];
    }
  }

  return toReturn;
};

export const flattenTranslations = (translations: TranslationsType<unknown>): TranslationsType => {
  return Object.keys(translations).reduce<TranslationsType>((acc, lang: string) => {
    acc[lang] = flattenObject(translations[lang]);
    return acc;
  }, {});
};
