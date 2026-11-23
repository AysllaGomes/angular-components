// "O que copiar": para cada componente, segue os imports reais e escreve no .md dele
// (PT e EN) a lista do que levar para outro projeto. Nunca à mão: os imports mudam.
//
//   npm run docs:copy    reescreve as seções (entre <!-- copy:start --> e <!-- copy:end -->)
//   npm run check:copy   falha se alguma seção estiver desatualizada (roda no CI)
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const shared = join(root, 'src/app/shared');
const check = process.argv.includes('--check');

/** documento → arquivos de entrada (o que quem usa importa) */
const DOCS = [
  { doc: 'components/actionbar/actionbar', name: { pt: 'o ActionBar', en: 'the ActionBar' }, entries: ['components/actionbar/actionbar.component.ts'] },
  { doc: 'components/button/button', name: { pt: 'o Button', en: 'the Button' }, entries: ['components/button/button.directive.ts'] },
  { doc: 'components/checkbox/checkbox', name: { pt: 'o Checkbox', en: 'the Checkbox' }, entries: ['components/checkbox/checkbox.component.ts'] },
  { doc: 'components/dialog/dialog', name: { pt: 'o Dialog', en: 'the Dialog' }, entries: ['components/dialog/dialog.component.ts'] },
  { doc: 'components/pagination/pagination', name: { pt: 'a Paginação', en: 'the Pagination' }, entries: ['components/pagination/pagination.component.ts'] },
  { doc: 'components/radio/radio-group', name: { pt: 'o Radio group', en: 'the Radio group' }, entries: ['components/radio/radio-group.component.ts'] },
  { doc: 'components/select/select', name: { pt: 'o Select', en: 'the Select' }, entries: ['components/select/select.component.ts'] },
  { doc: 'components/stepper/stepper', name: { pt: 'o Stepper', en: 'the Stepper' }, entries: ['components/stepper/stepper.component.ts'] },
  { doc: 'components/switch/switch', name: { pt: 'o Switch', en: 'the Switch' }, entries: ['components/switch/switch.component.ts'] },
  { doc: 'components/table/table', name: { pt: 'a Tabela', en: 'the Table' }, entries: ['components/table/table.component.ts'] },
  { doc: 'components/tabs/tabs', name: { pt: 'as Tabs', en: 'the Tabs' }, entries: ['components/tabs/index.ts'] },
  { doc: 'components/toast/toast', name: { pt: 'o Toast', en: 'the Toast' }, entries: ['components/toast/toast-container.component.ts', 'services/toast.service.ts'] },
  { doc: 'components/tooltip/tooltip', name: { pt: 'o Tooltip', en: 'the Tooltip' }, entries: ['components/tooltip/tooltip.directive.ts'] },
  { doc: 'components/tree-select/tree-select', name: { pt: 'o TreeSelect', en: 'the TreeSelect' }, entries: ['components/tree-select/tree-select.component.ts'] },
  { doc: 'forms/forms', name: { pt: 'os Formulários', en: 'the Forms helpers' }, entries: ['forms/index.ts', 'components/form-field/form-field.component.ts'] },
];

const read = f => readFileSync(f, 'utf8');
const rel = f => relative(shared, f).replace(/\\/g, '/');
const lineCount = f => read(f).split(/\r?\n/).length;

function resolveImport(from, spec) {
  if (!spec.startsWith('.')) return null;
  const base = resolve(dirname(from), spec);
  for (const c of [base + '.ts', join(base, 'index.ts')]) if (existsSync(c)) return c;
  return null;
}

/** arquivos alcançados pelos imports locais (+ templateUrl/styleUrl e @use de Sass) e pacotes externos */
function closure(entries) {
  const seen = new Set();
  const external = new Set();
  const stack = entries.map(e => join(shared, e));
  while (stack.length) {
    const f = stack.pop();
    if (seen.has(f) || !existsSync(f)) continue;
    seen.add(f);
    const src = read(f);
    if (f.endsWith('.ts')) {
      for (const m of src.matchAll(/from\s+'([^']+)'/g)) {
        const r = resolveImport(f, m[1]);
        if (r) stack.push(r);
        else if (!m[1].startsWith('.')) external.add(m[1].split('/').slice(0, m[1].startsWith('@') ? 2 : 1).join('/'));
      }
      for (const m of src.matchAll(/(?:templateUrl|styleUrl)\s*:\s*'([^']+)'/g)) stack.push(resolve(dirname(f), m[1]));
    }
  }
  return { files: [...seen], external: [...external].sort() };
}

/** componentes cujo estilo entra pelo styles.sass global (@use './app/shared/components/<x>/...') */
const globalUses = [...read(join(root, 'src/styles.sass')).matchAll(/@use\s+'\.\/app\/shared\/(components\/[^/]+)\/([^']+)'(.*)$/gm)]
  .map(m => ({ folder: m[1], path: `shared/${m[1]}/${m[2]}`, rest: m[3].trimEnd() }));

const folderOf = r => (r.startsWith('components/') ? r.split('/').slice(0, 2).join('/') : null);
const folderFiles = folder => readdirSync(join(shared, folder)).filter(n => !n.endsWith('.spec.ts') && !n.endsWith('.md')).map(n => join(shared, folder, n));

function manifest(def) {
  const { files, external } = closure(def.entries);
  const rels = files.map(rel);
  // pastas "do componente"; um serviço de entrada (Toast) vai na linha "Serviço"
  const mainFolders = new Set(def.entries.filter(e => !e.startsWith('services/')).map(e => folderOf(e) ?? e.split('/')[0]));
  const compFolders = [...new Set(rels.map(folderOf).filter(Boolean))].filter(f => !mainFolders.has(f)).sort();
  const other = rels.filter(r => !folderOf(r) && !def.entries.some(e => e.split('/')[0] === r.split('/')[0] && e.split('/')[0] !== 'services'));
  const types = other.filter(r => r.startsWith('model/')).sort();
  const labels = other.filter(r => r.startsWith('labels/')).length ? ['labels/'] : [];
  const services = other.filter(r => r.startsWith('services/')).sort();

  // arquivos que de fato vão: pastas inteiras dos componentes (sem specs/md) + avulsos
  const copied = new Set();
  for (const folder of [...mainFolders, ...compFolders]) {
    if (folder.startsWith('components/')) folderFiles(folder).forEach(f => copied.add(f));
  }
  for (const f of files) if (!folderOf(rel(f))) copied.add(f);
  if (labels.length) folderFiles('labels').filter(f => f.endsWith('.ts')).forEach(f => copied.add(f));
  const total = copied.size;
  const lines = [...copied].reduce((n, f) => n + lineCount(f), 0);

  const globals = globalUses.filter(g => mainFolders.has(g.folder) || compFolders.includes(g.folder));
  return { mainFolders: [...mainFolders], compFolders, types, labels, services, external, total, lines, globals };
}

const T = {
  pt: {
    title: '## O que copiar',
    intro: n => `Para usar ${n} em outro projeto Angular, copie para dentro de uma pasta \`shared/\` **mantendo a mesma estrutura de pastas** (os imports são relativos). Specs (\`*.spec.ts\`) e documentação são opcionais.`,
    head: '| O quê | Copiar |',
    main: 'O componente', comps: 'Componentes que ele usa', types: 'Tipos', labels: 'Textos padrão', services: 'Serviço',
    labelsNote: '([Textos dos componentes](LABELS))',
    globals: 'Estilos globais: acrescente no `styles.sass` (ou `styles.scss`) do seu projeto:',
    folder: '<sua-pasta>',
    deps: (ext, total, lines) => `Depende só de ${ext}. Ao todo: ${total} arquivos, ~${lines} linhas. As variáveis CSS têm valor padrão: o visual funciona sem o tema deste projeto, que continua podendo sobrescrevê-las.`,
    gen: '<!-- copy:start · gerado por `npm run docs:copy` a partir dos imports; não edite à mão -->',
  },
  en: {
    title: '## What to copy',
    intro: n => `To use ${n} in another Angular project, copy into a \`shared/\` folder **keeping the same folder structure** (imports are relative). Specs (\`*.spec.ts\`) and docs are optional.`,
    head: '| What | Copy |',
    main: 'The component', comps: 'Components it uses', types: 'Types', labels: 'Default texts', services: 'Service',
    labelsNote: '([Component texts](LABELS))',
    globals: 'Global styles: add to your project\'s `styles.sass` (or `styles.scss`):',
    folder: '<your-folder>',
    deps: (ext, total, lines) => `Depends only on ${ext}. In total: ${total} files, ~${lines} lines. CSS variables have defaults: the look works without this project\'s theme, which can still override them.`,
    gen: '<!-- copy:start · generated by `npm run docs:copy` from the imports; do not edit by hand -->',
  },
};

function section(def, m, lang, docPath) {
  const t = T[lang];
  const code = s => `\`${s}\``;
  const labelsLink = relative(dirname(join(shared, docPath)), join(shared, `labels/labels${lang === 'en' ? '.en' : ''}.md`)).replace(/\\/g, '/');
  const rows = [
    [t.main, m.mainFolders.map(f => code(f + '/')).join(', ')],
    m.compFolders.length && [t.comps, m.compFolders.map(f => code(f + '/')).join(', ')],
    m.types.length && [t.types, m.types.map(code).join('<br>')],
    m.labels.length && [t.labels, `${code('labels/')} ${t.labelsNote.replace('LABELS', labelsLink)}`],
    m.services.length && [t.services, m.services.map(code).join(', ')],
  ].filter(Boolean);
  const out = [
    t.gen, t.title, '', t.intro(def.name[lang]), '', t.head, '|---|---|',
    ...rows.map(([a, b]) => `| ${a} | ${b} |`), '',
  ];
  if (m.globals.length) out.push(t.globals, '', '```sass', ...m.globals.map(g => `@use '${t.folder}/${g.path}'${g.rest}`), '```', '');
  out.push(t.deps(m.external.map(code).join(', '), m.total, m.lines), '<!-- copy:end -->');
  return out.join('\n');
}

const START = /<!-- copy:start[^>]*-->[\s\S]*?<!-- copy:end -->/;
let stale = [];
for (const def of DOCS) {
  const m = manifest(def);
  for (const lang of ['pt', 'en']) {
    const docPath = `${def.doc}${lang === 'en' ? '.en' : ''}.md`;
    const file = join(shared, docPath);
    const src = read(file);
    const nl = src.includes('\r\n') ? '\r\n' : '\n';
    const block = section(def, m, lang, docPath).replace(/\n/g, nl);
    let next;
    if (START.test(src)) next = src.replace(START, block);
    else {
      // primeira vez: antes do primeiro "## " (depois da introdução)
      const i = src.search(/^## /m);
      next = i < 0 ? src + nl + block + nl : src.slice(0, i) + block + nl + nl + src.slice(i);
    }
    if (next !== src) {
      stale.push(docPath);
      if (!check) writeFileSync(file, next);
    }
  }
}

if (check) {
  if (stale.length) {
    console.error(`✗ "O que copiar" desatualizado em ${stale.length} documento(s) (os imports mudaram):\n` + stale.map(s => '  ' + s).join('\n') + '\n\nRode: npm run docs:copy');
    process.exit(1);
  }
  console.log(`✓ "O que copiar" em dia (${DOCS.length * 2} documentos)`);
} else {
  console.log(stale.length ? `✓ ${stale.length} documento(s) atualizados` : '✓ nada a atualizar');
}
