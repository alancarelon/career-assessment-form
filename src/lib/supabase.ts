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
  career_growth_other?: string
  future_vision?: string
  future_vision_other?: string
  growth_areas?: string[]
  growth_areas_other?: string
  
  // Step 2: Self Assessment
  skill_ratings?: Record<string, { rating: number; example: string }>
  multi_select_responses?: Record<string, string[]>
  
  // Step 3: Superpowers
  strengths?: string[]
  strengths_other?: string
  teammates_feedback?: string
  proud_accomplishment?: string
  
  // Step 4: Growth Opportunities
  skills_to_improve?: string[]
  skills_to_improve_other?: string
  growth_limits?: string[]
  growth_limits_other?: string
  learning_style?: string[]
  
  // Step 5: Community
  teaching_topic?: string
  mentor_interest?: string
  
  // Step 6: Commitment
  six_month_goal?: string
  goal_importance?: string
}
