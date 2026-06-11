const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const outDir = path.join(root, 'public');

const files = [
  'index.html',
  '404.html',
  'benefits.html',
  'grievances.html',
  'meetings.html',
  'pdf-viewer.html',
  'qr.html',
  'safety.html',
  '_shared.css',
  '_shared.js',
  'contract.pdf',
  'shop-floor-poster.pdf',
  'icon-192.png',
  'icon-512.png',
  'manifest.json',
  'service-worker.js'
];

const directories = [
  'union-one'
];

function ensureInsideProject(target) {
  const relative = path.relative(root, target);
  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    throw new Error(`Refusing to write outside project: ${target}`);
  }
}

function copyFile(relativePath) {
  const source = path.join(root, relativePath);
  if (!fs.existsSync(source)) {
    throw new Error(`Missing required static file: ${relativePath}`);
  }
  const destination = path.join(outDir, relativePath);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.copyFileSync(source, destination);
}

function copyDirectory(relativePath) {
  const source = path.join(root, relativePath);
  if (!fs.existsSync(source)) {
    throw new Error(`Missing required static directory: ${relativePath}`);
  }
  fs.cpSync(source, path.join(outDir, relativePath), { recursive: true });
}

ensureInsideProject(outDir);
fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });

files.forEach(copyFile);
directories.forEach(copyDirectory);

console.log(`Local 10 Hub: static app copied to public/ (${files.length} files, ${directories.length} directories)`);
