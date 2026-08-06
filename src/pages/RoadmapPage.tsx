import { useNavigate } from 'react-router-dom'
import { Rocket, Home, Target, Map, Award, CheckCircle2, Clock, Lock } from 'lucide-react'
import Button from '@/components/Button'
import Card from '@/components/Card'
import Badge from '@/components/Badge'

const milestones = [
  {
    id: 1,
    title: 'UX Research Fundamentals',
    description: 'Master the basics of user research and data analysis',
    status: 'completed',
    progress: 100,
    tasks: ['Complete 5 user interviews', 'Analyze research data', 'Present findings'],
  },
  {
    id: 2,
    title: 'Advanced Design Systems',
    description: 'Build scalable and accessible design systems',
    status: 'in-progress',
    progress: 60,
    tasks: ['Create component library', 'Document design tokens', 'Implement accessibility'],
  },
  {
    id: 3,
    title: 'Leadership & Mentoring',
    description: 'Develop skills to lead and mentor other designers',
    status: 'upcoming',
    progress: 0,
    tasks: ['Mentor junior designer', 'Lead design review', 'Present to stakeholders'],
  },
  {
    id: 4,
    title: 'Strategic UX Thinking',
    description: 'Align UX strategy with business objectives',
    status: 'locked',
    progress: 0,
    tasks: ['Business case development', 'Stakeholder alignment', 'Metrics definition'],
  },
]

export default function RoadmapPage() {
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

      <main className="max-w-5xl mx-auto px-8 py-12">
        <div className="mb-8">
          <Badge variant="leadership" className="mb-4">
            Your Path Forward
          </Badge>
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Growth Roadmap</h2>
          <p className="text-lg text-slate-600">
            Your personalized journey to becoming a senior UX leader. Complete milestones to unlock
            new opportunities.
          </p>
        </div>

        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-growth-200 via-leadership-200 to-slate-200" />

          <div className="space-y-8">
            {milestones.map((milestone, index) => {
              const isCompleted = milestone.status === 'completed'
              const isInProgress = milestone.status === 'in-progress'
              const isLocked = milestone.status === 'locked'

              return (
                <div key={milestone.id} className="relative pl-20">
                  <div
                    className={`absolute left-0 w-16 h-16 rounded-2xl flex items-center justify-center ${
                      isCompleted
                        ? 'bg-gradient-to-br from-progress-400 to-progress-600'
                        : isInProgress
                        ? 'bg-gradient-to-br from-growth-400 to-growth-600'
                        : isLocked
                        ? 'bg-slate-300'
                        : 'bg-gradient-to-br from-leadership-400 to-leadership-600'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-8 h-8 text-white" />
                    ) : isLocked ? (
                      <Lock className="w-8 h-8 text-white" />
                    ) : (
                      <Clock className="w-8 h-8 text-white" />
                    )}
                  </div>

                  <Card className={isLocked ? 'opacity-60' : ''}>
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-slate-800 mb-1">
                          {milestone.title}
                        </h3>
                        <p className="text-slate-600">{milestone.description}</p>
                      </div>
                      <Badge
                        variant={
                          isCompleted
                            ? 'progress'
                            : isInProgress
                            ? 'growth'
                            : isLocked
                            ? 'default'
                            : 'leadership'
                        }
                      >
                        {isCompleted
                          ? 'Completed'
                          : isInProgress
                          ? 'In Progress'
                          : isLocked
                          ? 'Locked'
                          : 'Upcoming'}
                      </Badge>
                    </div>

                    {milestone.progress > 0 && (
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-slate-700">Progress</span>
                          <span className="text-sm font-bold text-slate-900">
                            {milestone.progress}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-growth-500 to-progress-500 h-2 rounded-full transition-all"
                            style={{ width: `${milestone.progress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-slate-700 mb-2">Key Tasks:</p>
                      {milestone.tasks.map((task, taskIndex) => (
                        <div key={taskIndex} className="flex items-center gap-2 text-sm">
                          <div
                            className={`w-1.5 h-1.5 rounded-full ${
                              isCompleted ? 'bg-progress-500' : 'bg-slate-400'
                            }`}
                          />
                          <span className="text-slate-600">{task}</span>
                        </div>
                      ))}
                    </div>

                    {!isLocked && !isCompleted && (
                      <div className="mt-4 pt-4 border-t border-slate-200">
                        <Button variant="outline" size="sm">
                          {isInProgress ? 'Continue Learning' : 'Start Milestone'}
                        </Button>
                      </div>
                    )}
                  </Card>
                </div>
              )
            })}
          </div>
        </div>
      </main>
    </div>
  )
}
