/**
 * Generates public/icon.png: 1024x1024 PNG, no alpha (Base/Farcaster spec).
 * Run: node scripts/generate-icon-png.mjs
 */
import sharp from 'sharp';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const publicDir = join(root, 'public');
const inputPath = join(publicDir, 'icon-1024.png');
const outputPath = join(publicDir, 'icon.png');

const bg = '#0a0a0f'; // dark, matches splash

let buffer;
if (existsSync(inputPath)) {
  buffer = readFileSync(inputPath);
  buffer = await sharp(buffer)
    .resize(1024, 1024)
    .flatten({ background: bg })
    .png({ compressionLevel: 6 })
    .toBuffer();
} else {
  buffer = await sharp({
    create: { width: 1024, height: 1024, channels: 3, background: { r: 10, g: 10, b: 15 } }
  })
    .png()
    .toBuffer();
}

writeFileSync(outputPath, buffer);
console.log('Written public/icon.png (1024x1024, no alpha,', Math.round(buffer.length / 1024), 'KB)');
