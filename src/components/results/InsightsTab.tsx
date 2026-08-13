import { GeneratedInsights } from '../../utils/insightGenerator'
import Card from '../Card'

interface InsightsTabProps {
  formData: any
  insights: GeneratedInsights
}

export default function InsightsTab({ formData, insights }: InsightsTabProps) {
  return (
    <div className="space-y-6">
      {/* Key Insights */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">⭐</span>
            <h3 className="text-lg font-bold text-slate-800">Your Superpower</h3>
          </div>
          <p className="text-slate-700">{insights.superpower}</p>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">🎯</span>
            <h3 className="text-lg font-bold text-slate-800">Your Growth Edge</h3>
          </div>
          <p className="text-slate-700">{insights.growthEdge}</p>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">💡</span>
            <h3 className="text-lg font-bold text-slate-800">Your Unique Path</h3>
          </div>
          <p className="text-slate-700">{insights.uniquePath}</p>
        </Card>
      </div>

      {/* Your Story */}
      <Card>
        <h2 className="text-2xl font-bold text-slate-800 mb-6">📖 Your Story in 3 Acts</h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          {/* Where You Are */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-growth-100 flex items-center justify-center">
                <span className="text-growth-600 font-bold">1</span>
              </div>
              <h3 className="font-bold text-slate-800">Where You Are</h3>
            </div>
            <div className="pl-10 space-y-2">
              <p className="text-sm font-medium text-slate-700">{formData.currentRole}</p>
              <div className="bg-slate-50 rounded-lg p-3">
                <p className="text-xs text-slate-600 font-medium mb-1">Proud of:</p>
                <p className="text-sm text-slate-700 italic">
                  "{formData.proudAccomplishment || 'Building my foundation'}"
                </p>
              </div>
            </div>
          </div>

          {/* Where You're Going */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 font-bold">2</span>
              </div>
              <h3 className="font-bold text-slate-800">Where You're Going</h3>
            </div>
            <div className="pl-10 space-y-2">
              <div className="bg-slate-50 rounded-lg p-3">
                <p className="text-xs text-slate-600 font-medium mb-1">6-Month Goal:</p>
                <p className="text-sm text-slate-700 italic">
                  "{formData.sixMonthGoal || 'Continuing to grow'}"
                </p>
              </div>
              <div className="bg-slate-50 rounded-lg p-3">
                <p className="text-xs text-slate-600 font-medium mb-1">Future Vision:</p>
                <p className="text-sm text-slate-700 italic">
                  "{formData.futureVision || 'Becoming a better designer'}"
                </p>
              </div>
            </div>
          </div>

          {/* How You'll Get There */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                <span className="text-purple-600 font-bold">3</span>
              </div>
              <h3 className="font-bold text-slate-800">How You'll Get There</h3>
            </div>
            <div className="pl-10 space-y-2">
              <div className="bg-slate-50 rounded-lg p-3">
                <p className="text-xs text-slate-600 font-medium mb-1">Focus on:</p>
                <ul className="text-sm text-slate-700 space-y-1">
                  {formData.growthAreas?.slice(0, 3).map((area: string, i: number) => (
                    <li key={i}>• {area}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-slate-50 rounded-lg p-3">
                <p className="text-xs text-slate-600 font-medium mb-1">Learning Style:</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {formData.learningStyle?.slice(0, 2).map((style: string, i: number) => (
                    <span key={i} className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                      {style}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Visual Timeline */}
        <div className="mt-8 pt-6 border-t border-slate-200">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-growth-300 via-blue-300 to-purple-300 -z-10"></div>
            
            <div className="bg-white px-4">
              <div className="w-12 h-12 rounded-full bg-growth-500 flex items-center justify-center text-white font-bold mx-auto">
                NOW
              </div>
              <p className="text-xs text-center text-slate-600 mt-2">{formData.currentRole}</p>
            </div>
            
            <div className="bg-white px-4">
              <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold mx-auto">
                6M
              </div>
              <p className="text-xs text-center text-slate-600 mt-2">Goal Achieved</p>
            </div>
            
            <div className="bg-white px-4">
              <div className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold mx-auto">
                ∞
              </div>
              <p className="text-xs text-center text-slate-600 mt-2">Future Vision</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
