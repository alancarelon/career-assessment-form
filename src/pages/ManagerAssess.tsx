import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import type { AssessmentSubmission } from '../lib/supabase'

interface RatingOption {
  label: string
  display_text: string
  description: string
  numeric_value: number | null
  icon: string
}

interface CategoryInfo {
  id: string
  name: string
  questions: string[]
}

const CATEGORIES: CategoryInfo[] = [
  {
    id: 'ux_research',
    name: 'UX Research',
    questions: [
      'How effectively do they plan and conduct user research?',
      'How well do they synthesize findings into actionable insights?'
    ]
  },
  {
    id: 'interaction_design',
    name: 'Interaction Design',
    questions: [
      'How effectively do they design user flows and interactions?',
      'How well do they balance user needs with technical constraints?'
    ]
  },
  {
    id: 'visual_design',
    name: 'Visual Design',
    questions: [
      'How strong is their visual design execution?',
      'How well do they apply design systems and maintain consistency?'
    ]
  },
  {
    id: 'accessibility',
    name: 'Accessibility',
    questions: [
      'How well do they design for inclusive experiences?',
      'How effectively do they implement accessibility standards?'
    ]
  },
  {
    id: 'facilitation',
    name: 'Facilitation',
    questions: [
      'How effectively do they lead design discussions?',
      'How well do they guide teams through design processes?'
    ]
  },
  {
    id: 'stakeholder_management',
    name: 'Stakeholder Management',
    questions: [
      'How effectively do they communicate design decisions?',
      'How well do they manage stakeholder expectations?'
    ]
  },
  {
    id: 'workshop_facilitation',
    name: 'Workshop Facilitation',
    questions: [
      'How effectively do they plan and run collaborative sessions?',
      'How well do they engage participants and drive outcomes?'
    ]
  },
  {
    id: 'ai_for_ux',
    name: 'AI for UX',
    questions: [
      'How effectively do they leverage AI tools in their work?',
      'How well do they understand AI implications for UX?'
    ]
  }
]

export default function ManagerAssess() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  
  const [assessment, setAssessment] = useState<AssessmentSubmission | null>(null)
  const [ratingOptions, setRatingOptions] = useState<RatingOption[]>([])
  const [currentCategory, setCurrentCategory] = useState(0)
  const [ratings, setRatings] = useState<Record<string, string>>({})
  const [overallNotes, setOverallNotes] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [managerAssessmentId, setManagerAssessmentId] = useState<string | null>(null)

  const MANAGER_NAME = 'Zheeshan Durrani'
  const MANAGER_EMAIL = 'zheeshan.durrani@carelon.com'

  useEffect(() => {
    loadData()
  }, [id])

  const loadData = async () => {
    try {
      setLoading(true)

      const { data: assessmentData, error: assessmentError } = await supabase
        .from('assessments')
        .select('*')
        .eq('id', id)
        .single()

      if (assessmentError) throw assessmentError
      setAssessment(assessmentData)

      const { data: ratingsData, error: ratingsError } = await supabase
        .from('rating_mappings')
        .select('*')
        .order('order_index')

      if (ratingsError) throw ratingsError
      setRatingOptions(ratingsData || [])

      const { data: existingAssessment, error: existingError } = await supabase
        .from('manager_assessments')
        .select('*')
        .eq('associate_assessment_id', id)
        .eq('assessor_email', MANAGER_EMAIL)
        .maybeSingle()

      if (existingError && existingError.code !== 'PGRST116') throw existingError

      if (existingAssessment) {
        setManagerAssessmentId(existingAssessment.id)
        setRatings(existingAssessment.category_ratings || {})
        setOverallNotes(existingAssessment.overall_notes || '')
        
        const completedCategories = Object.keys(existingAssessment.category_ratings || {}).length
        if (completedCategories > 0 && completedCategories < CATEGORIES.length) {
          setCurrentCategory(completedCategories)
        }
      }
    } catch (error) {
      console.error('Error loading data:', error)
      alert('Failed to load assessment. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleRatingSelect = (categoryId: string, ratingLabel: string) => {
    setRatings(prev => ({
      ...prev,
      [categoryId]: ratingLabel
    }))
  }

  const saveProgress = async () => {
    try {
      setSaving(true)

      const categoryRatingsNumeric: Record<string, number | null> = {}
      Object.entries(ratings).forEach(([categoryId, ratingLabel]) => {
        const option = ratingOptions.find(opt => opt.label === ratingLabel)
        categoryRatingsNumeric[categoryId] = option?.numeric_value ?? null
      })

      const assessmentData = {
        associate_assessment_id: id,
        assessor_name: MANAGER_NAME,
        assessor_email: MANAGER_EMAIL,
        assessor_role: 'manager',
        category_ratings: ratings,
        category_ratings_numeric: categoryRatingsNumeric,
        overall_notes: overallNotes,
        assessment_status: 'in_progress',
        progress: Object.keys(ratings).length,
        updated_at: new Date().toISOString()
      }

      if (managerAssessmentId) {
        const { error } = await supabase
          .from('manager_assessments')
          .update(assessmentData)
          .eq('id', managerAssessmentId)

        if (error) throw error
      } else {
        const { data, error } = await supabase
          .from('manager_assessments')
          .insert([assessmentData])
          .select()
          .single()

        if (error) throw error
        setManagerAssessmentId(data.id)
      }

      return true
    } catch (error) {
      console.error('Error saving progress:', error)
      alert('Failed to save progress. Please try again.')
      return false
    } finally {
      setSaving(false)
    }
  }

  const handleNext = async () => {
    if (!ratings[CATEGORIES[currentCategory].id]) {
      alert('Please select a rating before continuing.')
      return
    }

    const saved = await saveProgress()
    if (saved && currentCategory < CATEGORIES.length - 1) {
      setCurrentCategory(currentCategory + 1)
      window.scrollTo(0, 0)
    }
  }

  const handlePrevious = () => {
    if (currentCategory > 0) {
      setCurrentCategory(currentCategory - 1)
      window.scrollTo(0, 0)
    }
  }

  const handleComplete = async () => {
    if (Object.keys(ratings).length < CATEGORIES.length) {
      alert('Please rate all categories before completing the assessment.')
      return
    }

    try {
      setSaving(true)

      const categoryRatingsNumeric: Record<string, number | null> = {}
      Object.entries(ratings).forEach(([categoryId, ratingLabel]) => {
        const option = ratingOptions.find(opt => opt.label === ratingLabel)
        categoryRatingsNumeric[categoryId] = option?.numeric_value ?? null
      })

      const assessmentData = {
        associate_assessment_id: id,
        assessor_name: MANAGER_NAME,
        assessor_email: MANAGER_EMAIL,
        assessor_role: 'manager',
        category_ratings: ratings,
        category_ratings_numeric: categoryRatingsNumeric,
        overall_notes: overallNotes,
        assessment_status: 'completed',
        progress: CATEGORIES.length,
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      if (managerAssessmentId) {
        const { error } = await supabase
          .from('manager_assessments')
          .update(assessmentData)
          .eq('id', managerAssessmentId)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('manager_assessments')
          .insert([assessmentData])

        if (error) throw error
      }

      alert('✅ Assessment completed successfully!')
      navigate(`/gap-analysis/${id}`)
    } catch (error) {
      console.error('Error completing assessment:', error)
      alert('Failed to complete assessment. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const getSelfRatingForCategory = (categoryId: string): number | null => {
    if (!assessment?.skill_ratings) return null
    
    const categoryRatings = Object.entries(assessment.skill_ratings)
      .filter(([key]) => key.toLowerCase().includes(categoryId.replace('_', '')))
      .map(([, value]) => value.rating)
    
    if (categoryRatings.length === 0) return null
    
    return categoryRatings.reduce((a, b) => a + b, 0) / categoryRatings.length
  }

  const getGapPreview = (categoryId: string, selectedRating: string): string => {
    const selfRating = getSelfRatingForCategory(categoryId)
    if (selfRating === null) return ''
    
    const option = ratingOptions.find(opt => opt.label === selectedRating)
    if (!option || option.numeric_value === null) return ''
    
    const gap = selfRating - option.numeric_value
    
    if (Math.abs(gap) <= 0.5) return '✅ Well calibrated'
    if (gap > 0.5) return '⚠️ Possible overestimation'
    if (gap < -0.5) return '⬆️ Hidden strength'
    return ''
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading assessment...</p>
        </div>
      </div>
    )
  }

  if (!assessment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Assessment Not Found</h1>
          <p className="text-gray-600 mb-6">
            The requested assessment could not be found.
          </p>
          <button
            onClick={() => navigate('/manager-dashboard')}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  const category = CATEGORIES[currentCategory]
  const progress = (Object.keys(ratings).length / CATEGORIES.length) * 100
  const selfRating = getSelfRatingForCategory(category.id)

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/manager-dashboard')}
            className="text-purple-600 hover:text-purple-700 font-medium mb-4 flex items-center gap-2"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Assessing: {assessment.name}
          </h1>
          <p className="text-gray-600">
            {assessment.current_role} • Self-assessment submitted: {new Date(assessment.created_at!).toLocaleDateString()}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Progress: {Object.keys(ratings).length}/{CATEGORIES.length} categories
            </span>
            <span className="text-sm font-medium text-purple-600">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-purple-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Category Assessment */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-6">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl font-bold text-purple-600">
                {currentCategory + 1}
              </span>
              <h2 className="text-2xl font-bold text-gray-900">
                {category.name}
              </h2>
            </div>

            {/* Self-Rating Display */}
            {selfRating !== null && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm font-medium text-blue-900 mb-1">
                  👤 Designer self-rated:
                </p>
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={star <= Math.round(selfRating) ? 'text-yellow-400' : 'text-gray-300'}
                      >
                        ⭐
                      </span>
                    ))}
                  </div>
                  <span className="text-lg font-semibold text-blue-900">
                    ({selfRating.toFixed(1)}/5)
                  </span>
                </div>
              </div>
            )}

            {/* Guiding Questions */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
              <p className="text-sm font-medium text-purple-900 mb-2">
                💭 Consider these aspects:
              </p>
              <ul className="space-y-2">
                {category.questions.map((question, idx) => (
                  <li key={idx} className="text-gray-700 flex items-start gap-2">
                    <span className="text-purple-600 mt-1">•</span>
                    <span>{question}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Rating Options */}
            <div>
              <p className="text-lg font-semibold text-gray-900 mb-4">
                📊 Your overall assessment of {category.name}:
              </p>
              <div className="space-y-3">
                {ratingOptions.map((option) => (
                  <button
                    key={option.label}
                    onClick={() => handleRatingSelect(category.id, option.label)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      ratings[category.id] === option.label
                        ? 'border-purple-600 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{option.icon}</span>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 mb-1">
                          {option.display_text}
                          {option.numeric_value !== null && (
                            <span className="text-sm text-gray-500 ml-2">
                              ({option.numeric_value})
                            </span>
                          )}
                        </p>
                        <p className="text-sm text-gray-600">
                          {option.description}
                        </p>
                      </div>
                      {ratings[category.id] === option.label && (
                        <span className="text-purple-600 text-xl">✓</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {/* Gap Preview */}
              {ratings[category.id] && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-700">
                    💡 Gap Preview: {getGapPreview(category.id, ratings[category.id])}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Overall Notes (shown on last category) */}
        {currentCategory === CATEGORIES.length - 1 && (
          <div className="bg-white rounded-xl shadow-md p-8 mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              📝 Overall Notes (Optional)
            </h3>
            <textarea
              value={overallNotes}
              onChange={(e) => setOverallNotes(e.target.value)}
              placeholder="Add any additional observations or comments about this associate's overall performance..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              rows={4}
            />
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center">
          <button
            onClick={handlePrevious}
            disabled={currentCategory === 0}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              currentCategory === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            ← Previous
          </button>

          <button
            onClick={saveProgress}
            disabled={saving}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
          >
            {saving ? 'Saving...' : '💾 Save Progress'}
          </button>

          {currentCategory < CATEGORIES.length - 1 ? (
            <button
              onClick={handleNext}
              disabled={!ratings[category.id]}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                !ratings[category.id]
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-purple-600 text-white hover:bg-purple-700'
              }`}
            >
              Next Category →
            </button>
          ) : (
            <button
              onClick={handleComplete}
              disabled={Object.keys(ratings).length < CATEGORIES.length || saving}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                Object.keys(ratings).length < CATEGORIES.length || saving
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {saving ? 'Completing...' : '✅ Complete Assessment'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
