-- Migration: Add "Other" text fields ONLY (email constraint already exists)
-- Run this in Supabase SQL Editor BEFORE launching to team
-- Date: 2026-08-27

-- ============================================
-- STEP 1: Add new "Other" text fields
-- ============================================
-- These fields capture custom user input when "Other" is selected

ALTER TABLE assessments 
ADD COLUMN IF NOT EXISTS strengths_other TEXT,
ADD COLUMN IF NOT EXISTS skills_to_improve_other TEXT,
ADD COLUMN IF NOT EXISTS growth_limits_other TEXT,
ADD COLUMN IF NOT EXISTS career_growth_other TEXT,
ADD COLUMN IF NOT EXISTS future_vision_other TEXT,
ADD COLUMN IF NOT EXISTS growth_areas_other TEXT;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Verify new columns were added
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'assessments'
AND column_name IN (
  'strengths_other',
  'skills_to_improve_other', 
  'growth_limits_other',
  'career_growth_other',
  'future_vision_other',
  'growth_areas_other'
)
ORDER BY column_name;
-- Expected: 6 rows showing all new columns

-- Verify email uniqueness constraint exists (should already be there)
SELECT 
    conname AS constraint_name,
    contype AS constraint_type
FROM pg_constraint
WHERE conrelid = 'assessments'::regclass
AND conname = 'unique_email';
-- Expected: unique_email | u

-- Check current table structure
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'assessments'
ORDER BY ordinal_position;

-- ============================================
-- SUCCESS MESSAGE
-- ============================================
-- If verification shows 6 new columns, migration is complete!
-- Email uniqueness was already in place (good!)
-- Next step: Clean test data using cleanup-test-data.sql
