import { defineConfig } from 'vitest/config';

/**
 * `npm run test:shuffle`: roda a suíte com os arquivos em ordem aleatória, um de
 * cada vez, como pode acontecer no CI (lá não há o cache que o Vitest usa para
 * ordenar). Os testes compartilham o ambiente (isolate: false), então um spec que
 * deixa algo para trás (timers falsos, listeners, elementos no <body>) só quebra
 * outro em certas ordens.
 *
 * Cada execução usa uma semente nova e a mostra no início. Para repetir uma ordem
 * que falhou: SEED=1234 npm run test:shuffle
 */
const seed = Number(process.env['SEED']) || Math.floor(Math.random() * 1_000_000);
console.log(`\n[test:shuffle] semente ${seed} (repita com SEED=${seed} npm run test:shuffle)\n`);

export default defineConfig({
  test: {
    maxWorkers: 1,
    fileParallelism: false,
    sequence: { shuffle: { files: true, tests: false }, seed },
  },
});
