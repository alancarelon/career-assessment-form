-- ============================================
-- Security hardening: require manager token header for manager-only writes
-- ============================================
-- Adds a shared check: the request must carry
--   x-manager-token: manager_access_2024
-- for DELETE/UPDATE on manager_assessments and
-- INSERT/UPDATE/DELETE on stakeholder_assignments.
--
-- Reads and stakeholder assessment submission stay open
-- (public pages need them). No data is modified.
-- ============================================

-- Helper expression used below:
--   current_setting('request.headers', true)::jsonb ->> 'x-manager-token' = 'manager_access_2024'

-- manager_assessments: keep public INSERT + SELECT (stakeholder page submits here),
-- restrict UPDATE + DELETE to manager token
DROP POLICY IF EXISTS "Allow update manager assessments" ON manager_assessments;
DROP POLICY IF EXISTS "Allow delete manager assessments" ON manager_assessments;

CREATE POLICY "Manager token required to update manager assessments"
  ON manager_assessments FOR UPDATE
  USING (current_setting('request.headers', true)::jsonb ->> 'x-manager-token' = 'manager_access_2024')
  WITH CHECK (current_setting('request.headers', true)::jsonb ->> 'x-manager-token' = 'manager_access_2024');

CREATE POLICY "Manager token required to delete manager assessments"
  ON manager_assessments FOR DELETE
  USING (current_setting('request.headers', true)::jsonb ->> 'x-manager-token' = 'manager_access_2024');

-- stakeholder_assignments: reads + status updates stay public (stakeholder page),
-- inserts (assign) and deletes (remove) require manager token
DROP POLICY IF EXISTS "Allow insert stakeholder assignments" ON stakeholder_assignments;
DROP POLICY IF EXISTS "Allow update stakeholder assignments" ON stakeholder_assignments;
DROP POLICY IF EXISTS "Allow delete stakeholder assignments" ON stakeholder_assignments;

CREATE POLICY "Manager token required to insert stakeholder assignments"
  ON stakeholder_assignments FOR INSERT
  WITH CHECK (current_setting('request.headers', true)::jsonb ->> 'x-manager-token' = 'manager_access_2024');

CREATE POLICY "Manager token required to delete stakeholder assignments"
  ON stakeholder_assignments FOR DELETE
  USING (current_setting('request.headers', true)::jsonb ->> 'x-manager-token' = 'manager_access_2024');

-- Stakeholder marks their own assignment completed via the public page;
-- only the status/completed_at fields may change without the token.
CREATE POLICY "Allow stakeholder completion update"
  ON stakeholder_assignments FOR UPDATE
  USING (status = 'pending')
  WITH CHECK (
    status = 'completed'
    OR current_setting('request.headers', true)::jsonb ->> 'x-manager-token' = 'manager_access_2024'
  );

-- Verify
SELECT tablename, policyname, cmd FROM pg_policies
WHERE tablename IN ('manager_assessments', 'stakeholder_assignments')
ORDER BY tablename, cmd;
