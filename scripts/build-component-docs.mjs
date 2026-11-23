// Páginas de componente (/componentes/:id): lê o .md de cada componente (PT e EN) e
// escreve os dados que a página mostra em src/app/site/component-docs.generated.ts.
// Fonte única: o texto mora no .md; a página nunca tem uma cópia escrita à mão.
//
//   npm run docs:pages    regenera o arquivo
//   npm run check:pages   falha se o arquivo não bater com os .md (roda no CI)
//
// O que é lido (por convenção de títulos, nos dois idiomas):
//   resumo         primeiro parágrafo depois do título
//   por que existe ## Por que existe / ## Why it exists
//   quando usar    ## Quando usar → ### Use quando + ### Prefira outro (e o inglês)
//   exemplo        primeiro bloco ```html de ## Uso / ## Usage (sem ele, da primeira seção de exemplos)
//   API            cada tabela debaixo de ## API ou ## API — <nome> (o ### dela vira o nome da aba;
//                  uma tabela direto no ## API — <nome> vira a aba <nome>)
//   acessibilidade os itens de toda seção com "Acessibilidade" / "Accessibility" no título
//   tema           as variáveis CSS citadas em seções de tema/tokens
//   o que copiar   a seção gerada por `npm run docs:copy`
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, posix, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const shared = join(root, 'src/app/shared');
const out = join(root, 'src/app/site/component-docs.generated.ts');
const repoBlob = 'https://github.com/AysllaGomes/angular-components/blob/main/src/app/shared';
const check = process.argv.includes('--check');

/** id no site → documento (sem extensão), relativo a src/app/shared */
const DOCS = {
  actionbar: 'components/actionbar/actionbar',
  button: 'components/button/button',
  checkbox: 'components/checkbox/checkbox',
  dialog: 'components/dialog/dialog',
  pagination: 'components/pagination/pagination',
  radio: 'components/radio/radio-group',
  select: 'components/select/select',
  stepper: 'components/stepper/stepper',
  switch: 'components/switch/switch',
  table: 'components/table/table',
  tabs: 'components/tabs/tabs',
  toast: 'components/toast/toast',
  tooltip: 'components/tooltip/tooltip',
  treeselect: 'components/tree-select/tree-select',
  validation: 'forms/forms',
};
const idByDoc = Object.fromEntries(Object.entries(DOCS).map(([id, doc]) => [doc, id]));

const T = {
  pt: { why: /^Por que existe$/, when: /^Quando usar$/, use: /^Use quando$/, other: /^Prefira outro$/, usage: /^Uso/, examples: /^Exemplo/, a11y: /acessibilidade/i, theme: /Tokens|Theming|Tema/ },
  en: { why: /^Why it exists$/, when: /^When to use$/, use: /^Use when$/, other: /^Prefer another$/, usage: /^(Basic )?[Uu]sage/, examples: /^(Full )?[Ee]xamples?\b/, a11y: /accessibility/i, theme: /Tokens|Theming|Theme/ },
};

// ---------- markdown simples → HTML (só o que os documentos usam), escapando o resto
const escapeHtml = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function linkTarget(href, docPath) {
  if (/^(https?:|mailto:)/.test(href)) return href;
  if (href.startsWith('#')) return null; // âncora do .md: não existe na página
  const [file] = href.split('#');
  const target = posix.normalize(posix.join(posix.dirname(docPath), file)).replace(/(\.en)?\.md$/, '');
  if (idByDoc[target]) return `/componentes/${idByDoc[target]}`;
  return `${repoBlob}/${posix.normalize(posix.join(posix.dirname(docPath), file))}`;
}

function inline(md, docPath) {
  const codes = [];
  let s = md.replace(/`([^`]+)`/g, (_, c) => `\u0000${codes.push(c) - 1}\u0000`);
  s = escapeHtml(s);
  s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, text, href) => {
    const to = linkTarget(href, docPath);
    return to ? `<a href="${escapeHtml(to)}">${text}</a>` : text;
  });
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/(^|[\s(])_([^_]+)_(?=[\s).,;:!?]|$)/g, '$1<em>$2</em>');
  return s.replace(/\u0000(\d+)\u0000/g, (_, i) => `<code>${escapeHtml(codes[i])}</code>`).trim();
}

// ---------- estrutura do documento
function sections(md) {
  // tira a seção gerada (lida à parte) e blocos de código, que podem ter "#" dentro
  const body = md.replace(/<!-- copy:start[\s\S]*?<!-- copy:end -->/, '');
  const lines = body.split('\n');
  const list = [];
  let h2 = null;
  let h3 = null;
  let inCode = false;
  for (const line of lines) {
    if (/^```/.test(line)) inCode = !inCode;
    if (!inCode && /^## /.test(line)) { h2 = { title: line.slice(3).trim(), lines: [], subs: [] }; h3 = null; list.push(h2); continue; }
    if (!inCode && /^### /.test(line) && h2) { h3 = { title: line.slice(4).trim(), lines: [] }; h2.subs.push(h3); continue; }
    (h3 ?? h2)?.lines.push(line);
  }
  return list;
}
const allLines = sec => [...sec.lines, ...sec.subs.flatMap(s => [`### ${s.title}`, ...s.lines])];

const paragraphs = lines => lines.join('\n').split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);
const bullets = lines => {
  const items = [];
  let inCode = false;
  for (const line of lines) {
    if (/^\s*```/.test(line)) { inCode = !inCode; continue; }
    if (inCode) continue;
    const m = line.match(/^- (.*)$/);
    if (m) items.push(m[1].trim());
    else if (items.length && /^\s{2,}\S/.test(line) && !line.trim().startsWith('```')) items[items.length - 1] += ' ' + line.trim();
  }
  return items;
};

/** todas as tabelas de um trecho (separadas por qualquer linha que não seja de tabela) */
function tablesFrom(lines) {
  const groups = [];
  let cur = [];
  for (const l of lines) {
    if (/^\|/.test(l.trim())) cur.push(l);
    else if (cur.length) { groups.push(cur); cur = []; }
  }
  if (cur.length) groups.push(cur);
  return groups.map(tableFrom).filter(Boolean);
}

function tableFrom(lines) {
  const rows = lines.filter(l => /^\|/.test(l.trim()));
  if (rows.length < 2) return null;
  const cells = l => l.trim().replace(/^\||\|$/g, '').split(/(?<!\\)\|/).map(c => c.trim().replace(/\\\|/g, '|'));
  const head = cells(rows[0]);
  const body = rows.slice(1).filter(r => !/^\|?\s*:?-{3,}/.test(r.trim())).map(cells);
  return { head, rows: body };
}

function lead(md, docPath) {
  const afterTitle = md.split(/^# .*$/m)[1] ?? '';
  const intro = afterTitle.split(/^## /m)[0];
  // pula citação, HTML, lista, código, tabela e régua; "**Single** choice…" é parágrafo
  const p = paragraphs(intro.split('\n')).find(x => !/^(>|<|- |\* |```|\||---)/.test(x));
  return p ? inline(p.replace(/\n/g, ' '), docPath) : '';
}

function copyBlock(md, docPath) {
  const m = md.match(/<!-- copy:start[^>]*-->([\s\S]*?)<!-- copy:end -->/);
  if (!m) return null;
  const block = m[1];
  const table = tableFrom(block.split('\n'));
  const globals = (block.match(/```sass\n([\s\S]*?)```/) ?? [])[1]?.trim().split('\n') ?? [];
  const summary = block.trim().split('\n').filter(Boolean).at(-1) ?? '';
  return {
    rows: (table?.rows ?? []).map(([what, items]) => ({ what, items: items.split(/<br>|,\s*(?=`)/).map(s => inline(s.trim(), docPath)) })),
    globals,
    summary: inline(summary, docPath),
  };
}

function parse(id, lang) {
  const docPath = `${DOCS[id]}${lang === 'en' ? '.en' : ''}.md`;
  const file = join(shared, docPath);
  if (!existsSync(file)) throw new Error('documento não encontrado: ' + docPath);
  const md = readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
  const t = T[lang];
  const secs = sections(md);
  const find = re => secs.find(s => re.test(s.title));

  const why = find(t.why);
  const when = find(t.when);
  const apis = secs.filter(s => /^API(\s|$)/.test(s.title));
  const a11y = secs.filter(s => t.a11y.test(s.title));
  const theme = [...secs.filter(s => t.theme.test(s.title)).map(allLines), ...secs.flatMap(s => s.subs.filter(x => t.theme.test(x.title)).map(x => x.lines))];

  const htmlOf = sec => (allLines(sec).join('\n').match(/```html\n([\s\S]*?)```/) ?? [])[1]?.trimEnd() ?? null;
  const example = [find(t.usage), find(t.examples)].filter(Boolean).map(htmlOf).find(Boolean) ?? null;
  const apiTables = apis.flatMap(api => {
    // "## API — `app-checkbox-mark`" com a tabela logo abaixo: a aba leva o nome dele
    const own = { title: api.title.replace(/^API\s*[—–:-]?\s*/, '') || 'API', lines: api.lines };
    return [own, ...api.subs].flatMap(s => tablesFrom(s.lines).map((table, i) => ({
      // uma seção com duas tabelas (ex.: inputs e eventos): a segunda vira outra aba
      title: inline(i === 0 ? s.title : `${s.title} · ${table.head[0]}`, docPath),
      head: table.head.map(h => inline(h, docPath)),
      rows: table.rows.map(r => r.map(c => inline(c, docPath))),
    })));
  });

  return {
    lead: lead(md, docPath),
    why: why ? paragraphs(why.lines).map(p => inline(p.replace(/\n/g, ' '), docPath)) : [],
    useWhen: bullets(when?.subs.find(s => t.use.test(s.title))?.lines ?? []).map(b => inline(b, docPath)),
    preferOther: bullets(when?.subs.find(s => t.other.test(s.title))?.lines ?? []).map(b => inline(b, docPath)),
    example,
    api: apiTables,
    a11y: a11y.flatMap(s => bullets(allLines(s))).map(b => inline(b, docPath)),
    tokens: [...new Set(theme.join('\n').match(/--[a-z][a-z0-9-]*/g) ?? [])],
    copy: copyBlock(md, docPath),
    source: `${repoBlob}/${docPath}`,
  };
}

const data = Object.fromEntries(Object.keys(DOCS).map(id => [id, { pt: parse(id, 'pt'), en: parse(id, 'en') }]));
const ready = Object.keys(data).filter(id => data[id].pt.why.length && data[id].en.why.length);

const file = `// GERADO por \`npm run docs:pages\` a partir dos .md de cada componente. Não edite à mão:
// mude o .md e rode o script (o CI confere com \`npm run check:pages\`).
import { ComponentDocs } from './component-docs.types';

/** componentes com página completa (têm "Por que existe" nos dois idiomas) */
export const COMPONENT_PAGES_READY: readonly string[] = ${JSON.stringify(ready)};

export const COMPONENT_DOCS: Record<string, ComponentDocs> = ${JSON.stringify(data, null, 2)};
`;

const current = existsSync(out) ? readFileSync(out, 'utf8').replace(/\r\n/g, '\n') : '';
if (check) {
  if (current !== file) {
    console.error('✗ src/app/site/component-docs.generated.ts não bate com os .md. Rode: npm run docs:pages');
    process.exit(1);
  }
  console.log(`✓ páginas de componente em dia (${Object.keys(data).length} documentos, ${ready.length} completos)`);
} else {
  if (current !== file) writeFileSync(out, file);
  console.log(`✓ ${relative(root, out).replace(/\\/g, '/')} (${Object.keys(data).length} componentes, completos: ${ready.join(', ') || 'nenhum'})`);
}
