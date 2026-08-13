import { ExternalLink } from 'lucide-react'
import { GeneratedInsights } from '../../utils/insightGenerator'
import Card from '../Card'

interface LearnTabProps {
  insights: GeneratedInsights
}

export default function LearnTab({ insights }: LearnTabProps) {
  return (
    <div className="space-y-8">
      {/* Top Recommendations */}
      <div>
        <h3 className="font-semibold text-slate-900 mb-4">Recommended Resources</h3>
        <div className="space-y-3">
          {insights.recommendations.slice(0, 3).map((resource, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-slate-900">{resource.title}</h4>
                    {resource.free && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                        Free
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-600">
                    {resource.provider} • {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
                  </p>
                </div>
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-4 flex items-center gap-1 text-growth-600 hover:text-growth-700 font-medium text-sm whitespace-nowrap"
                >
                  View
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Learning Tips */}
      {insights.learningTips.length > 0 && (
        <Card className="bg-slate-50">
          <h3 className="font-semibold text-slate-900 mb-3">Tips for Your Learning Style</h3>
          <ul className="space-y-2">
            {insights.learningTips.slice(0, 3).map((tip, index) => (
              <li key={index} className="text-slate-700 flex items-start gap-2">
                <span className="text-growth-600 mt-1">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  )
}
