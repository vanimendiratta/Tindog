import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

let errors = 0;
let warnings = 0;

function logPass(msg) {
  console.log(`\x1b[32m✔ [PASS]\x1b[0m ${msg}`);
}

function logError(msg) {
  console.error(`\x1b[31m✖ [FAIL]\x1b[0m ${msg}`);
  errors++;
}

function logWarn(msg) {
  console.warn(`\x1b[33m▲ [WARN]\x1b[0m ${msg}`);
  warnings++;
}

console.log('\n🔍 Running TinDog Project Lint & Asset Verification...\n');

// 1. Verify index.html exists
const indexPath = path.join(rootDir, 'index.html');
if (!fs.existsSync(indexPath)) {
  logError('index.html is missing!');
  process.exit(1);
}

const htmlContent = fs.readFileSync(indexPath, 'utf-8');

// 2. Check HTML standards
if (/<!DOCTYPE html>/i.test(htmlContent)) {
  logPass('HTML5 DOCTYPE present.');
} else {
  logError('Missing HTML5 <!DOCTYPE html> declaration.');
}

if (/<html[^>]*lang=["'][a-z]+["']/i.test(htmlContent)) {
  logPass('HTML lang attribute present.');
} else {
  logError('Missing lang attribute on <html> element.');
}

if (/<meta[^>]*name=["']viewport["'][^>]*content=["'][^"']*width=device-width/i.test(htmlContent)) {
  logPass('Mobile viewport meta tag present and configured correctly.');
} else {
  logError('Missing or malformed <meta name="viewport" content="width=device-width, initial-scale=1">.');
}

if (/<meta[^>]*charset=["']utf-8["']/i.test(htmlContent)) {
  logPass('Character encoding meta tag (UTF-8) present.');
} else {
  logError('Missing UTF-8 charset declaration.');
}

// 3. Typo checks
if (htmlContent.includes('Pirority')) {
  logError('Typo detected: "Pirority" found in HTML (should be "Priority").');
} else {
  logPass('No known typos ("Pirority") found.');
}

// 4. Asset references and Magic Byte Verification
const srcRegex = /(?:src|href)=["']([^"']+)["']/g;
let match;
const localAssets = new Set();

while ((match = srcRegex.exec(htmlContent)) !== null) {
  const assetPath = match[1];
  if (!assetPath.startsWith('http') && !assetPath.startsWith('#') && !assetPath.startsWith('mailto:')) {
    const cleanPath = assetPath.split('?')[0].split('#')[0];
    if (cleanPath) {
      localAssets.add(cleanPath);
    }
  }
}

const PNG_MAGIC = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
const JPG_MAGIC = [0xff, 0xd8, 0xff];

for (const asset of localAssets) {
  const fullAssetPath = path.join(rootDir, asset);
  if (!fs.existsSync(fullAssetPath)) {
    logError(`Referenced asset does not exist on disk: ${asset}`);
    continue;
  }

  // Format validation for images
  if (asset.endsWith('.png')) {
    const buf = Buffer.alloc(8);
    const fd = fs.openSync(fullAssetPath, 'r');
    fs.readSync(fd, buf, 0, 8, 0);
    fs.closeSync(fd);

    const isPng = PNG_MAGIC.every((byte, idx) => buf[idx] === byte);
    if (isPng) {
      logPass(`Valid PNG binary signature confirmed: ${asset}`);
    } else {
      logError(`Invalid PNG format (magic byte mismatch): ${asset} is not a true PNG file!`);
    }
  } else if (asset.endsWith('.jpg') || asset.endsWith('.jpeg')) {
    const buf = Buffer.alloc(3);
    const fd = fs.openSync(fullAssetPath, 'r');
    fs.readSync(fd, buf, 0, 3, 0);
    fs.closeSync(fd);

    const isJpg = JPG_MAGIC.every((byte, idx) => buf[idx] === byte);
    if (isJpg) {
      logPass(`Valid JPEG binary signature confirmed: ${asset}`);
    } else {
      logError(`Invalid JPEG format (magic byte mismatch): ${asset} is not a true JPEG file!`);
    }
  } else {
    logPass(`Referenced local asset exists: ${asset}`);
  }
}

// 5. CSS syntax & braces check
const cssPath = path.join(rootDir, 'css', 'styles.css');
if (fs.existsSync(cssPath)) {
  const css = fs.readFileSync(cssPath, 'utf-8');
  const openBraces = (css.match(/\{/g) || []).length;
  const closeBraces = (css.match(/\}/g) || []).length;
  if (openBraces === closeBraces) {
    logPass(`CSS file balanced braces (${openBraces} rules parsed).`);
  } else {
    logError(`CSS brace mismatch: ${openBraces} opening vs ${closeBraces} closing.`);
  }
} else {
  logError('css/styles.css is missing!');
}

console.log('\n----------------------------------------');
if (errors > 0) {
  console.error(`\x1b[31m✖ Lint failed with ${errors} error(s) and ${warnings} warning(s).\x1b[0m\n`);
  process.exit(1);
} else {
  console.log(`\x1b[32m✔ All lint checks passed successfully (${warnings} warnings).\x1b[0m\n`);
  process.exit(0);
}
