-- Migration 002: Android tester offer (3 months free, first 15 people)
-- ------------------------------------------------------------------
-- NOT RUN. Written for the owner to review. The feature that uses this table is
-- OFF until ANDROID_TESTERS_OFFER_ENABLED=true; nothing in the application
-- creates or alters this table (no ensureSchema change), so deploying the code
-- without running this file changes nothing.
--
-- Rules to run it (see knowledge/SQB/16 Live database access.md and the other
-- files in migrations/): owner's yes, dry run on a copy, pg_dump backup, then
-- this file in one transaction (it is idempotent and touches no existing table).
--
--   psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f migrations/002_android_testers.sql
-- ------------------------------------------------------------------

BEGIN;

CREATE TABLE IF NOT EXISTS android_testers (
  id           BIGSERIAL    PRIMARY KEY,
  account_id   INT          NOT NULL UNIQUE REFERENCES accounts(id) ON DELETE CASCADE,
  -- the Google account address as the student typed it (lowercased), pasted into Play Console
  play_email   VARCHAR(254) NOT NULL,
  -- canonical form (gmail dots and +tags removed) so one person cannot take two spots
  email_key    VARCHAR(254) NOT NULL UNIQUE,
  joined_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  -- set when the 3 free months were given after a sign-in from the Android app
  redeemed_at  TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_android_testers_joined_at ON android_testers(joined_at);

COMMIT;
