import { COMPONENT_DOCS, COMPONENT_PAGES_READY } from './component-docs.generated';
import { SITE_COMPONENTS } from './site-components';

/** dados das páginas de componente (gerados dos .md por `npm run docs:pages`) */
describe('component docs (generated)', () => {
  const ids = SITE_COMPONENTS.map(c => c.id);
  const all = Object.entries(COMPONENT_DOCS).flatMap(([id, d]) => [['pt', id, d.pt], ['en', id, d.en]] as const);
  const html = (doc: (typeof all)[number][2]) =>
    [doc.lead, ...doc.why, ...doc.useWhen, ...doc.preferOther, ...doc.a11y,
      ...doc.api.flatMap(t => [t.title, ...t.head, ...t.rows.flat()]),
      ...(doc.copy ? [doc.copy.summary, ...doc.copy.rows.flatMap(r => [r.what, ...r.items])] : [])];

  it('has every site component, and the pilots are complete', () => {
    expect(Object.keys(COMPONENT_DOCS).sort()).toEqual([...ids].sort());
    expect(COMPONENT_PAGES_READY).toEqual(expect.arrayContaining(['tabs', 'table', 'select']));
  });

  it('complete pages have every section in both languages', () => {
    for (const id of COMPONENT_PAGES_READY) {
      for (const doc of [COMPONENT_DOCS[id].pt, COMPONENT_DOCS[id].en]) {
        expect(doc.lead, id).toBeTruthy();
        expect(doc.why.length, id).toBeGreaterThan(0);
        expect(doc.useWhen.length, id).toBeGreaterThan(0);
        expect(doc.preferOther.length, id).toBeGreaterThan(0);
        expect(doc.example, id).toBeTruthy();
        expect(doc.api.length, id).toBeGreaterThan(0);
        expect(doc.a11y.length, id).toBeGreaterThan(0);
        expect(doc.copy, id).not.toBeNull();
      }
    }
  });

  it('API tables are well formed (every row has the header width)', () => {
    for (const [lang, id, doc] of all) {
      for (const t of doc.api) for (const r of t.rows) expect(r.length, `${id}/${lang} ${t.title}`).toBe(t.head.length);
    }
  });

  it('only safe markup comes out of the markdown, and internal links point to real pages', () => {
    for (const [lang, id, doc] of all) {
      for (const h of html(doc)) {
        const tags = [...h.matchAll(/<\/?([a-z]+)/g)].map(m => m[1]);
        expect(tags.filter(t => !['strong', 'em', 'code', 'a'].includes(t)), `${id}/${lang}: ${h}`).toEqual([]);
        for (const m of h.matchAll(/href="([^"]+)"/g)) {
          const href = m[1];
          // relativo ao <base href>: "/componentes/x" quebra no GitHub Pages (/angular-components/)
          if (href.startsWith('componentes/')) expect(ids, `${id}/${lang} → ${href}`).toContain(href.split('/')[1]);
          else expect(href, `${id}/${lang}`).toMatch(/^(https:\/\/|mailto:)/);
        }
      }
    }
  });
});
