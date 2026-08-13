-- Migration: Add unique constraint on email to prevent duplicate submissions
-- Run this in Supabase SQL Editor

-- Add unique constraint on email column
ALTER TABLE assessments 
ADD CONSTRAINT unique_email UNIQUE (email);

-- Verify the constraint was added
SELECT 
    conname AS constraint_name,
    contype AS constraint_type
FROM pg_constraint
WHERE conrelid = 'assessments'::regclass
AND conname = 'unique_email';
