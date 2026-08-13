import { useState } from 'react'
import { BarChart3, Lightbulb, BookOpen, Map, Download } from 'lucide-react'
import { GeneratedInsights } from '../../utils/insightGenerator'
import OverviewTab from './OverviewTab'
import InsightsTab from './InsightsTab'
import LearnTab from './LearnTab'
import RoadmapTab from './RoadmapTab'
import ExportTab from './ExportTab'

interface ResultsDashboardProps {
  formData: any
  insights: GeneratedInsights
}

type TabType = 'overview' | 'insights' | 'learn' | 'roadmap' | 'export'

export default function ResultsDashboard({ formData, insights }: ResultsDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>('overview')

  const tabs = [
    { id: 'overview' as TabType, label: 'Overview', icon: BarChart3 },
    { id: 'insights' as TabType, label: 'Insights', icon: Lightbulb },
    { id: 'learn' as TabType, label: 'Learn', icon: BookOpen },
    { id: 'roadmap' as TabType, label: 'Roadmap', icon: Map },
    { id: 'export' as TabType, label: 'Export', icon: Download }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-growth-50 via-white to-blue-50">
      {/* Hero Section - Always Visible */}
      <div className="bg-gradient-to-r from-growth-600 to-blue-600 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            ✨ Your UX Growth Story, {formData.name}
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-6">
            {insights.roleMessage}
          </p>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
              <div className="text-3xl font-bold">{insights.avgRating}/5</div>
              <div className="text-sm text-white/80">Avg Skill Rating</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
              <div className="text-3xl font-bold">{insights.topStrengths.length}</div>
              <div className="text-sm text-white/80">Top Strengths</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
              <div className="text-3xl font-bold">{insights.growthOpportunities.length}</div>
              <div className="text-sm text-white/80">Focus Areas</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex space-x-1 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-2 px-6 py-4 font-medium transition-colors whitespace-nowrap
                    ${activeTab === tab.id
                      ? 'text-growth-600 border-b-2 border-growth-600'
                      : 'text-slate-600 hover:text-slate-900'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {activeTab === 'overview' && <OverviewTab formData={formData} insights={insights} />}
        {activeTab === 'insights' && <InsightsTab formData={formData} insights={insights} />}
        {activeTab === 'learn' && <LearnTab insights={insights} />}
        {activeTab === 'roadmap' && <RoadmapTab formData={formData} insights={insights} />}
        {activeTab === 'export' && <ExportTab formData={formData} insights={insights} />}
      </div>
    </div>
  )
}
