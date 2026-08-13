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
      {/* Hero Section - Clean & Professional */}
      <div className="bg-white border-b border-slate-200 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-1">
                {formData.name}
              </h1>
              <p className="text-slate-600">
                {formData.currentRole} • Assessed {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-growth-600">{insights.avgRating}</div>
              <div className="text-sm text-slate-500">Overall Rating</div>
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
