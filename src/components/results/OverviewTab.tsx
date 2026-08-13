import { TrendingUp, TrendingDown, Target } from 'lucide-react'
import { GeneratedInsights } from '../../utils/insightGenerator'
import Card from '../Card'

interface OverviewTabProps {
  formData: any
  insights: GeneratedInsights
}

export default function OverviewTab({ formData, insights }: OverviewTabProps) {
  return (
    <div className="space-y-8">
      {/* Key Insights - Single Row */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Strengths */}
        <Card className="border-l-4 border-green-500">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <h3 className="font-semibold text-slate-900">Top Strengths</h3>
          </div>
          <div className="space-y-3">
            {insights.topStrengths.slice(0, 3).map((strength, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-slate-700">{strength.skill}</span>
                <span className="font-semibold text-green-600">{strength.rating}/5</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Growth Areas */}
        <Card className="border-l-4 border-orange-500">
          <div className="flex items-center gap-2 mb-4">
            <TrendingDown className="w-5 h-5 text-orange-600" />
            <h3 className="font-semibold text-slate-900">Focus Areas</h3>
          </div>
          <div className="space-y-3">
            {insights.growthOpportunities.slice(0, 3).map((opportunity, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-slate-700">{opportunity.skill}</span>
                <span className="font-semibold text-orange-600">{opportunity.rating}/5</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Goal */}
        <Card className="border-l-4 border-blue-500">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-slate-900">6-Month Goal</h3>
          </div>
          <p className="text-slate-700 leading-relaxed">
            {formData.sixMonthGoal || 'Continue growing as a designer'}
          </p>
        </Card>
      </div>

      {/* Key Insight */}
      <Card className="bg-gradient-to-r from-growth-50 to-blue-50 border-growth-200">
        <div className="flex items-start gap-4">
          <div className="text-3xl">�</div>
          <div>
            <h3 className="font-semibold text-slate-900 mb-2">Key Insight</h3>
            <p className="text-slate-700 leading-relaxed">{insights.uniquePath}</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
