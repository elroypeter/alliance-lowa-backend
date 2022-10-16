import { Translatable } from './locale-types';

export class LocaleService {
  translate<T>(translatable: Translatable<T>): T {
    return translate(translatable);
  }
}

export function translate<T>(translatable: Translatable<T>): T {
  const translation = translatable.translations[0];
  const translated = { ...(translatable as any) };
  delete translated.translations;

  for (const [key, value] of Object.entries(translation)) {
    if (key !== 'langCode' && key !== 'id') {
      translated[key] = value;
    }
  }

  return translated;
}
