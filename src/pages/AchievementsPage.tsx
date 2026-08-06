import { useNavigate } from 'react-router-dom'
import { Rocket, Home, Target, Map, Award, Star, Trophy, Zap, Crown } from 'lucide-react'
import Button from '@/components/Button'
import Card from '@/components/Card'
import Badge from '@/components/Badge'

const achievements = [
  {
    id: 1,
    title: 'Research Master',
    description: 'Completed 10 user research studies',
    icon: '🏆',
    color: 'achievement',
    earned: true,
    date: 'Earned on March 15, 2026',
  },
  {
    id: 2,
    title: 'Goal Achiever',
    description: 'Met all quarterly objectives',
    icon: '🎯',
    color: 'growth',
    earned: true,
    date: 'Earned on March 1, 2026',
  },
  {
    id: 3,
    title: 'Team Player',
    description: 'Mentored 3 junior designers',
    icon: '🌟',
    color: 'leadership',
    earned: true,
    date: 'Earned on February 20, 2026',
  },
  {
    id: 4,
    title: 'Fast Learner',
    description: 'Completed 5 courses in one month',
    icon: '🚀',
    color: 'progress',
    earned: true,
    date: 'Earned on January 30, 2026',
  },
  {
    id: 5,
    title: 'Design System Expert',
    description: 'Built a comprehensive design system',
    icon: '💎',
    color: 'growth',
    earned: false,
    date: 'In Progress',
  },
  {
    id: 6,
    title: 'Accessibility Champion',
    description: 'Achieved 100% WCAG compliance',
    icon: '♿',
    color: 'progress',
    earned: false,
    date: 'Locked',
  },
]

export default function AchievementsPage() {
  const navigate = useNavigate()
  const earnedCount = achievements.filter((a) => a.earned).length

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

      <main className="max-w-6xl mx-auto px-8 py-12">
        <div className="mb-8">
          <Badge variant="achievement" className="mb-4">
            Your Accomplishments
          </Badge>
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Achievements</h2>
          <p className="text-lg text-slate-600">
            Celebrate your milestones and track your progress toward becoming a UX leader.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-achievement-500 to-achievement-600 text-white border-0">
            <div className="flex items-center gap-3 mb-2">
              <Trophy className="w-8 h-8" />
              <div>
                <p className="text-sm opacity-90">Total Achievements</p>
                <p className="text-3xl font-bold">{earnedCount}</p>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-growth-500 to-growth-600 text-white border-0">
            <div className="flex items-center gap-3 mb-2">
              <Star className="w-8 h-8" />
              <div>
                <p className="text-sm opacity-90">Completion Rate</p>
                <p className="text-3xl font-bold">
                  {Math.round((earnedCount / achievements.length) * 100)}%
                </p>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-leadership-500 to-leadership-600 text-white border-0">
            <div className="flex items-center gap-3 mb-2">
              <Zap className="w-8 h-8" />
              <div>
                <p className="text-sm opacity-90">Current Streak</p>
                <p className="text-3xl font-bold">12 days</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((achievement) => (
            <Card
              key={achievement.id}
              className={`text-center ${
                !achievement.earned ? 'opacity-50 grayscale' : 'card-hover'
              }`}
            >
              <div
                className={`w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center text-4xl ${
                  achievement.earned
                    ? `bg-gradient-to-br from-${achievement.color}-100 to-${achievement.color}-200 border-2 border-${achievement.color}-300`
                    : 'bg-slate-100 border-2 border-slate-200'
                }`}
              >
                {achievement.icon}
              </div>
              <h3 className="font-bold text-lg mb-2 text-slate-800">{achievement.title}</h3>
              <p className="text-sm text-slate-600 mb-3">{achievement.description}</p>
              <Badge
                variant={achievement.earned ? (achievement.color as any) : 'default'}
                size="sm"
              >
                {achievement.date}
              </Badge>
            </Card>
          ))}
        </div>

        <Card className="mt-8 bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
              <Crown className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-slate-800 mb-1">Keep Going!</h3>
              <p className="text-slate-600">
                You're on track to unlock {achievements.length - earnedCount} more achievements.
                Continue your growth journey!
              </p>
            </div>
            <Button onClick={() => navigate('/roadmap')}>View Roadmap</Button>
          </div>
        </Card>
      </main>
    </div>
  )
}
