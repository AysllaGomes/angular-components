/** Idiomas e dicionários do site (a biblioteca usa provideUiLabels, não isto). */

export const LANGS = ['pt', 'en'] as const;
export type Lang = typeof LANGS[number];

export type DictEntry = { pt: string; en: string };

export type Dict = Record<string, DictEntry>;
