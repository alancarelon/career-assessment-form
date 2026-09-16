-- ============================================
-- PHASE 1: Manager Portal Database Migration
-- ============================================
-- This creates NEW tables for the manager portal
-- Does NOT modify existing 'assessments' table
-- Safe to run - no impact on current system
-- ============================================

-- Table 1: Rating Mappings (Reference data for the 4 rating options)
CREATE TABLE IF NOT EXISTS rating_mappings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  label TEXT NOT NULL UNIQUE,
  display_text TEXT NOT NULL,
  description TEXT,
  numeric_value DECIMAL,
  icon TEXT,
  order_index INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Table 2: Manager Assessments (Stores manager's ratings for each associate)
CREATE TABLE IF NOT EXISTS manager_assessments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  associate_assessment_id UUID REFERENCES assessments(id) ON DELETE CASCADE,
  assessor_name TEXT NOT NULL,
  assessor_email TEXT NOT NULL,
  assessor_role TEXT DEFAULT 'manager',
  
  -- Category ratings (stores label like 'on_track', 'consistently_strong', etc.)
  category_ratings JSONB NOT NULL DEFAULT '{}',
  -- Example: {
  --   "ux_research": "on_track",
  --   "interaction_design": "consistently_strong",
  --   "visual_design": "needs_development",
  --   ...
  -- }
  
  -- Numeric values (for gap analysis calculations)
  category_ratings_numeric JSONB DEFAULT '{}',
  -- Example: {
  --   "ux_research": 3.0,
  --   "interaction_design": 4.5,
  --   "visual_design": 1.5,
  --   ...
  -- }
  
  -- Overall notes from manager
  overall_notes TEXT,
  
  -- Status tracking
  assessment_status TEXT DEFAULT 'in_progress',
  progress INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  
  -- Ensure one manager assessment per associate
  UNIQUE(associate_assessment_id, assessor_email)
);

-- Seed the 4 rating options
INSERT INTO rating_mappings (label, display_text, description, numeric_value, icon, order_index) VALUES
('consistently_strong', 'Consistently Strong', 'I regularly see them performing at a high level in this area. They could mentor others in this skill.', 4.5, '✨', 1),
('on_track', 'On Track', 'They perform competently in this area. Meets expectations for their level.', 3.0, '✅', 2),
('needs_development', 'Needs Development', 'I see gaps in this area. They need support/guidance to improve.', 1.5, '📚', 3),
('unable_to_assess', 'Unable to Assess', 'I haven''t seen enough evidence to judge. This flags areas needing more observation.', NULL, '❓', 4)
ON CONFLICT (label) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_manager_assessments_associate ON manager_assessments(associate_assessment_id);
CREATE INDEX IF NOT EXISTS idx_manager_assessments_status ON manager_assessments(assessment_status);
CREATE INDEX IF NOT EXISTS idx_manager_assessments_email ON manager_assessments(assessor_email);

-- Enable Row Level Security (RLS)
ALTER TABLE rating_mappings ENABLE ROW LEVEL SECURITY;
ALTER TABLE manager_assessments ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Allow read access to rating_mappings (reference data)
CREATE POLICY "Allow public read access to rating mappings"
  ON rating_mappings FOR SELECT
  USING (true);

-- RLS Policies: Allow insert/update for manager_assessments
CREATE POLICY "Allow insert manager assessments"
  ON manager_assessments FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow read manager assessments"
  ON manager_assessments FOR SELECT
  USING (true);

CREATE POLICY "Allow update manager assessments"
  ON manager_assessments FOR UPDATE
  USING (true);

-- Verification queries (run these to confirm everything worked)
SELECT 'Rating mappings created:' as status, COUNT(*) as count FROM rating_mappings;
SELECT 'Manager assessments table ready:' as status, COUNT(*) as count FROM manager_assessments;
SELECT 'Tables created successfully!' as message;
