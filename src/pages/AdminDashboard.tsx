import { useState, useEffect } from 'react'
import { Download, RefreshCw, Calendar, Mail, User } from 'lucide-react'
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
        'Current Role',
        'Years of Experience',
        'User Interviews',
        'Usability Testing',
        'Data Analysis',
        'Research Planning',
        'Component Libraries',
        'Design Tokens',
        'Documentation',
        'Accessibility',
        'Team Mentoring',
        'Project Management',
        'Stakeholder Communication',
        'Strategic Thinking',
        'Short-term Goals',
        'Long-term Goals',
        'Areas for Growth',
        'Learning Preferences',
        'Additional Comments',
      ],
      ...submissions.map((sub) => [
        new Date(sub.created_at!).toLocaleString(),
        sub.name,
        sub.email,
        sub.current_role,
        sub.years_of_experience,
        sub.ux_research_skills.userInterviews,
        sub.ux_research_skills.usabilityTesting,
        sub.ux_research_skills.dataAnalysis,
        sub.ux_research_skills.researchPlanning,
        sub.design_systems_skills.componentLibraries,
        sub.design_systems_skills.designTokens,
        sub.design_systems_skills.documentation,
        sub.design_systems_skills.accessibility,
        sub.leadership_skills.teamMentoring,
        sub.leadership_skills.projectManagement,
        sub.leadership_skills.stakeholderCommunication,
        sub.leadership_skills.strategicThinking,
        sub.short_term_goals,
        sub.long_term_goals,
        sub.areas_for_growth,
        sub.learning_preferences.join(', '),
        sub.additional_comments,
      ]),
    ]

    const ws = XLSX.utils.aoa_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'All Submissions')

    ws['!cols'] = Array(data[0].length).fill({ wch: 20 })

    const fileName = `All_Assessments_${new Date().toISOString().split('T')[0]}.xlsx`
    XLSX.writeFile(wb, fileName)
  }

  const calculateAverageSkill = (submissions: AssessmentSubmission[], category: string, skill: string) => {
    if (submissions.length === 0) return 0
    const sum = submissions.reduce((acc, sub: any) => {
      return acc + (sub[category]?.[skill] || 0)
    }, 0)
    return (sum / submissions.length).toFixed(1)
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

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <h3 className="text-sm font-semibold text-slate-600 mb-2">Total Submissions</h3>
            <p className="text-3xl font-bold text-slate-800">{submissions.length}</p>
          </Card>
          <Card>
            <h3 className="text-sm font-semibold text-slate-600 mb-2">Avg UX Research</h3>
            <p className="text-3xl font-bold text-slate-800">
              {calculateAverageSkill(submissions, 'ux_research_skills', 'userInterviews')}
            </p>
          </Card>
          <Card>
            <h3 className="text-sm font-semibold text-slate-600 mb-2">Avg Leadership</h3>
            <p className="text-3xl font-bold text-slate-800">
              {calculateAverageSkill(submissions, 'leadership_skills', 'teamMentoring')}
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
                      <p className="text-xs text-slate-500">{submission.years_of_experience}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-slate-600 font-medium mb-1">UX Research</p>
                      <p className="text-slate-800">
                        Avg: {(
                          (submission.ux_research_skills.userInterviews +
                            submission.ux_research_skills.usabilityTesting +
                            submission.ux_research_skills.dataAnalysis +
                            submission.ux_research_skills.researchPlanning) / 4
                        ).toFixed(1)}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-600 font-medium mb-1">Design Systems</p>
                      <p className="text-slate-800">
                        Avg: {(
                          (submission.design_systems_skills.componentLibraries +
                            submission.design_systems_skills.designTokens +
                            submission.design_systems_skills.documentation +
                            submission.design_systems_skills.accessibility) / 4
                        ).toFixed(1)}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-600 font-medium mb-1">Leadership</p>
                      <p className="text-slate-800">
                        Avg: {(
                          (submission.leadership_skills.teamMentoring +
                            submission.leadership_skills.projectManagement +
                            submission.leadership_skills.stakeholderCommunication +
                            submission.leadership_skills.strategicThinking) / 4
                        ).toFixed(1)}
                      </p>
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
