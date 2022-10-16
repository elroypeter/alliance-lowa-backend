export type LocaleString = string & {_opeque: 'LocalString'};

export type TranslatableKeys<T> = {
    [K in keyof T]: T[K] extends LocaleString ? K : never;
}[keyof T]

export type NonTranslateableKeys<T> = {
    [K in keyof T]: T[K] extends LocaleString ? never : K;
}[keyof T]

export type Translatable<T> = { [K in NonTranslateableKeys<T>]: T[K] } & 
                              { [K in TranslatableKeys<T>]?: never } &
                              { translations: Translation<T>[] }

export type Translation<T> = { langCode: string; base: Translatable<T> } & { [K in TranslatableKeys<T>]: string }