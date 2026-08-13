import { useState, useEffect } from 'react'
import { ArrowRight, ArrowLeft, Sparkles, Target, Users, TrendingUp, Award, Zap, Download, BarChart2 } from 'lucide-react'
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell } from 'recharts'
import Button from './Button'
import Card from './Card'
import Badge from './Badge'
import { roleBasedQuestions } from '../data/roleQuestions'
import { calculateXP, getSkillName, getCareerLevel, getNextCareerLevel, CAREER_LEVELS } from '../utils/scoreCalculations'
import { supabase } from '../lib/supabase'

interface FormData {
  // Step 1: Career Aspirations
  careerGrowth: string
  futureVision: string
  growthAreas: string[]
  
  // Track selection removed - all skills assessed for everyone
  
  // Step 3: Self Assessment
  skillRatings: Record<string, { rating: number; example: string }>
  multiSelectResponses: Record<string, string[]> // For multiselect questions (question -> selected options)
  
  // Step 4: Superpowers
  strengths: string[]
  teammatesFeedback: string
  proudAccomplishment: string
  
  // Step 5: Growth Opportunities
  skillsToImprove: string[]
  growthLimits: string[]
  learningStyle: string[]
  
  // Step 6: Community
  teachingTopic: string
  mentorInterest: string
  
  // Step 7: Commitment
  sixMonthGoal: string
  goalImportance: string
  
  // Personal Info
  name: string
  agid: string
  email: string
  currentRole: string
}

const initialFormData: FormData = {
  careerGrowth: '',
  futureVision: '',
  growthAreas: [],
  skillRatings: {},
  multiSelectResponses: {},
  strengths: [],
  teammatesFeedback: '',
  proudAccomplishment: '',
  skillsToImprove: [],
  growthLimits: [],
  learningStyle: [],
  teachingTopic: '',
  mentorInterest: '',
  sixMonthGoal: '',
  goalImportance: '',
  name: '',
  agid: '',
  email: '',
  currentRole: 'Associate UX Designer',
}

const careerOptions = [
  'UX Specialist',
  'Senior UX Designer',
  'Lead Designer',
  'Design Manager',
  'Product Strategist',
  'Design Researcher',
  'Design Systems Specialist',
  'Not Sure Yet',
]

const futureVisionOptions = [
  'Growing into my next role',
  'Becoming a domain expert',
  'Leading projects',
  'Leading teams',
  'Driving product strategy',
  'Influencing business decisions',
]

const growthAreasOptions = [
  'Research',
  'Strategy',
  'Communication',
  'Accessibility',
  'Leadership',
  'AI for Design',
  'Business Acumen',
  'Stakeholder Management',
  'Design Systems',
  'Product Thinking',
  'Data & Analytics',
]

// Unused - kept for reference
/* const skillCategories = [
  {
    category: 'Design Craft',
    description: 'Core design skills that shape how you create and deliver user experiences—from visual aesthetics to interaction patterns and technical implementation.',
    skills: [
      'Interaction Design',
      'Visual Design',
      'Information Architecture',
      'Design Systems',
      'Accessibility',
      'Prototyping',
      'Responsive Design',
      'Data Visualization',
      'Design Quality Review',
    ],
  },
  {
    category: 'Leadership & Team Growth',
    description: 'Skills for guiding, developing, and empowering others—essential for growing into senior IC or management roles.',
    skills: [
      'Mentoring',
      'Team Development',
      'Design Critique Leadership',
      'Decision Making',
      'Delegation',
      'Change Management',
      'Recruiting & Interviewing',
      'Capability Building',
    ],
  },
  {
    category: 'AI & Future Skills',
    description: 'Emerging capabilities for leveraging AI tools and designing AI-powered experiences—critical for staying competitive in the evolving design landscape.',
    skills: [
      'AI for UX',
      'Prompt Design',
      'AI-Assisted Research',
      'AI-Assisted Prototyping',
      'Designing AI Experiences',
      'Automation Mindset',
    ],
  },
  {
    category: 'Collaboration & Influence',
    description: 'Interpersonal skills for working effectively across teams, communicating design value, and driving alignment with stakeholders.',
    skills: [
      'Stakeholder Management',
      'Storytelling',
      'Presentation Skills',
      'Cross-Functional Collaboration',
      'Negotiation & Conflict Resolution',
      'Feedback Giving',
      'Receiving Feedback',
    ],
  },
  {
    category: 'User Research & Problem Solving',
    description: 'Methods for understanding user needs, validating solutions, and framing problems—the foundation of user-centered design.',
    skills: [
      'UX Research Planning',
      'Interviewing',
      'Usability Testing',
      'Journey Mapping',
      'Problem Framing',
      'Metrics & KPI Understanding',
    ],
  },
] */

const ratingLabels = [
  { rating: 1, label: 'Beginner', description: 'Just starting to learn this skill' },
  { rating: 2, label: 'Developing', description: 'Building competency with guidance' },
  { rating: 3, label: 'Competent', description: 'Can perform independently' },
  { rating: 4, label: 'Proficient', description: 'Consistently strong performance' },
  { rating: 5, label: 'Expert', description: 'Master level, can teach others' },
]

const strengthsOptions = [
  'User Research',
  'Visual Design',
  'Interaction Design',
  'Communication',
  'Storytelling',
  'Facilitation',
  'Accessibility',
  'Systems Thinking',
  'Strategic Thinking',
  'Collaboration',
  'Leadership',
  'Problem Solving',
  'Data Analysis',
]

const growthLimitsOptions = [
  'Need more experience',
  'Need coaching',
  'Need mentorship',
  'Need project exposure',
  'Need stakeholder visibility',
  'Need structured learning',
  'Need confidence',
  'Need leadership opportunities',
  'Time constraints',
]

const learningStyleOptions = [
  'Workshops',
  'Mentorship',
  'Peer Learning',
  'Online Courses',
  'Self Learning',
  'Hands-on Projects',
  'Shadowing',
  'External Speakers',
]

const masterSteps = [
  { number: 1, icon: '🎯', title: 'Skills Assessment', description: 'Rate your proficiency across 5 key areas' },
  { number: 2, icon: '✨', title: 'Superpowers', description: 'Celebrate what makes you exceptional' },
  { number: 3, icon: '📈', title: 'Growth Goals', description: 'Identify areas to level up' },
  { number: 4, icon: '🤝', title: 'Community', description: 'How you want to give back' },
  { number: 5, icon: '🚀', title: 'Career Vision', description: 'Paint a picture of your future' },
  { number: 6, icon: '📊', title: 'Your Journey', description: 'View your personalized roadmap' },
]

// Career levels with icons and descriptions for UI display
const careerLevelDisplay = [
  { level: 'Explorer', icon: '🧭', description: 'Learning foundations and building confidence.' },
  { level: 'Builder', icon: '🛠', description: 'Applying skills independently and contributing consistently.' },
  { level: 'Influencer', icon: '🚀', description: 'Driving impact and supporting others.' },
  { level: 'Strategist', icon: '🎯', description: 'Connecting customer needs, design decisions, and business outcomes.' },
  { level: 'Catalyst', icon: '🏆', description: 'Creating organizational impact and helping others grow.' },
]

const getLevelDisplay = (levelName: string) => {
  return careerLevelDisplay.find(l => l.level === levelName) || careerLevelDisplay[0]
}

// AI Insights Component
const AIInsights = ({ step, formData }: { step: number; formData: FormData }) => {
  const getInsights = () => {
    // Shared variables
    const wantsToMentor = formData.mentorInterest === 'Yes, I\'d love to mentor'
    
    switch (step) {
      case 2: // Superpowers
        const strengthCount = formData.strengths.length
        return {
          title: '💡 Strength Insights',
          insights: [
            strengthCount === 0 
              ? 'Select your top 3 strengths - these are skills where you naturally excel and feel energized.'
              : strengthCount < 3
              ? `Great start! Add ${3 - strengthCount} more strength${3 - strengthCount > 1 ? 's' : ''} to complete this section.`
              : '✨ Excellent! Your strengths form the foundation of your unique value proposition.',
            formData.strengths.includes('Visual Design') && formData.strengths.includes('Prototyping')
              ? '🎨 Your design craft strengths suggest a strong IC (Individual Contributor) path.'
              : formData.strengths.includes('Stakeholder Management') || formData.strengths.includes('Mentoring')
              ? '👥 Your people-focused strengths indicate potential for leadership roles.'
              : 'Your combination of strengths opens multiple career paths.',
            formData.teammatesFeedback
              ? '📝 Teammate feedback helps validate your self-perception and reveals blind spots.'
              : '💬 Teammate feedback is valuable - it shows how others experience your impact.',
          ],
          tips: [
            '🎯 Focus on strengths that energize you, not just what you\'re good at',
            '🔄 Your strengths should complement each other',
            '💼 Think about how these strengths serve your career goals',
          ]
        }
      
      case 3: // Growth Goals
        const growthCount = formData.skillsToImprove.length
        const hasLearningStyle = formData.learningStyle.length > 0
        return {
          title: '🚀 Growth Strategy',
          insights: [
            growthCount === 0
              ? 'Identify 3 skills that will unlock your next career milestone.'
              : growthCount < 3
              ? `${growthCount}/3 skills selected. Choose areas that align with your career aspirations.`
              : '✅ Great selection! Focus on 3 skills to avoid spreading yourself too thin.',
            formData.skillsToImprove.includes('AI for Design')
              ? '🤖 AI skills are increasingly critical - you\'re future-proofing your career.'
              : 'Consider adding emerging skills like AI to stay competitive.',
            hasLearningStyle
              ? `📚 Your learning style (${formData.learningStyle.join(', ')}) will guide your development plan.`
              : '🎓 Knowing how you learn best helps you choose effective resources.',
            formData.skillsToImprove.some(s => ['Leadership', 'Stakeholder Management', 'Communication'].includes(s))
              ? '👔 Soft skills often differentiate senior practitioners from juniors.'
              : '',
          ].filter(Boolean),
          tips: [
            '⚡ Pick skills that compound - each should build on your strengths',
            '📈 Balance technical and soft skills for well-rounded growth',
            '🎯 Align growth areas with your 6-month career goal',
          ]
        }
      
      case 4: // Community
        const hasMentorInterest = formData.mentorInterest !== ''
        return {
          title: '🤝 Community Impact',
          insights: [
            formData.teachingTopic
              ? `📢 Teaching "${formData.teachingTopic}" reinforces your own mastery.`
              : '💡 Teaching others is one of the best ways to deepen your own expertise.',
            wantsToMentor
              ? '🌟 Mentoring builds leadership skills and expands your network.'
              : hasMentorInterest
              ? '🤔 Mentoring can start small - even 30 min/month makes an impact.'
              : '👥 Community contribution accelerates your visibility and influence.',
            formData.teachingTopic && formData.strengths.includes(formData.teachingTopic)
              ? '✨ Teaching your strengths creates a powerful feedback loop.'
              : '',
          ].filter(Boolean),
          tips: [
            '🎤 Start with brown bags or lunch & learns',
            '📝 Document your knowledge in wikis or case studies',
            '🌱 Giving back often leads to unexpected opportunities',
          ]
        }
      
      case 5: // Career Vision - Gap Analysis
        const skillRatingsCount = Object.keys(formData.skillRatings).length
        const avgRating = skillRatingsCount > 0 
          ? Object.values(formData.skillRatings).reduce((sum, s) => sum + s.rating, 0) / skillRatingsCount 
          : 0
        
        // Analyze career path alignment
        const isLeadershipPath = formData.careerGrowth?.includes('Manager') || formData.careerGrowth?.includes('Lead')
        const hasLeadershipSkills = formData.strengths.some(s => 
          ['Stakeholder Management', 'Mentoring', 'Strategic Thinking'].includes(s)
        )
        const isGrowingLeadershipSkills = formData.skillsToImprove.some(s => 
          ['Leadership', 'Stakeholder Management', 'Communication'].includes(s)
        )
        
        const isSpecialistPath = formData.careerGrowth?.includes('Specialist') || formData.careerGrowth?.includes('Strategist')
        const hasSpecialistSkills = formData.strengths.some(s => 
          ['User Research', 'Visual Design', 'Prototyping', 'Information Architecture'].includes(s)
        )
        
        // Identify gaps
        const gaps = []
        if (isLeadershipPath && !hasLeadershipSkills && !isGrowingLeadershipSkills) {
          gaps.push('Leadership & people management skills')
        }
        if (isSpecialistPath && !hasSpecialistSkills) {
          gaps.push('Deep specialist expertise in your domain')
        }
        if (formData.futureVision?.includes('business') && !formData.skillsToImprove.includes('Business Acumen')) {
          gaps.push('Business acumen & strategy')
        }
        if (avgRating < 3 && (isLeadershipPath || isSpecialistPath)) {
          gaps.push('Overall skill proficiency (current avg: ' + avgRating.toFixed(1) + '/5)')
        }
        
        return {
          title: '🎯 Gap Analysis',
          insights: [
            formData.careerGrowth
              ? `🚀 Target Role: ${formData.careerGrowth}`
              : '📍 Select your target role to see personalized gap analysis.',
            isLeadershipPath && hasLeadershipSkills
              ? '✅ Your leadership strengths align well with your management aspirations.'
              : isLeadershipPath && isGrowingLeadershipSkills
              ? '📈 Good! You\'re actively developing leadership skills for your target role.'
              : isLeadershipPath
              ? '⚠️ Consider adding leadership skills to your growth plan for management roles.'
              : '',
            isSpecialistPath && hasSpecialistSkills
              ? '✅ Your specialist strengths support your career direction.'
              : isSpecialistPath
              ? '💡 Deepen your specialist expertise to stand out in this path.'
              : '',
            gaps.length === 0 && formData.careerGrowth
              ? '🎉 Strong alignment! Your skills and growth plan support your aspirations.'
              : gaps.length > 0
              ? `⚠️ ${gaps.length} gap${gaps.length > 1 ? 's' : ''} identified - see recommendations below.`
              : '',
            formData.futureVision?.includes('Leading') && !wantsToMentor
              ? '💭 Consider mentoring to build leadership experience.'
              : '',
          ].filter(Boolean),
          tips: gaps.length > 0 
            ? [
                '🔍 Key Gaps to Address:',
                ...gaps.map(gap => `  • ${gap}`),
                '',
                '💡 Recommended Actions:',
                isLeadershipPath && !hasLeadershipSkills 
                  ? '  • Add "Leadership" or "Stakeholder Management" to growth goals'
                  : '',
                avgRating < 3 
                  ? '  • Focus on raising proficiency in core skills to 3+ level'
                  : '',
                '  • Align your learning style with skill development needs',
                '  • Leverage your strengths while closing critical gaps',
              ].filter(Boolean)
            : [
                '✨ You\'re well-positioned for your target role!',
                '🎯 Continue developing your selected growth areas',
                '🤝 Leverage community contributions for visibility',
                '📚 Stay current with industry trends and emerging skills',
              ]
        }
      
      default:
        return null
    }
  }

  const content = getInsights()
  if (!content) return null

  return (
    <div className="sticky top-8 space-y-4">
      <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200">
        <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
          {content.title}
        </h3>
        <div className="space-y-3">
          {content.insights.map((insight, index) => (
            <div key={index} className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 flex-shrink-0" />
              <p className="text-xs text-slate-700 leading-relaxed">{insight}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card className="bg-gradient-to-br from-green-50 to-teal-50 border-2 border-green-200">
        <h3 className="text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">Quick Tips</h3>
        <div className="space-y-2">
          {content.tips.map((tip, index) => (
            <p key={index} className="text-xs text-slate-600 leading-relaxed">{tip}</p>
          ))}
        </div>
      </Card>
    </div>
  )
}

// Integrated Progress Sidebar Component
const ProgressSidebar = ({ currentStep, currentCategory, skillCategories, onStepClick }: { 
  currentStep: number
  currentCategory?: number
  skillCategories?: Array<{ category: string; description: string; skills: Array<string | { name: string; idealRating: number }>; isScored?: boolean }>
  onStepClick: (step: number) => void
}) => {
  return (
    <div className="sticky top-8">
      <h3 className="text-xs font-bold text-slate-500 mb-4 uppercase tracking-wide">Your Progress</h3>
      <div className="space-y-1">
        {masterSteps.map((step, index) => {
          const stepNumber = index + 1
          const isCompleted = stepNumber < currentStep
          const isCurrent = stepNumber === currentStep
          
          return (
            <div key={step.number}>
              {/* Main Step */}
              <div className="relative">
                <button
                  onClick={() => onStepClick(stepNumber)}
                  className={`w-full flex items-start gap-3 p-3 rounded-lg transition-all text-left hover:bg-slate-50 ${
                    isCurrent ? 'bg-growth-50 border-l-4 border-growth-500' : ''
                  }`}>
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 transition-all ${
                      isCompleted
                        ? 'bg-growth-600 text-white'
                        : isCurrent
                        ? 'bg-growth-500 text-white ring-2 ring-growth-200'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {isCompleted ? '✓' : step.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold leading-tight ${
                      isCurrent ? 'text-slate-800' : isCompleted ? 'text-slate-700' : 'text-slate-500'
                    }`}>
                      {step.title}
                    </p>
                    {isCurrent && (
                      <p className="text-xs text-slate-500 mt-1">{step.description}</p>
                    )}
                  </div>
                </button>

                {/* Sub-steps for Skills Assessment */}
                {stepNumber === 1 && isCurrent && skillCategories && (
                  <div className="ml-8 mt-2 space-y-1 animate-in slide-in-from-top-2 duration-300">
                    {skillCategories.map((cat, catIndex) => {
                      const isCurrentCategory = catIndex === currentCategory
                      const isCompletedCategory = catIndex < (currentCategory || 0)
                      
                      return (
                        <div
                          key={cat.category}
                          className={`flex items-center gap-2 py-2 px-3 rounded-md transition-all ${
                            isCurrentCategory ? 'bg-white border border-growth-300' : ''
                          }`}
                        >
                          <div
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${
                              isCompletedCategory
                                ? 'bg-growth-400 text-white'
                                : isCurrentCategory
                                ? 'bg-growth-500 text-white'
                                : 'bg-slate-100 text-slate-400'
                            }`}
                          >
                            {isCompletedCategory ? '✓' : catIndex + 1}
                          </div>
                          <p className={`text-xs ${
                            isCurrentCategory ? 'font-semibold text-slate-800' : 'text-slate-600'
                          }`}>
                            {cat.category}
                          </p>
                        </div>
                      )
                    })}
                  </div>
                )}

                {/* Connecting Line */}
                {index < masterSteps.length - 1 && (
                  <div className={`w-0.5 h-4 ml-[13px] my-1 ${
                    isCompleted ? 'bg-growth-600' : 'bg-slate-200'
                  }`} />
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function UXGrowthJourney() {
  // Load saved data from localStorage on mount
  const [currentStep, setCurrentStep] = useState(() => {
    const saved = localStorage.getItem('uxGrowthJourney_currentStep')
    return saved ? parseInt(saved) : 0
  })
  const [currentCategory, setCurrentCategory] = useState(0)
  const [formData, setFormData] = useState<FormData>(() => {
    const saved = localStorage.getItem('uxGrowthJourney_formData')
    if (saved) {
      const parsedData = JSON.parse(saved)
      // Ensure currentRole has a valid value
      if (!parsedData.currentRole || parsedData.currentRole === '') {
        parsedData.currentRole = 'Associate UX Designer'
      }
      return parsedData
    }
    return initialFormData
  })
  const [showResults, setShowResults] = useState(false)
  const [showAchievement, setShowAchievement] = useState(false)
  const [achievementTitle, setAchievementTitle] = useState('')
  const [previousXP, setPreviousXP] = useState(0)

  // Auto-save to localStorage whenever formData changes
  useEffect(() => {
    localStorage.setItem('uxGrowthJourney_formData', JSON.stringify(formData))
  }, [formData])

  // Save current step to localStorage
  useEffect(() => {
    localStorage.setItem('uxGrowthJourney_currentStep', currentStep.toString())
  }, [currentStep])

  // Scroll to top whenever step changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [currentStep])

  // Scroll to top whenever category changes (for Skills Assessment sub-steps)
  useEffect(() => {
    if (currentStep === 1) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [currentCategory, currentStep])

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  // Handle step navigation from sidebar
  const handleStepClick = (step: number) => {
    setCurrentStep(step)
    setCurrentCategory(0) // Reset category when changing steps
  }

  // Get role configuration
  const getRoleConfig = () => {
    return roleBasedQuestions[formData.currentRole] || roleBasedQuestions["Associate UX Designer"]
  }

  // Check for level up - must be at top level
  const currentXP = formData.currentRole ? calculateXP(formData.skillRatings, getRoleConfig(), formData.currentRole) : 0
  useEffect(() => {
    if (currentXP !== previousXP) {
      if (currentXP > previousXP && previousXP > 0) {
        const prevLevel = getCareerLevel(previousXP)
        const newLevel = getCareerLevel(currentXP)
        const prevLevelIndex = CAREER_LEVELS.findIndex(l => l.level === prevLevel.level)
        const newLevelIndex = CAREER_LEVELS.findIndex(l => l.level === newLevel.level)
        if (newLevelIndex > prevLevelIndex) {
          const levelDisplay = getLevelDisplay(newLevel.level)
          setAchievementTitle(`${levelDisplay.icon} ${newLevel.level}`)
          setShowAchievement(true)
          setTimeout(() => setShowAchievement(false), 4000)
        }
      }
      setPreviousXP(currentXP)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentXP])

  const toggleArrayItem = (field: keyof FormData, item: string) => {
    const currentArray = formData[field] as string[]
    updateFormData(
      field,
      currentArray.includes(item)
        ? currentArray.filter((i) => i !== item)
        : [...currentArray, item]
    )
  }

  // Unused - kept for future use
  /* const resetForm = () => {
    if (confirm('Are you sure you want to start over? All your progress will be lost.')) {
      localStorage.removeItem('uxGrowthJourney_formData')
      localStorage.removeItem('uxGrowthJourney_currentStep')
      setFormData(initialFormData)
      setCurrentStep(0)
      setCurrentCategory(0)
      setShowResults(false)
    }
  } */

  const nextStep = () => {
    if (currentStep < 6) setCurrentStep(currentStep + 1)
  }

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1)
  }

  // Check if all required fields are filled
  const isFormComplete = () => {
    // Step 1: Skills Assessment - at least some skills rated
    const hasSkillRatings = Object.keys(formData.skillRatings).length > 0
    
    // Step 2: Superpowers
    const hasSuperpowers = formData.strengths.length === 3 && 
                          formData.teammatesFeedback.trim() !== '' && 
                          formData.proudAccomplishment.trim() !== ''
    
    // Step 3: Growth Opportunities
    const hasGrowthGoals = formData.skillsToImprove.length === 3 && 
                          formData.growthLimits.length > 0 && 
                          formData.learningStyle.length > 0
    
    // Step 4: Community
    const hasCommunity = formData.teachingTopic.trim() !== '' && 
                        formData.mentorInterest !== ''
    
    // Step 5: Career Aspirations
    const hasCareerVision = formData.careerGrowth !== '' && 
                           formData.futureVision !== '' && 
                           formData.growthAreas.length > 0
    
    return hasSkillRatings && hasSuperpowers && hasGrowthGoals && hasCommunity && hasCareerVision
  }

  const getIncompleteSteps = () => {
    const incomplete = []
    
    if (Object.keys(formData.skillRatings).length === 0) {
      incomplete.push({ step: 1, name: 'Skills Assessment', reason: 'Rate your skills across all categories' })
    }
    
    if (formData.strengths.length !== 3 || !formData.teammatesFeedback || !formData.proudAccomplishment) {
      incomplete.push({ step: 2, name: 'Superpowers', reason: 'Complete all fields about your strengths' })
    }
    
    if (formData.skillsToImprove.length !== 3 || formData.growthLimits.length === 0 || formData.learningStyle.length === 0) {
      incomplete.push({ step: 3, name: 'Growth Goals', reason: 'Select skills to improve and learning preferences' })
    }
    
    if (!formData.teachingTopic || !formData.mentorInterest) {
      incomplete.push({ step: 4, name: 'Community', reason: 'Share how you want to contribute' })
    }
    
    if (!formData.careerGrowth || !formData.futureVision || formData.growthAreas.length === 0) {
      incomplete.push({ step: 5, name: 'Career Vision', reason: 'Define your career aspirations' })
    }
    
    return incomplete
  }

  const handleSubmit = async () => {
    if (isFormComplete()) {
      // Save to Supabase with complete data
      try {
        const submissionData = {
          // Personal Information
          name: formData.name,
          email: formData.email,
          agid: formData.agid,
          current_role: formData.currentRole,
          
          // Step 1: Career Vision
          career_growth: formData.careerGrowth,
          future_vision: formData.futureVision,
          growth_areas: formData.growthAreas,
          
          // Step 2: Self Assessment
          skill_ratings: formData.skillRatings,
          multi_select_responses: formData.multiSelectResponses,
          
          // Step 3: Superpowers
          strengths: formData.strengths,
          teammates_feedback: formData.teammatesFeedback,
          proud_accomplishment: formData.proudAccomplishment,
          
          // Step 4: Growth Opportunities
          skills_to_improve: formData.skillsToImprove,
          growth_limits: formData.growthLimits,
          learning_style: formData.learningStyle,
          
          // Step 5: Community
          teaching_topic: formData.teachingTopic,
          mentor_interest: formData.mentorInterest,
          
          // Step 6: Commitment
          six_month_goal: formData.sixMonthGoal,
          goal_importance: formData.goalImportance
        }

        const { error } = await supabase
          .from('assessments')
          .insert([submissionData])

        if (error) {
          console.error('Error saving to Supabase:', error)
          alert('Failed to save your assessment. Please try again.')
        } else {
          console.log('Successfully saved to Supabase!')
        }
      } catch (err) {
        console.error('Exception saving to Supabase:', err)
        alert('An error occurred while saving. Please try again.')
      }

      setShowResults(true)
    } else {
      // User will see the incomplete notification on step 6
      setCurrentStep(6)
    }
  }

  // Unused - kept for future PDF export feature
  /* const generatePDF = () => {
    const doc = new jsPDF()
    let yPos = 20

    doc.setFontSize(20)
    doc.text('🚀 My UX Growth Journey', 20, yPos)
    yPos += 15

    doc.setFontSize(12)
    doc.text(`Name: ${formData.name}`, 20, yPos)
    yPos += 10
    doc.text(`Email: ${formData.email}`, 20, yPos)
    yPos += 10
    doc.text(`Role: ${formData.currentRole}`, 20, yPos)
    yPos += 15

    doc.setFontSize(14)
    doc.text('Career Aspirations', 20, yPos)
    yPos += 10
    doc.setFontSize(10)
    doc.text(`Career Growth: ${formData.careerGrowth}`, 20, yPos)
    yPos += 7
    doc.text(`Future Vision: ${formData.futureVision}`, 20, yPos)
    yPos += 7
    doc.text(`Growth Areas: ${formData.growthAreas.join(', ')}`, 20, yPos)
    yPos += 15

    doc.setFontSize(14)
    doc.text('Top Strengths', 20, yPos)
    yPos += 10
    doc.setFontSize(10)
    doc.text(formData.strengths.join(', '), 20, yPos)
    yPos += 15

    doc.setFontSize(14)
    doc.text('Skills to Improve', 20, yPos)
    yPos += 10
    doc.setFontSize(10)
    doc.text(formData.skillsToImprove.join(', '), 20, yPos)
    yPos += 15

    doc.setFontSize(14)
    doc.text('6-Month Goal', 20, yPos)
    yPos += 10
    doc.setFontSize(10)
    const goalLines = doc.splitTextToSize(formData.sixMonthGoal, 170)
    doc.text(goalLines, 20, yPos)

    doc.save(`UX_Growth_Summary_${formData.name.replace(/\s+/g, '_')}.pdf`)
  } */

  // Results Page - Check this FIRST before any step checks
  if (showResults) {
    const totalXP = currentXP
    const currentLevel = getCareerLevel(totalXP)
    const nextLevel = getNextCareerLevel(totalXP)
    const currentLevelDisplay = getLevelDisplay(currentLevel.level)
    const progressToNext = nextLevel 
      ? ((totalXP - currentLevel.minXP) / (nextLevel.minXP - currentLevel.minXP)) * 100
      : 100

    // Get role configuration for categories
    const getRoleConfig = () => {
      return roleBasedQuestions[formData.currentRole] || roleBasedQuestions["UX Designer"]
    }

    const roleConfig = getRoleConfig()

    // Calculate CATEGORY-LEVEL averages from skill ratings
    const getCategoryAverages = () => {
      const categoryAverages: Array<{category: string, avgRating: number, questionCount: number}> = []
      
      roleConfig.skillCategories.forEach(cat => {
        if (cat.isScored === false) return // Skip non-scored categories
        
        let totalRating = 0
        let ratedCount = 0
        
        cat.skills.forEach(skill => {
          const skillName = typeof skill === 'string' ? skill : skill.name
          const rating = formData.skillRatings[skillName]
          
          if (rating && rating.rating) {
            totalRating += rating.rating
            ratedCount++
          }
        })
        
        if (ratedCount > 0) {
          categoryAverages.push({
            category: cat.category,
            avgRating: totalRating / ratedCount,
            questionCount: ratedCount
          })
        }
      })
      
      return categoryAverages
    }

    const categoryAverages = getCategoryAverages()

    // Calculate overall average rating
    const avgRating = categoryAverages.length > 0
      ? (categoryAverages.reduce((sum, cat) => sum + cat.avgRating, 0) / categoryAverages.length).toFixed(1)
      : '0.0'

    // Radar chart data - CATEGORY LEVEL
    const getRadarChartData = () => {
      return categoryAverages.map(cat => ({
        category: cat.category.length > 30 ? cat.category.substring(0, 30) + '...' : cat.category,
        rating: parseFloat(cat.avgRating.toFixed(1)),
        fullMark: 5
      }))
    }

    const radarData = getRadarChartData()

    // Peer comparison - CATEGORY LEVEL
    const getPeerComparison = (): Array<{category: string, rating: number, percentile: number}> => {
      const comparisons: Array<{category: string, rating: number, percentile: number}> = []
      
      // Get top 3 categories
      const topCategories = [...categoryAverages]
        .sort((a, b) => b.avgRating - a.avgRating)
        .slice(0, 3)
      
      topCategories.forEach(cat => {
        // Simulate percentile based on rating
        const percentile = cat.avgRating >= 4.5 ? 90 : 
                          cat.avgRating >= 4 ? 75 :
                          cat.avgRating >= 3.5 ? 60 :
                          cat.avgRating >= 3 ? 45 : 30
        
        comparisons.push({
          category: cat.category,
          rating: parseFloat(cat.avgRating.toFixed(1)),
          percentile
        })
      })
      
      return comparisons
    }

    const peerComparisons = getPeerComparison()

    // Get benchmark comparison data (actual vs ideal)
    const getBenchmarkComparison = () => {
      const benchmarks: Array<{
        category: string
        actual: number
        ideal: number
        gap: number
        status: 'exceeds' | 'meets' | 'developing' | 'needs-focus'
      }> = []
      
      roleConfig.skillCategories.forEach(cat => {
        if (cat.isScored === false) return
        
        let totalActual = 0
        let totalIdeal = 0
        let count = 0
        
        cat.skills.forEach(skill => {
          if (typeof skill === 'object' && 'name' in skill) {
            const skillName = skill.name
            const rating = formData.skillRatings[skillName]
            
            if (rating && rating.rating) {
              totalActual += rating.rating
              totalIdeal += skill.idealRating
              count++
            }
          }
        })
        
        if (count > 0) {
          const avgActual = totalActual / count
          const avgIdeal = totalIdeal / count
          const gap = avgActual - avgIdeal
          
          let status: 'exceeds' | 'meets' | 'developing' | 'needs-focus'
          if (gap >= 0.5) status = 'exceeds'
          else if (gap >= -0.3) status = 'meets'
          else if (gap >= -0.8) status = 'developing'
          else status = 'needs-focus'
          
          benchmarks.push({
            category: cat.category,
            actual: parseFloat(avgActual.toFixed(1)),
            ideal: parseFloat(avgIdeal.toFixed(1)),
            gap: parseFloat(gap.toFixed(1)),
            status
          })
        }
      })
      
      return benchmarks
    }

    const benchmarks = getBenchmarkComparison()

    // Generate insights for peer comparison
    const getPeerInsights = (comp: {category: string, rating: number, percentile: number}) => {
      if (comp.percentile >= 75) {
        return {
          icon: '🏆',
          message: 'Outstanding performance! You\'re a role model in this area.',
          action: 'Consider mentoring others or leading initiatives here.',
          color: 'text-green-700'
        }
      } else if (comp.percentile >= 60) {
        return {
          icon: '⭐',
          message: 'Strong performance! You\'re ahead of most peers.',
          action: 'Keep building on this strength and share your knowledge.',
          color: 'text-blue-700'
        }
      } else if (comp.percentile >= 45) {
        return {
          icon: '📈',
          message: 'Solid foundation with room to grow.',
          action: 'Focus on consistent practice to reach the next level.',
          color: 'text-yellow-700'
        }
      } else {
        return {
          icon: '🎯',
          message: 'Great opportunity for growth!',
          action: 'Prioritize learning and seek mentorship in this area.',
          color: 'text-orange-700'
        }
      }
    }

    // 2x2 Matrix - CATEGORY LEVEL
    const getStrengthsGrowthMatrix = () => {
      const matrix = {
        highStrength: categoryAverages.filter(cat => cat.avgRating >= 4).map(cat => cat.category),
        developingStrength: categoryAverages.filter(cat => cat.avgRating >= 3 && cat.avgRating < 4).map(cat => cat.category),
        focusArea: categoryAverages.filter(cat => cat.avgRating < 3).map(cat => cat.category)
      }
      
      return matrix
    }

    const matrix = getStrengthsGrowthMatrix()

    // Generate personalized roadmap milestones
    const getPersonalizedRoadmap = () => {
      const roadmap = []
      
      // Current state
      roadmap.push({
        phase: 'Current',
        title: formData.currentRole,
        description: `Avg Rating: ${avgRating}/5`,
        icon: '📍',
        color: 'blue'
      })
      
      // 3-month milestone (based on skills to improve)
      if (formData.skillsToImprove.length > 0) {
        roadmap.push({
          phase: '3 Months',
          title: `Develop ${formData.skillsToImprove[0]}`,
          description: formData.learningStyle[0] || 'Start learning',
          icon: '📚',
          color: 'purple'
        })
      }
      
      // 6-month goal (from their input)
      roadmap.push({
        phase: '6 Months',
        title: formData.sixMonthGoal || 'Achieve next milestone',
        description: `Target: ${(parseFloat(avgRating) + 0.5).toFixed(1)}/5 rating`,
        icon: '🎯',
        color: 'indigo'
      })
      
      // 1-year vision (based on career growth)
      roadmap.push({
        phase: '1 Year',
        title: formData.careerGrowth,
        description: `Leverage ${formData.strengths[0] || 'your strengths'}`,
        icon: '🌟',
        color: 'green'
      })
      
      return roadmap
    }

    const roadmap = getPersonalizedRoadmap()

    // Generate personalized insights
    const getPersonalizedInsights = () => {
      const insights = []
      
      if (formData.strengths.length > 0) {
        insights.push(`Your top strength is ${formData.strengths[0]} - leverage this in your daily work!`)
      }
      
      if (formData.skillsToImprove.length > 0) {
        insights.push(`Focus on developing ${formData.skillsToImprove[0]} to reach the next level.`)
      }
      
      if (formData.learningStyle.length > 0) {
        insights.push(`Your ${formData.learningStyle[0]} learning style is perfect for ${formData.learningStyle[0] === 'Hands-on practice' ? 'project-based courses' : 'structured learning programs'}.`)
      }
      
      if (parseFloat(avgRating) >= 4) {
        insights.push("You're performing at a high level - consider mentoring others!")
      } else if (parseFloat(avgRating) >= 3) {
        insights.push("You're on a solid growth trajectory - keep pushing forward!")
      }
      
      return insights
    }

    const insights = getPersonalizedInsights()

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Sparkles className="w-12 h-12 text-purple-600 animate-pulse" />
              <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-green-600 bg-clip-text text-transparent">
                Your Career Insights
              </h1>
            </div>
            <p className="text-xl text-slate-600">
              Data-driven analysis of your UX journey, {formData.name}
            </p>
          </div>

          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <div className="text-center">
                <div className="text-5xl mb-3">{currentLevelDisplay.icon}</div>
                <h3 className="text-sm font-semibold text-purple-600 mb-1">Career Level</h3>
                <p className="text-2xl font-bold text-slate-800">{currentLevel.level}</p>
                <p className="text-xs text-slate-600 mt-2">{currentLevelDisplay.description}</p>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <div className="text-center">
                <TrendingUp className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                <h3 className="text-sm font-semibold text-blue-600 mb-1">Overall Score</h3>
                <p className="text-2xl font-bold text-slate-800">{avgRating} / 5.0</p>
                <div className="flex justify-center gap-1 mt-2">
                  {[1,2,3,4,5].map(star => (
                    <span key={star} className={star <= Math.round(parseFloat(avgRating)) ? 'text-yellow-400' : 'text-slate-300'}>⭐</span>
                  ))}
                </div>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <div className="text-center">
                <Award className="w-12 h-12 text-green-600 mx-auto mb-3" />
                <h3 className="text-sm font-semibold text-green-600 mb-1">Top Strength</h3>
                <p className="text-lg font-bold text-slate-800">{formData.strengths[0] || 'N/A'}</p>
                <p className="text-xs text-slate-600 mt-2">Your superpower!</p>
              </div>
            </Card>
          </div>

          {/* Category-Level Radar Chart */}
          <Card className="mb-8">
            <h3 className="text-2xl font-bold text-slate-800 mb-6 text-center flex items-center justify-center gap-2">
              <BarChart2 className="w-6 h-6 text-blue-600" />
              Your Skills by Category
            </h3>
            {radarData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={450}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#e2e8f0" strokeWidth={2} />
                    <PolarAngleAxis 
                      dataKey="category" 
                      tick={{ fill: '#475569', fontSize: 11, fontWeight: 600 }}
                    />
                    <PolarRadiusAxis 
                      angle={90} 
                      domain={[0, 5]} 
                      tick={{ fill: '#64748b', fontSize: 11 }}
                      tickCount={6}
                    />
                    <Radar
                      name="Category Average"
                      dataKey="rating"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.5}
                      strokeWidth={3}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#fff', 
                        border: '2px solid #3b82f6',
                        borderRadius: '8px',
                        padding: '12px'
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
                <p className="text-center text-sm text-slate-600 mt-4">
                  Showing {radarData.length} skill categories for {formData.currentRole} • Rated on a scale of 1-5
                </p>
              </>
            ) : (
              <div className="text-center py-12 text-slate-500">
                <p>No skill ratings available</p>
              </div>
            )}
          </Card>

          {/* Benchmark vs Actual Performance */}
          <Card className="mb-8">
            <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-purple-600" />
              Your Performance vs Role Benchmark
            </h3>
            <p className="text-sm text-slate-600 mb-6">
              Compare your ratings against the expected benchmark for {formData.currentRole}
            </p>
            <div className="space-y-4">
              {benchmarks.map((bench, index) => {
                const statusColors = {
                  'exceeds': 'bg-green-500',
                  'meets': 'bg-blue-500',
                  'developing': 'bg-yellow-500',
                  'needs-focus': 'bg-orange-500'
                }
                const statusLabels = {
                  'exceeds': 'Exceeds Benchmark',
                  'meets': 'Meets Benchmark',
                  'developing': 'Developing',
                  'needs-focus': 'Needs Focus'
                }
                const statusIcons = {
                  'exceeds': '🌟',
                  'meets': '✅',
                  'developing': '📈',
                  'needs-focus': '🎯'
                }
                
                return (
                  <div key={index} className="bg-white p-5 rounded-lg border-2 border-slate-200 hover:border-purple-300 transition-all">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex-1">
                        <p className="font-bold text-slate-800 text-sm mb-1">{bench.category}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{statusIcons[bench.status]}</span>
                          <span className={`text-xs font-semibold px-2 py-1 rounded ${statusColors[bench.status]} text-white`}>
                            {statusLabels[bench.status]}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-slate-800">{bench.actual}</p>
                        <p className="text-xs text-slate-500">vs {bench.ideal} target</p>
                      </div>
                    </div>
                    
                    {/* Visual bar comparison */}
                    <div className="relative h-8 bg-slate-100 rounded-lg overflow-hidden mb-2">
                      {/* Benchmark line */}
                      <div 
                        className="absolute top-0 bottom-0 w-1 bg-red-400 z-10"
                        style={{ left: `${(bench.ideal / 5) * 100}%` }}
                      >
                        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-red-600 font-semibold whitespace-nowrap">
                          Target
                        </div>
                      </div>
                      {/* Actual performance bar */}
                      <div 
                        className={`h-full ${statusColors[bench.status]} transition-all flex items-center justify-end pr-2`}
                        style={{ width: `${(bench.actual / 5) * 100}%` }}
                      >
                        <span className="text-xs font-bold text-white">You</span>
                      </div>
                    </div>
                    
                    {/* Gap analysis */}
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-600">
                        {bench.gap >= 0 ? (
                          <span className="text-green-600 font-semibold">+{bench.gap} above target 🎉</span>
                        ) : (
                          <span className="text-orange-600 font-semibold">{Math.abs(bench.gap)} gap to close</span>
                        )}
                      </span>
                      <span className="text-slate-500">
                        {((bench.actual / bench.ideal) * 100).toFixed(0)}% of target
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>

          {/* Enhanced Peer Comparison with Insights */}
          <Card className="mb-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Users className="w-6 h-6 text-blue-600" />
              How You Stack Up Against Peers
            </h3>
            <p className="text-sm text-slate-600 mb-6">
              See where you stand compared to other {formData.currentRole}s in your top-performing categories
            </p>
            <div className="space-y-6">
              {peerComparisons.map((comp, index) => {
                const insight = getPeerInsights(comp)
                return (
                  <div key={index} className="bg-white p-6 rounded-xl border-2 border-blue-200 shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-3xl">{insight.icon}</span>
                          <div>
                            <p className="font-bold text-slate-800 text-lg">{comp.category}</p>
                            <p className="text-sm text-slate-600">Your Rating: {comp.rating}/5</p>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-lg">
                          <p className="text-xs font-semibold">PERCENTILE</p>
                          <p className="text-2xl font-bold">{comp.percentile}th</p>
                        </div>
                        <p className="text-xs text-slate-600 mt-1">Top {100 - comp.percentile}%</p>
                      </div>
                    </div>
                    
                    {/* Percentile visualization */}
                    <div className="relative h-4 bg-slate-200 rounded-full overflow-hidden mb-4">
                      <div 
                        className="absolute h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 rounded-full transition-all"
                        style={{ width: `${comp.percentile}%` }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xs font-bold text-white drop-shadow-lg">
                          {comp.percentile}% of peers below you
                        </span>
                      </div>
                    </div>
                    
                    {/* Insight box */}
                    <div className="bg-gradient-to-r from-slate-50 to-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                      <p className={`font-semibold text-sm mb-1 ${insight.color}`}>
                        💡 {insight.message}
                      </p>
                      <p className="text-xs text-slate-700">
                        <strong>Next Step:</strong> {insight.action}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>

          {/* 2x2 Strengths vs Growth Matrix - CATEGORY LEVEL */}
          <Card className="mb-8">
            <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Target className="w-6 h-6 text-purple-600" />
              Category Performance Matrix
            </h3>
            <p className="text-sm text-slate-600 mb-4">
              Based on average ratings across all questions in each category for {formData.currentRole}
            </p>
            <div className="grid grid-cols-2 gap-4">
              {/* High Strength (Top Right) */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-6 rounded-lg border-2 border-green-300">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">🌟</span>
                  <h4 className="font-bold text-green-800">Strong Categories</h4>
                </div>
                <p className="text-xs text-green-700 mb-3">Avg ≥ 4.0 • Leverage these!</p>
                <div className="space-y-2">
                  {matrix.highStrength.map((category, i) => (
                    <div key={i} className="text-sm bg-white px-3 py-2 rounded border border-green-200">
                      {category}
                    </div>
                  ))}
                  {matrix.highStrength.length === 0 && (
                    <p className="text-sm text-green-600 italic">Keep developing!</p>
                  )}
                </div>
              </div>

              {/* Developing (Top Left) */}
              <div className="bg-gradient-to-br from-yellow-50 to-amber-100 p-6 rounded-lg border-2 border-yellow-300">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">📈</span>
                  <h4 className="font-bold text-yellow-800">Developing Categories</h4>
                </div>
                <p className="text-xs text-yellow-700 mb-3">Avg 3.0-3.9 • Almost there!</p>
                <div className="space-y-2">
                  {matrix.developingStrength.map((category, i) => (
                    <div key={i} className="text-sm bg-white px-3 py-2 rounded border border-yellow-200">
                      {category}
                    </div>
                  ))}
                  {matrix.developingStrength.length === 0 && (
                    <p className="text-sm text-yellow-600 italic">Great progress!</p>
                  )}
                </div>
              </div>

              {/* Focus Area (Bottom) - Full Width */}
              <div className="col-span-2 bg-gradient-to-br from-orange-50 to-red-100 p-6 rounded-lg border-2 border-orange-300">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">🎯</span>
                  <h4 className="font-bold text-orange-800">Priority Focus Categories</h4>
                </div>
                <p className="text-xs text-orange-700 mb-3">Avg &lt; 3.0 • Invest time here for maximum growth</p>
                <div className="grid grid-cols-2 gap-2">
                  {matrix.focusArea.map((category, i) => (
                    <div key={i} className="text-sm bg-white px-3 py-2 rounded border border-orange-200">
                      {category}
                    </div>
                  ))}
                  {matrix.focusArea.length === 0 && (
                    <p className="text-sm text-orange-600 italic col-span-2">Excellent! No critical gaps identified.</p>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Strengths vs Growth */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-purple-50 to-pink-50">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-6 h-6 text-purple-600" />
                <h3 className="text-xl font-bold text-slate-800">💪 Your Superpowers</h3>
              </div>
              <div className="space-y-3">
                {formData.strengths.map((strength, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-white rounded-lg border-2 border-purple-200">
                    <span className="text-2xl">{['�', '✨', '⚡'][index % 3]}</span>
                    <p className="font-semibold text-slate-800">{strength}</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-blue-50">
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-6 h-6 text-green-600" />
                <h3 className="text-xl font-bold text-slate-800">🎯 Growth Opportunities</h3>
              </div>
              <div className="space-y-3">
                {formData.skillsToImprove.map((skill, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-white rounded-lg border-2 border-green-200">
                    <span className="text-2xl">{['📈', '🚀', '💡'][index % 3]}</span>
                    <p className="font-semibold text-slate-800">{skill}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Personalized Career Roadmap */}
          <Card className="mb-8 bg-gradient-to-r from-blue-50 via-purple-50 to-green-50">
            <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <span>🗺️</span>
              Your Personalized Career Roadmap
            </h3>
            <div className="relative">
              <div className="flex items-center justify-between">
                {roadmap.map((milestone, index) => (
                  <div key={index} className="flex items-center flex-1">
                    <div className="flex-1 text-center">
                      <div className={`w-20 h-20 bg-${milestone.color}-500 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg`}>
                        <span className="text-3xl">{milestone.icon}</span>
                      </div>
                      <p className="font-bold text-slate-800 text-sm mb-1">{milestone.phase}</p>
                      <p className="font-semibold text-slate-700 text-xs mb-1">{milestone.title}</p>
                      <p className="text-xs text-slate-600">{milestone.description}</p>
                    </div>
                    {index < roadmap.length - 1 && (
                      <div className="flex-1 border-t-4 border-dashed border-slate-300 mx-2 mt-[-40px]"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-6 p-4 bg-white rounded-lg border-2 border-indigo-200">
              <p className="text-sm text-slate-700">
                <strong>💡 Roadmap Insight:</strong> This personalized journey is based on your current skills ({avgRating}/5), 
                your goal to develop <strong>{formData.skillsToImprove[0] || 'new skills'}</strong>, 
                and your aspiration to <strong>{formData.careerGrowth}</strong>.
              </p>
            </div>
          </Card>

          {/* Personalized Insights */}
          <Card className="mb-8 bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
            <h3 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span>💡</span>
              Your Personalized Insights
            </h3>
            <div className="space-y-3">
              {insights.map((insight, index) => (
                <div key={index} className="flex items-start gap-3 p-4 bg-white rounded-lg border-l-4 border-orange-400">
                  <span className="text-xl mt-1">✓</span>
                  <p className="text-slate-700">{insight}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4 mt-8">
            <Button variant="outline" onClick={() => setShowResults(false)}>
              Back to Assessment
            </Button>
            <Button onClick={() => window.print()} className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Download Report
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Step 0: Welcome Page
  if (currentStep === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="text-6xl mb-6">🚀</div>
            <h1 className="text-5xl font-bold text-slate-800 mb-4">Welcome to Your UX Growth Journey</h1>
            <p className="text-xl text-slate-600">
              Discover your strengths, set goals, and unlock your career potential
            </p>
          </div>

          <Card className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Let's get started!</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => updateFormData('name', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 focus:border-purple-500 focus:outline-none"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">AGID</label>
                <input
                  type="text"
                  value={formData.agid || ''}
                  onChange={(e) => updateFormData('agid', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 focus:border-purple-500 focus:outline-none"
                  placeholder="Enter your AGID"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData('email', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 focus:border-purple-500 focus:outline-none"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Role</label>
                <select
                  value={formData.currentRole}
                  onChange={(e) => updateFormData('currentRole', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 focus:border-purple-500 focus:outline-none"
                >
                  <option value="">Choose your role...</option>
                  <option value="Associate UX Designer">Associate UX Designer</option>
                  <option value="UX Designer">UX Designer</option>
                  <option value="Senior UX Designer">Senior UX Designer</option>
                  <option value="Lead UX Designer">Lead UX Designer</option>
                </select>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <Button
                onClick={() => setCurrentStep(1)}
                disabled={!formData.currentRole || !formData.name || !formData.email}
                size="lg"
              >
                Start Your Journey
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  // Step 1: Skills Assessment
  if (currentStep === 1) {
    const roleConfig = getRoleConfig()
    const category = roleConfig.skillCategories[currentCategory]
    const currentCategorySkills = category.skills
    
    const allCurrentCategoryRated = category.questionType === 'multiselect'
      ? category.multiSelectQuestions?.every((q) => {
          const responses = formData.multiSelectResponses?.[q.question]
          return responses && responses.length > 0
        }) ?? true
      : currentCategorySkills.every((skill) => {
          const skillName = getSkillName(skill)
          return formData.skillRatings[skillName]?.rating
        })
    
    const currentLevel = getCareerLevel(currentXP)
    const nextLevel = getNextCareerLevel(currentXP)
    const progressToNext = nextLevel ? ((currentXP - currentLevel.minXP) / (nextLevel.minXP - currentLevel.minXP)) * 100 : 100
    const remainingXP = nextLevel ? nextLevel.minXP - currentXP : 0
    const currentLevelDisplay = getLevelDisplay(currentLevel.level)

    return (
      <div className="min-h-screen bg-slate-50 py-8 px-6">
        {/* Achievement Notification */}
        {showAchievement && (
          <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50 animate-bounce">
            <Card className="bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 border-4 border-yellow-300 shadow-2xl">
              <div className="text-center py-6 px-8">
                <div className="text-6xl mb-3">🎉</div>
                <h3 className="text-2xl font-bold text-white mb-2">Achievement Unlocked!</h3>
                <p className="text-lg text-white font-semibold">{achievementTitle}</p>
              </div>
            </Card>
          </div>
        )}

        <div className="max-w-[1600px] mx-auto">
          <div className="grid grid-cols-12 gap-6">
            {/* Left Sidebar - Integrated Progress */}
            <div className="col-span-2">
              <ProgressSidebar 
                currentStep={1} 
                currentCategory={currentCategory}
                skillCategories={roleConfig.skillCategories}
                onStepClick={handleStepClick}
              />
            </div>

            {/* Center - Main Content */}
            <div className="col-span-7">
              <Card className="mb-6 border-2 border-slate-300">
                <div className="mb-6 pb-4 border-b-2 border-slate-200">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-growth-400 to-growth-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                      {currentCategory + 1}
                    </div>
                    <div className="flex-1">
                      <h2 className="text-3xl font-bold text-slate-800 mb-1">{category.category}</h2>
                      <p className="text-sm text-slate-600">
                        {category.questionType === 'multiselect' 
                          ? 'Select your responses for each question below' 
                          : 'Rate your proficiency level for each skill below'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-600">Category Progress</p>
                      <p className="text-2xl font-bold text-growth-600">
                        {category.questionType === 'multiselect'
                          ? `${category.multiSelectQuestions?.filter(q => {
                              const responses = formData.multiSelectResponses?.[q.question]
                              return responses && responses.length > 0
                            }).length || 0}/${category.multiSelectQuestions?.length || 0}`
                          : `${currentCategorySkills.filter(s => formData.skillRatings[getSkillName(s)]?.rating).length}/${currentCategorySkills.length}`
                        }
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200">
                    {category.description}
                  </p>
                </div>

                <div className="space-y-3">
                  {/* Debug Info */}
                  {category.questionType === 'multiselect' && !category.multiSelectQuestions && (
                    <div className="p-4 bg-yellow-50 border-2 border-yellow-300 rounded-lg">
                      <p className="text-yellow-800">No multiselect questions found for this category.</p>
                    </div>
                  )}
                  
                  {/* Rating Questions */}
                  {category.questionType !== 'multiselect' && category.skills.map((skill, index) => {
                    const skillName = getSkillName(skill)
                    return (
                      <div key={skillName} className="group">
                        <div className="p-4 bg-white rounded-xl border-2 border-slate-200 hover:border-growth-400 hover:shadow-md transition-all">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 font-bold text-sm flex items-center justify-center">
                              {index + 1}
                            </div>
                            <h4 className="text-lg font-bold text-slate-800 flex-1">{skillName}</h4>
                            {formData.skillRatings[skillName]?.rating && (
                              <div className="flex items-center gap-2">
                                <Badge variant="growth" className="text-sm">
                                  {ratingLabels[formData.skillRatings[skillName].rating - 1].label}
                          </Badge>
                          <span className="text-sm font-bold text-purple-600">+{formData.skillRatings[skillName].rating * 5} XP</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          type="button"
                          onClick={() =>
                            updateFormData('skillRatings', {
                              ...formData.skillRatings,
                              [skillName]: { ...formData.skillRatings[skillName], rating },
                            })
                          }
                          className={`flex-1 h-14 rounded-xl font-bold text-xl transition-all relative overflow-hidden ${
                            formData.skillRatings[skillName]?.rating === rating
                              ? 'bg-gradient-to-br from-growth-500 to-growth-700 text-white scale-105 shadow-xl ring-2 ring-growth-300'
                              : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border-2 border-slate-300 hover:border-growth-400'
                          }`}
                        >
                          <span className="relative z-10">{rating}</span>
                          {formData.skillRatings[skillName]?.rating === rating && (
                            <div className="absolute inset-0 bg-white opacity-20 animate-pulse" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )})}
              
              {/* MultiSelect Questions */}
              {category.questionType === 'multiselect' && category.multiSelectQuestions?.map((question, qIndex) => (
                <div key={qIndex} className="group">
                  <div className="p-4 bg-white rounded-xl border-2 border-slate-200 hover:border-growth-400 hover:shadow-md transition-all">
                    <div className="mb-3">
                      <h4 className="text-lg font-bold text-slate-800 mb-3">{question.question}</h4>
                      <p className="text-sm text-slate-600 mb-3">Select all that apply</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {question.options.map((option) => {
                        const isSelected = formData.multiSelectResponses?.[question.question]?.includes(option) || false
                        return (
                          <button
                            key={option}
                            type="button"
                            onClick={() => {
                              const currentSelections = formData.multiSelectResponses?.[question.question] || []
                              const newSelections = isSelected
                                ? currentSelections.filter(o => o !== option)
                                : [...currentSelections, option]
                              updateFormData('multiSelectResponses', {
                                ...formData.multiSelectResponses,
                                [question.question]: newSelections
                              })
                            }}
                            className={`p-3 rounded-lg text-left transition-all ${
                              isSelected
                                ? 'bg-gradient-to-br from-growth-500 to-growth-700 text-white font-semibold shadow-md'
                                : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-2 border-slate-300'
                            }`}
                          >
                            {option}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

              {/* Navigation */}
              <div className="flex justify-between mt-6">
                <Button
                  variant="outline"
                  onClick={() => {
                    if (currentCategory > 0) {
                      setCurrentCategory(currentCategory - 1)
                    } else {
                      prevStep()
                    }
                  }}
                  size="lg"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back
                </Button>
                <Button
                  onClick={() => {
                    if (currentCategory < roleConfig.skillCategories.length - 1) {
                      setCurrentCategory(currentCategory + 1)
                    } else {
                      setCurrentCategory(0)
                      nextStep()
                    }
                  }}
                  disabled={!allCurrentCategoryRated}
                  size="lg"
                >
                  {currentCategory < roleConfig.skillCategories.length - 1 ? 'Next Category' : 'Continue'}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>

            {/* Right Sidebar - XP & Rating Legend */}
            <div className="col-span-3">
              <div className="sticky top-8 space-y-6">
                {/* Career XP Card */}
                <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-300">
                  <h3 className="text-xs font-bold text-slate-600 mb-2 uppercase tracking-wide">Career XP</h3>
                  <p className="text-5xl font-bold text-purple-600 mb-3">{currentXP}</p>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Current:</span>
                      <span className="font-bold text-slate-800">{currentLevelDisplay.icon} {currentLevel.level}</span>
                    </div>
                    {nextLevel && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">Next:</span>
                        <span className="font-bold text-slate-800">{getLevelDisplay(nextLevel.level).icon} {nextLevel.level}</span>
                      </div>
                    )}
                  </div>
                  {nextLevel && (
                    <>
                      <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden mb-2">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-500"
                          style={{ width: `${Math.min(progressToNext, 100)}%` }}
                        />
                      </div>
                      <p className="text-xs text-slate-600 text-center">
                        {remainingXP} XP until {nextLevel.level}
                      </p>
                    </>
                  )}
                </Card>

                {/* Rating Scale */}
                <Card className="bg-gradient-to-br from-green-50 to-teal-50 border-2 border-green-300">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="text-2xl">💡</div>
                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Rating Scale</h3>
                  </div>
                  <div className="space-y-3">
                    {ratingLabels.map(({ rating, label, description }) => (
                      <div key={rating} className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-200 to-slate-300 text-slate-700 font-bold text-sm flex items-center justify-center flex-shrink-0">
                          {rating}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm text-slate-800">{label}</p>
                          <p className="text-xs text-slate-600 leading-tight">{description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-green-200">
                    <p className="text-xs text-slate-600 text-center">💎 <strong>Earn 5 XP</strong> per rating point</p>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Step 2: Superpowers
  if (currentStep === 2) {
    return (
      <div className="min-h-screen bg-slate-50 py-8 px-6">
        <div className="max-w-[1600px] mx-auto">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-2">
              <ProgressSidebar currentStep={2} onStepClick={handleStepClick} />
            </div>
            <div className="col-span-7">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Badge variant="achievement" className="mb-4">Step 2 of 6</Badge>
            <h2 className="text-3xl font-bold text-slate-800 mb-2 flex items-center gap-2">
              <Sparkles className="w-8 h-8 text-achievement-600" />
              Discover Your Superpowers
            </h2>
            <p className="text-lg text-slate-600">Let's celebrate what you do best</p>
          </div>

          <div className="space-y-6">
            <Card>
              <h3 className="text-xl font-bold text-slate-800 mb-4">
                What are your biggest strengths? <span className="text-sm font-normal text-slate-600">(Choose 3)</span>
              </h3>
              <div className="grid md:grid-cols-2 gap-3">
                {strengthsOptions.map((option) => (
                  <label
                    key={option}
                    className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      formData.strengths.includes(option)
                        ? 'border-achievement-500 bg-achievement-50'
                        : formData.strengths.length >= 3
                        ? 'border-slate-200 opacity-50 cursor-not-allowed'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.strengths.includes(option)}
                      onChange={() => toggleArrayItem('strengths', option)}
                      disabled={formData.strengths.length >= 3 && !formData.strengths.includes(option)}
                      className="w-5 h-5 text-achievement-600 rounded focus:ring-achievement-500"
                    />
                    <span className="font-medium text-slate-700">{option}</span>
                  </label>
                ))}
              </div>
            </Card>

            <Card>
              <h3 className="text-xl font-bold text-slate-800 mb-4">
                What do teammates usually come to you for?
              </h3>
              <textarea
                value={formData.teammatesFeedback}
                onChange={(e) => updateFormData('teammatesFeedback', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 focus:border-growth-500 focus:outline-none transition-colors"
                placeholder="Share what others appreciate about your work..."
              />
            </Card>

            <Card>
              <h3 className="text-xl font-bold text-slate-800 mb-4">
                What accomplishment are you most proud of recently?
              </h3>
              <textarea
                value={formData.proudAccomplishment}
                onChange={(e) => updateFormData('proudAccomplishment', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 focus:border-growth-500 focus:outline-none transition-colors"
                placeholder="Describe your proudest achievement..."
              />
            </Card>
          </div>

          <div className="flex justify-between mt-8">
            <Button variant="outline" onClick={prevStep}>
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </Button>
            <Button
              onClick={nextStep}
              disabled={
                formData.strengths.length !== 3 ||
                !formData.teammatesFeedback ||
                !formData.proudAccomplishment
              }
            >
              Continue
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
            </div>
            <div className="col-span-3">
              <AIInsights step={2} formData={formData} />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Step 3: Growth Opportunities
  if (currentStep === 3) {
    return (
      <div className="min-h-screen bg-slate-50 py-8 px-6">
        <div className="max-w-[1600px] mx-auto">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-2">
              <ProgressSidebar currentStep={3} onStepClick={handleStepClick} />
            </div>
            <div className="col-span-7">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Badge variant="growth" className="mb-4">Step 3 of 6</Badge>
            <h2 className="text-3xl font-bold text-slate-800 mb-2 flex items-center gap-2">
              <Target className="w-8 h-8 text-growth-600" />
              Future Growth Areas
            </h2>
            <p className="text-lg text-slate-600">Identify where you want to develop</p>
          </div>

          <div className="space-y-6">
            <Card>
              <h3 className="text-xl font-bold text-slate-800 mb-4">
                Which skills would you most like to improve? <span className="text-sm font-normal text-slate-600">(Choose 3)</span>
              </h3>
              <div className="grid md:grid-cols-2 gap-3">
                {strengthsOptions.map((option) => (
                  <label
                    key={option}
                    className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      formData.skillsToImprove.includes(option)
                        ? 'border-growth-500 bg-growth-50'
                        : formData.skillsToImprove.length >= 3
                        ? 'border-slate-200 opacity-50 cursor-not-allowed'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.skillsToImprove.includes(option)}
                      onChange={() => toggleArrayItem('skillsToImprove', option)}
                      disabled={formData.skillsToImprove.length >= 3 && !formData.skillsToImprove.includes(option)}
                      className="w-5 h-5 text-growth-600 rounded focus:ring-growth-500"
                    />
                    <span className="font-medium text-slate-700">{option}</span>
                  </label>
                ))}
              </div>
            </Card>

            <Card>
              <h3 className="text-xl font-bold text-slate-800 mb-4">
                What currently limits your growth?
              </h3>
              <p className="text-sm text-slate-600 mb-4">Select all that apply</p>
              <div className="space-y-3">
                {growthLimitsOptions.map((option) => (
                  <label
                    key={option}
                    className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      formData.growthLimits.includes(option)
                        ? 'border-growth-500 bg-growth-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.growthLimits.includes(option)}
                      onChange={() => toggleArrayItem('growthLimits', option)}
                      className="w-5 h-5 text-growth-600 rounded focus:ring-growth-500"
                    />
                    <span className="font-medium text-slate-700">{option}</span>
                  </label>
                ))}
              </div>
            </Card>

            <Card>
              <h3 className="text-xl font-bold text-slate-800 mb-4">
                How do you learn best?
              </h3>
              <p className="text-sm text-slate-600 mb-4">Select all that apply</p>
              <div className="grid md:grid-cols-2 gap-3">
                {learningStyleOptions.map((option) => (
                  <label
                    key={option}
                    className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      formData.learningStyle.includes(option)
                        ? 'border-growth-500 bg-growth-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.learningStyle.includes(option)}
                      onChange={() => toggleArrayItem('learningStyle', option)}
                      className="w-5 h-5 text-growth-600 rounded focus:ring-growth-500"
                    />
                    <span className="font-medium text-slate-700">{option}</span>
                  </label>
                ))}
              </div>
            </Card>
          </div>

          <div className="flex justify-between mt-8">
            <Button variant="outline" onClick={prevStep}>
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </Button>
            <Button
              onClick={nextStep}
              disabled={
                formData.skillsToImprove.length !== 3 ||
                formData.growthLimits.length === 0 ||
                formData.learningStyle.length === 0
              }
            >
              Continue
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
            </div>
            <div className="col-span-3">
              <AIInsights step={3} formData={formData} />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Step 4: Community Contribution
  if (currentStep === 4) {
    return (
      <div className="min-h-screen bg-slate-50 py-8 px-6">
        <div className="max-w-[1600px] mx-auto">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-2">
              <ProgressSidebar currentStep={4} onStepClick={handleStepClick} />
            </div>
            <div className="col-span-7">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Badge variant="leadership" className="mb-4">Step 4 of 6</Badge>
            <h2 className="text-3xl font-bold text-slate-800 mb-2 flex items-center gap-2">
              <Users className="w-8 h-8 text-leadership-600" />
              Share What You Can Teach
            </h2>
            <p className="text-lg text-slate-600">Help others grow with your expertise</p>
          </div>

          <div className="space-y-6">
            <Card>
              <h3 className="text-xl font-bold text-slate-800 mb-4">
                Which topic would you love to teach others?
              </h3>
              <textarea
                value={formData.teachingTopic}
                onChange={(e) => updateFormData('teachingTopic', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 focus:border-growth-500 focus:outline-none transition-colors"
                placeholder="What knowledge or skills could you share with the team?"
              />
            </Card>

            <Card>
              <h3 className="text-xl font-bold text-slate-800 mb-4">
                Would you be interested in becoming a mentor, workshop facilitator, or subject matter champion?
              </h3>
              <div className="space-y-3">
                {['Yes', 'Maybe Later', 'Not Right Now'].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => updateFormData('mentorInterest', option)}
                    className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                      formData.mentorInterest === option
                        ? 'border-leadership-500 bg-leadership-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <span className="font-medium text-slate-700">{option}</span>
                  </button>
                ))}
              </div>
            </Card>
          </div>

          <div className="flex justify-between mt-8">
            <Button variant="outline" onClick={prevStep}>
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </Button>
            <Button
              onClick={nextStep}
              disabled={!formData.teachingTopic || !formData.mentorInterest}
            >
              Continue
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
            </div>
            <div className="col-span-3">
              <AIInsights step={4} formData={formData} />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Step 5: Career Aspirations (Moved from Step 2)
  if (currentStep === 5) {
    return (
      <div className="min-h-screen bg-slate-50 py-8 px-6">
        <div className="max-w-[1600px] mx-auto">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-2">
              <ProgressSidebar currentStep={5} onStepClick={handleStepClick} />
            </div>
            <div className="col-span-7">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Badge variant="growth" className="mb-4">Step 5 of 6</Badge>
            <h2 className="text-3xl font-bold text-slate-800 mb-2">Career Aspirations</h2>
            <p className="text-lg text-slate-600">Help us understand your career goals</p>
          </div>

          <div className="space-y-6">
            <Card>
              <h3 className="text-xl font-bold text-slate-800 mb-4">
                Where would you like your career to grow?
              </h3>
              <div className="grid md:grid-cols-2 gap-3">
                {careerOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => updateFormData('careerGrowth', option)}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      formData.careerGrowth === option
                        ? 'border-growth-500 bg-growth-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <span className="font-medium text-slate-700">{option}</span>
                  </button>
                ))}
              </div>
            </Card>

            <Card>
              <h3 className="text-xl font-bold text-slate-800 mb-4">
                In the next 2 years, where do you see yourself?
              </h3>
              <div className="space-y-3">
                {futureVisionOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => updateFormData('futureVision', option)}
                    className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                      formData.futureVision === option
                        ? 'border-growth-500 bg-growth-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <span className="font-medium text-slate-700">{option}</span>
                  </button>
                ))}
              </div>
            </Card>

            <Card>
              <h3 className="text-xl font-bold text-slate-800 mb-4">
                Which areas are most important to your future growth?
              </h3>
              <p className="text-sm text-slate-600 mb-4">Select all that apply</p>
              <div className="grid md:grid-cols-2 gap-3">
                {growthAreasOptions.map((option) => (
                  <label
                    key={option}
                    className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      formData.growthAreas.includes(option)
                        ? 'border-growth-500 bg-growth-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.growthAreas.includes(option)}
                      onChange={() => toggleArrayItem('growthAreas', option)}
                      className="w-5 h-5 text-growth-600 rounded focus:ring-growth-500"
                    />
                    <span className="font-medium text-slate-700">{option}</span>
                  </label>
                ))}
              </div>
            </Card>
          </div>

          <div className="flex justify-between mt-8">
            <Button variant="outline" onClick={prevStep}>
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </Button>
            <Button
              onClick={() => {
                console.log('Button clicked!')
                handleSubmit()
              }}
              disabled={!formData.careerGrowth || !formData.futureVision || formData.growthAreas.length === 0}
              size="lg"
            >
              View My Growth Journey
              <Sparkles className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
            </div>
            <div className="col-span-3">
              <AIInsights step={5} formData={formData} />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Step 6: Incomplete Notification (shown when user tries to view results but hasn't completed all fields)
  if (currentStep === 6 && !isFormComplete()) {
    const incompleteSteps = getIncompleteSteps()
    
    return (
      <div className="min-h-screen bg-slate-50 py-8 px-6">
        <div className="max-w-[1600px] mx-auto">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-2">
              <ProgressSidebar currentStep={6} onStepClick={handleStepClick} />
            </div>
            <div className="col-span-10">
              <div className="max-w-3xl mx-auto">
                {/* Alert Card */}
                <Card className="border-2 border-orange-300 bg-gradient-to-br from-orange-50 to-yellow-50 mb-6">
                  <div className="text-center py-8">
                    <div className="text-6xl mb-4">⚠️</div>
                    <h2 className="text-3xl font-bold text-slate-800 mb-3">Almost There!</h2>
                    <p className="text-lg text-slate-600 mb-2">
                      You need to complete all sections before viewing your Growth Journey.
                    </p>
                    <p className="text-sm text-slate-500">
                      Don't worry - your progress has been saved automatically!
                    </p>
                  </div>
                </Card>

                {/* Incomplete Steps List */}
                <Card>
                  <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <span>📋</span>
                    Incomplete Sections ({incompleteSteps.length})
                  </h3>
                  <div className="space-y-3">
                    {incompleteSteps.map((item) => (
                      <button
                        key={item.step}
                        onClick={() => handleStepClick(item.step)}
                        className="w-full flex items-start gap-4 p-4 rounded-lg border-2 border-slate-200 hover:border-growth-500 hover:bg-growth-50 transition-all text-left group"
                      >
                        <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 font-bold flex items-center justify-center flex-shrink-0 group-hover:bg-growth-500 group-hover:text-white transition-all">
                          {item.step}
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-slate-800 mb-1">{item.name}</p>
                          <p className="text-sm text-slate-600">{item.reason}</p>
                        </div>
                        <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-growth-600 transition-all" />
                      </button>
                    ))}
                  </div>
                </Card>

                {/* Progress Summary */}
                <Card className="mt-6 bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600 mb-1">Overall Progress</p>
                      <p className="text-2xl font-bold text-slate-800">
                        {5 - incompleteSteps.length} of 5 sections complete
                      </p>
                    </div>
                    <div className="text-5xl">
                      {5 - incompleteSteps.length === 5 ? '🎉' : '💪'}
                    </div>
                  </div>
                  <div className="mt-4 w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-growth-500 to-blue-500 transition-all duration-500"
                      style={{ width: `${((5 - incompleteSteps.length) / 5) * 100}%` }}
                    />
                  </div>
                </Card>

                {/* Action Button */}
                <div className="mt-8 text-center">
                  <Button
                    onClick={() => handleStepClick(incompleteSteps[0].step)}
                    size="lg"
                    className="px-8"
                  >
                    Complete {incompleteSteps[0].name}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return null
}
