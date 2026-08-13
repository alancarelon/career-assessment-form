import { GeneratedInsights } from '../../utils/insightGenerator'
import Card from '../Card'

interface InsightsTabProps {
  formData: any
  insights: GeneratedInsights
}

export default function InsightsTab({ formData, insights }: InsightsTabProps) {
  return (
    <div className="space-y-8">
      {/* Main Insights */}
      <div className="space-y-6">
        <Card className="border-l-4 border-green-500">
          <h3 className="font-semibold text-slate-900 mb-3">Your Superpower</h3>
          <p className="text-slate-700 leading-relaxed">{insights.superpower}</p>
        </Card>

        <Card className="border-l-4 border-orange-500">
          <h3 className="font-semibold text-slate-900 mb-3">Growth Opportunity</h3>
          <p className="text-slate-700 leading-relaxed">{insights.growthEdge}</p>
        </Card>

        <Card className="border-l-4 border-blue-500">
          <h3 className="font-semibold text-slate-900 mb-3">Recommended Path</h3>
          <p className="text-slate-700 leading-relaxed">{insights.uniquePath}</p>
        </Card>
      </div>

      {/* Goal Context */}
      <Card>
        <h3 className="font-semibold text-slate-900 mb-4">Your Vision</h3>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-slate-500 mb-1">Future Vision</p>
            <p className="text-slate-700">{formData.futureVision || 'Continuing to grow as a designer'}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500 mb-1">Proud Accomplishment</p>
            <p className="text-slate-700">{formData.proudAccomplishment || 'Building my skills and experience'}</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
