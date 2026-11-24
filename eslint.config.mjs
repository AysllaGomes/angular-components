// @ts-check
// Lint do projeto (npm run lint): TypeScript, templates Angular e acessibilidade nos
// templates. Roda no CI antes dos testes. Exceções pontuais ficam no próprio código,
// com o motivo (eslint-disable-next-line ... -- motivo).
import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import angular from 'angular-eslint';
import tseslint from 'typescript-eslint';
import globals from 'globals';

export default defineConfig([
  globalIgnores(['dist/', '.angular/', 'coverage/', 'test-results/', 'playwright-report/', 'src/app/site/component-docs.generated.ts']),

  {
    files: ['**/*.ts'],
    extends: [js.configs.recommended, tseslint.configs.recommended, tseslint.configs.stylistic, angular.configs.tsRecommended],
    processor: angular.processInlineTemplates,
    linterOptions: { reportUnusedDisableDirectives: 'error' },
    rules: {
      '@angular-eslint/component-selector': ['error', { type: 'element', prefix: 'app', style: 'kebab-case' }],
      '@angular-eslint/directive-selector': ['error', { type: 'attribute', prefix: 'app', style: 'camelCase' }],
      // padrão do projeto: `fooInput = input(..., { alias: 'foo' })` + `foo = computed(...)`, que cai
      // no texto de provideUiLabels quando a instância não passa nada
      '@angular-eslint/no-input-rename': 'off',
      // callbacks vazios do ControlValueAccessor (`onChange = () => {}`) até o forms registrar os seus
      '@typescript-eslint/no-empty-function': ['error', { allow: ['arrowFunctions'] }],
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },

  // a biblioteca (shared/) é toda OnPush; o site e as demos usam campos simples de propósito
  // (Eager), e os hosts de teste também
  {
    files: ['src/**/*.ts'],
    ignores: ['src/app/shared/**/*.ts'],
    rules: { '@angular-eslint/prefer-on-push-component-change-detection': 'off' },
  },
  {
    files: ['**/*.spec.ts', 'src/testing/**/*.ts'],
    rules: {
      '@angular-eslint/prefer-on-push-component-change-detection': 'off',
      // testes acessam internos e montam dados parciais
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },

  {
    files: ['**/*.html'],
    extends: [angular.configs.templateRecommended, angular.configs.templateAccessibility],
    linterOptions: { reportUnusedDisableDirectives: 'error' },
  },

  // scripts de build/CI (Node)
  {
    files: ['scripts/**/*.mjs', '*.mjs', '*.mts'],
    extends: [js.configs.recommended],
    languageOptions: { globals: globals.node },
    linterOptions: { reportUnusedDisableDirectives: 'error' },
  },
]);
