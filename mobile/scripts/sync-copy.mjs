// Copies the website's Arabic/English copy dictionaries into the app so both
// say exactly the same thing. The website is the source of truth: edit the text
// there, then run `npm run sync:copy` here and commit the result.
//
//   node scripts/sync-copy.mjs          copy (overwrite) everything
//   node scripts/sync-copy.mjs --check  exit 1 if the app's copy has drifted
import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const siteI18n = resolve(here, '../../my-react-app/src/i18n');
const outDir = resolve(here, '../src/i18n/copy');
const check = process.argv.includes('--check');

// install.js is the PWA "add to home screen" prompt: meaningless inside the app.
const SKIP = new Set(['install.js']);

const banner = (from) =>
  `// AUTO-COPIED from my-react-app/src/i18n/${from}. Do not edit here:\n` +
  `// change the website's file, then run \`npm run sync:copy\` in mobile/.\n`;

const files = readdirSync(join(siteI18n, 'copy'))
  .filter((f) => f.endsWith('.js') && !SKIP.has(f))
  .map((f) => ({ name: f, from: `copy/${f}`, src: readFileSync(join(siteI18n, 'copy', f), 'utf8') }));

// common.js reads the language through a React hook; the app has its own.
let common = readFileSync(join(siteI18n, 'common.js'), 'utf8');
common = common
  .replace(/^import \{ useCopy \} from '\.\/LanguageContext\.jsx';\r?\n/m, '')
  .replace(/^export const useCommon = .*\r?\n/m, '');
files.push({ name: 'common.js', from: 'common.js', src: common });

if (!check) mkdirSync(outDir, { recursive: true });
let drift = 0;
for (const { name, from, src } of files) {
  const body = banner(from) + src.replace(/\r\n/g, '\n');
  const target = join(outDir, name);
  if (check) {
    const current = existsSync(target) ? readFileSync(target, 'utf8') : '';
    if (current !== body) {
      drift += 1;
      console.log(`drifted: ${name}`);
    }
  } else {
    writeFileSync(target, body);
  }
}
if (check) {
  if (drift) {
    console.log(`${drift} file(s) differ from the website. Run: npm run sync:copy`);
    process.exit(1);
  }
  console.log('copy is in sync with the website');
} else {
  console.log(`copied ${files.length} files to src/i18n/copy`);
}
