import { ExternalLink } from 'lucide-react'
import { GeneratedInsights } from '../../utils/insightGenerator'
import Card from '../Card'

interface LearnTabProps {
  insights: GeneratedInsights
}

export default function LearnTab({ insights }: LearnTabProps) {
  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'course': return '🎓'
      case 'book': return '📚'
      case 'article': return '📝'
      case 'tutorial': return '🎨'
      case 'tool': return '🔧'
      case 'community': return '👥'
      default: return '📖'
    }
  }

  // Group recommendations by skill
  const groupedResources: Record<string, typeof insights.recommendations> = {}
  insights.recommendations.forEach(resource => {
    // Extract skill from context (simplified - in real app would be more sophisticated)
    const skill = insights.growthOpportunities[0]?.skill || 'General'
    if (!groupedResources[skill]) {
      groupedResources[skill] = []
    }
    groupedResources[skill].push(resource)
  })

  return (
    <div className="space-y-6">
      {/* Learning Tips */}
      {insights.learningTips.length > 0 && (
        <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
          <h3 className="text-xl font-bold text-slate-800 mb-4">💡 Tips for Your Learning Style</h3>
          <div className="grid md:grid-cols-2 gap-3">
            {insights.learningTips.map((tip, index) => (
              <div key={index} className="flex items-start gap-2">
                <span className="text-purple-600 mt-0.5">•</span>
                <p className="text-sm text-slate-700">{tip}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Recommended Resources */}
      <div className="space-y-6">
        {Object.entries(groupedResources).map(([skill, resources]) => (
          <Card key={skill}>
            <h3 className="text-xl font-bold text-slate-800 mb-4">
              📚 Resources for {skill}
            </h3>
            <div className="space-y-3">
              {resources.map((resource, index) => (
                <div
                  key={index}
                  className="flex items-start justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">{getResourceIcon(resource.type)}</span>
                      <h4 className="font-semibold text-slate-800">{resource.title}</h4>
                      {resource.recommended && (
                        <span className="text-xs bg-growth-100 text-growth-700 px-2 py-0.5 rounded">
                          ⭐ Recommended
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <span className="capitalize">{resource.type}</span>
                      <span>•</span>
                      <span>{resource.provider}</span>
                      <span>•</span>
                      <span className={resource.free ? 'text-green-600 font-medium' : 'text-slate-600'}>
                        {resource.free ? 'Free' : 'Paid'}
                      </span>
                    </div>
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
              ))}
            </div>
          </Card>
        ))}
      </div>

      {/* Additional Resources */}
      <Card>
        <h3 className="text-xl font-bold text-slate-800 mb-4">🌐 Communities & Platforms</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 rounded-lg">
            <h4 className="font-semibold text-slate-800 mb-2">👥 Designer Hangout</h4>
            <p className="text-sm text-slate-600 mb-2">Large Slack community for UX professionals</p>
            <a
              href="https://www.designerhangout.co/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-growth-600 hover:text-growth-700 text-sm font-medium inline-flex items-center gap-1"
            >
              Join Community <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          
          <div className="p-4 bg-slate-50 rounded-lg">
            <h4 className="font-semibold text-slate-800 mb-2">🎓 Interaction Design Foundation</h4>
            <p className="text-sm text-slate-600 mb-2">Courses and community for designers</p>
            <a
              href="https://www.interaction-design.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-growth-600 hover:text-growth-700 text-sm font-medium inline-flex items-center gap-1"
            >
              Explore Courses <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          
          <div className="p-4 bg-slate-50 rounded-lg">
            <h4 className="font-semibold text-slate-800 mb-2">💬 ADPList</h4>
            <p className="text-sm text-slate-600 mb-2">Free mentorship platform for designers</p>
            <a
              href="https://adplist.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-growth-600 hover:text-growth-700 text-sm font-medium inline-flex items-center gap-1"
            >
              Find a Mentor <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          
          <div className="p-4 bg-slate-50 rounded-lg">
            <h4 className="font-semibold text-slate-800 mb-2">📖 UX Mastery Community</h4>
            <p className="text-sm text-slate-600 mb-2">Supportive community for UX learners</p>
            <a
              href="https://community.uxmastery.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-growth-600 hover:text-growth-700 text-sm font-medium inline-flex items-center gap-1"
            >
              Join Forum <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </Card>
    </div>
  )
}
