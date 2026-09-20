# Database move: Koyeb Postgres -> Supabase (September 2026)

The SQB database (26 MB, 41 tables) was on a paid Koyeb Postgres instance. It is
being moved to a **Supabase Free** project so the database costs nothing. This
file records what the code change is and how to switch and roll back. It holds
no credentials.

## What this commit changes
`backend/config/supabaseCa.js` + one expression in `backend/app.js`: when
`DBHOST` ends in `.supabase.com`, the pool trusts Supabase's public root CA and
keeps `rejectUnauthorized: true`. Without it, Supabase fails with
`SELF_SIGNED_CERT_IN_CHAIN`. **Any other host (Koyeb) behaves exactly as before**,
so this is safe to deploy before the switch and changes nothing on its own.

## The new database
- Supabase project `sqb` (ref `ennvnogxfnsgrxxptnui`), PostgreSQL 17, region
  East US (North Virginia) — the same region as the `medquiz` Vercel function
  (`iad1`), so query latency does not change.
- Data API is OFF (SQB talks to Postgres directly; the REST API would otherwise
  expose tables).
- Use the **transaction pooler**: host `aws-0-us-east-1.pooler.supabase.com`,
  port **6543**, user `postgres.<project-ref>`, database `postgres`. The direct
  host is IPv6-only and Vercel cannot reach it. Tested with the exact pool
  settings in `app.js` (including `statement_timeout`).
- Restored from a full `pg_dump`; every table's row count, and the index /
  constraint / sequence counts, matched Koyeb exactly. The 10 `uuid-ossp`
  functions show under the `extensions` schema instead of `public` — expected,
  and no column default depends on them.

## Switching (Vercel -> `medquiz` -> Environment Variables, then redeploy)
Set `DBHOST`, `DBPORT` (6543), `DBNAME` (postgres), `DBUSER`, `DBPASSWORD` to
the Supabase values. Do it in a quiet hour; a final data refresh from Koyeb is
run immediately before, and a catch-up of any rows written during the switch
immediately after.

## Rolling back
Put the five variables back to the Koyeb values and redeploy. Koyeb is kept
untouched for a week after the switch precisely for this. Anything written to
Supabase after the switch would then need copying back (not automatic).

## Watch after switching
- Supabase free projects **pause after 7 days without activity** — SQB's traffic
  and its GitHub Actions crons keep it awake.
- Free plan: 500 MB database, no backups. Take periodic `pg_dump` copies.
