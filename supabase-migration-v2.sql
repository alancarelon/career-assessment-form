-- Drop the old table and create new comprehensive schema
DROP TABLE IF EXISTS assessments CASCADE;

-- Create the new assessments table with complete data capture
CREATE TABLE assessments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  
  -- Personal Information
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  agid TEXT,
  current_role TEXT NOT NULL,
  
  -- Step 1: Career Vision
  career_growth TEXT,
  future_vision TEXT,
  growth_areas TEXT[],
  
  -- Step 2: Self Assessment
  skill_ratings JSONB DEFAULT '{}'::jsonb,
  multi_select_responses JSONB DEFAULT '{}'::jsonb,
  
  -- Step 3: Superpowers
  strengths TEXT[],
  teammates_feedback TEXT,
  proud_accomplishment TEXT,
  
  -- Step 4: Growth Opportunities
  skills_to_improve TEXT[],
  growth_limits TEXT[],
  learning_style TEXT[],
  
  -- Step 5: Community
  teaching_topic TEXT,
  mentor_interest TEXT,
  
  -- Step 6: Commitment
  six_month_goal TEXT,
  goal_importance TEXT
);

-- Create indexes for better query performance
CREATE INDEX idx_assessments_email ON assessments(email);
CREATE INDEX idx_assessments_created_at ON assessments(created_at DESC);
CREATE INDEX idx_assessments_current_role ON assessments(current_role);
CREATE INDEX idx_assessments_skill_ratings ON assessments USING GIN (skill_ratings);

-- Enable Row Level Security (RLS)
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows anyone to insert (for form submissions)
CREATE POLICY "Allow public inserts" ON assessments
  FOR INSERT
  WITH CHECK (true);

-- Create a policy that allows anyone to read (you can restrict this later)
CREATE POLICY "Allow public reads" ON assessments
  FOR SELECT
  USING (true);
