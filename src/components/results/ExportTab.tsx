import { Download, Mail } from 'lucide-react'
import { GeneratedInsights } from '../../utils/insightGenerator'
import Card from '../Card'

interface ExportTabProps {
  formData: any
  insights: GeneratedInsights
}

export default function ExportTab({ formData, insights }: ExportTabProps) {
  const handleEmailManager = () => {
    const subject = encodeURIComponent(`Career Development - ${formData.name}`)
    const body = encodeURIComponent(`Hi,

I completed a career assessment. Here are my key takeaways:

Top Strength: ${insights.topStrengths[0]?.skill || 'N/A'}
Focus Area: ${insights.growthOpportunities[0]?.skill || 'N/A'}
6-Month Goal: ${formData.sixMonthGoal || 'N/A'}

I'd like to discuss this in our next 1-on-1.

Thanks,
${formData.name}`)

    window.location.href = `mailto:?subject=${subject}&body=${body}`
  }

  return (
    <div className="space-y-6">
      {/* Summary */}
      <Card>
        <h3 className="font-semibold text-slate-900 mb-4">Summary</h3>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-slate-500 mb-1">Top Strengths</p>
            <p className="text-slate-700">
              {insights.topStrengths.slice(0, 2).map(s => s.skill).join(', ')}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-500 mb-1">Focus Areas</p>
            <p className="text-slate-700">
              {insights.growthOpportunities.slice(0, 2).map(s => s.skill).join(', ')}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-500 mb-1">6-Month Goal</p>
            <p className="text-slate-700">{formData.sixMonthGoal || 'Continue growing'}</p>
          </div>
        </div>
      </Card>

      {/* Actions */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={handleEmailManager}>
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-growth-600" />
            <div>
              <h4 className="font-semibold text-slate-900">Email Manager</h4>
              <p className="text-sm text-slate-600">Share with your manager</p>
            </div>
          </div>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => window.print()}>
          <div className="flex items-center gap-3">
            <Download className="w-5 h-5 text-growth-600" />
            <div>
              <h4 className="font-semibold text-slate-900">Print Results</h4>
              <p className="text-sm text-slate-600">Save as PDF</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Motivational */}
      <Card className="bg-slate-50 text-center">
        <p className="text-slate-700 italic">{insights.motivationalQuote}</p>
      </Card>
    </div>
  )
}
