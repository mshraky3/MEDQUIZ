# Dental track (SDLE) — October 2026

Third study track next to `medical` (SMLE) and `nursing` (SNLE). Key: `dental`. Exam: Saudi Dental Licensing Exam (SDLE).

## Content (source PDFs are local only: `source-material/dental/`, git-ignored)
| Source PDF | Collection key | What it is | Kept |
|---|---|---|---|
| "رفيع المقام 16 مصحح" (1,347 pages) | `DentalExplained` | 2,648 curated questions, each with explanation, textbook reference and confidence; 1,252 originals + 1,396 expansions | 2,601 |
| "July & Aug 2026 Questions" (68 pages) | `DentalRecall2026` | student recalls, July and Aug 2026 | 222 |
| "رفيع المقام 19" (98 pages) | `DentalRecall2024` | student recall compilations (2024 months) | 237 |

Build and quality gates: `source-material/dental/parse_rafee16.py` (structured parse, counts match the PDF's own table of contents exactly, 15/15 sections),
two transcription passes read by a model for the recall PDFs (`extracted/agents/SPEC.md`), eight factual-review passes over the explained bank
(`REVIEW_SPEC.md`, 23 flags), then `build_clean.py` -> `source-material/clean/dental-*.json` and `DENTAL_REPORT.md` (every drop and its reason).
Rules: text, options and answers verbatim; unanswerable / needs-an-image / doubtful-key / contradictory items dropped; recalls with 3 real options are padded with
`didn't recall`; recalls with only 2 real options (163) are HELD BACK in `dental-held-2-options.json` pending the owner's decision. No image support exists in the bank,
so image questions were dropped (about 85).

Specialty keys (`questions.question_type`, 13): endodontics (includes trauma), restorative dentistry, dental materials, periodontics, implant dentistry,
fixed prosthodontics, removable prosthodontics, orthodontics, pediatric dentistry, oral surgery, oral medicine and radiology, medical dentistry,
professionalism and infection control.

## Code
- `backend/config/tracks.js` (+ mirrors `my-react-app/src/utils/tracks.js`, `mobile/src/lib/tracks.ts`): `DENTAL` track and specialties.
- `backend/config/sources.js`: `DENTAL_SOURCES`; dental never falls back to an open bank; sources added to `ALL_SESSION_SOURCES`; `SCHEMA_BOOTSTRAP_VERSION` 12 rebuilds `check_valid_quiz_source`.
- Import: `POST /admin/import-recall` (admin key, dry run by default, 400 per call), one call batch per collection, in this order: DentalExplained, DentalRecall2026, DentalRecall2024.
- Web: signup track picker (3 tracks), landing track cards (3-column grid), source labels, exam dates, summaries show the honest "in preparation" state (no dental summaries yet).
- Tests: `backend/config/tracks.test.js`, `scripts/checkSources.js` (38 cases).

## Ship order (do not change)
1. Backend commit first (dormant: no page offers the dental track yet). 2. Import the three collections. 3. Then the web commit (picker, landing, labels) so nobody can choose a track that is empty.

## Known gaps
No dental summaries, no exam dates, no dental SEO/exam-guide pages, Android app only mirrors the track definition (not rebuilt), recall questions carry no explanations
(the explanation pipeline `buildExplanationSet.js` can add them later).
