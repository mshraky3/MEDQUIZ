/**
 * Answer explanations are written in a light markdown, and were being rendered
 * as if they were not.
 *
 * Every explanation in the bank is authored with the same structure — a bold
 * heading per stage (`**Core Concept:**`, `**Diagnosis:**`, `**Management:**`)
 * and `- ` bullets under it. 194 of the 240 published questions contain bold
 * markers and 218 contain bullets, and all of it was going through
 * `<p>{question.explanation}</p>`: one flat paragraph, literal asterisks, every
 * line break collapsed. The explanation is the entire reason these pages are
 * worth publishing, and it read like a wall of text with punctuation errors.
 *
 * Parsed once here into blocks so the React pages and the prerendered HTML
 * cannot drift apart — a crawler and a student must be shown the same thing.
 *
 * Deliberately NOT a markdown library: the input is a known, narrow format
 * written in-house, and the output is inserted into pages that already have a
 * strict "no raw HTML from data" rule. Bold and bullets are the whole grammar.
 *
 * React-free and browser-free: runs under Node at build time.
 */

/** `**bold**` → a list of `{ bold, text }` runs. Never emits HTML. */
export function parseInline(line = '') {
    const runs = [];
    // Non-greedy, and it requires content between the markers, so a stray
    // `**` or an unclosed pair is left alone as literal text rather than
    // swallowing the rest of the explanation.
    const re = /\*\*([^*]+)\*\*/g;
    let last = 0;
    let match = re.exec(line);
    while (match) {
        if (match.index > last) runs.push({ bold: false, text: line.slice(last, match.index) });
        runs.push({ bold: true, text: match[1] });
        last = match.index + match[0].length;
        match = re.exec(line);
    }
    if (last < line.length) runs.push({ bold: false, text: line.slice(last) });
    return runs.length ? runs : [{ bold: false, text: line }];
}

/**
 * An explanation → `[{ type: 'p', runs }, { type: 'ul', items: [runs] }]`.
 *
 * Consecutive bullet lines collapse into one list; everything else is a
 * paragraph. Blank lines are separators and produce nothing.
 */
export function parseExplanation(text = '') {
    const blocks = [];
    let list = null;

    for (const raw of String(text).split('\n')) {
        const line = raw.trim();
        if (!line) { list = null; continue; }

        const bullet = /^[-*•]\s+(.*)$/.exec(line);
        if (bullet) {
            if (!list) { list = { type: 'ul', items: [] }; blocks.push(list); }
            list.items.push(parseInline(bullet[1]));
            continue;
        }

        list = null;
        blocks.push({ type: 'p', runs: parseInline(line) });
    }

    return blocks;
}

const escapeHtml = (value = '') =>
    String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');

const runsHtml = (runs) => runs
    .map((run) => (run.bold ? `<strong>${escapeHtml(run.text)}</strong>` : escapeHtml(run.text)))
    .join('');

/** The same blocks as HTML, for the prerendered question pages. */
export function explanationHtml(text = '') {
    return parseExplanation(text)
        .map((block) => (block.type === 'ul'
            ? `<ul>${block.items.map((item) => `<li>${runsHtml(item)}</li>`).join('')}</ul>`
            : `<p>${runsHtml(block.runs)}</p>`))
        .join('\n          ');
}

/**
 * Plain text, markers stripped.
 *
 * For meta descriptions and structured data, where markup would be shown to a
 * reader as literal characters in a search result.
 */
export function explanationPlain(text = '') {
    return parseExplanation(text)
        .flatMap((block) => (block.type === 'ul'
            ? block.items.map((item) => item.map((r) => r.text).join(''))
            : [block.runs.map((r) => r.text).join('')]))
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim();
}
