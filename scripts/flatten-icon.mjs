import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const inputPath = join(root, 'public', 'icon-1024.png');
const outputPath = join(root, 'public', 'icon-1024.png');

const buffer = readFileSync(inputPath);
const out = await sharp(buffer)
  .resize(1024, 1024)
  .flatten({ background: '#0a0a0f' })
  .png()
  .toBuffer();
writeFileSync(outputPath, out);
console.log('Written icon-1024.png (1024x1024, no alpha)');
