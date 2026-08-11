import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface AssessmentSubmission {
  id?: string
  created_at?: string
  
  // Personal Information
  name: string
  email: string
  agid?: string
  current_role: string
  
  // Step 1: Career Vision
  career_growth?: string
  future_vision?: string
  growth_areas?: string[]
  
  // Step 2: Self Assessment
  skill_ratings?: Record<string, { rating: number; example: string }>
  multi_select_responses?: Record<string, string[]>
  
  // Step 3: Superpowers
  strengths?: string[]
  teammates_feedback?: string
  proud_accomplishment?: string
  
  // Step 4: Growth Opportunities
  skills_to_improve?: string[]
  growth_limits?: string[]
  learning_style?: string[]
  
  // Step 5: Community
  teaching_topic?: string
  mentor_interest?: string
  
  // Step 6: Commitment
  six_month_goal?: string
  goal_importance?: string
}
