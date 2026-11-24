import { SITE_COMPONENTS, normalizeText, suggestComponent } from './site-components';

describe('site components', () => {
  it('normalizes names for comparison (case, accents, punctuation)', () => {
    expect(normalizeText('Paginação')).toBe('paginacao');
    expect(normalizeText('Tree-Select')).toBe('treeselect');
  });

  it('lists the 17 components, ids unique', () => {
    expect(SITE_COMPONENTS.length).toBe(17);
    expect(new Set(SITE_COMPONENTS.map(c => c.id)).size).toBe(17);
  });

  it('suggests by name in English or Portuguese', () => {
    expect(suggestComponent('/angular-components/table')?.id).toBe('table');
    expect(suggestComponent('/angular-components/tabela')?.id).toBe('table');
    expect(suggestComponent('/abas')?.id).toBe('tabs');
    expect(suggestComponent('/modal')?.id).toBe('dialog');
    expect(suggestComponent('/paginação')?.id).toBe('pagination');
  });

  it('tolerates small typos', () => {
    expect(suggestComponent('/tabla')?.id).toBe('table');
    expect(suggestComponent('/dialgo')?.id).toBe('dialog');
    expect(suggestComponent('/tooltp')?.id).toBe('tooltip');
  });

  it('ignores the site prefix, the demo segment and very short segments', () => {
    expect(suggestComponent('/angular-components/demo/select')?.id).toBe('select');
    expect(suggestComponent('/angular-components/')).toBeNull();
    expect(suggestComponent('/ab')).toBeNull();
  });

  it('suggests nothing for unrelated addresses', () => {
    expect(suggestComponent('/xyz')).toBeNull();
    expect(suggestComponent('/precos')).toBeNull();
    expect(suggestComponent('/contato/123')).toBeNull();
  });
});
