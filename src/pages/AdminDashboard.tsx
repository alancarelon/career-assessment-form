import { useState, useEffect } from 'react'
import { Download, RefreshCw, Calendar, Mail, User, TrendingUp, Target, Award } from 'lucide-react'
import { supabase, AssessmentSubmission } from '../lib/supabase'
import * as XLSX from 'xlsx'
import Card from '../components/Card'
import Button from '../components/Button'

export default function AdminDashboard() {
  const [submissions, setSubmissions] = useState<AssessmentSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

        <Card>
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Recent Submissions</h2>
          {submissions.length === 0 ? (
            <p className="text-center text-slate-500 py-8">No submissions yet</p>
          ) : (
            <div className="space-y-4">
              {submissions.map((submission) => (
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
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
