import { cpSync, existsSync } from 'fs';
import { resolve } from 'path';

const clientDir = resolve('dist/client');
const distDir = resolve('dist');

if (existsSync(clientDir)) {
  cpSync(clientDir, distDir, { recursive: true });
  console.log('✓ Assets copiados de dist/client a dist/');
} else {
  console.log('⚠ No se encontró dist/client, saltando copia.');
}