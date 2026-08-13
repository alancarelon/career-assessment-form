import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Download, RefreshCw, Calendar, Mail, User, TrendingUp, Target, Award, BarChart3, PieChart, Eye, Filter, X } from 'lucide-react'
import { supabase, AssessmentSubmission } from '../lib/supabase'
import * as XLSX from 'xlsx'
import { PieChart as RechartsPie, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import Card from '../components/Card'
import Button from '../components/Button'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [submissions, setSubmissions] = useState<AssessmentSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    roles: [] as string[],
    performance: 'all' as 'all' | 'high' | 'ontrack' | 'needs',
    dateRange: 'all' as 'all' | 'week' | 'month' | 'quarter'
  })

  const fetchSubmissions = async () => {
    setLoading(true)
    setError(null)
    try {
      const { data, error: fetchError } = await supabase
        .from('assessments')
        .select('*')
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError
      setSubmissions(data || [])
    } catch (err) {
      console.error('Error fetching submissions:', err)
      setError('Failed to load submissions')
    } finally {
      setLoading(false)
    }
  }

  // Calculate average rating for a submission
  const calculateAvgRating = (skillRatings: any) => {
    if (!skillRatings || Object.keys(skillRatings).length === 0) return 0
    const ratings = Object.values(skillRatings)
    const sum = ratings.reduce((acc: number, val: any) => {
      const rating = typeof val === 'object' ? val.rating : Number(val)
      return acc + rating
    }, 0)
    return sum / ratings.length
  }

  // Filter submissions based on active filters
  const filteredSubmissions = submissions.filter(sub => {
    // Role filter
    if (filters.roles.length > 0 && !filters.roles.includes(sub.current_role)) {
      return false
    }

    // Performance filter
    if (filters.performance !== 'all') {
      const avg = calculateAvgRating(sub.skill_ratings)
      if (filters.performance === 'high' && avg < 4.0) return false
      if (filters.performance === 'ontrack' && (avg < 3.0 || avg >= 4.0)) return false
      if (filters.performance === 'needs' && avg >= 3.0) return false
    }

    // Date range filter
    if (filters.dateRange !== 'all' && sub.created_at) {
      const submissionDate = new Date(sub.created_at)
      const now = new Date()
      const daysDiff = Math.floor((now.getTime() - submissionDate.getTime()) / (1000 * 60 * 60 * 24))
      
      if (filters.dateRange === 'week' && daysDiff > 7) return false
      if (filters.dateRange === 'month' && daysDiff > 30) return false
      if (filters.dateRange === 'quarter' && daysDiff > 90) return false
    }

    return true
  })

  // Get unique roles from submissions
  const availableRoles = Array.from(new Set(submissions.map(s => s.current_role))).sort()

  // Count active filters
  const activeFilterCount = 
    filters.roles.length + 
    (filters.performance !== 'all' ? 1 : 0) + 
    (filters.dateRange !== 'all' ? 1 : 0)

  // Clear all filters
  const clearAllFilters = () => {
    setFilters({
      roles: [],
      performance: 'all',
      dateRange: 'all'
    })
  }

  // Remove individual filter
  const removeRoleFilter = (role: string) => {
    setFilters(prev => ({
      ...prev,
      roles: prev.roles.filter(r => r !== role)
    }))
  }

  useEffect(() => {
    fetchSubmissions()
  }, [])

  const exportAllToExcel = () => {
    if (submissions.length === 0) return

    const data = [
      [
        'Submission Date',
        'Name',
        'Email',
        'AGID',
        'Current Role',
        'Career Growth',
        'Future Vision',
        'Growth Areas',
        'Strengths',
        'Teammates Feedback',
        'Proud Accomplishment',
        'Skills to Improve',
        'Growth Limits',
        'Learning Style',
        'Teaching Topic',
        'Mentor Interest',
        'Six Month Goal',
        'Goal Importance',
        'Skill Ratings (JSON)',
      ],
      ...submissions.map((sub) => [
        new Date(sub.created_at!).toLocaleString(),
        sub.name,
        sub.email,
        sub.agid || '',
        sub.current_role,
        sub.career_growth || '',
        sub.future_vision || '',
        sub.growth_areas?.join(', ') || '',
        sub.strengths?.join(', ') || '',
        sub.teammates_feedback || '',
        sub.proud_accomplishment || '',
        sub.skills_to_improve?.join(', ') || '',
        sub.growth_limits?.join(', ') || '',
        sub.learning_style?.join(', ') || '',
        sub.teaching_topic || '',
        sub.mentor_interest || '',
        sub.six_month_goal || '',
        sub.goal_importance || '',
        JSON.stringify(sub.skill_ratings || {}),
      ]),
    ]

    const ws = XLSX.utils.aoa_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'All Submissions')

    ws['!cols'] = Array(data[0].length).fill({ wch: 25 })

    const fileName = `Career_Assessments_${new Date().toISOString().split('T')[0]}.xlsx`
    XLSX.writeFile(wb, fileName)
  }

  const calculateAverageSkillRating = () => {
    if (submissions.length === 0) return '0.0'
    let totalRating = 0
    let ratingCount = 0
    
    submissions.forEach(sub => {
      const skillRatings = sub.skill_ratings || {}
      Object.values(skillRatings).forEach((skill: any) => {
        if (skill?.rating) {
          totalRating += skill.rating
          ratingCount++
        }
      })
    })
    
    return ratingCount > 0 ? (totalRating / ratingCount).toFixed(1) : '0.0'
  }

  const getMostCommonStrength = () => {
    const strengthCounts: Record<string, number> = {}
    
    submissions.forEach(sub => {
      const strengths = sub.strengths || []
      strengths.forEach((strength: string) => {
        strengthCounts[strength] = (strengthCounts[strength] || 0) + 1
      })
    })
    
    const sorted = Object.entries(strengthCounts).sort((a, b) => b[1] - a[1])
    return sorted.length > 0 ? sorted[0][0] : 'N/A'
  }

  const getMostCommonGrowthArea = () => {
    const areaCounts: Record<string, number> = {}
    
    submissions.forEach(sub => {
      const areas = sub.growth_areas || []
      areas.forEach((area: string) => {
        areaCounts[area] = (areaCounts[area] || 0) + 1
      })
    })
    
    const sorted = Object.entries(areaCounts).sort((a, b) => b[1] - a[1])
    return sorted.length > 0 ? sorted[0][0] : 'N/A'
  }

  // Analytics data for charts
  const getRoleDistribution = () => {
    const roleCounts: Record<string, number> = {}
    submissions.forEach(sub => {
      const role = sub.current_role || 'Unknown'
      roleCounts[role] = (roleCounts[role] || 0) + 1
    })
    return Object.entries(roleCounts).map(([name, value]) => ({ name, value }))
  }

  const getTopGrowthAreas = () => {
    const areaCounts: Record<string, number> = {}
    submissions.forEach(sub => {
      const areas = sub.growth_areas || []
      areas.forEach((area: string) => {
        areaCounts[area] = (areaCounts[area] || 0) + 1
      })
    })
    return Object.entries(areaCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }))
  }

  const getTopStrengths = () => {
    const strengthCounts: Record<string, number> = {}
    submissions.forEach(sub => {
      const strengths = sub.strengths || []
      strengths.forEach((strength: string) => {
        strengthCounts[strength] = (strengthCounts[strength] || 0) + 1
      })
    })
    return Object.entries(strengthCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }))
  }

  const getLearningStyleDistribution = () => {
    const styleCounts: Record<string, number> = {}
    submissions.forEach(sub => {
      const styles = sub.learning_style || []
      styles.forEach((style: string) => {
        styleCounts[style] = (styleCounts[style] || 0) + 1
      })
    })
    return Object.entries(styleCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
  }

  const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899']

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-growth-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading submissions...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold gradient-text mb-2">Admin Dashboard</h1>
            <p className="text-slate-600">View and manage all assessment submissions</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={fetchSubmissions} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button onClick={exportAllToExcel} disabled={submissions.length === 0}>
              <Download className="w-4 h-4 mr-2" />
              Export All
            </Button>
          </div>
        </div>

        {error && (
          <Card className="bg-red-50 border-red-200 mb-6">
            <p className="text-red-800">{error}</p>
          </Card>
        )}

        {/* Filter Bar */}
        <Card className="mb-8">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors rounded-lg"
          >
            <div className="flex items-center gap-3">
              <Filter className="w-5 h-5 text-purple-600" />
              <span className="font-semibold text-slate-800">Filters</span>
              {activeFilterCount > 0 && (
                <span className="bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {activeFilterCount}
                </span>
              )}
            </div>
            <span className="text-slate-400">{showFilters ? '▲' : '▼'}</span>
          </button>

          {showFilters && (
            <div className="p-4 pt-0 space-y-4 border-t border-slate-200 mt-4">
              {/* Role Filter */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Role</label>
                <div className="flex flex-wrap gap-2">
                  {availableRoles.map(role => (
                    <button
                      key={role}
                      onClick={() => {
                        setFilters(prev => ({
                          ...prev,
                          roles: prev.roles.includes(role)
                            ? prev.roles.filter(r => r !== role)
                            : [...prev.roles, role]
                        }))
                      }}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                        filters.roles.includes(role)
                          ? 'bg-purple-600 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>

              {/* Performance Filter */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Performance</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: 'all', label: 'All' },
                    { value: 'high', label: 'High Performers (≥4.0)' },
                    { value: 'ontrack', label: 'On Track (3.0-3.9)' },
                    { value: 'needs', label: 'Needs Support (<3.0)' }
                  ].map(option => (
                    <button
                      key={option.value}
                      onClick={() => setFilters(prev => ({ ...prev, performance: option.value as any }))}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                        filters.performance === option.value
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Date Range Filter */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Date Range</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: 'all', label: 'All Time' },
                    { value: 'week', label: 'Last 7 Days' },
                    { value: 'month', label: 'Last 30 Days' },
                    { value: 'quarter', label: 'Last 90 Days' }
                  ].map(option => (
                    <button
                      key={option.value}
                      onClick={() => setFilters(prev => ({ ...prev, dateRange: option.value as any }))}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                        filters.dateRange === option.value
                          ? 'bg-green-600 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              {activeFilterCount > 0 && (
                <div className="pt-2 border-t border-slate-200">
                  <Button variant="outline" onClick={clearAllFilters} className="text-sm">
                    <X className="w-4 h-4 mr-2" />
                    Clear All Filters
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Active Filter Chips */}
          {activeFilterCount > 0 && (
            <div className="px-4 pb-4 flex flex-wrap gap-2">
              {filters.roles.map(role => (
                <span key={role} className="inline-flex items-center gap-1 bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                  Role: {role}
                  <button onClick={() => removeRoleFilter(role)} className="hover:bg-purple-200 rounded-full p-0.5">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              {filters.performance !== 'all' && (
                <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  Performance: {filters.performance === 'high' ? 'High' : filters.performance === 'ontrack' ? 'On Track' : 'Needs Support'}
                  <button onClick={() => setFilters(prev => ({ ...prev, performance: 'all' }))} className="hover:bg-blue-200 rounded-full p-0.5">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {filters.dateRange !== 'all' && (
                <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  Date: {filters.dateRange === 'week' ? 'Last 7 Days' : filters.dateRange === 'month' ? 'Last 30 Days' : 'Last 90 Days'}
                  <button onClick={() => setFilters(prev => ({ ...prev, dateRange: 'all' }))} className="hover:bg-green-200 rounded-full p-0.5">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
          )}

          {/* Results Count */}
          <div className="px-4 pb-4 text-sm text-slate-600">
            Showing <span className="font-semibold text-slate-900">{filteredSubmissions.length}</span> of <span className="font-semibold text-slate-900">{submissions.length}</span> submissions
          </div>
        </Card>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <div className="flex items-center gap-2 mb-2">
              <User className="w-4 h-4 text-growth-600" />
              <h3 className="text-sm font-semibold text-slate-600">Total Submissions</h3>
            </div>
            <p className="text-3xl font-bold text-slate-800">{submissions.length}</p>
          </Card>
          <Card>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-growth-600" />
              <h3 className="text-sm font-semibold text-slate-600">Avg Skill Rating</h3>
            </div>
            <p className="text-3xl font-bold text-slate-800">
              {calculateAverageSkillRating()} / 5
            </p>
          </Card>
          <Card>
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-4 h-4 text-growth-600" />
              <h3 className="text-sm font-semibold text-slate-600">Top Strength</h3>
            </div>
            <p className="text-lg font-bold text-slate-800">
              {getMostCommonStrength()}
            </p>
          </Card>
          <Card>
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-growth-600" />
              <h3 className="text-sm font-semibold text-slate-600">Top Growth Area</h3>
            </div>
            <p className="text-lg font-bold text-slate-800">
              {getMostCommonGrowthArea()}
            </p>
          </Card>
        </div>

        {/* Analytics Charts */}
        {filteredSubmissions.length > 0 && (
          <>
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Role Distribution Pie Chart */}
              <Card>
                <div className="flex items-center gap-2 mb-4">
                  <PieChart className="w-5 h-5 text-growth-600" />
                  <h3 className="text-xl font-bold text-slate-800">Role Distribution</h3>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPie>
                    <Pie
                      data={getRoleDistribution()}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
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
              </Card>

              {/* Learning Styles Distribution */}
              <Card>
                <div className="flex items-center gap-2 mb-4">
                  <BarChart3 className="w-5 h-5 text-growth-600" />
                  <h3 className="text-xl font-bold text-slate-800">Learning Styles</h3>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={getLearningStyleDistribution()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Top Growth Areas */}
              <Card>
                <div className="flex items-center gap-2 mb-4">
                  <Target className="w-5 h-5 text-growth-600" />
                  <h3 className="text-xl font-bold text-slate-800">Top 5 Growth Areas</h3>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={getTopGrowthAreas()} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={150} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              {/* Top Strengths */}
              <Card>
                <div className="flex items-center gap-2 mb-4">
                  <Award className="w-5 h-5 text-growth-600" />
                  <h3 className="text-xl font-bold text-slate-800">Top 5 Strengths</h3>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={getTopStrengths()} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={150} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8b5cf6" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </div>
          </>
        )}

        <Card>
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Recent Submissions</h2>
          {filteredSubmissions.length === 0 ? (
            <p className="text-center text-slate-500 py-8">
              {submissions.length === 0 ? 'No submissions yet' : 'No submissions match the selected filters'}
            </p>
          ) : (
            <div className="space-y-4">
              {filteredSubmissions.map((submission) => (
                <div
                  key={submission.id}
                  className="p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-growth-300 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="w-4 h-4 text-slate-500" />
                        <h3 className="font-semibold text-slate-800">{submission.name}</h3>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-600">
                        <div className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {submission.email}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(submission.created_at!).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-slate-700">{submission.current_role}</p>
                      <p className="text-xs text-slate-500">AGID: {submission.agid || 'N/A'}</p>
                    </div>
                  </div>
                  
                  {/* Career Vision */}
                  <div className="mt-3 pt-3 border-t border-slate-200">
                    <p className="text-slate-600 font-semibold mb-2 text-sm">📍 Career Vision</p>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <p className="text-slate-500">Growth Areas:</p>
                        <p className="text-slate-800">{submission.growth_areas?.join(', ') || 'Not specified'}</p>
                      </div>
                      <div>
                        <p className="text-slate-500">Future Vision:</p>
                        <p className="text-slate-800">{submission.future_vision || 'Not specified'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Superpowers */}
                  <div className="mt-3 pt-3 border-t border-slate-200">
                    <p className="text-slate-600 font-semibold mb-2 text-sm">⭐ Superpowers</p>
                    <div className="text-xs">
                      <p className="text-slate-500">Strengths:</p>
                      <p className="text-slate-800 mb-2">{submission.strengths?.join(', ') || 'Not specified'}</p>
                      <p className="text-slate-500">Proud Accomplishment:</p>
                      <p className="text-slate-800">{submission.proud_accomplishment || 'Not specified'}</p>
                    </div>
                  </div>

                  {/* Growth Opportunities */}
                  <div className="mt-3 pt-3 border-t border-slate-200">
                    <p className="text-slate-600 font-semibold mb-2 text-sm">🎯 Growth Opportunities</p>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <p className="text-slate-500">Skills to Improve:</p>
                        <p className="text-slate-800">{submission.skills_to_improve?.join(', ') || 'Not specified'}</p>
                      </div>
                      <div>
                        <p className="text-slate-500">Learning Style:</p>
                        <p className="text-slate-800">{submission.learning_style?.join(', ') || 'Not specified'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Community & Goals */}
                  <div className="mt-3 pt-3 border-t border-slate-200">
                    <p className="text-slate-600 font-semibold mb-2 text-sm">🚀 Goals & Community</p>
                    <div className="text-xs space-y-1">
                      <p><span className="text-slate-500">6-Month Goal:</span> {submission.six_month_goal || 'Not specified'}</p>
                      <p><span className="text-slate-500">Teaching Topic:</span> {submission.teaching_topic || 'Not specified'}</p>
                      <p><span className="text-slate-500">Mentor Interest:</span> {submission.mentor_interest || 'Not specified'}</p>
                    </div>
                  </div>

                  {/* View Details Button */}
                  <div className="mt-4 pt-3 border-t border-slate-200">
                    <Button
                      onClick={() => navigate(`/admin/user/${submission.id}`)}
                      className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      <Eye className="w-4 h-4" />
                      View Detailed Report
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
