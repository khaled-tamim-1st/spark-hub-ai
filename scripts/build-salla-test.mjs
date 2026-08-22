import { build } from '../node_modules/.pnpm/esbuild@0.27.3/node_modules/esbuild/lib/main.js';

async function buildTest() {
  await build({
    entryPoints: ['scripts/test-salla-shipping.ts'],
    outfile: 'scripts/run-salla-test.mjs',
    bundle: true,
    format: 'esm',
    platform: 'node',
    external: ['pg-native', '@whiskeysockets/baileys'],
    banner: {
      js: "import { createRequire as __cr } from 'node:module'; globalThis.require = __cr(import.meta.url);",
    },
  });
  console.log('Salla & Shipping test bundled successfully.');
}

buildTest().catch(console.error);
