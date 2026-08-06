import { useNavigate } from 'react-router-dom'
import { Rocket, TrendingUp, Target, Award, ArrowRight, Sparkles } from 'lucide-react'
import Button from '@/components/Button'
import Card from '@/components/Card'

export default function WelcomePage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col">
      <header className="py-6 px-8 border-b border-white/20 glass-effect">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Rocket className="w-8 h-8 text-growth-600" />
            <h1 className="text-2xl font-bold gradient-text">UX Growth Journey</h1>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-6xl w-full">
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center gap-2 mb-6">
              <Sparkles className="w-6 h-6 text-achievement-500" />
              <span className="text-sm font-semibold text-leadership-600 uppercase tracking-wide">
                Your Career Accelerator
              </span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold mb-6 gradient-text">
              🚀 My UX Growth Journey
            </h2>
            <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Discover your strengths, identify growth opportunities, and build a personalized
              roadmap toward your next career milestone.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 animate-slide-up">
            <Card hover className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-growth-100 to-growth-200 flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-growth-600" />
              </div>
              <h3 className="font-bold text-lg mb-2 text-slate-800">Track Progress</h3>
              <p className="text-sm text-slate-600">
                Visualize your growth with beautiful, intuitive progress tracking
              </p>
            </Card>

            <Card hover className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-leadership-100 to-leadership-200 flex items-center justify-center">
                <Target className="w-8 h-8 text-leadership-600" />
              </div>
              <h3 className="font-bold text-lg mb-2 text-slate-800">Set Goals</h3>
              <p className="text-sm text-slate-600">
                Define clear, achievable goals aligned with your career aspirations
              </p>
            </Card>

            <Card hover className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-progress-100 to-progress-200 flex items-center justify-center">
                <Rocket className="w-8 h-8 text-progress-600" />
              </div>
              <h3 className="font-bold text-lg mb-2 text-slate-800">Personalized Path</h3>
              <p className="text-sm text-slate-600">
                Get a customized roadmap tailored to your unique strengths
              </p>
            </Card>

            <Card hover className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-achievement-100 to-achievement-200 flex items-center justify-center">
                <Award className="w-8 h-8 text-achievement-600" />
              </div>
              <h3 className="font-bold text-lg mb-2 text-slate-800">Earn Recognition</h3>
              <p className="text-sm text-slate-600">
                Celebrate milestones with achievements and badges
              </p>
            </Card>
          </div>

          <div className="text-center animate-scale-in">
            <Button size="lg" onClick={() => navigate('/dashboard')} className="group">
              Begin Your Journey
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <p className="mt-4 text-sm text-slate-500">
              Your organization is investing in your growth
            </p>
          </div>
        </div>
      </main>

      <footer className="py-6 px-8 border-t border-white/20 glass-effect">
        <div className="max-w-7xl mx-auto text-center text-sm text-slate-600">
          <p>© 2026 UX Growth Journey. Empowering UX professionals to reach their full potential.</p>
        </div>
      </footer>
    </div>
  )
}
