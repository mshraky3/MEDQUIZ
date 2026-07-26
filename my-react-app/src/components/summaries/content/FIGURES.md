# Adding figures & images to summaries

Summary content lives in `medicine.js`, `pediatrics.js`, `obgyn.js`, `surgery.js`
as HTML strings (`subtopic.summaryHtml`) rendered by `SummariesPage.jsx`. There
are three ways to add a visual — all wrapped in `<figure class="deck-fig">…`.

## 1. Inline SVG diagram (preferred — no hosting, original artwork)

Draw it directly. Use explicit colours (the summaries render light) and add
`role="img"` + `aria-label`. Example:

```html
<figure class="deck-fig"><div class="deck-fig-title"><span class="deck-tag tag-fig">Diagram</span> Title</div>
<svg viewBox="0 0 680 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="what it shows">
  … shapes …
</svg>
<figcaption>One-line takeaway.</figcaption></figure>
```

Styling is already provided: `.deck-fig svg { max-width:100%; height:auto }`.
See the diagrams in `surgery.js` (SBO vs LBO), `obgyn.js` (CTG decelerations),
`pediatrics.js` (milestone timeline), and `medicine.js` for patterns.

**Do NOT paste Medscape / Google / textbook images** — that is copyright
infringement. Draw original diagrams, or use tier 2/3 for images you own.

## 2. Public raster image (simple)

Drop the file in `my-react-app/public/summaries/` and reference it:

```html
<figure class="deck-fig"><img class="deck-img" src="/summaries/my-photo.webp" alt="description" />
<figcaption>caption</figcaption></figure>
```

Directly URL-accessible, so use only for non-sensitive supplementary images.

## 3. Gated raster image (undownloadable, for licensed content)

Upload the file to private R2 under the `figures/` prefix (extend
`backend/scripts/uploadSummaries.js`), then reference it by key — **no `src`**:

```html
<figure class="deck-fig"><img class="deck-img" data-figure-key="my-figure.webp" alt="description" />
<figcaption>caption</figcaption></figure>
```

`SummariesPage.jsx` fetches `GET /api/summaries/figure/:name` with the auth
header, streams it from private storage, and swaps in a blob URL. Filenames must
match `^[a-zA-Z0-9_-]+\.(webp|png|jpg|jpeg|svg)$`. Requires `R2_*` env vars set
(`isR2Configured()`); returns 503 until then.
