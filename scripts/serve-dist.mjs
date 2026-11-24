// Serve o build (dist/angular-components/browser) como o GitHub Pages: tudo sob
// /angular-components/, pasta → index.html (sem barra no fim: redireciona), arquivo
// desconhecido → 404 com a casca do app (404.html, ou index.csr.html antes do deploy);
// fora de /angular-components/ → 404 sem o app, como o do próprio GitHub.
// Usado pelos testes de navegador (npm run e2e); sem dependências.
//
//   npm run build && node scripts/serve-dist.mjs   →  http://localhost:4321/angular-components/
import { createServer } from 'node:http';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { dirname, extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist/angular-components/browser');
const BASE = '/angular-components/';
const PORT = Number(process.env.PORT ?? 4321);

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.mjs': 'text/javascript',
  '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png',
  '.ico': 'image/x-icon', '.webp': 'image/webp', '.woff2': 'font/woff2', '.txt': 'text/plain',
};

if (!existsSync(join(dist, 'index.html'))) {
  console.error('✗ build não encontrado em dist/angular-components/browser: rode `npm run build` antes.');
  process.exit(1);
}

const isFile = p => existsSync(p) && statSync(p).isFile();
const send = (res, status, file) => {
  res.writeHead(status, { 'content-type': TYPES[extname(file)] ?? 'application/octet-stream' });
  res.end(readFileSync(file));
};
const notFound = res => {
  const shell = [join(dist, '404.html'), join(dist, 'index.csr.html'), join(dist, 'index.html')].find(isFile);
  send(res, 404, shell);
};

createServer((req, res) => {
  const path = decodeURIComponent(new URL(req.url ?? '/', 'http://x').pathname);
  if (path === BASE.slice(0, -1)) { res.writeHead(301, { location: BASE }); return res.end(); }
  // fora do projeto o 404.html dele não vale: no GitHub Pages quem responde é o 404 do
  // próprio GitHub, sem o app (um link que ignora o base href cai aqui)
  if (!path.startsWith(BASE)) {
    res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
    return res.end(`404: ${path} está fora do site (${BASE})`);
  }

  const rel = normalize(path.slice(BASE.length)).replace(/^([/\\])+/, '');
  if (rel.startsWith('..')) return notFound(res);
  const target = join(dist, rel);

  if (isFile(target)) return send(res, 200, target);
  if (isFile(join(target, 'index.html'))) {
    if (!path.endsWith('/')) { res.writeHead(301, { location: path + '/' }); return res.end(); }
    return send(res, 200, join(target, 'index.html'));
  }
  notFound(res);
}).listen(PORT, () => console.log(`servindo ${dist} em http://localhost:${PORT}${BASE}`));
