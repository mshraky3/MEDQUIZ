---
name: daily-reports
description: "Build the owner's daily report: SQB growth numbers from the report emails in Gmail, what shipped in git, and the calendar for today and the week, then save it as an Obsidian note. Use when the user types /daily-reports (with or without extras like '+ calendar read'), or asks for the daily report, daily brief, today's numbers, or 'what's on today'."
---

# Daily reports

One report a day, in this order: numbers, what shipped, calendar, things to look at. All times are Saudi time (Asia/Riyadh, UTC+3, no DST). Google Calendar returns UTC timestamps ending in `Z`, so add 3 hours before you show them.

## 1. Gather (run independent calls in parallel)

**Gmail** (load `mcp__Gmail__search_threads` and `mcp__Gmail__get_thread` with ToolSearch):
- Search: `newer_than:3d (subject:"Daily Signups" OR subject:"Subscriptions Report" OR subject:error OR subject:alert OR from:vercel OR from:github)`.
- Open the newest **🌱 Daily Signups** email and the newest **📈 Subscriptions Report** email from `noreply@smle-question-bank.com` with `get_thread` (use `messageFormat: PLAIN_TEXT`). Never report from search snippets alone.
- Keep: new signups, how people joined, total users, the 7-day average, and the previous day's numbers for comparison. Also keep new subscriptions, gross/net SAR, refunds, and the period each report covers.
- Note when each email arrived. The signups job is scheduled for 00:05 AST (`5 21 * * *` in `.github/workflows/cron.yml`), so say so if an email is more than about an hour late or missing.

**Google Calendar** (load `mcp__Google_Calendar__list_events`):
- Primary calendar from today 00:00 to today+7 days, `orderBy: startTime`, `pageSize: 50`.
- All-day events have an exclusive end date: an event with end date 16 Oct runs through 15 Oct.
- Read each event's description, because it often names files, thresholds, or the note in the Obsidian `knowledge/` vault to read.

**Git** (in every repo checked out in the session):
- `git log --since="48 hours ago" --date=short --format='%h %ad %s'` on the default branch.
- Cross-check calendar "Feature:" or "Fix:" events against these commits. If something on the calendar already shipped, say so and name the commit, so the owner can free the slot.

If a source fails or isn't connected, say which one and keep going with the others. Don't stop the report for it.

## 2. Write the report

Use this note layout (Markdown):

```
# Daily report: <Weekday> <D Mon YYYY>

## SQB numbers
(signups table: new / total / 7-day avg / previous day, plus how people joined; subscriptions: count, net SAR, period)

## Shipped in the last 48 h
(short hash, date, one plain sentence per commit)

## Calendar
**Today** (time range: title, with the one-line "why" from the description)
**Rest of the week**
(bold exams, deadlines and anything that needs a decision)

## Things to look at
(numbered: anomalies in the numbers, late or missing reports, calendar items already done, clashes, bugs seen in the report emails themselves; each with file:line when it's code)
```

Before you add an item to "Things to look at", check it in the source (the code, the commit, the email). Don't add guesses.

## 3. Save to Obsidian (the owner documents everything in Obsidian)

The note is `Daily Reports/<YYYY-MM-DD>.md`.

The vault lives only on the owner's PC, with no sync. Cloud sessions can never reach it, so they leave the note in git. The next local run moves it into the vault.

1. **Vault reachable (local session on the PC):** find the vault in Obsidian's config, i.e. `%APPDATA%\obsidian\obsidian.json` on Windows, `~/Library/Application Support/obsidian/obsidian.json` on macOS, or `~/.config/obsidian/obsidian.json` on Linux. Use the vault marked `"open": true`, or else the one with the highest `ts`. Write the note at `<vault>/Daily Reports/<date>.md`. Never guess a drive letter or path, and never use the `D:\Obsidian\...` path in the `/obsidian-sync` command file, because it belongs to the plugin's author.
   - **Catch-up:** next, run `git fetch origin` and list every `docs/daily-reports/*.md` on all `origin/claude/*` branches and on `origin/main` (`git ls-tree -r --name-only <ref> docs/daily-reports/`). Copy any that are missing into `<vault>/Daily Reports/` with `git show <ref>:<path>`. These notes come from cloud sessions. Don't overwrite a note that's already in the vault. List what you imported.
2. **No vault (cloud session):** write the note to `docs/daily-reports/<date>.md` in the session's repository, commit it, and push it to the session's branch. Tell the owner the note will reach Obsidian the next time they run `/daily-reports` on their PC (the catch-up step above). Also give the full report in chat.

If today's note already exists, update it in place. Don't create a second file.

## 4. Reply in chat

Keep the chat reply short: the numbers in 2–3 bullets, today's calendar, the rest of the week, then the items to look at. End with where the note was saved. Don't fix code unless asked; offer the fix in one line.
