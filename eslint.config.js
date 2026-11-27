// @ts-check
import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import svelte from 'eslint-plugin-svelte';
import tseslint from 'typescript-eslint';

export default defineConfig(
  {
    ignores: [
      '**/node_modules/',
      '**/dist/',
      '**/build/',
      '**/.svelte-kit/',
      '**/coverage/',
      'dokumenty/',
      // Intentionally broken samples, linted only by tests/tooling/lint-rules.test.ts.
      'tests/tooling/fixtures/',
    ],
  },

  js.configs.recommended,

  // TypeScript and JS: strict, type-aware rules (no-unsafe-*, no-floating-promises, ...).
  {
    files: ['**/*.{ts,mts,cts,js,mjs,cjs}'],
    extends: [tseslint.configs.strictTypeChecked],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // Explicit, so a preset change cannot silently drop the `any` ban.
      '@typescript-eslint/no-explicit-any': 'error',
    },
  },

  // Svelte components. Not type-aware yet: .svelte files are outside tsconfig
  // until apps/web exists.
  {
    files: ['**/*.svelte'],
    // strict (not type-checked) registers the @typescript-eslint plugin for <script lang="ts">;
    // svelte comes last so its parser wins for .svelte files.
    extends: [tseslint.configs.strict, svelte.configs.recommended],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
        extraFileExtensions: ['.svelte'],
      },
    },
    rules: {
      // XSS: {@html} is banned project-wide (SPEC, CLAUDE.md "Frontend").
      'svelte/no-at-html-tags': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
    },
  },
);
