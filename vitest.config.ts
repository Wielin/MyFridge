import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/**/*.test.ts', '{apps,packages}/*/src/**/*.test.ts'],
    // Type-aware linting in tests/tooling is slow on a cold start.
    testTimeout: 30_000,
  },
});
