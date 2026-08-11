-- Create the assessments table
CREATE TABLE IF NOT EXISTS assessments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  
  -- Personal Information
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  current_role TEXT NOT NULL,
  years_of_experience TEXT NOT NULL,
  
  -- Skills (stored as JSONB for flexibility)
  ux_research_skills JSONB NOT NULL,
  design_systems_skills JSONB NOT NULL,
  leadership_skills JSONB NOT NULL,
  
  -- Career Goals
  short_term_goals TEXT NOT NULL,
  long_term_goals TEXT NOT NULL,
  areas_for_growth TEXT NOT NULL,
  learning_preferences TEXT[] NOT NULL,
  
  -- Additional
  additional_comments TEXT
);

-- Create an index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_assessments_email ON assessments(email);

-- Create an index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_assessments_created_at ON assessments(created_at DESC);

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
