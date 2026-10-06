import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import type { AssessmentSubmission } from '../lib/supabase'
import * as XLSX from 'xlsx'
import { Download } from 'lucide-react'
import { CATEGORIES, getSelfCategoryRatings } from '../data/categories'

interface ManagerAssessment {
  id: string
  associate_assessment_id: string
  assessor_name: string
  assessor_email: string
  assessor_role?: string
  category_ratings: Record<string, string>
  category_ratings_numeric: Record<string, number | null>
  overall_notes: string
  completed_at: string
}

interface CategoryGap {
  id: string
  name: string
  selfRating: number | null
  managerRating: number | null
  gap: number | null
  gapType: 'no_gap' | 'positive' | 'concern' | 'blind_spot' | 'no_data'
  gapLabel: string
  icon: string
  color: string
}

const NO_GAP_THRESHOLD = 0.5

export default function GapAnalysis() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  
  const [assessment, setAssessment] = useState<AssessmentSubmission | null>(null)
  const [managerAssessment, setManagerAssessment] = useState<ManagerAssessment | null>(null)
  const [gaps, setGaps] = useState<CategoryGap[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [id])

  const calculateGapType = (
    selfRating: number | null,
    managerRating: number | null,
    managerLabel: string | undefined
  ): CategoryGap['gapType'] => {
    if (managerLabel === 'unable_to_assess') return 'blind_spot'
    if (selfRating === null || managerRating === null) return 'no_data'

    const gap = selfRating - managerRating

    if (Math.abs(gap) <= NO_GAP_THRESHOLD) return 'no_gap'
    return gap > 0 ? 'concern' : 'positive'
  }

  const getGapLabel = (gapType: CategoryGap['gapType']): { label: string; icon: string; color: string } => {
    switch (gapType) {
      case 'no_gap':
        return { label: 'No Gap', icon: '✅', color: 'text-green-600' }
      case 'positive':
        return { label: 'Positive', icon: '⬆️', color: 'text-blue-600' }
      case 'concern':
        return { label: 'Concern', icon: '⚠️', color: 'text-orange-600' }
      case 'blind_spot':
        return { label: 'Blind Spot', icon: '❓', color: 'text-purple-600' }
      case 'no_data':
        return { label: 'No Self-Rating', icon: '➖', color: 'text-gray-400' }
      default:
        return { label: 'Unknown', icon: '?', color: 'text-gray-400' }
    }
  }

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

      const { data: managerData, error: managerError } = await supabase
        .from('manager_assessments')
        .select('*')
        .eq('associate_assessment_id', id)
        .in('assessor_role', ['manager', 'stakeholder'])
        .eq('assessment_status', 'completed')
        .order('completed_at', { ascending: false })
        .limit(1)
        .single()

      if (managerError) throw managerError
      setManagerAssessment(managerData)

      const selfRatings = getSelfCategoryRatings(assessmentData.skill_ratings, assessmentData.current_role)

      const categoryGaps: CategoryGap[] = CATEGORIES.map(category => {
        const selfRating = selfRatings[category.id]
        const managerRating = managerData.category_ratings_numeric?.[category.id] ?? null
        const gap = selfRating !== null && managerRating !== null ? selfRating - managerRating : null
        const gapType = calculateGapType(selfRating, managerRating, managerData.category_ratings?.[category.id])
        const { label, icon, color } = getGapLabel(gapType)

        return {
          id: category.id,
          name: category.name,
          selfRating,
          managerRating,
          gap,
          gapType,
          gapLabel: label,
          icon,
          color
        }
      })

      setGaps(categoryGaps)
    } catch (error) {
      console.error('Error loading gap analysis:', error)
      alert('Failed to load gap analysis. Please ensure the manager assessment is completed.')
      navigate('/dashboard')
    } finally {
      setLoading(false)
    }
  }

  const getCalibrationScore = (): number => {
    const comparableGaps = gaps.filter(g => g.gap !== null)
    if (comparableGaps.length === 0) return 0

    const noGapCount = comparableGaps.filter(g => g.gapType === 'no_gap').length
    return Math.round((noGapCount / comparableGaps.length) * 100)
  }

  const getSummaryStats = () => {
    return {
      noGap: gaps.filter(g => g.gapType === 'no_gap').length,
      positive: gaps.filter(g => g.gapType === 'positive').length,
      concern: gaps.filter(g => g.gapType === 'concern').length,
      blindSpots: gaps.filter(g => g.gapType === 'blind_spot').length
    }
  }

  const getPriorityActions = () => {
    const actions: { type: string; category: string; action: string; icon: string }[] = []

    gaps.forEach(gap => {
      if (gap.gapType === 'concern') {
        actions.push({
          type: 'CONCERN',
          category: gap.name,
          action: 'Discuss expectations with specific examples and agree on areas for improvement.',
          icon: '⚠️'
        })
      } else if (gap.gapType === 'positive') {
        actions.push({
          type: 'STRENGTH',
          category: gap.name,
          action: 'Build confidence and showcase this skill. Consider mentoring others.',
          icon: '⬆️'
        })
      } else if (gap.gapType === 'blind_spot') {
        actions.push({
          type: 'OBSERVE',
          category: gap.name,
          action: 'Assign projects to observe and assess this skill.',
          icon: '❓'
        })
      }
    })

    return actions.slice(0, 5)
  }

  const exportToExcel = () => {
    if (!assessment || !managerAssessment) return

    const exportData = gaps.map(gap => ({
      Category: gap.name,
      'Self Rating': gap.selfRating?.toFixed(1) || 'N/A',
      'Reviewer Rating': gap.managerRating?.toFixed(1) || 'N/A',
      'Gap': gap.gap?.toFixed(1) || 'N/A',
      'Status': gap.gapLabel
    }))

    const ws = XLSX.utils.json_to_sheet(exportData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Gap Analysis')

    const summaryData = [
      { Metric: 'Associate', Value: assessment.name },
      { Metric: 'Role', Value: assessment.current_role },
      { Metric: managerAssessment.assessor_role === 'stakeholder' ? 'Stakeholder' : 'Manager', Value: managerAssessment.assessor_name },
      { Metric: 'Calibration Score', Value: `${getCalibrationScore()}%` },
      { Metric: '', Value: '' },
      { Metric: 'No Gap', Value: getSummaryStats().noGap },
      { Metric: 'Positive', Value: getSummaryStats().positive },
      { Metric: 'Concern', Value: getSummaryStats().concern },
      { Metric: 'Blind Spots', Value: getSummaryStats().blindSpots }
    ]

    const ws2 = XLSX.utils.json_to_sheet(summaryData)
    XLSX.utils.book_append_sheet(wb, ws2, 'Summary')

    XLSX.writeFile(wb, `Gap_Analysis_${assessment.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading gap analysis...</p>
        </div>
      </div>
    )
  }

  if (!assessment || !managerAssessment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Gap Analysis Not Available</h1>
          <p className="text-gray-600 mb-6">
            Manager assessment must be completed before viewing gap analysis.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  const calibrationScore = getCalibrationScore()
  const summaryStats = getSummaryStats()
  const priorityActions = getPriorityActions()

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-purple-600 hover:text-purple-700 font-medium mb-4 flex items-center gap-2"
          >
            ← Back to Dashboard
          </button>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                📊 Gap Analysis: {assessment.name}
              </h1>
              <p className="text-gray-600">
                {assessment.current_role} • Assessed by {managerAssessment.assessor_name}
                {managerAssessment.assessor_role === 'stakeholder' ? ' (stakeholder)' : ' (manager)'}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Completed: {new Date(managerAssessment.completed_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            <button
              onClick={exportToExcel}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Calibration Score */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">Overall Calibration</p>
              <p className="text-4xl font-bold text-purple-600">{calibrationScore}%</p>
              <p className="text-sm text-gray-500 mt-1">
                {calibrationScore >= 75 ? '✅ Excellent' : calibrationScore >= 50 ? '👍 Good' : '⚠️ Needs Attention'}
              </p>
            </div>
            <div className="text-6xl">🎯</div>
          </div>
        </div>

        {/* Gap Comparison Table */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Category Comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Category</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Self Rating</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Reviewer Rating</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Gap</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {gaps.map((gap, index) => (
                  <tr key={gap.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="py-3 px-4 font-medium text-gray-900">{gap.name}</td>
                    <td className="text-center py-3 px-4">
                      {gap.selfRating !== null ? (
                        <span className="font-semibold text-blue-600">{gap.selfRating.toFixed(1)}</span>
                      ) : (
                        <span className="text-gray-400">N/A</span>
                      )}
                    </td>
                    <td className="text-center py-3 px-4">
                      {gap.managerRating !== null ? (
                        <span className="font-semibold text-purple-600">{gap.managerRating.toFixed(1)}</span>
                      ) : (
                        <span className="text-gray-400">N/A</span>
                      )}
                    </td>
                    <td className="text-center py-3 px-4">
                      {gap.gap !== null ? (
                        <span className={`font-semibold ${
                          gap.gap > 0.5 ? 'text-orange-600' : gap.gap < -0.5 ? 'text-blue-600' : 'text-green-600'
                        }`}>
                          {gap.gap > 0 ? '+' : ''}{gap.gap.toFixed(1)}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`flex items-center gap-2 ${gap.color}`}>
                        <span className="text-lg">{gap.icon}</span>
                        <span className="font-medium">{gap.gapLabel}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">No Gap</p>
                <p className="text-3xl font-bold text-green-600 mt-1">{summaryStats.noGap}</p>
              </div>
              <div className="text-3xl">✅</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Positive</p>
                <p className="text-3xl font-bold text-blue-600 mt-1">{summaryStats.positive}</p>
              </div>
              <div className="text-3xl">⬆️</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Concern</p>
                <p className="text-3xl font-bold text-orange-600 mt-1">{summaryStats.concern}</p>
              </div>
              <div className="text-3xl">⚠️</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Blind Spots</p>
                <p className="text-3xl font-bold text-purple-600 mt-1">{summaryStats.blindSpots}</p>
              </div>
              <div className="text-3xl">❓</div>
            </div>
          </div>
        </div>

        {/* Priority Actions */}
        {priorityActions.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">🎯 Priority Actions</h2>
            <div className="space-y-4">
              {priorityActions.map((action, index) => (
                <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                  <span className="text-2xl">{action.icon}</span>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 mb-1">
                      {index + 1}. {action.type}: {action.category}
                    </p>
                    <p className="text-gray-600 text-sm">{action.action}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Manager Notes */}
        {managerAssessment.overall_notes && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">📝 Reviewer Notes</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{managerAssessment.overall_notes}</p>
          </div>
        )}
      </div>
    </div>
  )
}
