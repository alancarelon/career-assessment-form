import { useNavigate } from 'react-router-dom'
import { Rocket, Home, Target, Map, Award, TrendingUp, Zap, BookOpen, Users } from 'lucide-react'
import Button from '@/components/Button'
import Card from '@/components/Card'
import ProgressBar from '@/components/ProgressBar'
import Badge from '@/components/Badge'

export default function Dashboard() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen">
      <header className="py-4 px-8 border-b border-white/20 glass-effect sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Rocket className="w-7 h-7 text-growth-600" />
            <h1 className="text-xl font-bold gradient-text">UX Growth Journey</h1>
          </div>
          <nav className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
              <Home className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate('/assessment')}>
              <Target className="w-4 h-4 mr-2" />
              Assessment
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate('/roadmap')}>
              <Map className="w-4 h-4 mr-2" />
              Roadmap
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate('/achievements')}>
              <Award className="w-4 h-4 mr-2" />
              Achievements
            </Button>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Welcome back! 👋</h2>
          <p className="text-lg text-slate-600">
            Let's continue your growth journey. You're making great progress!
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-800">Your Growth Progress</h3>
              <Badge variant="progress">On Track</Badge>
            </div>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-slate-700">UX Research</span>
                  <span className="text-sm text-slate-500">Advanced</span>
                </div>
                <ProgressBar value={85} color="growth" />
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-slate-700">Design Systems</span>
                  <span className="text-sm text-slate-500">Intermediate</span>
                </div>
                <ProgressBar value={65} color="leadership" />
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-slate-700">Leadership & Mentoring</span>
                  <span className="text-sm text-slate-500">Developing</span>
                </div>
                <ProgressBar value={45} color="progress" />
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-slate-700">Accessibility</span>
                  <span className="text-sm text-slate-500">Proficient</span>
                </div>
                <ProgressBar value={78} color="achievement" />
              </div>
            </div>
          </Card>

          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-growth-500 to-growth-600 text-white border-0">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm opacity-90">Overall Progress</p>
                  <p className="text-3xl font-bold">68%</p>
                </div>
              </div>
              <p className="text-sm opacity-90">
                You've completed 17 of 25 growth objectives this quarter
              </p>
            </Card>

            <Card>
              <h4 className="font-bold text-slate-800 mb-4">Quick Actions</h4>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => navigate('/assessment')}
                >
                  <Target className="w-4 h-4 mr-2" />
                  Start Self-Assessment
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => navigate('/roadmap')}
                >
                  <Map className="w-4 h-4 mr-2" />
                  View Learning Path
                </Button>
              </div>
            </Card>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card hover>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-growth-100 flex items-center justify-center">
                <Zap className="w-5 h-5 text-growth-600" />
              </div>
              <h4 className="font-bold text-slate-800">Active Goals</h4>
            </div>
            <p className="text-3xl font-bold text-slate-900 mb-1">5</p>
            <p className="text-sm text-slate-600">2 completed this month</p>
          </Card>

          <Card hover>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-leadership-100 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-leadership-600" />
              </div>
              <h4 className="font-bold text-slate-800">Learning Hours</h4>
            </div>
            <p className="text-3xl font-bold text-slate-900 mb-1">24</p>
            <p className="text-sm text-slate-600">This quarter</p>
          </Card>

          <Card hover>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-progress-100 flex items-center justify-center">
                <Users className="w-5 h-5 text-progress-600" />
              </div>
              <h4 className="font-bold text-slate-800">Mentorship</h4>
            </div>
            <p className="text-3xl font-bold text-slate-900 mb-1">3</p>
            <p className="text-sm text-slate-600">Sessions completed</p>
          </Card>
        </div>

        <Card>
          <h3 className="text-xl font-bold text-slate-800 mb-4">Recent Achievements</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-xl bg-gradient-to-br from-achievement-50 to-achievement-100 border border-achievement-200">
              <div className="text-4xl mb-2">🏆</div>
              <p className="font-semibold text-sm text-slate-800">Research Master</p>
              <p className="text-xs text-slate-600 mt-1">Completed 10 user studies</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-gradient-to-br from-growth-50 to-growth-100 border border-growth-200">
              <div className="text-4xl mb-2">🎯</div>
              <p className="font-semibold text-sm text-slate-800">Goal Achiever</p>
              <p className="text-xs text-slate-600 mt-1">Met quarterly objectives</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-gradient-to-br from-leadership-50 to-leadership-100 border border-leadership-200">
              <div className="text-4xl mb-2">🌟</div>
              <p className="font-semibold text-sm text-slate-800">Team Player</p>
              <p className="text-xs text-slate-600 mt-1">Mentored 3 designers</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-gradient-to-br from-progress-50 to-progress-100 border border-progress-200">
              <div className="text-4xl mb-2">🚀</div>
              <p className="font-semibold text-sm text-slate-800">Fast Learner</p>
              <p className="text-xs text-slate-600 mt-1">Completed 5 courses</p>
            </div>
          </div>
        </Card>
      </main>
    </div>
  )
}
