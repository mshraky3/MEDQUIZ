/**
 * Answer explanations are written in a light markdown: a bold heading per
 * stage (`**Diagnosis:**`) and `- ` bullets under it. Bold and bullets are the
 * whole grammar, so this is deliberately not a markdown library. A port of the
 * website's seo/explanation.js, kept identical so both render the same.
 */
export type Run = { bold: boolean; text: string };
export type ExplanationBlock = { type: 'p'; runs: Run[] } | { type: 'ul'; items: Run[][] };

/** `**bold**` -> a list of `{ bold, text }` runs. */
export function parseInline(line = ''): Run[] {
  const runs: Run[] = [];
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

export function parseExplanation(text = ''): ExplanationBlock[] {
  const blocks: ExplanationBlock[] = [];
  let list: { type: 'ul'; items: Run[][] } | null = null;

  for (const raw of String(text).split('\n')) {
    const line = raw.trim();
    if (!line) {
      list = null;
      continue;
    }
    const bullet = /^[-*•]\s+(.*)$/.exec(line);
    if (bullet) {
      if (!list) {
        list = { type: 'ul', items: [] };
        blocks.push(list);
      }
      list.items.push(parseInline(bullet[1]));
      continue;
    }
    list = null;
    blocks.push({ type: 'p', runs: parseInline(line) });
  }
  return blocks;
}

/** Plain text with the markers stripped. */
export function explanationPlain(text = ''): string {
  return parseExplanation(text)
    .flatMap((block) =>
      block.type === 'ul'
        ? block.items.map((item) => item.map((r) => r.text).join(''))
        : [block.runs.map((r) => r.text).join('')]
    )
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}
