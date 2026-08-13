import { GeneratedInsights } from '../../utils/insightGenerator'
import Card from '../Card'

interface RoadmapTabProps {
  formData: any
  insights: GeneratedInsights
}

export default function RoadmapTab({ formData, insights }: RoadmapTabProps) {
  const topGrowthArea = insights.growthOpportunities[0]?.skill || 'Design Skills'
  
  return (
    <div className="space-y-6">
      {/* 30-60-90 Day Plan */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800 mb-6">🎯 Your 90-Day Growth Plan</h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          {/* Month 1 */}
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">
                1
              </div>
              <div>
                <h3 className="font-bold text-slate-800">Month 1</h3>
                <p className="text-sm text-slate-600">Foundation</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <label className="flex items-start gap-2 cursor-pointer">
                <input type="checkbox" className="mt-1" />
                <span className="text-sm text-slate-700">
                  Complete beginner course in {topGrowthArea}
                </span>
              </label>
              
              <label className="flex items-start gap-2 cursor-pointer">
                <input type="checkbox" className="mt-1" />
                <span className="text-sm text-slate-700">
                  Read recommended book/article
                </span>
              </label>
              
              <label className="flex items-start gap-2 cursor-pointer">
                <input type="checkbox" className="mt-1" />
                <span className="text-sm text-slate-700">
                  Practice daily (15-30 min)
                </span>
              </label>
              
              <label className="flex items-start gap-2 cursor-pointer">
                <input type="checkbox" className="mt-1" />
                <span className="text-sm text-slate-700">
                  Join relevant community
                </span>
              </label>
            </div>
          </Card>

          {/* Month 2 */}
          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                2
              </div>
              <div>
                <h3 className="font-bold text-slate-800">Month 2</h3>
                <p className="text-sm text-slate-600">Application</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <label className="flex items-start gap-2 cursor-pointer">
                <input type="checkbox" className="mt-1" />
                <span className="text-sm text-slate-700">
                  Build a practice project
                </span>
              </label>
              
              <label className="flex items-start gap-2 cursor-pointer">
                <input type="checkbox" className="mt-1" />
                <span className="text-sm text-slate-700">
                  Apply learning to work project
                </span>
              </label>
              
              <label className="flex items-start gap-2 cursor-pointer">
                <input type="checkbox" className="mt-1" />
                <span className="text-sm text-slate-700">
                  Document your learnings
                </span>
              </label>
              
              <label className="flex items-start gap-2 cursor-pointer">
                <input type="checkbox" className="mt-1" />
                <span className="text-sm text-slate-700">
                  Get feedback from mentor/peers
                </span>
              </label>
            </div>
          </Card>

          {/* Month 3 */}
          <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold">
                3
              </div>
              <div>
                <h3 className="font-bold text-slate-800">Month 3</h3>
                <p className="text-sm text-slate-600">Leadership</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <label className="flex items-start gap-2 cursor-pointer">
                <input type="checkbox" className="mt-1" />
                <span className="text-sm text-slate-700">
                  Achieve your 6-month goal
                </span>
              </label>
              
              <label className="flex items-start gap-2 cursor-pointer">
                <input type="checkbox" className="mt-1" />
                <span className="text-sm text-slate-700">
                  Share learnings in workshop/article
                </span>
              </label>
              
              <label className="flex items-start gap-2 cursor-pointer">
                <input type="checkbox" className="mt-1" />
                <span className="text-sm text-slate-700">
                  Start mentoring someone
                </span>
              </label>
              
              <label className="flex items-start gap-2 cursor-pointer">
                <input type="checkbox" className="mt-1" />
                <span className="text-sm text-slate-700">
                  Retake assessment to track progress
                </span>
              </label>
            </div>
          </Card>
        </div>
      </div>

      {/* Learning Tips */}
      <Card>
        <h3 className="text-xl font-bold text-slate-800 mb-4">💡 Pro Tips for Success</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {insights.learningTips.map((tip, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
              <div className="w-6 h-6 rounded-full bg-growth-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-growth-600 text-sm font-bold">{index + 1}</span>
              </div>
              <p className="text-sm text-slate-700">{tip}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Your Goal Reminder */}
      <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
        <div className="flex items-start gap-4">
          <div className="text-4xl">🎯</div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-slate-800 mb-2">Your 6-Month Goal</h3>
            <p className="text-lg text-slate-700 italic mb-4">
              "{formData.sixMonthGoal || 'Continue growing as a designer'}"
            </p>
            <p className="text-sm text-slate-600">
              <strong>Why it matters:</strong> {formData.goalImportance || 'This goal will help you grow in your career and make a bigger impact.'}
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
