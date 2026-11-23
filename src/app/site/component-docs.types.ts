/**
 * Dados da página de um componente (/componentes/:id), gerados dos .md por
 * `npm run docs:pages`. Os textos em HTML já vêm escapados pelo gerador (só
 * <strong>, <em>, <code> e <a> saem do markdown).
 */
export interface ComponentDocTable {
  /** nome da aba na API (ex.: "<code>app-tabs</code>", "Inputs") */
  title: string;
  head: string[];
  rows: string[][];
}

export interface ComponentDocCopy {
  rows: { what: string; items: string[] }[];
  /** linhas @use para o styles.sass do projeto, quando o componente traz estilo global */
  globals: string[];
  summary: string;
}

export interface ComponentDoc {
  lead: string;
  why: string[];
  useWhen: string[];
  preferOther: string[];
  /** primeiro exemplo HTML de "Uso" (texto puro, mostrado como código) */
  example: string | null;
  api: ComponentDocTable[];
  a11y: string[];
  tokens: string[];
  copy: ComponentDocCopy | null;
  /** o .md no GitHub */
  source: string;
}

export interface ComponentDocs {
  pt: ComponentDoc;
  en: ComponentDoc;
}
