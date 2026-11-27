// Brings the website's public question library, past-paper collections and
// success stories into the app. These are plain data modules (the website runs
// them under Node at build time), so the logic is copied byte for byte and only
// the import paths change. The website is the source of truth: re-run
// `npm run sync:library` after it changes, then commit the result.
//
//   node scripts/sync-library.mjs          copy (overwrite)
//   node scripts/sync-library.mjs --check  exit 1 if the app has drifted
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const site = resolve(here, '../../my-react-app/src');
const seo = join(site, 'seo');
const appSrc = resolve(here, '../src');
const out = join(appSrc, 'features/library');
const check = process.argv.includes('--check');

const MODULES = [
  'seo/publicQuestions.js',
  'seo/pastPapers.js',
  'seo/faqSchema.js',
  'seo/locales.js',
  'seo/explanation.js',
  'seo/successStories.js',
  'seo/fitText.js',
  // A website util with no hand-written twin in src/lib, so it comes along.
  'utils/telegramChannels.js',
];
const DATA = ['publicQuestions.json', 'successStories.json'];

const banner = (from) =>
  `// AUTO-COPIED from my-react-app/src/${from}. Do not edit here:\n` +
  `// change the website's file, then run \`npm run sync:library\` in mobile/.\n`;

const files = [];
const siblings = new Set(MODULES.map((from) => `./${basename(from)}`));
// Whether an import in a copied module resolves inside the app.
const inApp = (spec) => {
  if (spec.startsWith('./')) return siblings.has(spec);
  if (!spec.startsWith('@/')) return false;
  const path = join(appSrc, spec.slice(2));
  return ['', '.ts', '.tsx'].some((ext) => existsSync(path + ext));
};
for (const from of MODULES) {
  const name = basename(from);
  let src = readFileSync(join(site, from), 'utf8').replace(/\r\n/g, '\n');
  src = src.replace(/from '\.\.\/utils\/telegramChannels\.js'/g, "from './telegramChannels.js'");
  src = src.replace(/from '\.\.\/seo\/([A-Za-z]+)\.js'/g, "from './$1.js'");
  src = src.replace(/from '\.\.\/i18n\/copy\/([A-Za-z]+)\.js'/g, "from '@/i18n/copy/$1.js'");
  src = src.replace(/from '\.\.\/utils\/([A-Za-z]+)\.js'/g, "from '@/lib/$1'");
  const stray = [...src.matchAll(/from '((?:\.{1,2}|@)\/[^']+)'/g)].map((m) => m[1]).filter((spec) => !inApp(spec));
  if (stray.length) throw new Error(`${name} imports ${stray.join(', ')}: map it in sync-library.mjs`);
  files.push({ target: join(out, 'seo', name), body: banner(from) + src });
}
for (const name of DATA) {
  files.push({ target: join(out, 'data', name), body: readFileSync(join(seo, 'data', name), 'utf8').replace(/\r\n/g, '\n') });
}

let drift = 0;
for (const f of files) {
  if (check) {
    // A Windows checkout (core.autocrlf) holds CRLF: line endings are not drift.
    const current = existsSync(f.target) ? readFileSync(f.target, 'utf8').replace(/\r\n/g, '\n') : '';
    if (current !== f.body) {
      drift += 1;
      console.log(`drifted: ${f.target.replace(out, 'library')}`);
    }
  } else {
    mkdirSync(dirname(f.target), { recursive: true });
    writeFileSync(f.target, f.body);
  }
}

if (check) {
  if (drift) {
    console.log(`${drift} file(s) differ from the website. Run: npm run sync:library`);
    process.exit(1);
  }
  console.log('library is in sync with the website');
} else {
  console.log(`wrote ${files.length} files to src/features/library`);
}
