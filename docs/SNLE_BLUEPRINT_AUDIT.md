# The nursing track against the official SNLE blueprint

**S4-01.** Measured 2026-08-31. Re-run it with:

```bash
node scripts/auditNursingBlueprint.js
```

from `backend/` (add `--from-source` to measure the committed source files
instead of the live database — no credentials needed, and the numbers below
were produced that way).

---

## The source

Everything here is transcribed from the SCFHS **Saudi Nursing Licensure
Examination (SNLE) — Examination Content Guideline**, the version published at

<https://scfhs.org.sa/sites/default/files/2025-09/SNLE%20Applicant%20Guide%20.pdf>

retrieved 2026-08-31. The May 2024 edition was checked against it: the four
sections and their weights are identical. Two sub-sections moved — "Clinical of
nutrition" became "Basic sciences" under Fundamentals, and "Research and
Evidence Based Practice" was added under Management and Leadership. Nothing
that changes the conclusions below.

This matters because S1-06/07 were skipped for exactly the opposite reason:
secondary sources contradicted each other and the official one could not be
reached. It can be reached now. **S1-06 is therefore unblocked too** — the 2026
SMLE blueprint is at
<https://scfhs.org.sa/sites/default/files/2026-05/Saudi%20Medical%20Licensure%20Examination%20(SMLE)%20Blueprint_2026_0.pdf>
and is far more granular than the nursing one (per-topic item counts across ~15
pages).

### The blueprint

| Section | Weight | Sub-sections |
|---|---|---|
| Nursing Fundamentals | 20% | Fundamentals of nursing · Professionalism · Patient Centered · Evidence Based Practice and Research · Leadership and Management · Quality and Safety Management · Health Education and Promotion · Communication and Information Technology · Physical assessment · Pharmacology · Basic sciences |
| Adult Nursing | 40% | Medical nursing · Surgical nursing · Critical care nursing · Community nursing · Mental/psychiatric nursing |
| Maternal-Child Nursing | 30% | Maternity nursing · Gynecology · Neonatal nursing · Pediatric medical · Pediatric surgical |
| Nursing Management and Leadership | 10% | Resources to support and coordinate patient care · Quality and safe patient care at the frontline · Nursing teams and interprofessional relations · Nursing informatics for safe and legal delivery of patient care · Research and Evidence Based Practice |

The guide states the tolerance itself: *"Blueprint distributions of the
examination may differ up to +/-5% in each level."* That is the band used below.

### Exam facts from the same document

200 MCQs including up to 10% pilot questions · two parts of 100, 120 minutes
each, with a scheduled 30-minute break · four options, one best answer ·
passing score **500** on a 200–800 reporting scale, set in April 2017 by a
panel of 14 nurses · up to four attempts a year until a pass · final-year
students at Saudi universities may sit · Prometric centres, locally and
internationally.

(For contrast, the 2026 SMLE guide gives the same 2 × 100 / 120-minute
structure but a passing score of **560** on the same scale. The two are not
interchangeable, which is the kind of detail the earlier secondary sources got
wrong.)

---

## What the bank actually contains

**2,105 nursing questions.** That is the live table, not an estimate of it: the
collection totals in `src/seo/data/publicQuestions.json` come from a real
`COUNT(*)` against the database (`backend/scripts/exportPublicQuestions.js`, last
run 2026-08-30) and read 1,514 + 591 = 2,105, which is exactly the row count of
the two files under `source-material/clean/`. Every source row is in the table.

| Section | Ours | Target | Band | Gap |
|---|---|---|---|---|
| Nursing Fundamentals | **31.1%** | 20% | 15–25% | **+11.1 pts** |
| Adult Nursing | **32.7%** | 40% | 35–45% | **−7.3 pts** |
| Maternal-Child Nursing | **36.2%** | 30% | 25–35% | **+6.2 pts** |
| Nursing Management and Leadership | **0.0%** | 10% | 5–15% | **−10.0 pts** |

All four sections are outside the blueprint's own tolerance.

By our specialty, which is how a student actually meets the bank:

| Specialty | Questions | Share |
|---|---|---|
| medical surgical nursing | 597 | 28.4% |
| nursing fundamentals | 500 | 23.8% |
| pediatric nursing | 392 | 18.6% |
| maternal and newborn nursing | 370 | 17.6% |
| nursing pharmacology | 154 | 7.3% |
| mental health nursing | 92 | 4.4% |

The mapping is a judgement call in two places, both taken from the blueprint's
own sub-section lists: **pharmacology** counts toward Fundamentals (it is a
sub-section of it, not a section), and **mental health** counts toward Adult
Nursing (ditto). Move either one and the picture changes, so the mapping lives
in the script where it can be argued with.

---

## The 10% that has nowhere to live

`backend/config/tracks.js` defines six nursing specialties. None of them is
Management and Leadership, and it is a tenth of the exam.

It is not quite absent from the content — a keyword probe over every stem and
option finds it filed inside `nursing fundamentals`:

| Topic | Questions | Share |
|---|---|---|
| Delegation & supervision | 72 | 3.4% |
| Quality & incident reporting | 8 | 0.4% |
| Teams & conflict | 6 | 0.3% |
| **Nursing informatics** | **0** | **0.0%** |
| **Distinct questions matching any of the above** | **80** | **3.8%** |

Read the union, not the sum: those rows overlap, so 72 + 8 + 6 is 86 hits but
only 80 distinct questions. Eighty against a 10% section — and nursing
informatics, one of the five sub-sections, has no coverage at all.

Two other Adult Nursing sub-sections are thin for the same reason: **critical
care** (75 questions, 3.6%) and **community nursing** (43, 2.0%) are scattered
across the other decks rather than owned by one.

---

## What to do about it

**The bank does not have to mirror the blueprint to be good.** Over-representing
maternal-child is not a defect on its own — practice volume is not an exam. Two
things here are defects:

1. **A student cannot study management and leadership deliberately.** The 80
   questions that exist are unreachable as a set; they surface only by chance
   inside Fundamentals quizzes. Ten percent of the exam is being left to luck.
2. **Nursing informatics has zero questions.** Not thin — absent.

In rough order of return:

- **Add a seventh specialty, `nursing management and leadership`, and re-file
  the ~80 questions into it.** That alone gives it a real deck at ~3.8% and
  makes the gap visible in every analytics screen. Note the constraint the
  insert script already enforces: *a specialty with no deck is unreachable
  content*, so this needs a summaries deck authored at the same time — do not
  ship the specialty empty. The re-filing needs question-by-question review, not
  a regex; the probe finds candidates, it does not classify them.
- **Author ~145 more management questions** to reach 10% of the bank (that is
  on top of re-filing the 80 that exist), with informatics deliberately
  represented rather than incidentally.
- **Grow Adult Nursing by ~255** to reach 40%, weighted toward critical care,
  community and mental health — mental health at 4.4% is the single thinnest
  deck in the track and is one of five Adult sub-sections.

The first bullet is a schema change plus a data migration and is not something
to run against production casually. The other two are content work.

---

## Why this is worth doing at all

26 nursing accounts have produced 3 of 6 paying customers. The medical track's
90 accounts produced the other 3. On that evidence nursing converts several
times better, on a bank that misses a tenth of its own exam and has no public
page of its own. See S4-02 in `GROWTH_PLAN.md`.
