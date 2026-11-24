// Links internos do site publicado: lê o HTML pré-renderizado do build e resolve cada
// href como o navegador faria (a partir do <base href>, "/angular-components/" no
// GitHub Pages). Falha se um link sair do site ou apontar para uma página que não
// existe, ou para uma âncora (#id) que não está na página de destino.
//
//   npm run build && npm run check:links
//
// Pega o que os testes unitários não veem: um href="/componentes/x" (que ignora o base
// href) ou um routerLink para uma rota inexistente.
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist/angular-components/browser');
const ORIGIN = 'https://site.invalid';

if (!existsSync(join(dist, 'index.html'))) {
  console.error('✗ build não encontrado em dist/angular-components/browser: rode `npm run build` antes.');
  process.exit(1);
}

const pages = [];
(function walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) walk(p);
    // index.csr.html é a casca sem conteúdo (vira o 404.html no deploy)
    else if (entry.name.endsWith('.html') && entry.name !== 'index.csr.html') pages.push(p);
  }
})(dist);

const rel = p => relative(dist, p).replace(/\\/g, '/');
const attr = (tag, name) => tag.match(new RegExp(`\\s${name}="([^"]*)"`))?.[1];
const unescape = s => s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'");

// ids de cada página, lidos sob demanda
const idsCache = new Map();
function idsOf(file) {
  if (!idsCache.has(file)) {
    const html = readFileSync(file, 'utf8');
    idsCache.set(file, new Set([...html.matchAll(/\sid="([^"]+)"/g)].map(m => unescape(m[1]))));
  }
  return idsCache.get(file);
}

/** caminho (sem o base) → arquivo publicado, como o GitHub Pages serve */
function fileFor(path) {
  const clean = decodeURIComponent(path).replace(/\/+$/, '');
  // rota: pasta com index.html (pré-renderizada); arquivo: com extensão (ex.: a11y-report.json)
  const page = join(dist, clean, 'index.html');
  if (existsSync(page)) return page;
  const file = join(dist, clean);
  return /\.[a-z0-9]+$/i.test(clean) && existsSync(file) ? file : null;
}

const problems = [];
let checked = 0;
for (const page of pages) {
  const html = readFileSync(page, 'utf8');
  const baseHref = html.match(/<base\s+href="([^"]*)"/)?.[1] ?? '/';
  const base = new URL(baseHref, ORIGIN);

  for (const m of html.matchAll(/<a\s[^>]*>/g)) {
    const raw = attr(m[0], 'href');
    if (raw === undefined || raw === '') continue;
    const href = unescape(raw);
    if (/^(https?:|mailto:|tel:|javascript:)/i.test(href)) continue;
    checked++;

    const url = new URL(href, base);
    const where = `${rel(page)} → ${href}`;
    if (url.origin !== ORIGIN || !url.pathname.startsWith(base.pathname)) {
      problems.push(`${where}  (sai do site: vira ${url.pathname}; use um link relativo ao base href "${baseHref}")`);
      continue;
    }

    const target = fileFor(url.pathname.slice(base.pathname.length));
    if (!target) {
      problems.push(`${where}  (página não existe: ${url.pathname})`);
      continue;
    }
    const id = decodeURIComponent(url.hash.slice(1));
    if (id && target.endsWith('.html') && !idsOf(target).has(id)) {
      problems.push(`${where}  (âncora #${id} não existe em ${rel(target)})`);
    }
  }
}

if (problems.length) {
  console.error(`✗ ${problems.length} link(s) interno(s) quebrado(s) no site publicado:\n`);
  for (const p of problems) console.error('  ' + p);
  process.exit(1);
}
console.log(`✓ links internos do site: ${checked} links em ${pages.length} páginas, todos resolvem`);
