// Guards the security-relevant lint rules from PLAN F0.1 (B-7 tooling, XSS ban on {@html}).
// If someone weakens eslint.config.js, these tests fail.
import { fileURLToPath } from 'node:url';
import { ESLint } from 'eslint';
import { describe, expect, it } from 'vitest';

const repoRoot = fileURLToPath(new URL('../..', import.meta.url));
const fixture = (name: string): string =>
  fileURLToPath(new URL(`./fixtures/${name}`, import.meta.url));

// Fixtures are excluded from `pnpm lint`; `ignore: false` lints them anyway.
const eslint = new ESLint({ cwd: repoRoot, ignore: false });

async function lint(name: string): Promise<ESLint.LintResult> {
  const [result] = await eslint.lintFiles([fixture(name)]);
  if (result === undefined) {
    throw new Error(`ESLint returned no result for ${name}`);
  }
  return result;
}

function ruleIds(result: ESLint.LintResult): (string | null)[] {
  return result.messages.map((message) => message.ruleId);
}

describe('eslint security rules', () => {
  it('rejects {@html} in Svelte components', async () => {
    const result = await lint('at-html.svelte');
    expect(ruleIds(result)).toContain('svelte/no-at-html-tags');
    expect(result.errorCount).toBeGreaterThan(0);
  });

  it('rejects explicit any in TypeScript', async () => {
    const result = await lint('explicit-any.ts');
    expect(ruleIds(result)).toContain('@typescript-eslint/no-explicit-any');
    expect(result.errorCount).toBeGreaterThan(0);
  });

  it.each(['clean.ts', 'clean.svelte'])('accepts clean file %s', async (name) => {
    const result = await lint(name);
    expect(result.fatalErrorCount).toBe(0);
    expect(result.messages).toEqual([]);
  });
});
