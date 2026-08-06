import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Rocket, Home, Target, Map, Award, CheckCircle2, Circle } from 'lucide-react'
import Button from '@/components/Button'
import Card from '@/components/Card'
import Badge from '@/components/Badge'

const competencies = [
  {
    category: 'UX Research',
    skills: [
      'User Interviews',
      'Usability Testing',
      'Data Analysis',
      'Research Planning',
    ],
  },
  {
    category: 'Design Systems',
    skills: [
      'Component Libraries',
      'Design Tokens',
      'Documentation',
      'Accessibility Standards',
    ],
  },
  {
    category: 'Leadership',
    skills: [
      'Team Mentoring',
      'Project Management',
      'Stakeholder Communication',
      'Strategic Thinking',
    ],
  },
]

export default function AssessmentPage() {
  const navigate = useNavigate()
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    )
  }

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
          <Badge variant="growth" className="mb-4">
            Self-Reflection
          </Badge>
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Skills Assessment</h2>
          <p className="text-lg text-slate-600">
            Select the skills where you feel confident and want to grow further. This helps us
            personalize your learning journey.
          </p>
        </div>

        <div className="space-y-6 mb-8">
          {competencies.map((competency) => (
            <Card key={competency.category}>
              <h3 className="text-xl font-bold text-slate-800 mb-4">{competency.category}</h3>
              <div className="grid md:grid-cols-2 gap-3">
                {competency.skills.map((skill) => {
                  const isSelected = selectedSkills.includes(skill)
                  return (
                    <button
                      key={skill}
                      onClick={() => toggleSkill(skill)}
                      className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                        isSelected
                          ? 'border-growth-500 bg-growth-50'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      {isSelected ? (
                        <CheckCircle2 className="w-5 h-5 text-growth-600 flex-shrink-0" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-400 flex-shrink-0" />
                      )}
                      <span
                        className={`font-medium ${
                          isSelected ? 'text-growth-700' : 'text-slate-700'
                        }`}
                      >
                        {skill}
                      </span>
                    </button>
                  )
                })}
              </div>
            </Card>
          ))}
        </div>

        <Card className="bg-gradient-to-br from-slate-50 to-white border-2 border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-1">
                {selectedSkills.length} skills selected
              </h3>
              <p className="text-sm text-slate-600">
                Great! We'll use this to create your personalized growth plan.
              </p>
            </div>
            <Button
              size="lg"
              onClick={() => navigate('/roadmap')}
              disabled={selectedSkills.length === 0}
            >
              Continue to Roadmap
            </Button>
          </div>
        </Card>
      </main>
    </div>
  )
}
