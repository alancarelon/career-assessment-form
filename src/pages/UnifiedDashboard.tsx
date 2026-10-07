import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase, supabaseManager } from '../lib/supabase'
import type { AssessmentSubmission } from '../lib/supabase'
import { Download, BarChart3, Eye } from 'lucide-react'
import * as XLSX from 'xlsx'
import { PieChart as RechartsPie, Pie, Cell, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from 'recharts'
import { CATEGORIES, getSelfCategoryRatings, getExpectedCategoryRatings } from '../data/categories'

interface StakeholderAssignment {
  id: string
  associate_assessment_id: string
  stakeholder_name: string
  stakeholder_email: string
  token: string
  status: 'pending' | 'completed'
  completed_at?: string
}

interface AssessmentWithStatus extends AssessmentSubmission {
  manager_assessment_status?: 'pending' | 'in_progress' | 'completed'
  manager_assessment_id?: string
  manager_completed_at?: string
  reviewer_assessment_id?: string
  reviewer_role?: 'manager' | 'stakeholder'
  reviewer_name?: string
  reviewer_ratings_numeric?: Record<string, number | null>
  stakeholder_assignment?: StakeholderAssignment | null
}

export default function UnifiedDashboard() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [activeTab, setActiveTab] = useState<'assessments' | 'reports'>(
    (searchParams.get('tab') as 'assessments' | 'reports') || 'assessments'
  )
  const [assessments, setAssessments] = useState<AssessmentWithStatus[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'completed'>('all')
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [assigningFor, setAssigningFor] = useState<string | null>(null)
  const [stakeholderName, setStakeholderName] = useState('')
  const [stakeholderEmail, setStakeholderEmail] = useState('')
  const [assignSaving, setAssignSaving] = useState(false)

  const MANAGER_TOKEN = 'manager_access_2024'

  useEffect(() => {
    document.title = 'Manager Portal | UX Growth Journey'
  }, [])

  useEffect(() => {
    const token = searchParams.get('token')
    if (token === MANAGER_TOKEN) {
      setIsAuthorized(true)
      localStorage.setItem('manager_token', token)
    } else {
      const savedToken = localStorage.getItem('manager_token')
      if (savedToken === MANAGER_TOKEN) {
        setIsAuthorized(true)
      }
    }
  }, [searchParams])

  useEffect(() => {
    if (isAuthorized) {
      loadAssessments()
    }
  }, [isAuthorized])

  useEffect(() => {
    setSearchParams({ tab: activeTab })
  }, [activeTab])

  const loadAssessments = async () => {
    try {
      setLoading(true)

      const { data: assessmentsData, error: assessmentsError } = await supabase
        .from('assessments')
        .select('*')
        .order('created_at', { ascending: false })

      if (assessmentsError) throw assessmentsError

      const { data: managerAssessments, error: managerError } = await supabase
        .from('manager_assessments')
        .select('*')

      if (managerError) throw managerError

      // Stakeholder assignments (table added in Phase 2 - tolerate it not existing yet)
      const { data: stakeholderAssignments, error: saError } = await supabase
        .from('stakeholder_assignments')
        .select('*')

      if (saError) console.warn('stakeholder_assignments not available:', saError.message)

      const assessmentsWithStatus = assessmentsData?.map(assessment => {
        const managerAssessment = managerAssessments?.find(
          ma => ma.associate_assessment_id === assessment.id && (ma.assessor_role ?? 'manager') === 'manager'
        )
        const stakeholderAssessment = managerAssessments?.find(
          ma => ma.associate_assessment_id === assessment.id && ma.assessor_role === 'stakeholder'
        )
        const assignment = stakeholderAssignments?.find(
          sa => sa.associate_assessment_id === assessment.id
        ) || null

        const reviewer = stakeholderAssessment?.assessment_status === 'completed'
          ? stakeholderAssessment
          : managerAssessment
        const status = reviewer?.assessment_status === 'completed'
          ? 'completed'
          : reviewer?.assessment_status === 'in_progress'
            ? 'in_progress'
            : 'pending'

        return {
          ...assessment,
          manager_assessment_status: status,
          manager_assessment_id: managerAssessment?.id,
          manager_completed_at: reviewer?.completed_at,
          reviewer_assessment_id: stakeholderAssessment?.id ?? managerAssessment?.id,
          reviewer_role: reviewer?.assessor_role === 'stakeholder' ? 'stakeholder' : 'manager',
          reviewer_name: reviewer?.assessor_name,
          reviewer_ratings_numeric: reviewer?.assessment_status === 'completed' ? reviewer?.category_ratings_numeric : undefined,
          stakeholder_assignment: assignment
        }
      }) || []

      setAssessments(assessmentsWithStatus)
    } catch (error) {
      console.error('Error loading assessments:', error)
      alert('Failed to load assessments. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const filteredAssessments = assessments.filter(assessment => {
    const matchesSearch = assessment.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         assessment.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         assessment.current_role.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesFilter = filterStatus === 'all' ||
                         (filterStatus === 'completed' && assessment.manager_assessment_status === 'completed') ||
                         (filterStatus === 'pending' && assessment.manager_assessment_status !== 'completed')
    
    return matchesSearch && matchesFilter
  })

  const stats = {
    total: assessments.length,
    completed: assessments.filter(a => a.manager_assessment_status === 'completed').length,
    pending: assessments.filter(a => a.manager_assessment_status !== 'completed').length
  }

  const resetManagerAssessment = async (assessment: AssessmentWithStatus) => {
    if (!assessment.reviewer_assessment_id) return
    if (!window.confirm(`Reset the ${assessment.reviewer_role} assessment for ${assessment.name}? Their self-assessment will not be affected.`)) return

    const { error } = await supabaseManager
      .from('manager_assessments')
      .delete()
      .eq('id', assessment.reviewer_assessment_id)

    if (error) {
      console.error('Error resetting manager assessment:', error)
      alert('Failed to reset assessment. Please try again.')
      return
    }

    loadAssessments()
  }

  const assignStakeholder = async (assessment: AssessmentWithStatus) => {
    if (!stakeholderName.trim() || !stakeholderEmail.trim()) {
      alert('Please enter the stakeholder\'s name and email.')
      return
    }

    try {
      setAssignSaving(true)
      const { error } = await supabaseManager
        .from('stakeholder_assignments')
        .insert([{
          associate_assessment_id: assessment.id,
          stakeholder_name: stakeholderName.trim(),
          stakeholder_email: stakeholderEmail.trim().toLowerCase()
        }])

      if (error) throw error

      setAssigningFor(null)
      setStakeholderName('')
      setStakeholderEmail('')
      loadAssessments()
    } catch (error) {
      console.error('Error assigning stakeholder:', error)
      alert('Failed to assign stakeholder. Please try again.')
    } finally {
      setAssignSaving(false)
    }
  }

  const cancelStakeholderAssignment = async (assignment: StakeholderAssignment) => {
    if (!window.confirm(`Remove the stakeholder assignment for ${assignment.stakeholder_name}?`)) return

    const { error } = await supabaseManager
      .from('stakeholder_assignments')
      .delete()
      .eq('id', assignment.id)

    if (error) {
      console.error('Error removing assignment:', error)
      alert('Failed to remove assignment. Please try again.')
      return
    }

    loadAssessments()
  }

  const stakeholderLink = (token: string) =>
    `${window.location.origin}/stakeholder-assess/${token}`

  const copyStakeholderLink = async (token: string) => {
    try {
      await navigator.clipboard.writeText(stakeholderLink(token))
      alert('Link copied to clipboard!')
    } catch {
      window.prompt('Copy this link:', stakeholderLink(token))
    }
  }

  const assignStakeholderBlock = (assessment: AssessmentWithStatus) => {
    if (assigningFor !== assessment.id) {
      return (
        <button
          onClick={() => { setAssigningFor(assessment.id!); setStakeholderName(''); setStakeholderEmail('') }}
          className="w-full px-3 py-2 bg-white text-indigo-700 border border-indigo-300 rounded-lg hover:bg-indigo-50 transition-colors font-medium text-sm"
        >
          👥 Assign Stakeholder
        </button>
      )
    }

    return (
      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 space-y-2">
        <p className="text-xs font-medium text-indigo-900">
          Delegate this assessment to a stakeholder:
        </p>
        <input
          type="text"
          placeholder="Stakeholder name"
          value={stakeholderName}
          onChange={(e) => setStakeholderName(e.target.value)}
          className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
        <input
          type="email"
          placeholder="Stakeholder email"
          value={stakeholderEmail}
          onChange={(e) => setStakeholderEmail(e.target.value)}
          className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
        <div className="flex gap-2">
          <button
            onClick={() => assignStakeholder(assessment)}
            disabled={assignSaving}
            className="flex-1 px-2 py-1.5 bg-indigo-600 text-white rounded text-xs font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {assignSaving ? 'Creating...' : '🔗 Generate Link'}
          </button>
          <button
            onClick={() => setAssigningFor(null)}
            className="px-2 py-1.5 bg-white text-gray-600 border border-gray-300 rounded text-xs font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    )
  }

  const calculateAvgRating = (skillRatings: any) => {
    if (!skillRatings || Object.keys(skillRatings).length === 0) return 0
    const ratings = Object.values(skillRatings)
    const sum = ratings.reduce((acc: number, val: any) => {
      const rating = typeof val === 'object' ? val.rating : Number(val)
      return acc + rating
    }, 0)
    return sum / ratings.length
  }

  const exportToExcel = () => {
    const exportData = assessments.map(assessment => ({
      Name: assessment.name,
      Email: assessment.email,
      AGID: assessment.agid || '',
      Role: assessment.current_role,
      'Submission Date': new Date(assessment.created_at!).toLocaleDateString(),
      'Average Rating': calculateAvgRating(assessment.skill_ratings).toFixed(2),
      'Manager Status': assessment.manager_assessment_status || 'pending'
    }))

    const ws = XLSX.utils.json_to_sheet(exportData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Assessments')
    XLSX.writeFile(wb, `UX_Assessments_${new Date().toISOString().split('T')[0]}.xlsx`)
  }

  const getRoleDistribution = () => {
    const roleCounts: Record<string, number> = {}
    assessments.forEach(a => {
      roleCounts[a.current_role] = (roleCounts[a.current_role] || 0) + 1
    })
    return Object.entries(roleCounts).map(([name, value]) => ({ name, value }))
  }

  const getCategoryDistribution = () => {
    const perCategory: Record<string, number[]> = Object.fromEntries(CATEGORIES.map(c => [c.id, []]))

    assessments.forEach(assessment => {
      const selfRatings = getSelfCategoryRatings(assessment.skill_ratings, assessment.current_role)
      CATEGORIES.forEach(c => {
        const rating = selfRatings[c.id]
        if (rating !== null) perCategory[c.id].push(rating)
      })
    })

    return CATEGORIES
      .filter(c => perCategory[c.id].length > 0)
      .map(c => ({
        category: c.name,
        average: perCategory[c.id].reduce((a, b) => a + b, 0) / perCategory[c.id].length,
        associateCount: perCategory[c.id].length
      }))
      .sort((a, b) => b.average - a.average)
  }

  const getTeamCategoryData = () => {
    const avg = (vals: number[]) => vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null
    return CATEGORIES.map(c => {
      const selfVals: number[] = []
      const reviewerVals: number[] = []
      const expectedVals: number[] = []
      assessments.forEach(a => {
        const self = getSelfCategoryRatings(a.skill_ratings, a.current_role)[c.id]
        if (self !== null) selfVals.push(self)
        const expected = getExpectedCategoryRatings(a.current_role)[c.id]
        if (expected !== null) expectedVals.push(expected)
        const reviewer = a.reviewer_ratings_numeric?.[c.id]
        if (reviewer !== null && reviewer !== undefined) reviewerVals.push(reviewer)
      })
      return {
        id: c.id,
        category: c.name,
        self: avg(selfVals),
        reviewer: avg(reviewerVals),
        expected: avg(expectedVals),
        reviewerCount: reviewerVals.length
      }
    })
  }

  const getCollectiveGaps = () => {
    return getTeamCategoryData()
      .filter(d => d.expected !== null)
      .map(d => ({
        category: d.category,
        expected: d.expected!,
        actual: d.reviewer ?? d.self,
        gap: d.expected! - (d.reviewer ?? d.self ?? 0),
        basedOnReviewer: d.reviewer !== null
      }))
      .sort((a, b) => b.gap - a.gap)
  }

  const getCapabilityHeatmap = () => {
    return CATEGORIES.map(c => {
      const buckets = { strong: [] as string[], solid: [] as string[], developing: [] as string[] }
      assessments.forEach(a => {
        const rating = a.reviewer_ratings_numeric?.[c.id]
          ?? getSelfCategoryRatings(a.skill_ratings, a.current_role)[c.id]
        if (rating === null || rating === undefined) return
        if (rating >= 4) buckets.strong.push(a.name)
        else if (rating >= 3) buckets.solid.push(a.name)
        else buckets.developing.push(a.name)
      })
      return { id: c.id, category: c.name, ...buckets }
    })
  }

  const getAlignmentLeaderboard = () => {
    return assessments
      .filter(a => a.reviewer_ratings_numeric)
      .map(a => {
        const selfRatings = getSelfCategoryRatings(a.skill_ratings, a.current_role)
        let matched = 0
        let total = 0
        CATEGORIES.forEach(c => {
          const self = selfRatings[c.id]
          const rev = a.reviewer_ratings_numeric?.[c.id]
          if (self !== null && rev !== null && rev !== undefined) {
            total++
            if (Math.abs(self - rev) <= 0.5) matched++
          }
        })
        return {
          name: a.name,
          role: a.current_role,
          reviewer: a.reviewer_name,
          pct: total === 0 ? 0 : Math.round((matched / total) * 100),
          matched,
          total
        }
      })
      .sort((a, b) => a.pct - b.pct)
  }

  const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#14b8a6', '#f97316']

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Restricted</h1>
          <p className="text-gray-600 mb-6">
            This page is only accessible to authorized managers.
          </p>
          <p className="text-sm text-gray-500">
            Please use the secure link provided to access the Dashboard.
          </p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🎯 UX Growth Journey Dashboard
          </h1>
          <p className="text-gray-600">
            Manage assessments and view team analytics
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('assessments')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'assessments'
                    ? 'border-purple-600 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                📊 Assessments
              </button>
              <button
                onClick={() => setActiveTab('reports')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'reports'
                    ? 'border-purple-600 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                📈 Reports & Analytics
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'assessments' ? (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Total Assessments</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
                  </div>
                  <div className="text-4xl">📊</div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Completed</p>
                    <p className="text-3xl font-bold text-green-600 mt-1">{stats.completed}</p>
                  </div>
                  <div className="text-4xl">✅</div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Pending</p>
                    <p className="text-3xl font-bold text-orange-600 mt-1">{stats.pending}</p>
                  </div>
                  <div className="text-4xl">⏳</div>
                </div>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search by name, email, or role..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setFilterStatus('all')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      filterStatus === 'all'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setFilterStatus('pending')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      filterStatus === 'pending'
                        ? 'bg-orange-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Pending
                  </button>
                  <button
                    onClick={() => setFilterStatus('completed')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      filterStatus === 'completed'
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Completed
                  </button>
                </div>
              </div>
            </div>

            {/* Assessments Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAssessments.length === 0 ? (
                <div className="col-span-full bg-white rounded-xl shadow-md p-12 text-center">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No assessments found</h3>
                  <p className="text-gray-600">
                    {searchQuery || filterStatus !== 'all'
                      ? 'Try adjusting your search or filter'
                      : 'No assessments have been submitted yet'}
                  </p>
                </div>
              ) : (
                filteredAssessments.map((assessment) => (
                  <div
                    key={assessment.id}
                    className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-5 flex flex-col"
                  >
                    <div className="mb-3">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 truncate" title={assessment.name}>
                          {assessment.name}
                        </h3>

                        <div className="flex flex-col items-end shrink-0">
                          {assessment.manager_assessment_status === 'completed' && (
                            <span className="inline-block px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                              ✅ Completed
                            </span>
                          )}
                          {assessment.manager_assessment_status === 'in_progress' && (
                            <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                              🔄 In Progress
                            </span>
                          )}
                          {assessment.manager_assessment_status === 'pending' && (
                            <span className="inline-block px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                              ⏳ Pending
                            </span>
                          )}
                          {assessment.manager_assessment_status === 'completed' && assessment.reviewer_name && (
                            <p className="text-xs font-medium text-gray-600 mt-1 text-right">
                              👤 {assessment.reviewer_name}
                              <span className="text-gray-400 font-normal"> ({assessment.reviewer_role === 'stakeholder' ? 'Stakeholder' : 'Manager'})</span>
                            </p>
                          )}
                        </div>
                      </div>


                      <p className="text-sm text-gray-600 font-medium mb-1 truncate" title={assessment.current_role}>
                        {assessment.current_role}
                      </p>

                      <p className="text-xs text-gray-500 truncate" title={assessment.email}>
                        {assessment.email}
                      </p>

                      <p className="text-xs text-gray-400 mt-2">
                        Submitted: {new Date(assessment.created_at!).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                    </div>

                    <div className="mt-auto space-y-2">
                      {assessment.manager_assessment_status === 'completed' ? (
                        <>
                          <button
                            onClick={() => navigate(`/gap-analysis/${assessment.id}`)}
                            className="w-full px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium text-sm"
                          >
                            📊 View Gap Analysis
                          </button>
                          {assessment.reviewer_role === 'manager' && (
                            <button
                              onClick={() => navigate(`/manager-assess/${assessment.id}`)}
                              className="w-full px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors font-medium text-sm"
                            >
                              ✏️ Edit
                            </button>
                          )}
                        </>
                      ) : assessment.stakeholder_assignment ? (
                        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3">
                          <p className="text-xs font-medium text-indigo-900 mb-1">
                            👥 Stakeholder: {assessment.stakeholder_assignment.stakeholder_name}
                          </p>
                          <p className="text-xs text-indigo-700 mb-2">
                            ⏳ Awaiting response • {assessment.stakeholder_assignment.stakeholder_email}
                          </p>
                          <div className="flex gap-2">
                            <button
                              onClick={() => copyStakeholderLink(assessment.stakeholder_assignment!.token)}
                              className="flex-1 px-2 py-1.5 bg-indigo-600 text-white rounded text-xs font-medium hover:bg-indigo-700 transition-colors"
                            >
                              📋 Copy Link
                            </button>
                            <button
                              onClick={() => cancelStakeholderAssignment(assessment.stakeholder_assignment!)}
                              className="px-2 py-1.5 bg-white text-red-600 border border-red-200 rounded text-xs font-medium hover:bg-red-50 transition-colors"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <button
                            onClick={() => navigate(`/manager-assess/${assessment.id}`)}
                            className="w-full px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium text-sm"
                          >
                            {assessment.manager_assessment_status === 'in_progress' ? '▶️ Continue' : '🚀 Assess Myself'}
                          </button>
                          {assignStakeholderBlock(assessment)}
                        </>
                      )}
                      <button
                        onClick={() => navigate(`/user-report/${assessment.id}`)}
                        className="w-full px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm"
                      >
                        📄 View Self-Assessment
                      </button>
                      {assessment.name.includes('(Test)') && assessment.reviewer_assessment_id && (
                        <button
                          onClick={() => resetManagerAssessment(assessment)}
                          className="w-full px-3 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition-colors font-medium text-sm"
                        >
                          ♻️ Reset Assessment
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        ) : (
          <>
            {/* Reports Tab */}
            <div className="space-y-6">
              {/* Export Button */}
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Team Analytics</h2>
                <button
                  onClick={exportToExcel}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  <Download className="w-4 h-4" />
                  Export to Excel
                </button>
              </div>

              {/* Overall Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow-md p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium">Total Submissions</p>
                      <p className="text-3xl font-bold text-purple-600 mt-1">{assessments.length}</p>
                    </div>
                    <BarChart3 className="w-8 h-8 text-purple-600" />
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium">Avg Rating</p>
                      <p className="text-3xl font-bold text-blue-600 mt-1">
                        {(assessments.reduce((acc, a) => acc + calculateAvgRating(a.skill_ratings), 0) / assessments.length || 0).toFixed(1)}
                      </p>
                    </div>
                    <div className="text-3xl">⭐</div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium">Unique Roles</p>
                      <p className="text-3xl font-bold text-green-600 mt-1">
                        {new Set(assessments.map(a => a.current_role)).size}
                      </p>
                    </div>
                    <div className="text-3xl">👥</div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium">Completion Rate</p>
                      <p className="text-3xl font-bold text-orange-600 mt-1">
                        {Math.round((stats.completed / stats.total) * 100) || 0}%
                      </p>
                    </div>
                    <div className="text-3xl">📈</div>
                  </div>
                </div>
              </div>

              {/* Team Radar: Self vs Reviewer vs Expected */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">🕸️ Team Capability — Self vs Reviewer vs Expected</h3>
                <p className="text-xs text-gray-500 mb-4">
                  Average ratings per category. "Expected" is the target proficiency for each person's role.
                </p>
                <ResponsiveContainer width="100%" height={360}>
                  <RadarChart data={getTeamCategoryData().map(d => ({
                    category: d.category,
                    'Self (team avg)': d.self !== null ? Number(d.self.toFixed(2)) : 0,
                    'Reviewer (team avg)': d.reviewer !== null ? Number(d.reviewer.toFixed(2)) : null,
                    'Expected level': d.expected !== null ? Number(d.expected.toFixed(2)) : null
                  }))}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="category" tick={{ fontSize: 10 }} />
                    <PolarRadiusAxis domain={[0, 5]} tick={{ fontSize: 10 }} />
                    <Radar name="Self (team avg)" dataKey="Self (team avg)" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                    <Radar name="Reviewer (team avg)" dataKey="Reviewer (team avg)" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
                    <Radar name="Expected level" dataKey="Expected level" stroke="#10b981" fill="none" strokeDasharray="4 4" />
                    <Legend />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
                <p className="text-xs text-gray-400 mt-2">
                  Reviewer line only includes completed reviews ({assessments.filter(a => a.reviewer_ratings_numeric).length} of {assessments.length} reviewed).
                </p>
              </div>

              {/* Collective Gaps + Capability Heatmap */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">🎯 Where the Team Can Improve</h3>
                  <p className="text-xs text-gray-500 mb-4">
                    Categories ranked by how far the team is below the expected level for their role.
                  </p>
                  <div className="space-y-3">
                    {getCollectiveGaps().map((g, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <span className="text-sm font-bold text-gray-400 w-6">#{i + 1}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800 truncate" title={g.category}>{g.category}</p>
                          <p className="text-[10px] text-gray-500">
                            Expected {g.expected.toFixed(1)} • Actual {g.actual !== null ? g.actual.toFixed(1) : 'N/A'}{g.basedOnReviewer ? ' (reviewer)' : ' (self)'}
                          </p>
                        </div>
                        <span className={`text-sm font-bold px-2 py-1 rounded ${
                          g.gap > 1 ? 'bg-red-100 text-red-700' : g.gap > 0.5 ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'
                        }`}>
                          {g.gap > 0 ? `${g.gap.toFixed(1)} below` : 'On par'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">🧩 Team Skill Coverage</h3>
                  <p className="text-xs text-gray-500 mb-4">
                    Team members per strength level. Reviewer ratings used where available, else self-ratings.
                  </p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200 text-left">
                          <th className="py-2 pr-2 font-medium text-gray-600">Category</th>
                          <th className="py-2 px-2 font-medium text-green-700 text-center">Strong (4+)</th>
                          <th className="py-2 px-2 font-medium text-blue-700 text-center">Solid (3+)</th>
                          <th className="py-2 px-2 font-medium text-orange-700 text-center">Developing</th>
                        </tr>
                      </thead>
                      <tbody>
                        {getCapabilityHeatmap().map((row, i) => (
                          <tr key={i} className="border-b border-gray-100">
                            <td className="py-2 pr-2 text-gray-800 text-xs">{row.category}</td>
                            <td className="py-2 px-2 text-center">
                              <span
                                className={`inline-block min-w-6 px-1.5 py-0.5 rounded text-xs font-semibold ${row.strong.length === 0 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}
                                title={row.strong.join(', ') || 'No one rated 4+'}
                              >
                                {row.strong.length === 0 ? '0 ⚠️' : row.strong.length}
                              </span>
                            </td>
                            <td className="py-2 px-2 text-center">
                              <span className="inline-block min-w-6 px-1.5 py-0.5 rounded text-xs font-semibold bg-blue-100 text-blue-700" title={row.solid.join(', ') || 'None'}>
                                {row.solid.length}
                              </span>
                            </td>
                            <td className="py-2 px-2 text-center">
                              <span className="inline-block min-w-6 px-1.5 py-0.5 rounded text-xs font-semibold bg-orange-100 text-orange-700" title={row.developing.join(', ') || 'None'}>
                                {row.developing.length}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Alignment Leaderboard */}
              {getAlignmentLeaderboard().length > 0 && (
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">📋 Rating Match by Associate</h3>
                  <p className="text-xs text-gray-500 mb-4">
                    % of categories where self and reviewer ratings agree (within ±0.5). Lowest first — these may benefit most from a calibration conversation.
                  </p>
                  <div className="space-y-2">
                    {getAlignmentLeaderboard().map((row, i) => (
                      <div key={i} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900 text-sm truncate">{row.name}</p>
                          <p className="text-xs text-gray-500">{row.role} • Reviewed by {row.reviewer}</p>
                        </div>
                        <span className={`text-sm font-bold px-3 py-1 rounded-full ${
                          row.pct >= 75 ? 'bg-green-100 text-green-700' : row.pct >= 50 ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
                        }`}>
                          {row.pct}% ({row.matched}/{row.total})
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Role Distribution */}
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Role Distribution</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsPie>
                      <Pie
                        data={getRoleDistribution()}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {getRoleDistribution().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPie>
                  </ResponsiveContainer>
                </div>

                {/* Skill Categories - New Design */}
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Skill Categories - Team Performance</h3>
                  <div className="space-y-3 max-h-[300px] overflow-y-auto">
                    {getCategoryDistribution().map((cat, index) => {
                      const percentage = (cat.average / 5) * 100
                      const color = cat.average >= 4 ? 'bg-green-500' : cat.average >= 3 ? 'bg-blue-500' : 'bg-orange-500'
                      const bgColor = cat.average >= 4 ? 'bg-green-50' : cat.average >= 3 ? 'bg-blue-50' : 'bg-orange-50'
                      
                      return (
                        <div key={index} className={`p-3 rounded-lg border ${bgColor} border-gray-200`}>
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <span className="text-sm font-bold text-gray-400">#{index + 1}</span>
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-800 text-xs" title={cat.category}>
                                  {cat.category}
                                </h4>
                                <p className="text-[10px] text-gray-500">{cat.associateCount} team members</p>
                              </div>
                            </div>
                            <div className="text-right ml-2">
                              <div className="text-lg font-bold text-gray-800">{cat.average.toFixed(1)}</div>
                              <div className="text-[10px] text-gray-500">/ 5.0</div>
                            </div>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                            <div 
                              className={`h-full ${color} transition-all duration-500 rounded-full`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Individual Reports List */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Individual Reports</h3>
                <div className="space-y-2">
                  {assessments.map((assessment) => (
                    <div
                      key={assessment.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div>
                        <p className="font-medium text-gray-900">{assessment.name}</p>
                        <p className="text-sm text-gray-600">{assessment.current_role}</p>
                      </div>
                      <button
                        onClick={() => navigate(`/user-report/${assessment.id}`)}
                        className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium text-sm"
                      >
                        <Eye className="w-4 h-4" />
                        View Report
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
