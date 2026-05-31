import js from '@eslint/js';
import ts from 'typescript-eslint';
import astroPlugin from 'eslint-plugin-astro';
import prettier from 'eslint-config-prettier';
import globals from 'globals';

export default ts.config(
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'build/**',
      'coverage/**',
      '.astro/**',
    ],
  },
  js.configs.recommended,
  ...ts.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: ts.parser,
      parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
      globals: { ...globals.browser, ...globals.node, ...globals.es2021 },
    },
  },
  {
    files: ['**/*.{js,mjs}'],
    languageOptions: {
      globals: { ...globals.node, ...globals.es2021 },
    },
  },
  {
    files: ['**/*.{test,spec}.{ts,tsx,js,mjs}', 'test/**/*.{ts,tsx,js,mjs}'],
    languageOptions: { globals: { ...globals.jest, ...globals.node } },
  },
  ...astroPlugin.configs['flat/recommended'],
  prettier,
);
