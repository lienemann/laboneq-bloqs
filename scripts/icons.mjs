// Generate PWA icons from a simple SVG source using sharp.
// Run: `npm run icons` (re-runs are idempotent).

import sharp from 'sharp';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = resolve(__dirname, '../public/icons');
mkdirSync(OUT_DIR, { recursive: true });

const BG = '#111827';
const FG = '#60a5fa';

// Standard (non-maskable) icon: glyph fills most of the square.
const standardSvg = (size) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="96" fill="${BG}"/>
  <text x="256" y="340" text-anchor="middle"
        font-family="ui-monospace, SFMono-Regular, Menlo, monospace"
        font-size="260" font-weight="700" fill="${FG}">LQ</text>
</svg>`;

// Maskable icon: glyph inside inner 80% safe zone (pad 10%).
const maskableSvg = () => `
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="${BG}"/>
  <text x="256" y="310" text-anchor="middle"
        font-family="ui-monospace, SFMono-Regular, Menlo, monospace"
        font-size="190" font-weight="700" fill="${FG}">LQ</text>
</svg>`;

async function render(svg, size, outName) {
  const buf = Buffer.from(svg);
  await sharp(buf)
    .resize(size, size)
    .png({ compressionLevel: 9 })
    .toFile(resolve(OUT_DIR, outName));
  console.log('  wrote', outName);
}

console.log('Generating PWA icons →', OUT_DIR);
await render(standardSvg(192), 192, 'icon-192.png');
await render(standardSvg(512), 512, 'icon-512.png');
await render(maskableSvg(), 512, 'icon-maskable-512.png');
console.log('done.');
