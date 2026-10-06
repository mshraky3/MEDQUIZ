/** The inline markup of the website's legal and guide copy: **bold** and [[href|label]]. Pure: no React. */
const TOKEN = /(\[\[[^\]]+\]\]|\*\*[^*]+\*\*)/g;

export type InlinePart = { kind: 'text' | 'bold' | 'link'; text: string; href?: string };

/** Splits a string into text, **bold** and [[href|label]] parts. */
export function parseInline(text: string): InlinePart[] {
  return String(text)
    .split(TOKEN)
    .filter(Boolean)
    .map((part): InlinePart => {
      if (part.startsWith('**') && part.endsWith('**')) return { kind: 'bold', text: part.slice(2, -2) };
      if (part.startsWith('[[') && part.endsWith(']]')) {
        const [href, label = href] = part.slice(2, -2).split('|');
        return { kind: 'link', text: label, href };
      }
      return { kind: 'text', text: part };
    });
}
