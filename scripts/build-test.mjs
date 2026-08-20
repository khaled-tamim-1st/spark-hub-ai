import { build } from '../node_modules/.pnpm/esbuild@0.27.3/node_modules/esbuild/lib/main.js';

async function buildAllTests() {
  await build({
    entryPoints: [
      'scripts/test-voice-e2e.ts',
      'scripts/test-voice-failures.ts',
      'scripts/load-test-voice.ts',
    ],
    outdir: 'scripts/dist',
    bundle: true,
    format: 'esm',
    platform: 'node',
    external: ['pg-native', '@whiskeysockets/baileys'],
    banner: {
      js: "import { createRequire as __cr } from 'node:module'; globalThis.require = __cr(import.meta.url);",
    },
  });
  console.log('All test suites bundled successfully.');
}

buildAllTests().catch(console.error);
