// Garante que a documentação cobre a API pública: todo input, model e output de um
// componente/diretiva público aparece (entre crases) no .md em português e em inglês.
//
//   npm run check:api
//
// Público = o doc cita o seletor (ex.: `app-table`, `appTooltip`). Componentes internos
// (rodapé e chip da Tabela...) não aparecem nos docs e ficam de fora sozinhos.
// O nome cobrado é o que quem usa escreve: o `alias`, quando existe.
// Falha (exit 1) listando componente, doc e cada nome que falta.
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const shared = join(root, 'src/app/shared');

const files = [];
(function walk(dir) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else files.push(p);
  }
})(shared);

const ptDocs = files.filter(f => f.endsWith('.md') && !f.endsWith('.en.md'));
const enOf = pt => pt.replace(/\.md$/, '.en.md');
const text = new Map(files.filter(f => f.endsWith('.md')).map(f => [f, readFileSync(f, 'utf8')]));

/** classes com @Component/@Directive: seletor + nomes públicos (input, model, output) */
function apiOf(file) {
  const sf = ts.createSourceFile(file, readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true);
  const out = [];
  sf.forEachChild(node => {
    if (!ts.isClassDeclaration(node) || !node.name) return;
    const deco = ts.getDecorators(node)?.find(d =>
      ts.isCallExpression(d.expression) && ['Component', 'Directive'].includes(d.expression.expression.getText()));
    if (!deco) return;
    const meta = deco.expression.arguments[0];
    const sel = meta && ts.isObjectLiteralExpression(meta)
      && meta.properties.find(p => ts.isPropertyAssignment(p) && p.name.getText() === 'selector');
    if (!sel || !ts.isStringLiteralLike(sel.initializer)) return;

    const names = [];
    for (const m of node.members) {
      if (!ts.isPropertyDeclaration(m) || !m.initializer || !ts.isCallExpression(m.initializer)) continue;
      const callee = m.initializer.expression.getText();       // input, input.required, model, output...
      const kind = callee.split('.')[0];
      if (!['input', 'model', 'output'].includes(kind)) continue;
      const opts = m.initializer.arguments.find(a => ts.isObjectLiteralExpression(a));
      const alias = opts?.properties.find(p => ts.isPropertyAssignment(p) && p.name.getText() === 'alias');
      const name = alias && ts.isStringLiteralLike(alias.initializer) ? alias.initializer.text : m.name.getText();
      names.push({ name, kind });
    }
    out.push({ cls: node.name.text, selector: sel.initializer.text, names });
  });
  return out;
}

/** como o seletor aparece num doc: `app-x` (elemento) ou `appX` (atributo) */
const selectorTokens = sel => [...new Set([
  ...[...sel.matchAll(/(?:^|[\s,])(app-[a-z-]+)/g)].map(m => m[1]),
  ...[...sel.matchAll(/\[(app[A-Za-z]+)\]/g)].map(m => m[1]),
])];
const mentions = (doc, tok) => new RegExp(`(^|[^A-Za-z0-9-])${tok}([^A-Za-z0-9-]|$)`).test(text.get(doc));

/** seletores que os docs citam só para dizer que são internos (ninguém os usa direto) */
const INTERNAL = new Map([
  ['app-table-chip', 'chip da Tabela: o doc explica as classes chip--<variante>; quem usa passa chipMap na coluna'],
]);

const problems = [];
let checked = 0;
for (const file of files.filter(f => f.endsWith('.ts') && !f.endsWith('.spec.ts'))) {
  for (const c of apiOf(file)) {
    const toks = selectorTokens(c.selector);
    if (!toks.length || !c.names.length || toks.some(t => INTERNAL.has(t))) continue;
    // o doc da própria pasta; sem doc na pasta, qualquer doc que cite o seletor
    const local = ptDocs.filter(d => dirname(d) === dirname(file));
    const docs = (local.length ? local : ptDocs).filter(d => toks.some(t => mentions(d, t)));
    if (!docs.length) continue; // interno: nenhum doc cita o seletor
    checked++;
    for (const pt of docs) {
      for (const doc of [pt, enOf(pt)]) {
        if (!existsSync(doc)) { problems.push(`${rel(doc)}: não existe (par de ${rel(pt)})`); continue; }
        const missing = c.names.filter(n => !text.get(doc).includes('`' + n.name + '`')
          && !text.get(doc).includes('`[' + n.name + ']') && !text.get(doc).includes('`(' + n.name + ')'));
        if (missing.length) {
          problems.push(`${rel(doc)} — ${c.cls} (${c.selector}): ${missing.map(n => `${n.name} (${n.kind})`).join(', ')}`);
        }
      }
    }
  }
}

function rel(f) { return relative(root, f).replace(/\\/g, '/'); }

if (problems.length) {
  console.error(`✗ API pública sem documentação:\n`);
  for (const p of problems) console.error(`  ${p}`);
  console.error('\nDocumente cada nome (entre crases, de preferência na tabela de API) nos dois idiomas.');
  process.exit(1);
}
console.log(`✓ API pública documentada (${checked} componentes/diretivas, PT e EN)`);
