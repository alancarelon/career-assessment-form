// REPLACEMENT CODE FOR getSkillDistribution function (lines 144-164)
// Replace the entire getSkillDistribution function with this:

const getCategoryDistribution = () => {
  const categoryKeywords: Record<string, string[]> = {
    'Problem Discovery & Product Understanding': ['problem', 'discovery', 'define', 'business objective', 'success criteria', 'alignment'],
    'UX Research and Validation': ['research', 'usability testing', 'user feedback', 'insights', 'validation'],
    'Design Execution and Craft': ['wireframes', 'high-fidelity', 'prototypes', 'flows', 'iterate'],
    'AI and Design Integration': ['AI tools', 'AI workflow', 'AI-enabled', 'AI to accelerate'],
    'Design System and Consistency': ['Design System', 'components', 'patterns', 'accessibility', 'consistency'],
    'Collaboration & Communication': ['stakeholder', 'cross-functional', 'communicate', 'present', 'feedback'],
    'Strategic Thinking & Impact': ['strategic', 'business impact', 'metrics', 'advocate', 'authority']
  }

  const categoryData: Record<string, { ratings: number[], associates: Set<string> }> = {}
  
  Object.keys(categoryKeywords).forEach(category => {
    categoryData[category] = { ratings: [], associates: new Set() }
  })

  assessments.forEach(assessment => {
    if (assessment.skill_ratings) {
      Object.entries(assessment.skill_ratings).forEach(([skillName, data]: [string, any]) => {
        const rating = typeof data === 'object' ? data.rating : Number(data)
        const skillLower = skillName.toLowerCase()
        
        for (const [category, keywords] of Object.entries(categoryKeywords)) {
          if (keywords.some(keyword => skillLower.includes(keyword.toLowerCase()))) {
            categoryData[category].ratings.push(rating)
            categoryData[category].associates.add(assessment.id!)
            break
          }
        }
      })
    }
  })

  return Object.entries(categoryData)
    .filter(([_, data]) => data.ratings.length > 0)
    .map(([category, data]) => ({
      category,
      average: data.ratings.reduce((a, b) => a + b, 0) / data.ratings.length,
      associateCount: data.associates.size
    }))
    .sort((a, b) => b.average - a.average)
}
