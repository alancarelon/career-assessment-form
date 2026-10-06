-- ============================================
-- PHASE 2: Stakeholder Assignments
-- ============================================
-- Creates a NEW table for stakeholder delegation.
-- Does NOT modify 'assessments' or 'manager_assessments'.
-- Stakeholder submissions are stored in manager_assessments
-- with assessor_role = 'stakeholder'.
-- Safe to run - no impact on current system.
-- ============================================

CREATE TABLE IF NOT EXISTS stakeholder_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  associate_assessment_id UUID REFERENCES assessments(id) ON DELETE CASCADE NOT NULL,
  stakeholder_name TEXT NOT NULL,
  stakeholder_email TEXT NOT NULL,
  -- Unique token used in the public assessment link (/stakeholder-assess/:token)
  token UUID NOT NULL DEFAULT uuid_generate_v4() UNIQUE,
  status TEXT DEFAULT 'pending', -- 'pending' | 'completed'
  created_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  -- One stakeholder per associate
  UNIQUE(associate_assessment_id)
);

CREATE INDEX IF NOT EXISTS idx_stakeholder_assignments_token ON stakeholder_assignments(token);
CREATE INDEX IF NOT EXISTS idx_stakeholder_assignments_associate ON stakeholder_assignments(associate_assessment_id);

ALTER TABLE stakeholder_assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read stakeholder assignments"
  ON stakeholder_assignments FOR SELECT
  USING (true);

CREATE POLICY "Allow insert stakeholder assignments"
  ON stakeholder_assignments FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow update stakeholder assignments"
  ON stakeholder_assignments FOR UPDATE
  USING (true);

CREATE POLICY "Allow delete stakeholder assignments"
  ON stakeholder_assignments FOR DELETE
  USING (true);

-- Fix: manager_assessments had no DELETE policy in Phase 1, so RLS silently
-- blocked deletes (used by the dashboard Reset button). No data is affected.
CREATE POLICY "Allow delete manager assessments"
  ON manager_assessments FOR DELETE
  USING (true);

-- Verification
SELECT 'Stakeholder assignments table ready:' AS status, COUNT(*) AS count FROM stakeholder_assignments;
