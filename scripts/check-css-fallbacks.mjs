// Garante que os componentes funcionam copiados para outro projeto, sem o styles.sass:
// todo var(--x) nos estilos de src/app/shared/components precisa de valor padrão
// (var(--x, valor)), a não ser que a própria pasta do componente defina --x.
//
//   npm run check:css
//
// Falha (exit 1) listando arquivo:linha de cada uso sem padrão.
import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const componentsDir = join(root, 'src/app/shared/components');

const files = [];
(function walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) walk(p);
    else if (/\.(sass|scss|css|html)$/.test(entry.name) || (/\.ts$/.test(entry.name) && !entry.name.endsWith('.spec.ts'))) files.push(p);
  }
})(componentsDir);

// variáveis que cada pasta define: "--x:" no estilo, [style.--x] ou '--x' no template/código
const ownByFolder = new Map();
for (const f of files) {
  const own = ownByFolder.get(dirname(f)) ?? new Set();
  const src = readFileSync(f, 'utf8');
  for (const m of src.matchAll(/(--[a-z0-9-]+)\s*:/gi)) own.add(m[1]);
  for (const m of src.matchAll(/style\.(--[a-z0-9-]+)/gi)) own.add(m[1]);
  for (const m of src.matchAll(/['"](--[a-z0-9-]+)['"]/gi)) own.add(m[1]);
  ownByFolder.set(dirname(f), own);
}

const problems = [];
for (const f of files) {
  if (f.endsWith('.html')) continue;
  const src = readFileSync(f, 'utf8');
  if (f.endsWith('.ts') && !/styles\s*:\s*`/.test(src)) continue; // só estilos inline
  const own = ownByFolder.get(dirname(f));
  src.split(/\r?\n/).forEach((line, i) => {
    for (const m of line.matchAll(/var\(\s*(--[a-z0-9-]+)\s*\)/gi)) {
      if (!own.has(m[1])) problems.push(`${relative(root, f).replace(/\\/g, '/')}:${i + 1}  ${m[0]}`);
    }
  });
}

if (problems.length) {
  console.error(`✗ ${problems.length} uso(s) de variável CSS sem valor padrão (o componente quebraria fora deste projeto):\n`);
  for (const p of problems) console.error('  ' + p);
  console.error('\nUse var(--x, <valor do tema claro>), ou defina --x no :host do componente.');
  process.exit(1);
}
console.log(`✓ variáveis CSS dos componentes: todas com valor padrão (${files.length} arquivos)`);
