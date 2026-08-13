import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Mail, User, TrendingUp, Award, Target, BarChart3, Calendar } from 'lucide-react'
import { supabase, AssessmentSubmission } from '../lib/supabase'
import { roleBasedQuestions } from '../data/roleQuestions'
import Card from '../components/Card'
import Button from '../components/Button'

export default function UserReport() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [user, setUser] = useState<AssessmentSubmission | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchUserData()
  }, [id])

  const fetchUserData = async () => {
    setLoading(true)
    setError(null)
    try {
      const { data, error: fetchError } = await supabase
        .from('assessments')
        .select('*')
        .eq('id', id)
        .single()

      if (fetchError) throw fetchError
      if (!data) throw new Error('User not found')
      
      setUser(data)
    } catch (err) {
      console.error('Error fetching user data:', err)
      setError('Failed to load user report')
    } finally {
      setLoading(false)
    }
  }

  const calculateAverageRating = () => {
    if (!user?.skill_ratings) return 0
    const ratings = Object.values(user.skill_ratings)
    const sum = ratings.reduce((acc: number, val) => {
      const rating = typeof val === 'object' ? val.rating : Number(val)
      return acc + rating
    }, 0)
    return (sum / ratings.length).toFixed(1)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading user report...</p>
        </div>
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'User not found'}</p>
          <Button onClick={() => navigate('/admin')}>
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  const avgRating = calculateAverageRating()

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => navigate('/admin')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Button>
              <div className="h-8 w-px bg-slate-300"></div>
              <div>
                <p className="text-sm text-slate-500">Admin Dashboard / User Report</p>
                <h1 className="text-2xl font-bold text-slate-900">{user.name}'s Assessment Report</h1>
              </div>
            </div>
            <Button onClick={() => window.print()} className="flex items-center gap-2">
              🖨️ Print Report
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="flex items-center gap-3">
              <Mail className="w-10 h-10 text-blue-600" />
              <div>
                <p className="text-xs text-blue-800 font-semibold">Email</p>
                <p className="font-semibold text-slate-900 text-sm">{user.email}</p>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <div className="flex items-center gap-3">
              <User className="w-10 h-10 text-green-600" />
              <div>
                <p className="text-xs text-green-800 font-semibold">AGID</p>
                <p className="font-semibold text-slate-900 text-sm">{user.agid || 'N/A'}</p>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-10 h-10 text-purple-600" />
              <div>
                <p className="text-xs text-purple-800 font-semibold">Current Role</p>
                <p className="font-semibold text-slate-900 text-sm">{user.current_role}</p>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <div className="flex items-center gap-3">
              <Calendar className="w-10 h-10 text-orange-600" />
              <div>
                <p className="text-xs text-orange-800 font-semibold">Submitted</p>
                <p className="font-semibold text-slate-900 text-sm">
                  {new Date(user.created_at!).toLocaleDateString()}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Skill Ratings by Category */}
        {user.skill_ratings && Object.keys(user.skill_ratings).length > 0 && (() => {
          const roleQuestions = roleBasedQuestions[user.current_role]
          if (!roleQuestions) {
            return (
              <Card>
                <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <BarChart3 className="w-6 h-6 text-purple-600" />
                  Skill Ratings
                  <span className="ml-auto text-lg font-semibold text-purple-600">
                    Average: {avgRating}/5.0
                  </span>
                </h3>
                <p className="text-slate-600">No category information available for this role.</p>
              </Card>
            )
          }

          return (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                  <BarChart3 className="w-6 h-6 text-purple-600" />
                  Skill Ratings by Category
                </h3>
                <div className="bg-purple-100 px-4 py-2 rounded-lg">
                  <span className="text-sm font-semibold text-purple-800">Overall Average: </span>
                  <span className="text-2xl font-bold text-purple-600">{avgRating}/5.0</span>
                </div>
              </div>

              {roleQuestions.skillCategories
                .filter(cat => cat.questionType !== 'multiselect')
                .map((category, idx) => {
                  // Get skills for this category
                  const categorySkills = category.skills
                    .map(skill => {
                      const skillName = typeof skill === 'string' ? skill : skill.name
                      const ratingData = user.skill_ratings?.[skillName]
                      if (!ratingData) return null
                      const rating = typeof ratingData === 'object' ? ratingData.rating : Number(ratingData)
                      const idealRating = typeof skill === 'object' ? skill.idealRating : 5
                      return { skillName, rating, idealRating }
                    })
                    .filter(Boolean)

                  if (categorySkills.length === 0) return null

                  // Calculate category average
                  const categoryAvg = (categorySkills.reduce((sum, s) => sum + (s?.rating || 0), 0) / categorySkills.length).toFixed(1)

                  return (
                    <Card key={idx} className="overflow-hidden">
                      <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 border-b-2 border-purple-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-xl font-bold text-slate-900">{category.category}</h4>
                            <p className="text-sm text-slate-600 mt-1">{category.description}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-slate-600">Category Average</p>
                            <p className="text-3xl font-bold text-purple-600">{categoryAvg}/5</p>
                          </div>
                        </div>
                      </div>

                      {/* Table Format */}
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                              <th className="text-left py-3 px-4 font-semibold text-slate-700 text-sm">Skill</th>
                              <th className="text-center py-3 px-4 font-semibold text-slate-700 text-sm w-32">Your Rating</th>
                              <th className="text-center py-3 px-4 font-semibold text-slate-700 text-sm w-32">Target</th>
                              <th className="text-left py-3 px-4 font-semibold text-slate-700 text-sm w-64">Progress</th>
                              <th className="text-center py-3 px-4 font-semibold text-slate-700 text-sm w-24">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {categorySkills.map((skill, i) => {
                              if (!skill) return null
                              const percentage = (skill.rating / skill.idealRating) * 100
                              const status = percentage >= 100 ? 'exceeds' : percentage >= 80 ? 'meets' : 'growing'
                              
                              return (
                                <tr key={i} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                  <td className="py-3 px-4 font-medium text-slate-800">{skill.skillName}</td>
                                  <td className="py-3 px-4 text-center">
                                    <span className="text-2xl font-bold text-purple-600">{skill.rating}</span>
                                    <span className="text-slate-500">/5</span>
                                  </td>
                                  <td className="py-3 px-4 text-center">
                                    <span className="text-lg font-semibold text-slate-600">{skill.idealRating}</span>
                                    <span className="text-slate-400">/5</span>
                                  </td>
                                  <td className="py-3 px-4">
                                    <div className="w-full bg-slate-200 rounded-full h-4">
                                      <div 
                                        className={`h-4 rounded-full transition-all ${
                                          status === 'exceeds' ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                                          status === 'meets' ? 'bg-gradient-to-r from-blue-500 to-cyan-500' :
                                          'bg-gradient-to-r from-orange-500 to-amber-500'
                                        }`}
                                        style={{ width: `${Math.min(percentage, 100)}%` }}
                                      ></div>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-1">{percentage.toFixed(0)}% of target</p>
                                  </td>
                                  <td className="py-3 px-4 text-center">
                                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                                      status === 'exceeds' ? 'bg-green-100 text-green-800' :
                                      status === 'meets' ? 'bg-blue-100 text-blue-800' :
                                      'bg-orange-100 text-orange-800'
                                    }`}>
                                      {status === 'exceeds' ? '✓ Exceeds' : status === 'meets' ? '✓ Meets' : '→ Growing'}
                                    </span>
                                  </td>
                                </tr>
                              )
                            })}
                          </tbody>
                        </table>
                      </div>
                    </Card>
                  )
                })}
            </div>
          )
        })()}

        {/* Strengths & Growth Areas */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Strengths */}
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
            <h3 className="text-2xl font-bold text-green-900 mb-4 flex items-center gap-2">
              <Award className="w-6 h-6" />
              Strengths
            </h3>
            <ul className="space-y-3 mb-4">
              {user.strengths?.map((strength, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-700">
                  <span className="text-green-600 text-xl mt-0.5">✓</span>
                  <span className="font-medium">{strength}</span>
                </li>
              ))}
            </ul>
            {user.teammates_feedback && (
              <div className="mt-4 p-4 bg-white rounded-lg border-l-4 border-green-500">
                <p className="text-sm font-semibold text-green-800 mb-2">Teammate Feedback:</p>
                <p className="text-slate-700 italic">"{user.teammates_feedback}"</p>
              </div>
            )}
            {user.proud_accomplishment && (
              <div className="mt-4 p-4 bg-white rounded-lg">
                <p className="text-sm font-semibold text-green-800 mb-2">Proud Accomplishment:</p>
                <p className="text-slate-700 italic">"{user.proud_accomplishment}"</p>
              </div>
            )}
          </Card>

          {/* Growth Areas */}
          <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-200">
            <h3 className="text-2xl font-bold text-orange-900 mb-4 flex items-center gap-2">
              <Target className="w-6 h-6" />
              Growth Areas
            </h3>
            <ul className="space-y-3 mb-4">
              {user.skills_to_improve?.map((skill, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-700">
                  <span className="text-orange-600 text-xl mt-0.5">→</span>
                  <span className="font-medium">{skill}</span>
                </li>
              ))}
            </ul>
            {user.learning_style && user.learning_style.length > 0 && (
              <div className="mt-4 p-4 bg-white rounded-lg">
                <p className="text-sm font-semibold text-orange-800 mb-2">Preferred Learning Style:</p>
                <p className="text-slate-700">{user.learning_style.join(', ')}</p>
              </div>
            )}
            {user.growth_areas && user.growth_areas.length > 0 && (
              <div className="mt-4 p-4 bg-white rounded-lg">
                <p className="text-sm font-semibold text-orange-800 mb-2">Additional Growth Areas:</p>
                <p className="text-slate-700">{user.growth_areas.join(', ')}</p>
              </div>
            )}
          </Card>
        </div>

        {/* Career Vision & Goals */}
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200">
          <h3 className="text-2xl font-bold text-blue-900 mb-6">Career Vision & Goals</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-5 rounded-lg">
              <p className="text-sm font-semibold text-blue-800 mb-2">Career Growth</p>
              <p className="text-slate-700 text-lg">{user.career_growth || 'Not specified'}</p>
            </div>
            <div className="bg-white p-5 rounded-lg">
              <p className="text-sm font-semibold text-blue-800 mb-2">Future Vision</p>
              <p className="text-slate-700 text-lg">{user.future_vision || 'Not specified'}</p>
            </div>
            <div className="bg-white p-5 rounded-lg">
              <p className="text-sm font-semibold text-blue-800 mb-2">6-Month Goal</p>
              <p className="text-slate-700">{user.six_month_goal || 'Not specified'}</p>
            </div>
            <div className="bg-white p-5 rounded-lg">
              <p className="text-sm font-semibold text-blue-800 mb-2">Goal Importance</p>
              <p className="text-slate-700">{user.goal_importance || 'Not specified'}</p>
            </div>
          </div>
        </Card>

        {/* Community & Mentorship */}
        {(user.teaching_topic || user.mentor_interest) && (
          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
            <h3 className="text-2xl font-bold text-purple-900 mb-6">Community & Mentorship</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {user.teaching_topic && (
                <div className="bg-white p-5 rounded-lg">
                  <p className="text-sm font-semibold text-purple-800 mb-2">Teaching Topic</p>
                  <p className="text-slate-700">{user.teaching_topic}</p>
                </div>
              )}
              {user.mentor_interest && (
                <div className="bg-white p-5 rounded-lg">
                  <p className="text-sm font-semibold text-purple-800 mb-2">Mentor Interest</p>
                  <p className="text-slate-700">{user.mentor_interest}</p>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Back Button */}
        <div className="flex justify-center pt-8">
          <Button
            variant="outline"
            onClick={() => navigate('/admin')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  )
}
