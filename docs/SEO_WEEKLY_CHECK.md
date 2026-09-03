# The Sunday SEO check

Ten minutes, once a week. The point is to catch the indexing work either
landing or stalling **before** revenue could possibly show it — indexed-page
count moves weeks earlier than anything downstream of it.

Baseline, measured 30 August 2026 (Search Console, 90 days to 28 Aug):

| Metric | Baseline | 60-day target |
|---|---|---|
| Pages indexed | **5** | 150+ |
| Search impressions / 90d | **6,770** | 25,000 |
| Search clicks / 90d | **561** | — |
| Average position | **6.1** | hold ≤ 10 |
| Share of clicks from non-brand queries | **~5%** | 40% |
| URLs in sitemap | **271** | — |

The gap between 271 submitted and 5 indexed is the whole story. Everything
below exists to watch that gap close.

---

## 1. Indexing (the one that matters)

Search Console → **Indexing → Pages**.

Record: `Indexed`, `Not indexed`, and the count under **"Discovered –
currently not indexed"**.

What each movement means:

- **Indexed climbing** — the prerender work is landing. Keep going.
- **"Discovered – currently not indexed" climbing while Indexed is flat** —
  Google is finding the new URLs and judging them not worth crawling. That is
  the same signal the five study guides threw before their real content was
  prerendered. Check a sample URL with **URL Inspection → View crawled page**
  and confirm the HTML actually contains the article/question text.
- **"Crawled – currently not indexed" appearing** — Google fetched the page and
  still declined. That is a quality judgment, not a plumbing bug: the page needs
  to be more substantial, more distinct, or better linked.

> If a page looks thin to Google, resubmitting it does not help. Fix the page,
> *then* resubmit.

## 2. Performance

Search Console → **Performance**, last 28 days.

Record: total clicks, total impressions, average position.

Then sort **Queries by impressions** and write down the top non-brand query —
anything that is not `sqb`, `smle question bank`, `smle qbank`, or a variation.
That single line is the best available answer to "is the content work
attracting people who were not already looking for us?"

At baseline the top query by impressions was
*"how to use question banks to improve performance in the saudi prometric
exam"* — 690 impressions, **zero clicks**, against an article that existed but
had never been served to Google. Watch that one specifically.

## 3. Pages

Search Console → **Performance → Pages**.

Record how many distinct URLs got at least one impression. At baseline: **7**,
with the homepage taking 534 of 561 clicks. The goal is for that number to grow
and for the homepage's share to fall — a site where one page earns everything
has no second lever.

## 4. Local sanity check

Cheap, no login, catches a broken prerender before Google does:

```bash
cd my-react-app && npm run build
```

The postbuild line reports how many routes were prerendered and how many came
from the question library. If those numbers drop unexpectedly, something in
`src/seo/` stopped emitting and the sitemap shrank with it.

---

## Log

Append a row each week. Keeping it here rather than in a spreadsheet means the
history sits next to the code that moves it.

| Date | Indexed | Discovered-not-indexed | Clicks 28d | Impressions 28d | Avg pos | Top non-brand query | Note |
|---|---|---|---|---|---|---|---|
| 2026-08-30 | 5 | 7 | — | — | 6.1 | how to use question banks… (690 impr, 0 clicks) | Baseline. Guides + 240 question pages + collections not yet deployed. |
