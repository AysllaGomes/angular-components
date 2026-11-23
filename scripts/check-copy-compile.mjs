// Garante que a seção "O que copiar" de cada documento basta: copia só o que ela lista
// para uma pasta vazia e compila (TypeScript estrito, sem o resto do projeto).
// Também confere se cada templateUrl/styleUrl(s) aponta para um arquivo copiado.
//
//   npm run check:copy-compile
//
// Lê os documentos em português (a lista em inglês é a mesma; `check:copy` garante isso).
// Falha (exit 1) listando, por documento, os erros de compilação e os arquivos faltando.
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const shared = join(root, 'src/app/shared');
const nodeModules = join(root, 'node_modules').replace(/\\/g, '/');

/** documentos com lista gerada (os .en.md têm a mesma lista) */
const docs = [];
(function walk(dir) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith('.md') && !e.name.endsWith('.en.md') && readFileSync(p, 'utf8').includes('<!-- copy:start')) docs.push(p);
  }
})(shared);

/** caminhos entre crases nas linhas da tabela "O que copiar" (pastas terminam em /) */
function listedPaths(doc) {
  const block = readFileSync(doc, 'utf8').match(/<!-- copy:start[\s\S]*?<!-- copy:end -->/)[0];
  return block.split(/\r?\n/)
    .filter(l => l.startsWith('| ') && !l.startsWith('| O quê') && !l.startsWith('|---'))
    .flatMap(l => [...l.split('|')[2].matchAll(/`([^`]+)`/g)].map(m => m[1]));
}

/** copia como quem usa a lista: pastas sem specs nem docs; arquivos avulsos como estão */
function copyListed(paths, dest) {
  for (const p of paths) {
    const from = join(shared, p);
    if (!existsSync(from)) throw new Error(`a lista cita ${p}, que não existe`);
    if (p.endsWith('/')) {
      mkdirSync(join(dest, p), { recursive: true });
      for (const n of readdirSync(from)) {
        if (n.endsWith('.spec.ts') || n.endsWith('.md') || !statSync(join(from, n)).isFile()) continue;
        cpSync(join(from, n), join(dest, p, n));
      }
    } else {
      mkdirSync(dirname(join(dest, p)), { recursive: true });
      cpSync(from, join(dest, p));
    }
  }
}

const options = {
  strict: true,
  noEmit: true,
  target: ts.ScriptTarget.ES2022,
  module: ts.ModuleKind.ES2022,
  moduleResolution: ts.ModuleResolutionKind.Bundler,
  skipLibCheck: true,
  lib: ['lib.es2022.d.ts', 'lib.dom.d.ts'],
  types: [],
  paths: {
    '@angular/*': [`${nodeModules}/@angular/*`],
    'rxjs': [`${nodeModules}/rxjs`],
    'rxjs/*': [`${nodeModules}/rxjs/*`],
    'tslib': [`${nodeModules}/tslib`],
  },
};

// as declarações do Angular/lib são as mesmas para todos: lidas uma vez só
const cache = new Map();
const baseHost = ts.createCompilerHost(options);
const host = {
  ...baseHost,
  getSourceFile(file, lang, onError, fresh) {
    const shareable = file.includes('/node_modules/') || file.includes('\\node_modules\\');
    if (shareable && cache.has(file)) return cache.get(file);
    const sf = baseHost.getSourceFile(file, lang, onError, fresh);
    if (shareable && sf) cache.set(file, sf);
    return sf;
  },
};

const tsFiles = dir => {
  const out = [];
  (function walk(d) {
    for (const e of readdirSync(d, { withFileTypes: true })) {
      const p = join(d, e.name);
      if (e.isDirectory()) walk(p); else if (p.endsWith('.ts')) out.push(p);
    }
  })(dir);
  return out;
};

const work = mkdtempSync(join(tmpdir(), 'copy-compile-'));
const failures = [];
try {
  for (const doc of docs) {
    const name = relative(shared, doc).replace(/\\/g, '/');
    const dest = join(work, name.replace(/[/.]/g, '_'), 'shared');
    const problems = [];
    let files = [];
    try {
      copyListed(listedPaths(doc), dest);
      files = tsFiles(dest);
    } catch (e) {
      problems.push(e.message);
    }

    // templateUrl / styleUrl / styleUrls apontam para arquivos que vieram junto
    for (const f of files) {
      const src = readFileSync(f, 'utf8');
      const refs = [
        ...[...src.matchAll(/(?:templateUrl|styleUrl)\s*:\s*'([^']+)'/g)].map(m => m[1]),
        ...[...src.matchAll(/styleUrls\s*:\s*\[([^\]]*)\]/g)].flatMap(m => [...m[1].matchAll(/'([^']+)'/g)].map(x => x[1])),
      ];
      for (const r of refs) {
        if (!existsSync(resolve(dirname(f), r))) problems.push(`${relative(dest, f).replace(/\\/g, '/')}: falta ${r}`);
      }
    }

    if (files.length) {
      const program = ts.createProgram(files, options, host);
      for (const d of ts.getPreEmitDiagnostics(program)) {
        const msg = ts.flattenDiagnosticMessageText(d.messageText, '\n');
        if (d.file) {
          const { line } = d.file.getLineAndCharacterOfPosition(d.start ?? 0);
          problems.push(`${relative(dest, d.file.fileName).replace(/\\/g, '/')}:${line + 1} ${msg}`);
        } else {
          problems.push(msg);
        }
      }
    }

    if (problems.length) failures.push({ name, problems });
    else console.log(`  ✓ ${name} (${files.length} arquivos .ts)`);
  }
} finally {
  rmSync(work, { recursive: true, force: true });
}

if (failures.length) {
  console.error(`\n✗ "O que copiar" não basta em ${failures.length} documento(s):`);
  for (const { name, problems } of failures) {
    console.error(`\n  ${name}`);
    for (const p of problems) console.error(`    ${p}`);
  }
  console.error('\nAjuste os imports ou o scripts/copy-manifest.mjs e rode `npm run docs:copy`.');
  process.exit(1);
}
console.log(`✓ "O que copiar" compila sozinho (${docs.length} documentos)`);
