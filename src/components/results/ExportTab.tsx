import { Download, Mail, RefreshCw } from 'lucide-react'
import { GeneratedInsights } from '../../utils/insightGenerator'
import Card from '../Card'
import Button from '../Button'

interface ExportTabProps {
  formData: any
  insights: GeneratedInsights
}

export default function ExportTab({ formData, insights }: ExportTabProps) {
  const handleDownloadPDF = () => {
    // TODO: Implement PDF generation
    alert('PDF download feature coming soon!')
  }

  const handleEmailManager = () => {
    const subject = encodeURIComponent(`Career Development Assessment - ${formData.name}`)
    const body = encodeURIComponent(`Hi,

I recently completed a UX career assessment and wanted to share my results with you for our next 1-on-1.

Key Highlights:
• Top Strength: ${insights.topStrengths[0]?.skill || 'N/A'}
• Growth Focus: ${insights.growthOpportunities[0]?.skill || 'N/A'}
• 6-Month Goal: ${formData.sixMonthGoal || 'N/A'}

I'd love to discuss how I can work on these areas and how you can support my growth.

Best regards,
${formData.name}`)

    window.location.href = `mailto:?subject=${subject}&body=${body}`
  }

  return (
    <div className="space-y-6">
      {/* Download PDF */}
      <Card>
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-growth-100 flex items-center justify-center flex-shrink-0">
            <Download className="w-6 h-6 text-growth-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-slate-800 mb-2">📄 Download PDF Report</h3>
            <p className="text-slate-600 mb-4">
              Get a beautifully formatted PDF with all your insights, skills analysis, and personalized action plan.
            </p>
            <Button onClick={handleDownloadPDF}>
              <Download className="w-4 h-4 mr-2" />
              Download PDF Report
            </Button>
          </div>
        </div>
      </Card>

      {/* Email to Manager */}
      <Card>
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
            <Mail className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-slate-800 mb-2">📧 Email to Manager</h3>
            <p className="text-slate-600 mb-4">
              Share a summary with your manager for your next 1-on-1 discussion. This helps align your growth goals with team objectives.
            </p>
            <Button onClick={handleEmailManager} variant="outline">
              <Mail className="w-4 h-4 mr-2" />
              Compose Email
            </Button>
          </div>
        </div>
      </Card>

      {/* Retake Assessment */}
      <Card>
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
            <RefreshCw className="w-6 h-6 text-purple-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-slate-800 mb-2">🔄 Track Your Progress</h3>
            <p className="text-slate-600 mb-4">
              Come back in 3-6 months to retake the assessment and see how you've grown. Tracking progress is key to continuous improvement.
            </p>
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Retake Assessment
            </Button>
          </div>
        </div>
      </Card>

      {/* Summary Card */}
      <Card className="bg-gradient-to-br from-growth-50 to-blue-50 border-growth-200">
        <h3 className="text-xl font-bold text-slate-800 mb-4">📊 Your Assessment Summary</h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-slate-700 mb-2">💪 Top Strengths</h4>
            <ul className="space-y-1">
              {insights.topStrengths.map((strength, index) => (
                <li key={index} className="text-sm text-slate-600">
                  • {strength.skill} ({strength.rating}/5)
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-slate-700 mb-2">🌱 Growth Areas</h4>
            <ul className="space-y-1">
              {insights.growthOpportunities.map((opportunity, index) => (
                <li key={index} className="text-sm text-slate-600">
                  • {opportunity.skill} ({opportunity.rating}/5)
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-slate-200">
          <h4 className="font-semibold text-slate-700 mb-2">🎯 Your Goal</h4>
          <p className="text-slate-700 italic">"{formData.sixMonthGoal || 'Continue growing as a designer'}"</p>
        </div>

        <div className="mt-6 pt-6 border-t border-slate-200">
          <h4 className="font-semibold text-slate-700 mb-2">📚 Recommended Resources</h4>
          <p className="text-sm text-slate-600">
            {insights.recommendations.length} curated resources based on your growth areas
          </p>
        </div>
      </Card>

      {/* Motivational Close */}
      <Card className="text-center bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
        <div className="text-4xl mb-4">✨</div>
        <p className="text-xl text-slate-800 italic mb-2">
          "{insights.motivationalQuote}"
        </p>
        <p className="text-sm text-slate-600 mt-4">
          Your responses have been saved. Come back anytime to review your personalized plan.
        </p>
      </Card>
    </div>
  )
}
