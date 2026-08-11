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
  name: string
  email: string
  current_role: string
  years_of_experience: string
  ux_research_skills: {
    userInterviews: number
    usabilityTesting: number
    dataAnalysis: number
    researchPlanning: number
  }
  design_systems_skills: {
    componentLibraries: number
    designTokens: number
    documentation: number
    accessibility: number
  }
  leadership_skills: {
    teamMentoring: number
    projectManagement: number
    stakeholderCommunication: number
    strategicThinking: number
  }
  short_term_goals: string
  long_term_goals: string
  areas_for_growth: string
  learning_preferences: string[]
  additional_comments: string
}
