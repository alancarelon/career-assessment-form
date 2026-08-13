import { SUPERPOWER_INSIGHTS, GROWTH_EDGE_INSIGHTS, ROLE_MESSAGES, MOTIVATIONAL_QUOTES } from '../data/insights'
import { RESOURCES, LEARNING_STYLE_TIPS, Resource } from '../data/resources'

interface FormData {
  name: string
  currentRole: string
  skillRatings: Record<string, { rating: number; example: string }>
  strengths: string[]
  skillsToImprove: string[]
  learningStyle: string[]
  sixMonthGoal: string
  mentorInterest: string
  growthAreas: string[]
  careerGrowth: string
  futureVision: string
  proudAccomplishment: string
}

export interface GeneratedInsights {
  superpower: string
  growthEdge: string
  uniquePath: string
  roleMessage: string
  motivationalQuote: string
  topStrengths: Array<{ skill: string; rating: number }>
  growthOpportunities: Array<{ skill: string; rating: number }>
  avgRating: number
  recommendations: Resource[]
  learningTips: string[]
}

export function generateInsights(formData: FormData): GeneratedInsights {
  // Analyze skill ratings
  const skillEntries = Object.entries(formData.skillRatings || {})
  const sortedByRating = skillEntries.sort((a, b) => b[1].rating - a[1].rating)
  
  const topStrengths = sortedByRating
    .slice(0, 3)
    .map(([skill, data]) => ({ skill, rating: data.rating }))
  
  const growthOpportunities = sortedByRating
    .slice(-3)
    .reverse()
    .map(([skill, data]) => ({ skill, rating: data.rating }))
  
  const avgRating = skillEntries.length > 0
    ? skillEntries.reduce((sum, [, data]) => sum + data.rating, 0) / skillEntries.length
    : 0
  
  // Generate superpower insight
  const topSkill = topStrengths[0]?.skill || 'User Research'
  const superpowerTemplates = SUPERPOWER_INSIGHTS[topSkill] || SUPERPOWER_INSIGHTS['User Research']
  const superpower = superpowerTemplates[Math.floor(Math.random() * superpowerTemplates.length)]
  
  // Generate growth edge insight
  const lowestSkill = growthOpportunities[0]?.skill || 'Design Systems'
  const growthEdgeTemplates = GROWTH_EDGE_INSIGHTS[lowestSkill] || GROWTH_EDGE_INSIGHTS['Design Systems']
  const growthEdge = growthEdgeTemplates[Math.floor(Math.random() * growthEdgeTemplates.length)]
  
  // Generate unique path insight
  const uniquePath = generateUniquePath(formData)
  
  // Get role message
  const roleTemplates = ROLE_MESSAGES[formData.currentRole] || ROLE_MESSAGES['UX Designer']
  const roleMessage = roleTemplates[Math.floor(Math.random() * roleTemplates.length)]
  
  // Get motivational quote
  const motivationalQuote = MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)]
  
  // Generate resource recommendations
  const recommendations = generateRecommendations(formData, growthOpportunities)
  
  // Get learning tips
  const learningTips = generateLearningTips(formData.learningStyle)
  
  return {
    superpower,
    growthEdge,
    uniquePath,
    roleMessage,
    motivationalQuote,
    topStrengths,
    growthOpportunities,
    avgRating: Math.round(avgRating * 10) / 10,
    recommendations,
    learningTips
  }
}

function generateUniquePath(formData: FormData): string {
  const hasHandsOn = formData.learningStyle.includes('Hands-on projects')
  const hasMentorship = formData.learningStyle.includes('Mentorship and coaching')
  const hasOnlineCourses = formData.learningStyle.includes('Online courses')
  const mentorInterested = formData.mentorInterest?.toLowerCase().includes('yes')
  
  // Hands-on + Mentorship
  if (hasHandsOn && mentorInterested) {
    return "Your hands-on learning style combined with your interest in mentoring creates a unique opportunity: you learn best by teaching. Consider leading workshops where you build and teach simultaneously."
  }
  
  // Online courses + specific growth area
  if (hasOnlineCourses && formData.skillsToImprove.length > 0) {
    return "Your preference for structured learning makes you ideal for systematic skill development. Online courses will give you the framework you need to build your target skills methodically."
  }
  
  // Mentorship + leadership goals
  if (mentorInterested && formData.sixMonthGoal) {
    return "Your interest in mentoring aligns perfectly with your goals. Start mentoring now—it's the fastest path to developing leadership skills while helping others grow."
  }
  
  // Hands-on + top strength
  if (hasHandsOn) {
    return "Your hands-on learning style means you learn by building. Tackle your growth areas through side projects and experiments that stretch your capabilities."
  }
  
  // Default
  return "Your unique combination of learning preferences and goals positions you for personalized growth. Focus on approaches that energize you most—that's where sustainable learning happens."
}

function generateRecommendations(
  formData: FormData,
  growthOpportunities: Array<{ skill: string; rating: number }>
): Resource[] {
  const recommendations: Resource[] = []
  
  // Get resources for top 2 growth areas
  growthOpportunities.slice(0, 2).forEach(({ skill }) => {
    const skillResources = RESOURCES[skill] || []
    
    // Prioritize recommended and free resources
    const recommended = skillResources.filter(r => r.recommended)
    const free = skillResources.filter(r => r.free && !r.recommended)
    const paid = skillResources.filter(r => !r.free && !r.recommended)
    
    // Add top 3 resources per skill
    recommendations.push(...recommended.slice(0, 2))
    recommendations.push(...free.slice(0, 1))
    if (recommendations.length < 3) {
      recommendations.push(...paid.slice(0, 1))
    }
  })
  
  return recommendations.slice(0, 6) // Max 6 recommendations
}

function generateLearningTips(learningStyles: string[]): string[] {
  const tips: string[] = []
  
  learningStyles.forEach(style => {
    const styleTips = LEARNING_STYLE_TIPS[style] || []
    tips.push(...styleTips.slice(0, 2)) // 2 tips per style
  })
  
  return tips.slice(0, 4) // Max 4 tips
}
