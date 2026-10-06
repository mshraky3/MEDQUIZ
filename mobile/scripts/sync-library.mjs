// Brings the website's public question library, past-paper collections and
// success stories into the app. These are plain data modules (the website runs
// them under Node at build time), so the logic is copied byte for byte and only
// the import paths change. The website is the source of truth: re-run
// `npm run sync:library` after it changes, then commit the result.
//
//   node scripts/sync-library.mjs          copy (overwrite)
//   node scripts/sync-library.mjs --check  exit 1 if the app has drifted
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const seo = resolve(here, '../../my-react-app/src/seo');
const out = resolve(here, '../src/features/library');
const check = process.argv.includes('--check');

const MODULES = ['publicQuestions.js', 'pastPapers.js', 'faqSchema.js', 'locales.js', 'explanation.js', 'successStories.js'];
const DATA = ['publicQuestions.json', 'successStories.json'];

const banner = (from) =>
  `// AUTO-COPIED from my-react-app/src/${from}. Do not edit here:\n` +
  `// change the website's file, then run \`npm run sync:library\` in mobile/.\n`;

const files = [];
for (const name of MODULES) {
  let src = readFileSync(join(seo, name), 'utf8').replace(/\r\n/g, '\n');
  src = src.replace(/from '\.\.\/i18n\/copy\/([A-Za-z]+)\.js'/g, "from '@/i18n/copy/$1.js'");
  src = src.replace(/from '\.\.\/utils\/([A-Za-z]+)\.js'/g, "from '@/lib/$1'");
  const stray = src.match(/from '\.\.\/[^']+'/g);
  if (stray) throw new Error(`${name} imports ${stray.join(', ')}: map it in sync-library.mjs`);
  files.push({ target: join(out, 'seo', name), body: banner(`seo/${name}`) + src });
}
for (const name of DATA) {
  files.push({ target: join(out, 'data', name), body: readFileSync(join(seo, 'data', name), 'utf8').replace(/\r\n/g, '\n') });
}

let drift = 0;
for (const f of files) {
  if (check) {
    const current = existsSync(f.target) ? readFileSync(f.target, 'utf8') : '';
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
