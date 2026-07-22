/**
 * Dev helper: extract text from a PDF (no rendering) so summary content can be
 * authored from the source files in ../content. Not part of the app runtime.
 *
 * Usage: node scripts/extractText.js "<input.pdf>" "<output.txt>"
 */
import fs from 'fs';

async function main() {
    const input = process.argv[2];
    const output = process.argv[3];
    if (!input || !output) {
        console.error('Usage: node scripts/extractText.js <input.pdf> <output.txt>');
        process.exit(1);
    }
    const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
    const data = new Uint8Array(fs.readFileSync(input));
    const doc = await pdfjs.getDocument({ data, useSystemFonts: true }).promise;

    const parts = [`PAGES: ${doc.numPages}`];
    for (let i = 1; i <= doc.numPages; i++) {
        const page = await doc.getPage(i);
        const tc = await page.getTextContent();
        const text = tc.items.map((it) => (it.str || '')).join(' ').replace(/[ \t]+/g, ' ').trim();
        parts.push(`\n===== PAGE ${i} =====\n${text}`);
    }
    fs.writeFileSync(output, parts.join('\n'), 'utf8');
    console.log(`Wrote ${doc.numPages} pages → ${output}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
