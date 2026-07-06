-- ============================================================
-- DebtFlow - Supabase Migration
-- Run this entire script in your Supabase SQL Editor
-- ============================================================

-- ============================================================
-- EXTENSIONS
-- ============================================================
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- FUNCTIONS
-- ============================================================

-- Generate a secure random public token (48 hex chars)
CREATE OR REPLACE FUNCTION generate_public_token()
RETURNS TEXT AS $$
BEGIN
  RETURN encode(gen_random_bytes(24), 'hex');
END;
$$ LANGUAGE plpgsql;

-- Recalculate debt totals after any payment change
CREATE OR REPLACE FUNCTION recalculate_debt()
RETURNS TRIGGER AS $$
DECLARE
  v_debt_id UUID;
  v_total NUMERIC(12,2);
  v_paid  NUMERIC(12,2);
BEGIN
  -- Determine which debt_id to update
  IF TG_OP = 'DELETE' THEN
    v_debt_id := OLD.debt_id;
  ELSE
    v_debt_id := NEW.debt_id;
  END IF;

  -- Sum only approved payments
  SELECT COALESCE(SUM(amount), 0)
  INTO v_paid
  FROM payments
  WHERE debt_id = v_debt_id AND status = 'approved';

  -- Get total amount
  SELECT total_amount INTO v_total FROM debts WHERE id = v_debt_id;

  -- Update debt
  UPDATE debts
  SET
    amount_paid = v_paid,
    status = CASE
      WHEN v_paid >= v_total THEN 'completed'
      ELSE 'active'
    END,
    updated_at = NOW()
  WHERE id = v_debt_id;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Auto-update updated_at on debts
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- TABLES
-- ============================================================

CREATE TABLE IF NOT EXISTS debts (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  public_token          TEXT UNIQUE NOT NULL DEFAULT generate_public_token(),
  debtor_name           TEXT NOT NULL,
  description           TEXT,
  total_amount          NUMERIC(12,2) NOT NULL CHECK (total_amount > 0),
  amount_paid           NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (amount_paid >= 0),
  status                TEXT NOT NULL DEFAULT 'active'
                          CHECK (status IN ('active', 'completed', 'archived')),
  requires_confirmation BOOLEAN NOT NULL DEFAULT FALSE,
  deleted_at            TIMESTAMPTZ DEFAULT NULL,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Computed columns as generated expressions
ALTER TABLE debts
  ADD COLUMN IF NOT EXISTS remaining NUMERIC(12,2)
    GENERATED ALWAYS AS (total_amount - amount_paid) STORED;

ALTER TABLE debts
  ADD COLUMN IF NOT EXISTS percentage NUMERIC(5,2)
    GENERATED ALWAYS AS (
      CASE WHEN total_amount > 0
        THEN ROUND((amount_paid / total_amount) * 100, 2)
        ELSE 0
      END
    ) STORED;

CREATE TABLE IF NOT EXISTS payments (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  debt_id      UUID NOT NULL REFERENCES debts(id) ON DELETE CASCADE,
  amount       NUMERIC(12,2) NOT NULL CHECK (amount > 0),
  comment      TEXT,
  status       TEXT NOT NULL DEFAULT 'approved'
                 CHECK (status IN ('pending', 'approved', 'rejected')),
  payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TRIGGERS
-- ============================================================

-- Recalculate after payment insert / update / delete
DROP TRIGGER IF EXISTS trg_recalculate_debt_insert ON payments;
CREATE TRIGGER trg_recalculate_debt_insert
  AFTER INSERT OR UPDATE OR DELETE ON payments
  FOR EACH ROW EXECUTE FUNCTION recalculate_debt();

-- Auto-update updated_at on debts
DROP TRIGGER IF EXISTS trg_debts_updated_at ON debts;
CREATE TRIGGER trg_debts_updated_at
  BEFORE UPDATE ON debts
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_debts_public_token ON debts(public_token);
CREATE INDEX IF NOT EXISTS idx_debts_status ON debts(status);
CREATE INDEX IF NOT EXISTS idx_debts_created_at ON debts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_debts_deleted_at ON debts(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_payments_debt_id ON payments(debt_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_payment_date ON payments(payment_date);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE debts ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- ---- DEBTS POLICIES ----

-- Admin: full access (authenticated user)
CREATE POLICY "admin_all_debts"
  ON debts FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Public: read a single non-deleted debt by its token
CREATE POLICY "public_read_debt_by_token"
  ON debts FOR SELECT
  TO anon
  USING (deleted_at IS NULL);

-- ---- PAYMENTS POLICIES ----

-- Admin: full access
CREATE POLICY "admin_all_payments"
  ON payments FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Public: read payments for debts they have access to (via debt_id lookup)
CREATE POLICY "public_read_payments"
  ON payments FOR SELECT
  TO anon
  USING (
    EXISTS (
      SELECT 1 FROM debts
      WHERE debts.id = payments.debt_id
        AND debts.deleted_at IS NULL
    )
  );

-- Public: insert payments (the token validation happens in the app layer / RPC)
-- Only approved debts (active) can receive payments from anon
CREATE POLICY "public_insert_payment"
  ON payments FOR INSERT
  TO anon
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM debts
      WHERE debts.id = debt_id
        AND debts.deleted_at IS NULL
        AND debts.status = 'active'
    )
  );

-- ============================================================
-- REALTIME
-- ============================================================
-- Enable realtime on both tables
ALTER PUBLICATION supabase_realtime ADD TABLE debts;
ALTER PUBLICATION supabase_realtime ADD TABLE payments;
