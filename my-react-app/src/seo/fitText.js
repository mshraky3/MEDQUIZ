/**
 * Length limits for search-result titles and descriptions. A title longer than
 * ~70 characters is cut by the search engine, often mid-sentence; a description
 * past ~160 is cut as well. These helpers shorten at a word boundary instead.
 */
export const TITLE_TARGET = 60;
export const TITLE_MAX = 70;
export const DESCRIPTION_TARGET = 155;
export const DESCRIPTION_MAX = 160;

/**
 * Cut `text` to at most `max` characters at a word boundary. `ellipsis` adds a
 * trailing "…" (descriptions only); titles are cut clean. Stored headlines
 * already end in "…" when the source stem was long, so that is stripped first.
 */
export function fitText(text, max, { ellipsis = false } = {}) {
    const clean = String(text || '').replace(/\s+/g, ' ').replace(/(…|\.{3})\s*$/, '').trim();
    if (clean.length <= max) return clean;
    const room = ellipsis ? max - 1 : max;
    const head = clean.slice(0, room + 1);
    const space = head.lastIndexOf(' ');
    const cut = (space > room * 0.5 ? head.slice(0, space) : clean.slice(0, room))
        .replace(/[\s,;:\-–—|(&]+$/, '');
    return ellipsis ? `${cut}…` : cut;
}

/** Leave titles up to TITLE_MAX alone; shorten longer ones to TITLE_TARGET, keeping a trailing " | SQB". */
export function capTitle(title) {
    if (!title || title.length <= TITLE_MAX) return title;
    const m = title.match(/^(.*?)(\s*\|\s*SQB)$/);
    const body = m ? m[1] : title;
    const suffix = m ? m[2] : '';
    return `${fitText(body, TITLE_TARGET - suffix.length)}${suffix}`;
}

/** Leave descriptions up to DESCRIPTION_MAX alone; shorten longer ones to DESCRIPTION_TARGET. */
export function capDescription(description) {
    if (!description || description.length <= DESCRIPTION_MAX) return description;
    return fitText(description, DESCRIPTION_TARGET, { ellipsis: true });
}
