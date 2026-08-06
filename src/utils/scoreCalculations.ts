import { RoleQuestion, SkillWithRating } from '../data/roleQuestions'

/**
 * Get skill name from either string or SkillWithRating object
 */
export const getSkillName = (skill: string | SkillWithRating): string => {
  return typeof skill === 'string' ? skill : skill.name
}

/**
 * Get ideal rating for a skill (defaults to 3 if not specified)
 */
export const getIdealRating = (skill: string | SkillWithRating): number => {
  return typeof skill === 'string' ? 3 : skill.idealRating
}

/**
 * Category weights for XP calculation by role
 * These weights determine how much each category contributes to total XP
 */
const ROLE_CATEGORY_WEIGHTS: Record<string, Record<string, number>> = {
  'Associate UX Designer': {
    'Problem Discovery & Product Understanding': 0.15,
    'UX Research and Validation': 0.15,
    'Design Execution and Product Thinking': 0.20,
    'AI and Design Integration': 0.10,
    'Design System and Consistency': 0.10,
    'Documentation and Knowledge Sharing': 0.10,
    'Collaboration and Stakeholder Management': 0.10,
    'Professional Growth and Community Contribution': 0.10
  },
  'UX Designer': {
    'Problem Discovery & Product Understanding': 0.15,
    'UX Research and Validation': 0.15,
    'Design Execution and Product Thinking': 0.20,
    'AI and Design Integration': 0.10,
    'Design System and Consistency': 0.10,
    'Documentation and Knowledge Sharing': 0.10,
    'Collaboration and Stakeholder Management': 0.10,
    'Professional Growth and Community Contribution': 0.10
  },
  'Senior UX Designer': {
    'Discovery Leadership & Strategic Alignment': 0.15,
    'Research Leadership & Insight Generation': 0.15,
    'Product Thinking & Design Leadership': 0.15,
    'AI Adoption & Innovation Leadership': 0.10,
    'Design System and Consistency': 0.10,
    'Documentation & Operational Excellence': 0.10,
    'Collaboration, Influence & Facilitation': 0.10,
    'Mentoring & Capability Building': 0.15
  },
  'Lead UX Designer': {
    'Strategic Vision & Portfolio Leadership': 0.10,
    'Research Operations & Evidence-Based Decision Making': 0.10,
    'Product Thinking & Design Leadership': 0.10,
    'AI Strategy & Innovation Leadership': 0.10,
    'Design Systems, Standards & Governance': 0.10,
    'Design Operations & Documentation Culture': 0.05,
    'Organizational Influence & Stakeholder Leadership': 0.15,
    'Talent Development, Mentoring & Role Clarity': 0.10,
    'Organizational Growth & UX Evangelization': 0.20
  }
}

/**
 * Get category weight for a specific role and category
 */
const getCategoryWeight = (role: string, category: string): number => {
  const roleWeights = ROLE_CATEGORY_WEIGHTS[role]
  if (!roleWeights) return 0.10 // Default weight
  return roleWeights[category] || 0.10
}

/**
 * Career levels based on XP thresholds
 */
export const CAREER_LEVELS = [
  { level: 'Explorer', minXP: 0, maxXP: 199 },
  { level: 'Builder', minXP: 200, maxXP: 399 },
  { level: 'Influencer', minXP: 400, maxXP: 599 },
  { level: 'Strategist', minXP: 600, maxXP: 799 },
  { level: 'Catalyst', minXP: 800, maxXP: 1200 }
]

/**
 * Bonus XP actions
 */
export const BONUS_XP_ACTIONS = {
  COMPLETED_ASSESSMENT: 50,
  DETAILED_EXAMPLES: 50,
  IDENTIFIED_GROWTH_AREAS: 25,
  INTERESTED_IN_MENTORSHIP: 25,
  INTERESTED_IN_TEACHING: 25,
  CREATED_GROWTH_GOAL: 25
}

/**
 * Calculate XP based on skill ratings using weighted category approach
 * Step 1: Calculate average score per category
 * Step 2: Convert to percentage (score / 5)
 * Step 3: Apply category weight
 * Step 4: Sum all weighted contributions
 * Step 5: Convert to XP (multiply by 10)
 */
export const calculateXP = (
  skillRatings: Record<string, { rating: number; example: string }>,
  roleConfig: RoleQuestion,
  role: string
): number => {
  let totalScore = 0
  
  roleConfig.skillCategories.forEach((category) => {
    // Skip non-scored categories
    if (category.isScored === false) return
    
    // Step 1: Calculate average score for this category
    let categorySum = 0
    let questionCount = 0
    
    category.skills.forEach((skill) => {
      const skillName = getSkillName(skill)
      const rating = skillRatings[skillName]?.rating || 0
      categorySum += rating
      questionCount++
    })
    
    if (questionCount === 0) return
    
    const categoryAverage = categorySum / questionCount
    
    // Step 2: Convert to percentage (0-100%)
    const categoryPercentage = categoryAverage / 5
    
    // Step 3: Get category weight for this role
    const weight = getCategoryWeight(role, category.category)
    
    // Step 4: Apply weight and add to total
    totalScore += categoryPercentage * weight
  })
  
  // Step 5: Convert to XP (multiply by 100 to get 0-100, then by 10 to get 0-1000)
  const baseXP = Math.round(totalScore * 1000)
  
  return baseXP
}

/**
 * Calculate readiness score (0-100%)
 * Uses benchmark comparison: counts how many skills meet or exceed ideal rating
 */
export const calculateReadinessScore = (
  skillRatings: Record<string, { rating: number; example: string }>,
  roleConfig: RoleQuestion
): number => {
  let benchmarksMet = 0
  let totalBenchmarks = 0
  
  roleConfig.skillCategories.forEach((category) => {
    // Skip non-scored categories
    if (category.isScored === false) return
    
    category.skills.forEach((skill) => {
      const skillName = getSkillName(skill)
      const idealRating = getIdealRating(skill)
      const actualRating = skillRatings[skillName]?.rating || 0
      
      totalBenchmarks++
      
      // Check if benchmark is met (actual >= ideal)
      if (actualRating >= idealRating) {
        benchmarksMet++
      }
    })
  })
  
  if (totalBenchmarks === 0) return 0
  
  // Calculate percentage of benchmarks met
  const readiness = (benchmarksMet / totalBenchmarks) * 100
  
  return Math.round(readiness)
}

/**
 * Get skills that need improvement (actual < ideal)
 */
export const getSkillGaps = (
  skillRatings: Record<string, { rating: number; example: string }>,
  roleConfig: RoleQuestion
): Array<{ skillName: string; category: string; gap: number; idealRating: number; actualRating: number }> => {
  const gaps: Array<{ skillName: string; category: string; gap: number; idealRating: number; actualRating: number }> = []
  
  roleConfig.skillCategories.forEach((category) => {
    if (category.isScored === false) return
    
    category.skills.forEach((skill) => {
      const skillName = getSkillName(skill)
      const idealRating = getIdealRating(skill)
      const actualRating = skillRatings[skillName]?.rating || 0
      
      if (actualRating < idealRating) {
        gaps.push({
          skillName,
          category: category.category,
          gap: idealRating - actualRating,
          idealRating,
          actualRating
        })
      }
    })
  })
  
  // Sort by gap size (largest gaps first)
  return gaps.sort((a, b) => b.gap - a.gap)
}

/**
 * Get total number of scored skills
 */
export const getTotalScoredSkills = (roleConfig: RoleQuestion): number => {
  let count = 0
  
  roleConfig.skillCategories.forEach((category) => {
    if (category.isScored !== false) {
      count += category.skills.length
    }
  })
  
  return count
}

/**
 * Calculate bonus XP based on user actions
 */
export const calculateBonusXP = (
  hasDetailedExamples: boolean,
  hasIdentifiedGrowthAreas: boolean,
  interestedInMentorship: boolean,
  interestedInTeaching: boolean,
  hasCreatedGrowthGoal: boolean
): number => {
  let bonusXP = BONUS_XP_ACTIONS.COMPLETED_ASSESSMENT // Always awarded for completing
  
  if (hasDetailedExamples) bonusXP += BONUS_XP_ACTIONS.DETAILED_EXAMPLES
  if (hasIdentifiedGrowthAreas) bonusXP += BONUS_XP_ACTIONS.IDENTIFIED_GROWTH_AREAS
  if (interestedInMentorship) bonusXP += BONUS_XP_ACTIONS.INTERESTED_IN_MENTORSHIP
  if (interestedInTeaching) bonusXP += BONUS_XP_ACTIONS.INTERESTED_IN_TEACHING
  if (hasCreatedGrowthGoal) bonusXP += BONUS_XP_ACTIONS.CREATED_GROWTH_GOAL
  
  return bonusXP
}

/**
 * Get career level based on XP
 */
export const getCareerLevel = (xp: number): { level: string; minXP: number; maxXP: number } => {
  for (const level of CAREER_LEVELS) {
    if (xp >= level.minXP && xp <= level.maxXP) {
      return level
    }
  }
  return CAREER_LEVELS[CAREER_LEVELS.length - 1] // Return highest level if XP exceeds max
}

/**
 * Get next career level
 */
export const getNextCareerLevel = (currentXP: number): { level: string; minXP: number; maxXP: number } | null => {
  const currentLevel = getCareerLevel(currentXP)
  const currentIndex = CAREER_LEVELS.findIndex(l => l.level === currentLevel.level)
  
  if (currentIndex < CAREER_LEVELS.length - 1) {
    return CAREER_LEVELS[currentIndex + 1]
  }
  
  return null // Already at max level
}
