import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import type { AssessmentSubmission } from '../lib/supabase'
import { Download, RefreshCw, BarChart3, Eye } from 'lucide-react'
import * as XLSX from 'xlsx'
import { PieChart as RechartsPie, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface AssessmentWithStatus extends AssessmentSubmission {
  manager_assessment_status?: 'pending' | 'in_progress' | 'completed'
  manager_assessment_id?: string
  manager_completed_at?: string
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

  const getSkillDistribution = () => {
    const skillAverages: Record<string, number[]> = {}
    
    assessments.forEach(assessment => {
      if (assessment.skill_ratings) {
        Object.entries(assessment.skill_ratings).forEach(([skill, data]: [string, any]) => {
          const rating = typeof data === 'object' ? data.rating : Number(data)
          if (!skillAverages[skill]) skillAverages[skill] = []
          skillAverages[skill].push(rating)
        })
      }
    })

    return Object.entries(skillAverages)
      .map(([skill, ratings]) => ({
        skill: skill.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        average: ratings.reduce((a, b) => a + b, 0) / ratings.length
      }))
      .sort((a, b) => b.average - a.average)
      .slice(0, 10)
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
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate" title={assessment.name}>
                        {assessment.name}
                      </h3>
                      
                      <div className="mb-2">
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
                          <button
                            onClick={() => navigate(`/manager-assess/${assessment.id}`)}
                            className="w-full px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors font-medium text-sm"
                          >
                            ✏️ Edit
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => navigate(`/manager-assess/${assessment.id}`)}
                          className="w-full px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium text-sm"
                        >
                          {assessment.manager_assessment_status === 'in_progress' ? '▶️ Continue' : '🚀 Start Assessment'}
                        </button>
                      )}
                      <button
                        onClick={() => navigate(`/user-report/${assessment.id}`)}
                        className="w-full px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm"
                      >
                        📄 View Self-Assessment
                      </button>
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

                {/* Top Skills */}
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Top 10 Skills (Avg Rating)</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={getSkillDistribution()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="skill" angle={-45} textAnchor="end" height={100} fontSize={10} />
                      <YAxis domain={[0, 5]} />
                      <Tooltip />
                      <Bar dataKey="average" fill="#8b5cf6" />
                    </BarChart>
                  </ResponsiveContainer>
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
