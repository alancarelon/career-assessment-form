-- ============================================
-- Manager Portal: Switch to 1-5 rating scale (Option B1)
-- ============================================
-- Aligns manager ratings with the associate self-assessment scale
-- (Beginner / Developing / Competent / Proficient / Expert).
-- Run once in Supabase SQL Editor.
-- ============================================

-- STEP 1: Remove existing manager assessments (old 4.5 / 3.0 / 1.5 scale)
DELETE FROM manager_assessments;

-- STEP 2: Replace rating options
DELETE FROM rating_mappings;

INSERT INTO rating_mappings (label, display_text, description, numeric_value, icon, order_index) VALUES
('expert',           'Expert',           'Master level, can teach others. Sets the standard for this area.', 5, '🏆', 1),
('proficient',       'Proficient',       'Consistently strong performance. Works independently at a high level.', 4, '⭐', 2),
('competent',        'Competent',        'Can perform independently. Meets expectations for their level.', 3, '✅', 3),
('developing',       'Developing',       'Building competency with guidance. Needs some support to improve.', 2, '🌱', 4),
('beginner',         'Beginner',         'Just starting to learn this skill. Needs close support.', 1, '📘', 5),
('unable_to_assess', 'Unable to Assess', 'Not enough evidence to judge. Flags areas needing more observation.', NULL, '❓', 6);

-- STEP 3: Verify
SELECT label, display_text, numeric_value, order_index FROM rating_mappings ORDER BY order_index;
SELECT COUNT(*) AS manager_assessments_remaining FROM manager_assessments;
