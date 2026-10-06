import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { CATEGORIES } from '../data/categories'

interface RatingOption {
  label: string
  display_text: string
  description: string
  numeric_value: number | null
  icon: string
}

interface Assignment {
  id: string
  associate_assessment_id: string
  stakeholder_name: string
  stakeholder_email: string
  token: string
  status: 'pending' | 'completed'
}

export default function StakeholderAssess() {
  const { token } = useParams<{ token: string }>()

  const [assignment, setAssignment] = useState<Assignment | null>(null)
  const [associateName, setAssociateName] = useState('')
  const [associateRole, setAssociateRole] = useState('')
  const [ratingOptions, setRatingOptions] = useState<RatingOption[]>([])
  const [loading, setLoading] = useState(true)
  const [invalidLink, setInvalidLink] = useState(false)

  const [emailInput, setEmailInput] = useState('')
  const [verified, setVerified] = useState(false)
  const [verifyError, setVerifyError] = useState('')

  const [currentCategory, setCurrentCategory] = useState(0)
  const [ratings, setRatings] = useState<Record<string, string>>({})
  const [overallNotes, setOverallNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    loadData()
  }, [token])

  const loadData = async () => {
    try {
      setLoading(true)

      const { data: assignmentData, error: assignmentError } = await supabase
        .from('stakeholder_assignments')
        .select('*')
        .eq('token', token)
        .maybeSingle()

      if (assignmentError) throw assignmentError
      if (!assignmentData) {
        setInvalidLink(true)
        return
      }
      setAssignment(assignmentData)

      const { data: assessmentData, error: assessmentError } = await supabase
        .from('assessments')
        .select('name, current_role')
        .eq('id', assignmentData.associate_assessment_id)
        .single()

      if (assessmentError) throw assessmentError
      setAssociateName(assessmentData.name)
      setAssociateRole(assessmentData.current_role)

      const { data: ratingsData, error: ratingsError } = await supabase
        .from('rating_mappings')
        .select('*')
        .order('order_index')

      if (ratingsError) throw ratingsError
      setRatingOptions(ratingsData || [])
    } catch (error) {
      console.error('Error loading stakeholder assessment:', error)
      alert('Failed to load assessment. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyEmail = () => {
    if (!assignment) return
    if (emailInput.trim().toLowerCase() === assignment.stakeholder_email.toLowerCase()) {
      setVerified(true)
      setVerifyError('')
    } else {
      setVerifyError('This email does not match the stakeholder this assessment was assigned to.')
    }
  }

  const handleRatingSelect = (categoryId: string, ratingLabel: string) => {
    setRatings(prev => ({ ...prev, [categoryId]: ratingLabel }))
  }

  const handleNext = () => {
    if (!ratings[CATEGORIES[currentCategory].id]) {
      alert('Please select a rating before continuing.')
      return
    }
    if (currentCategory < CATEGORIES.length - 1) {
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
    if (!assignment) return
    if (Object.keys(ratings).length < CATEGORIES.length) {
      alert('Please rate all categories before submitting.')
      return
    }

    try {
      setSaving(true)

      const categoryRatingsNumeric: Record<string, number | null> = {}
      Object.entries(ratings).forEach(([categoryId, ratingLabel]) => {
        const option = ratingOptions.find(opt => opt.label === ratingLabel)
        categoryRatingsNumeric[categoryId] = option?.numeric_value ?? null
      })

      const { error } = await supabase
        .from('manager_assessments')
        .insert([{
          associate_assessment_id: assignment.associate_assessment_id,
          assessor_name: assignment.stakeholder_name,
          assessor_email: assignment.stakeholder_email,
          assessor_role: 'stakeholder',
          category_ratings: ratings,
          category_ratings_numeric: categoryRatingsNumeric,
          overall_notes: overallNotes,
          assessment_status: 'completed',
          progress: CATEGORIES.length,
          completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])

      if (error) throw error

      const { error: updateError } = await supabase
        .from('stakeholder_assignments')
        .update({ status: 'completed', completed_at: new Date().toISOString() })
        .eq('id', assignment.id)

      if (updateError) throw updateError

      setSubmitted(true)
    } catch (error) {
      console.error('Error submitting assessment:', error)
      alert('Failed to submit assessment. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading assessment...</p>
        </div>
      </div>
    )
  }

  if (invalidLink || !assignment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">🔗</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Invalid Link</h1>
          <p className="text-gray-600">
            This assessment link is invalid or has been removed. Please contact the manager who sent it.
          </p>
        </div>
      </div>
    )
  }

  if (assignment.status === 'completed' || submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h1>
          <p className="text-gray-600">
            This assessment has already been submitted. Your feedback for {associateName} has been recorded.
          </p>
        </div>
      </div>
    )
  }

  if (!verified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">👥</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Stakeholder Assessment</h1>
            <p className="text-gray-600">
              You've been asked to assess <span className="font-semibold">{associateName}</span> ({associateRole}).
            </p>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            To continue, please enter the email address this assessment was sent to:
          </p>
          <input
            type="email"
            placeholder="Your email address"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleVerifyEmail()}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          {verifyError && (
            <p className="text-sm text-red-600 mb-3">{verifyError}</p>
          )}
          <button
            onClick={handleVerifyEmail}
            className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            Verify &amp; Continue
          </button>
        </div>
      </div>
    )
  }

  const category = CATEGORIES[currentCategory]
  const progress = Math.min((Object.keys(ratings).length / CATEGORIES.length) * 100, 100)

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Assessing: {associateName}
          </h1>
          <p className="text-gray-600">
            {associateRole} • Assessing as stakeholder: {assignment.stakeholder_name}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Progress: {Object.keys(ratings).length}/{CATEGORIES.length} categories
            </span>
            <span className="text-sm font-medium text-indigo-600">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-indigo-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Category Assessment */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-6">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl font-bold text-indigo-600">
                {currentCategory + 1}
              </span>
              <h2 className="text-2xl font-bold text-gray-900">
                {category.name}
              </h2>
            </div>

            {/* Guiding Questions */}
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-6">
              <p className="text-sm font-medium text-indigo-900 mb-2">
                💭 Consider these aspects:
              </p>
              <ul className="space-y-2">
                {category.questions.map((question, idx) => (
                  <li key={idx} className="text-gray-700 flex items-start gap-2">
                    <span className="text-indigo-600 mt-1">•</span>
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
                        ? 'border-indigo-600 bg-indigo-50'
                        : 'border-gray-200 hover:border-indigo-300 bg-white'
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
                        <span className="text-indigo-600 text-xl">✓</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
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
              placeholder="Add any additional observations or comments about this person's overall performance..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
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

          <span />

          {currentCategory < CATEGORIES.length - 1 ? (
            <button
              onClick={handleNext}
              disabled={!ratings[category.id]}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                !ratings[category.id]
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
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
              {saving ? 'Submitting...' : '✅ Submit Assessment'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
