import { GeneratedInsights } from '../../utils/insightGenerator'
import Card from '../Card'

interface RoadmapTabProps {
  formData: any
  insights: GeneratedInsights
}

export default function RoadmapTab({ formData, insights }: RoadmapTabProps) {
  const topGrowthArea = insights.growthOpportunities[0]?.skill || 'Design Skills'
  
  return (
    <div className="space-y-8">
      {/* Next Steps */}
      <div>
        <h3 className="font-semibold text-slate-900 mb-4">Your Next Steps</h3>
        
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
            
            <ul className="space-y-2 text-sm text-slate-700">
              <li>• Complete beginner course in {topGrowthArea}</li>
              <li>• Read recommended resources</li>
              <li>• Practice daily (15-30 min)</li>
            </ul>
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
            
            <ul className="space-y-2 text-sm text-slate-700">
              <li>• Build a practice project</li>
              <li>• Apply to real work</li>
              <li>• Get feedback from peers</li>
            </ul>
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
            
            <ul className="space-y-2 text-sm text-slate-700">
              <li>• Achieve your 6-month goal</li>
              <li>• Share learnings with team</li>
              <li>• Retake assessment</li>
            </ul>
          </Card>
        </div>
      </div>

      {/* Goal Reminder */}
      <Card className="bg-slate-50">
        <h3 className="font-semibold text-slate-900 mb-3">Your Goal</h3>
        <p className="text-slate-700">{formData.sixMonthGoal || 'Continue growing as a designer'}</p>
      </Card>
    </div>
  )
}
