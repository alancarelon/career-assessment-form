import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from 'recharts'
import { GeneratedInsights } from '../../utils/insightGenerator'
import Card from '../Card'

interface OverviewTabProps {
  formData: any
  insights: GeneratedInsights
}

export default function OverviewTab({ formData, insights }: OverviewTabProps) {
  // Prepare radar chart data
  const radarData = Object.entries(formData.skillRatings || {}).map(([skill, data]: [string, any]) => ({
    skill: skill.length > 15 ? skill.substring(0, 15) + '...' : skill,
    rating: data.rating
  }))

  return (
    <div className="space-y-6">
      {/* Skills Visualization */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Radar Chart */}
        <Card>
          <h3 className="text-xl font-bold text-slate-800 mb-4">📊 Skills at a Glance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="skill" />
              <PolarRadiusAxis angle={90} domain={[0, 5]} />
              <Radar
                name="Rating"
                dataKey="rating"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.6}
              />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
          <div className="mt-4 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span>Strong (4-5)</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span>Developing (3)</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-3 h-3 rounded-full bg-orange-500"></div>
              <span>Growth Area (1-2)</span>
            </div>
          </div>
        </Card>

        {/* Top Strengths */}
        <Card>
          <h3 className="text-xl font-bold text-slate-800 mb-4">💪 Your Top Strengths</h3>
          <div className="space-y-4">
            {insights.topStrengths.map((strength, index) => (
              <div key={index}>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium text-slate-700">{index + 1}. {strength.skill}</span>
                  <span className="text-sm text-slate-600">{strength.rating}/5</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all"
                    style={{ width: `${(strength.rating / 5) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Growth Areas and Goal */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Growth Areas */}
        <Card>
          <h3 className="text-xl font-bold text-slate-800 mb-4">🌱 Growth Opportunities</h3>
          <div className="space-y-4">
            {insights.growthOpportunities.map((opportunity, index) => (
              <div key={index}>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium text-slate-700">{index + 1}. {opportunity.skill}</span>
                  <span className="text-sm text-slate-600">{opportunity.rating}/5</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-orange-500 h-2 rounded-full transition-all"
                    style={{ width: `${(opportunity.rating / 5) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Your Goal */}
        <Card>
          <h3 className="text-xl font-bold text-slate-800 mb-4">🎯 Your 6-Month Goal</h3>
          <div className="bg-gradient-to-br from-growth-50 to-blue-50 rounded-lg p-6">
            <p className="text-lg text-slate-800 italic">
              "{formData.sixMonthGoal || 'Not specified'}"
            </p>
            <div className="mt-4 pt-4 border-t border-slate-200">
              <p className="text-sm font-medium text-slate-700">📅 Timeline: 6 months</p>
              <p className="text-sm text-slate-600 mt-2">
                ✅ This goal aligns with your current strengths and growth areas
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
