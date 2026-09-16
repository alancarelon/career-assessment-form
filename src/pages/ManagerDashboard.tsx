import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import type { AssessmentSubmission } from '../lib/supabase'

interface AssessmentWithStatus extends AssessmentSubmission {
  manager_assessment_status?: 'pending' | 'in_progress' | 'completed'
  manager_assessment_id?: string
  manager_completed_at?: string
}

export default function ManagerDashboard() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [assessments, setAssessments] = useState<AssessmentWithStatus[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'completed'>('all')
  const [isAuthorized, setIsAuthorized] = useState(false)

  const MANAGER_TOKEN = 'manager_access_2024'

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

      const assessmentsWithStatus = assessmentsData?.map(assessment => {
        const managerAssessment = managerAssessments?.find(
          ma => ma.associate_assessment_id === assessment.id
        )

        return {
          ...assessment,
          manager_assessment_status: managerAssessment?.assessment_status || 'pending',
          manager_assessment_id: managerAssessment?.id,
          manager_completed_at: managerAssessment?.completed_at
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
            Please use the secure link provided to access the Manager Portal.
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
          <p className="text-gray-600">Loading assessments...</p>
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
            🎯 Manager Assessment Portal
          </h1>
          <p className="text-gray-600">
            Review and assess your team's UX capability self-assessments
          </p>
        </div>

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

        {/* Assessments List */}
        <div className="space-y-4">
          {filteredAssessments.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
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
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {assessment.name}
                      </h3>
                      {assessment.manager_assessment_status === 'completed' && (
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                          ✅ Completed
                        </span>
                      )}
                      {assessment.manager_assessment_status === 'in_progress' && (
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                          🔄 In Progress
                        </span>
                      )}
                      {assessment.manager_assessment_status === 'pending' && (
                        <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                          ⏳ Pending
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 mb-1">
                      <span className="font-medium">{assessment.current_role}</span>
                    </p>
                    <p className="text-sm text-gray-500">
                      {assessment.email}
                      {assessment.agid && ` • AGID: ${assessment.agid}`}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Self-assessment submitted: {new Date(assessment.created_at!).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                    {assessment.manager_completed_at && (
                      <p className="text-sm text-green-600 mt-1">
                        Manager assessment completed: {new Date(assessment.manager_completed_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => navigate(`/admin/user/${assessment.id}`)}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                    >
                      📄 View Self-Assessment
                    </button>
                    
                    {assessment.manager_assessment_status === 'completed' ? (
                      <>
                        <button
                          onClick={() => navigate(`/manager-assess/${assessment.id}`)}
                          className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors font-medium"
                        >
                          ✏️ Edit Assessment
                        </button>
                        <button
                          onClick={() => navigate(`/gap-analysis/${assessment.id}`)}
                          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                        >
                          📊 View Gap Analysis
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => navigate(`/manager-assess/${assessment.id}`)}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                      >
                        {assessment.manager_assessment_status === 'in_progress' ? '▶️ Continue Assessment' : '🚀 Start Assessment'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
