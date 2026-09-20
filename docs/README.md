# SQB docs index

Last reconciled: **2026-09-20**. One line per doc: what it is, and whether to trust it.
When you add or retire a doc, change this table in the same commit.

Hosting, databases, deploy flow and the live National Day offer are summarised in the
working-projects `INFRASTRUCTURE.md` (outside this repo; on the owner's machine:
`C:\Users\muhmo\Desktop\CODE\Projects\working projects`). Cross-session rules:
`CLAUDE.md` and `project-rules/SQB.md` in that same folder.

## Current: read these first

| Doc | Use it for |
|---|---|
| `NATIONAL_DAY_OFFER_2026-09.md` | The live offer, the **original price ladder** (what to restore), and how to end or revert the offer. |
| `DATABASE_MOVE_2026-09.md` | Koyeb -> Supabase: what changed in code, how to switch, how to roll back. |
| `VERCEL_CPU_NOTES_2026-09.md` | What was cut to stay under Vercel's free CPU limit, and how to verify/revert. |
| `DESIGN_MAP.md` | Page-by-page UI map, stylesheet ownership, CSS invariants. First file to read before touching UI. |
| `SEO_WEEKLY_CHECK.md` | The 10-minute weekly Search Console routine and its log. |
| `GROWTH_PLAN.md` | SEO/conversion backlog with status. The backlog **is deployed** (see its correction note). |
| `SNLE_BLUEPRINT_AUDIT.md` | Nursing track coverage vs the SNLE blueprint (snapshot, 2026-08-31). |
| `../MOYASAR_CHECKLIST.txt` | Owner runbook for Moyasar + the offer (git-ignored, exists only on the owner's machine). Part 1 predates the offer: do **not** set `PLAN_*` variables. |

## Useful but partly out of date (each has a banner at the top)

| Doc | Still good for | Out of date |
|---|---|---|
| `EMAIL_SYSTEM_DOCS.txt` | Broadcast + unsubscribe behaviour | Sender/SMTP sections: mail now goes through the central gateway |
| `SQB_HANDOFF_PLAN.txt` | Data rules (Parts A/E), image licence rules (Part H) | "DB: Koyeb"; deploy method; mobile status |
| `MOYASAR_GO_LIVE.md` | Compliance review + domain/webhook setup | Prices, single-plan model, deploy command |
| `SQB_IMAGE_SOURCING_LIST.md` | The licence table | Tier 1 is done |

## Historic record (closed; kept because code comments or other docs reference them)

`DESIGN_AUDIT_2026-08-25.md` (all 22 items fixed), `DESIGN_UNIFICATION_SUMMARY.md` (retired palette),
`CSS_MAP.md` (resolved collisions), `MONETIZATION_ANALYSIS_2026-08.md` (proposals; shipped prices differ).

## `archive/` (superseded; moved 2026-09-20, history kept by git)

`DATABASE_SIZE_AND_HOSTING_ANALYSIS.md`, `LANDING_PAGE_README.md`, `SEO_OPTIMIZATION_GUIDE.md`,
`ERROR_NOTIFICATION_README.md`, `EXPO_ACCOUNT_AND_BUILD_INFO.txt` (merged into `../mobile/README.md`).

## Not docs, but in `notes/` (git-ignored, local only)

`notes/email.txt` is an obsolete per-project Resend recipe: the central gateway replaced it.
`notes/association_check.txt` is a hex dump of the Apple Pay association file. `notes/blob.txt` is the R2 endpoint.
