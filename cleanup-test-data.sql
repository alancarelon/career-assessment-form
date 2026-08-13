-- Cleanup Script: Remove all test data before production
-- Run this in Supabase SQL Editor

-- STEP 1: Delete all existing test submissions
DELETE FROM assessments;

-- STEP 2: Verify cleanup was successful
SELECT 
  COUNT(*) as total_records,
  COUNT(DISTINCT email) as unique_emails
FROM assessments;
-- Expected result: total_records = 0, unique_emails = 0

-- STEP 3: Verify the unique email constraint is still active
SELECT 
    conname AS constraint_name,
    contype AS constraint_type
FROM pg_constraint
WHERE conrelid = 'assessments'::regclass
AND conname = 'unique_email';
-- Expected result: unique_email | u
