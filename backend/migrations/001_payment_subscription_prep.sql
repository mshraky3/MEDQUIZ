-- Migration 001: Payment & Subscription Readiness
-- ------------------------------------------------------------------
-- Prepares the schema for a FUTURE Moyasar subscription rollout.
-- Payment enforcement remains DISABLED in the application until the
-- PAYMENT_ENFORCEMENT_ENABLED feature flag is set to "true".
--
-- This migration is idempotent (IF NOT EXISTS guards) and uses safe
-- defaults so existing rows and queries are unaffected.
--
-- Run against the Koyeb PostgreSQL database:
--   psql "$DATABASE_URL" -f migrations/001_payment_subscription_prep.sql
-- ------------------------------------------------------------------

BEGIN;

-- 1. Subscription & payment readiness fields on accounts
ALTER TABLE accounts
  ADD COLUMN IF NOT EXISTS subscription_status         VARCHAR(50)  NOT NULL DEFAULT 'free',
  ADD COLUMN IF NOT EXISTS subscription_expiry_date    TIMESTAMPTZ  DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS account_type                VARCHAR(50)  NOT NULL DEFAULT 'standard',
  ADD COLUMN IF NOT EXISTS is_admin_created            BOOLEAN      NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS payment_gateway_customer_id VARCHAR(255) DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS grandfathered_at            TIMESTAMPTZ  DEFAULT NULL;

-- 2. Indexes for fast subscription lookups once enforcement is enabled
CREATE INDEX IF NOT EXISTS idx_accounts_subscription_status ON accounts(subscription_status);
CREATE INDEX IF NOT EXISTS idx_accounts_is_admin_created     ON accounts(is_admin_created);

-- 3. Append-only payment events audit log (for future webhook processing)
CREATE TABLE IF NOT EXISTS payment_events (
  id              BIGSERIAL PRIMARY KEY,
  account_id      INT REFERENCES accounts(id) ON DELETE SET NULL,
  event_type      VARCHAR(100) NOT NULL,          -- e.g. 'invoice.paid', 'subscription.cancelled'
  gateway         VARCHAR(50)  NOT NULL DEFAULT 'moyasar',
  gateway_ref     VARCHAR(255),                   -- Moyasar payment/invoice ID
  amount_halalas  INT,                            -- amount in halalas (1 SAR = 100 halalas)
  currency        VARCHAR(10)  DEFAULT 'SAR',
  status          VARCHAR(50),
  raw_payload     JSONB,
  received_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payment_events_account  ON payment_events(account_id);
CREATE INDEX IF NOT EXISTS idx_payment_events_received ON payment_events(received_at);

-- 4. Grandfather every existing account so the future rollout never charges
--    or locks out anyone who registered while the platform was free.
UPDATE accounts
SET grandfathered_at    = NOW(),
    subscription_status = 'grandfathered'
WHERE grandfathered_at IS NULL;

COMMIT;
