import { roleBasedQuestions } from './roleQuestions'
import { getSkillName, getIdealRating } from '../utils/scoreCalculations'

export type CategoryId =
  | 'problem_discovery'
  | 'ux_research'
  | 'design_execution'
  | 'ai_integration'
  | 'design_systems'
  | 'documentation'
  | 'collaboration'
  | 'professional_growth'

export interface CategoryInfo {
  id: CategoryId
  name: string
  questions: string[]
}

export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'problem_discovery',
    name: 'Problem Discovery & Product Understanding',
    questions: [
      'How effectively do they define problems, user needs, and business goals before starting design work?',
      'How well do they create discovery briefs and align with stakeholders on project direction?'
    ]
  },
  {
    id: 'ux_research',
    name: 'UX Research and Validation',
    questions: [
      'How effectively do they plan and conduct usability testing or evaluative research?',
      'How well do they synthesize research findings into actionable design insights?'
    ]
  },
  {
    id: 'design_execution',
    name: 'Design Execution and Craft',
    questions: [
      'How effectively do they translate requirements into flows, wireframes, and high-fidelity designs?',
      'How well do they balance user needs, business goals, and technical constraints in their designs?'
    ]
  },
  {
    id: 'ai_integration',
    name: 'AI and Design Integration',
    questions: [
      'How effectively do they use AI tools to support their UX workflow (research, ideation, documentation)?',
      'How well do they identify opportunities where AI can improve the user experience?'
    ]
  },
  {
    id: 'design_systems',
    name: 'Design System and Consistency',
    questions: [
      'How consistently do they use approved Design System components and patterns?',
      'How well do they understand and apply accessibility and consistency guidelines?'
    ]
  },
  {
    id: 'documentation',
    name: 'Documentation and Knowledge Sharing',
    questions: [
      'How effectively do they create complete documentation to support design handoffs?',
      'How clearly do their artifacts communicate design intent and decisions to engineers and stakeholders?'
    ]
  },
  {
    id: 'collaboration',
    name: 'Collaboration and Stakeholder Management',
    questions: [
      'How effectively do they present their work and engage stakeholders throughout the design process?',
      'How well do they incorporate cross-functional feedback and manage expectations?'
    ]
  },
  {
    id: 'professional_growth',
    name: 'Professional Growth and Community Contribution',
    questions: [
      'How actively do they invest in developing new UX skills and knowledge?',
      'How effectively do they share knowledge and contribute to the design community?'
    ]
  }
]

export const ROLE_CATEGORY_MAP: Record<string, CategoryId> = {
  'Problem Discovery & Product Understanding': 'problem_discovery',
  'UX Research and Validation': 'ux_research',
  'Design Execution and Craft': 'design_execution',
  'Design Execution and Product Thinking': 'design_execution',
  'AI and Design Integration': 'ai_integration',
  'Design System and Consistency': 'design_systems',
  'Documentation and Knowledge Sharing': 'documentation',
  'Collaboration and Stakeholder Management': 'collaboration',
  'Professional Growth and Community Contribution': 'professional_growth',

  'Discovery Leadership & Strategic Alignment': 'problem_discovery',
  'Research Leadership & Insight Generation': 'ux_research',
  'Product Thinking & Design Leadership': 'design_execution',
  'AI Adoption & Innovation Leadership': 'ai_integration',
  'Documentation & Operational Excellence': 'documentation',
  'Mentoring & Capability Building': 'professional_growth',
  'Collaboration, Influence & Facilitation': 'collaboration',

  'Strategic Vision & Portfolio Leadership': 'problem_discovery',
  'Research Operations & Evidence-Based Decision Making': 'ux_research',
  'AI Strategy & Innovation Leadership': 'ai_integration',
  'Design Systems, Standards & Governance': 'design_systems',
  'Design Operations & Documentation Culture': 'documentation',
  'Talent Development, Mentoring & Role Clarity': 'professional_growth',
  'Organizational Influence & Stakeholder Leadership': 'collaboration',
  'Organizational Growth & UX Evangelization': 'professional_growth'
}

const buildSkillLookup = (role: string): Record<string, CategoryId> => {
  const roles = roleBasedQuestions[role] ? [roleBasedQuestions[role]] : Object.values(roleBasedQuestions)
  const lookup: Record<string, CategoryId> = {}
  roles.forEach(roleQuestions => {
    roleQuestions.skillCategories.forEach(cat => {
      const categoryId = ROLE_CATEGORY_MAP[cat.category]
      if (!categoryId) return
      cat.skills.forEach(skill => {
        const name = getSkillName(skill)
        if (!(name in lookup)) lookup[name] = categoryId
      })
    })
  })
  return lookup
}

export const getSelfCategoryRatings = (
  skillRatings: Record<string, any> | null | undefined,
  role: string
): Record<CategoryId, number | null> => {
  const result = Object.fromEntries(CATEGORIES.map(c => [c.id, null])) as Record<CategoryId, number | null>
  if (!skillRatings) return result

  const lookup = buildSkillLookup(role)
  const buckets: Partial<Record<CategoryId, number[]>> = {}

  Object.entries(skillRatings).forEach(([skillName, value]) => {
    const categoryId = lookup[skillName]
    if (!categoryId) return
    const rating = typeof value === 'object' && value !== null ? Number(value.rating) : Number(value)
    if (!rating || isNaN(rating)) return
    ;(buckets[categoryId] ||= []).push(rating)
  })

  Object.entries(buckets).forEach(([categoryId, ratings]) => {
    if (ratings && ratings.length > 0) {
      result[categoryId as CategoryId] = ratings.reduce((a, b) => a + b, 0) / ratings.length
    }
  })

  return result
}

export const getExpectedCategoryRatings = (
  role: string
): Record<CategoryId, number | null> => {
  const result = Object.fromEntries(CATEGORIES.map(c => [c.id, null])) as Record<CategoryId, number | null>
  const roleQuestions = roleBasedQuestions[role]
  if (!roleQuestions) return result

  const buckets: Partial<Record<CategoryId, number[]>> = {}
  roleQuestions.skillCategories.forEach(cat => {
    const categoryId = ROLE_CATEGORY_MAP[cat.category]
    if (!categoryId || cat.questionType === 'multiselect') return
    cat.skills.forEach(skill => {
      ;(buckets[categoryId] ||= []).push(getIdealRating(skill))
    })
  })

  Object.entries(buckets).forEach(([categoryId, ratings]) => {
    if (ratings && ratings.length > 0) {
      result[categoryId as CategoryId] = ratings.reduce((a, b) => a + b, 0) / ratings.length
    }
  })

  return result
}
