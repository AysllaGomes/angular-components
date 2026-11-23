/** grupos do menu (as chaves nav.group.<grupo> têm os nomes) */
export type SiteGroup = 'forms' | 'data' | 'overlays' | 'navigation';
export const SITE_GROUPS: readonly SiteGroup[] = ['forms', 'data', 'overlays', 'navigation'];

/**
 * Os componentes do site, num lugar só: o catálogo da home e a página 404 usam esta
 * lista. `id` = id da <section> na demo (/demo#id) e das chaves `nav.<id>`;
 * `aliases` = como alguém poderia digitar o nome num endereço (PT e EN, sem acento).
 */
export interface SiteComponent {
  id: string;
  group: SiteGroup;
  aliases: readonly string[];
}

export const SITE_COMPONENTS: readonly SiteComponent[] = [
  { id: 'table', group: 'data', aliases: ['table', 'tabela', 'tabla', 'grid', 'datatable'] },
  { id: 'select', group: 'forms', aliases: ['select', 'selecao', 'seletor', 'dropdown', 'combo', 'combobox'] },
  { id: 'treeselect', group: 'forms', aliases: ['treeselect', 'tree', 'arvore'] },
  { id: 'tabs', group: 'navigation', aliases: ['tabs', 'tab', 'abas', 'aba'] },
  { id: 'dialog', group: 'overlays', aliases: ['dialog', 'dialogo', 'modal'] },
  { id: 'actionbar', group: 'overlays', aliases: ['actionbar', 'painel', 'drawer', 'sheet', 'sidesheet'] },
  { id: 'tooltip', group: 'overlays', aliases: ['tooltip', 'dica', 'hint'] },
  { id: 'toast', group: 'overlays', aliases: ['toast', 'notificacao', 'snackbar'] },
  { id: 'stepper', group: 'navigation', aliases: ['stepper', 'etapas', 'passos', 'steps', 'wizard'] },
  { id: 'pagination', group: 'data', aliases: ['pagination', 'paginacao', 'paginas', 'paginator'] },
  { id: 'checkbox', group: 'forms', aliases: ['checkbox', 'caixa', 'caixadeselecao'] },
  { id: 'radio', group: 'forms', aliases: ['radio', 'radiogroup', 'opcoes'] },
  { id: 'switch', group: 'forms', aliases: ['switch', 'toggle', 'chave'] },
  { id: 'button', group: 'navigation', aliases: ['button', 'botao', 'botoes', 'buttons'] },
  { id: 'validation', group: 'forms', aliases: ['validation', 'validacao', 'forms', 'formularios', 'formulario', 'mascara', 'mask'] },
];

/** minúsculas, sem acento e só letras/números ("Paginação" → "paginacao") */
export function normalizeText(s: string): string {
  return String(s ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '');
}

/** quantas trocas, inserções ou remoções separam duas palavras (Levenshtein) */
function editDistance(a: string, b: string): number {
  let prev = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    for (let j = 1; j <= b.length; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    prev = cur;
  }
  return prev[b.length];
}

/** segmentos do endereço que não dizem nada sobre o componente */
const IGNORED_SEGMENTS = new Set(['angularcomponents', 'demo', 'components', 'componentes', 'docs', 'index', 'indexhtml']);

/**
 * "Você quis dizer…": o componente que o endereço parece pedir, ou `null`.
 * Compara cada segmento com os apelidos, tolerando erros de digitação pequenos
 * (1 em nomes curtos, 2 nos maiores) — "/tabla", "/dialgo", "/abas".
 */
export function suggestComponent(path: string): SiteComponent | null {
  const segments = String(path ?? '')
    .split(/[/?#]/)
    .map(normalizeText)
    .filter(s => s.length >= 3 && !IGNORED_SEGMENTS.has(s));

  let best: { c: SiteComponent; d: number } | null = null;
  for (const seg of segments) {
    for (const c of SITE_COMPONENTS) {
      for (const alias of c.aliases) {
        const d = editDistance(seg, alias);
        const limit = alias.length <= 5 ? 1 : 2;
        if (d <= limit && (!best || d < best.d)) best = { c, d };
      }
    }
  }
  return best?.c ?? null;
}
