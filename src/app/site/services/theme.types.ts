/** Tema e cor de destaque escolhidos no site. */

export const THEMES = ['light', 'dark'] as const;
export type Theme = typeof THEMES[number];

export const ACCENTS = ['teal', 'orange', 'violet', 'blue', 'rose'] as const;
export type Accent = typeof ACCENTS[number];
