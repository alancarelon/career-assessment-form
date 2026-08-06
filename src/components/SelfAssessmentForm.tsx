import { useState } from 'react'
import { Download, CheckCircle2, Rocket } from 'lucide-react'
import * as XLSX from 'xlsx'
import Button from './Button'
import Card from './Card'

interface FormData {
  // Personal Information
  name: string
  email: string
  currentRole: string
  yearsOfExperience: string
  
  // Skills Assessment (1-5 rating)
  uxResearchSkills: {
    userInterviews: number
    usabilityTesting: number
    dataAnalysis: number
    researchPlanning: number
  }
  designSystemsSkills: {
    componentLibraries: number
    designTokens: number
    documentation: number
    accessibility: number
  }
  leadershipSkills: {
    teamMentoring: number
    projectManagement: number
    stakeholderCommunication: number
    strategicThinking: number
  }
  
  // Career Goals
  shortTermGoals: string
  longTermGoals: string
  areasForGrowth: string
  learningPreferences: string[]
  
  // Additional Comments
  additionalComments: string
}

const initialFormData: FormData = {
  name: '',
  email: '',
  currentRole: '',
  yearsOfExperience: '',
  uxResearchSkills: {
    userInterviews: 0,
    usabilityTesting: 0,
    dataAnalysis: 0,
    researchPlanning: 0,
  },
  designSystemsSkills: {
    componentLibraries: 0,
    designTokens: 0,
    documentation: 0,
    accessibility: 0,
  },
  leadershipSkills: {
    teamMentoring: 0,
    projectManagement: 0,
    stakeholderCommunication: 0,
    strategicThinking: 0,
  },
  shortTermGoals: '',
  longTermGoals: '',
  areasForGrowth: '',
  learningPreferences: [],
  additionalComments: '',
}

const learningOptions = [
  'Online Courses',
  'Workshops',
  'Mentorship',
  'Books/Articles',
  'Conferences',
  'Hands-on Projects',
]

export default function SelfAssessmentForm() {
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [submitted, setSubmitted] = useState(false)

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSkillRating = (category: keyof FormData, skill: string, rating: number) => {
    setFormData((prev) => ({
      ...prev,
      [category]: {
        ...(prev[category] as any),
        [skill]: rating,
      },
    }))
  }

  const handleLearningPreference = (option: string) => {
    setFormData((prev) => ({
      ...prev,
      learningPreferences: prev.learningPreferences.includes(option)
        ? prev.learningPreferences.filter((p) => p !== option)
        : [...prev.learningPreferences, option],
    }))
  }

  const exportToExcel = () => {
    const data = [
      ['UX Designer Self-Assessment Form'],
      ['Submitted on:', new Date().toLocaleString()],
      [''],
      ['PERSONAL INFORMATION'],
      ['Name', formData.name],
      ['Email', formData.email],
      ['Current Role', formData.currentRole],
      ['Years of Experience', formData.yearsOfExperience],
      [''],
      ['UX RESEARCH SKILLS (1-5)'],
      ['User Interviews', formData.uxResearchSkills.userInterviews],
      ['Usability Testing', formData.uxResearchSkills.usabilityTesting],
      ['Data Analysis', formData.uxResearchSkills.dataAnalysis],
      ['Research Planning', formData.uxResearchSkills.researchPlanning],
      [''],
      ['DESIGN SYSTEMS SKILLS (1-5)'],
      ['Component Libraries', formData.designSystemsSkills.componentLibraries],
      ['Design Tokens', formData.designSystemsSkills.designTokens],
      ['Documentation', formData.designSystemsSkills.documentation],
      ['Accessibility Standards', formData.designSystemsSkills.accessibility],
      [''],
      ['LEADERSHIP SKILLS (1-5)'],
      ['Team Mentoring', formData.leadershipSkills.teamMentoring],
      ['Project Management', formData.leadershipSkills.projectManagement],
      ['Stakeholder Communication', formData.leadershipSkills.stakeholderCommunication],
      ['Strategic Thinking', formData.leadershipSkills.strategicThinking],
      [''],
      ['CAREER GOALS'],
      ['Short-term Goals (6-12 months)', formData.shortTermGoals],
      ['Long-term Goals (2-5 years)', formData.longTermGoals],
      ['Areas for Growth', formData.areasForGrowth],
      ['Learning Preferences', formData.learningPreferences.join(', ')],
      [''],
      ['ADDITIONAL COMMENTS'],
      [formData.additionalComments],
    ]

    const ws = XLSX.utils.aoa_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Self Assessment')

    // Set column widths
    ws['!cols'] = [{ wch: 30 }, { wch: 50 }]

    const fileName = `UX_Self_Assessment_${formData.name.replace(/\s+/g, '_')}_${
      new Date().toISOString().split('T')[0]
    }.xlsx`
    XLSX.writeFile(wb, fileName)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    exportToExcel()
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setFormData(initialFormData)
    }, 3000)
  }

  const RatingScale = ({ value, onChange }: { value: number; onChange: (rating: number) => void }) => (
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map((rating) => (
        <button
          key={rating}
          type="button"
          onClick={() => onChange(rating)}
          className={`w-10 h-10 rounded-lg font-semibold transition-all ${
            value === rating
              ? 'bg-growth-600 text-white scale-110'
              : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
          }`}
        >
          {rating}
        </button>
      ))}
    </div>
  )

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <Card className="max-w-md text-center">
          <div className="w-16 h-16 bg-progress-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-10 h-10 text-progress-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Thank You!</h2>
          <p className="text-slate-600">
            Your self-assessment has been downloaded successfully. The form will reset shortly.
          </p>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Rocket className="w-10 h-10 text-growth-600" />
            <h1 className="text-4xl font-bold gradient-text">UX Designer Self-Assessment</h1>
          </div>
          <p className="text-lg text-slate-600">
            Help us understand your skills, goals, and growth areas to support your career development
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information */}
          <Card>
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Personal Information</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 focus:border-growth-500 focus:outline-none transition-colors"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 focus:border-growth-500 focus:outline-none transition-colors"
                  placeholder="john.doe@company.com"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Current Role <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.currentRole}
                  onChange={(e) => handleInputChange('currentRole', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 focus:border-growth-500 focus:outline-none transition-colors"
                  placeholder="Senior UX Designer"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Years of Experience <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.yearsOfExperience}
                  onChange={(e) => handleInputChange('yearsOfExperience', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 focus:border-growth-500 focus:outline-none transition-colors"
                >
                  <option value="">Select...</option>
                  <option value="0-2">0-2 years</option>
                  <option value="3-5">3-5 years</option>
                  <option value="6-10">6-10 years</option>
                  <option value="10+">10+ years</option>
                </select>
              </div>
            </div>
          </Card>

          {/* UX Research Skills */}
          <Card>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">UX Research Skills</h2>
            <p className="text-sm text-slate-600 mb-6">Rate your proficiency (1 = Beginner, 5 = Expert)</p>
            <div className="space-y-6">
              {[
                { key: 'userInterviews', label: 'User Interviews' },
                { key: 'usabilityTesting', label: 'Usability Testing' },
                { key: 'dataAnalysis', label: 'Data Analysis' },
                { key: 'researchPlanning', label: 'Research Planning' },
              ].map(({ key, label }) => (
                <div key={key} className="flex items-center justify-between">
                  <label className="text-slate-700 font-medium">{label}</label>
                  <RatingScale
                    value={formData.uxResearchSkills[key as keyof typeof formData.uxResearchSkills]}
                    onChange={(rating) => handleSkillRating('uxResearchSkills', key, rating)}
                  />
                </div>
              ))}
            </div>
          </Card>

          {/* Design Systems Skills */}
          <Card>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Design Systems Skills</h2>
            <p className="text-sm text-slate-600 mb-6">Rate your proficiency (1 = Beginner, 5 = Expert)</p>
            <div className="space-y-6">
              {[
                { key: 'componentLibraries', label: 'Component Libraries' },
                { key: 'designTokens', label: 'Design Tokens' },
                { key: 'documentation', label: 'Documentation' },
                { key: 'accessibility', label: 'Accessibility Standards' },
              ].map(({ key, label }) => (
                <div key={key} className="flex items-center justify-between">
                  <label className="text-slate-700 font-medium">{label}</label>
                  <RatingScale
                    value={formData.designSystemsSkills[key as keyof typeof formData.designSystemsSkills]}
                    onChange={(rating) => handleSkillRating('designSystemsSkills', key, rating)}
                  />
                </div>
              ))}
            </div>
          </Card>

          {/* Leadership Skills */}
          <Card>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Leadership Skills</h2>
            <p className="text-sm text-slate-600 mb-6">Rate your proficiency (1 = Beginner, 5 = Expert)</p>
            <div className="space-y-6">
              {[
                { key: 'teamMentoring', label: 'Team Mentoring' },
                { key: 'projectManagement', label: 'Project Management' },
                { key: 'stakeholderCommunication', label: 'Stakeholder Communication' },
                { key: 'strategicThinking', label: 'Strategic Thinking' },
              ].map(({ key, label }) => (
                <div key={key} className="flex items-center justify-between">
                  <label className="text-slate-700 font-medium">{label}</label>
                  <RatingScale
                    value={formData.leadershipSkills[key as keyof typeof formData.leadershipSkills]}
                    onChange={(rating) => handleSkillRating('leadershipSkills', key, rating)}
                  />
                </div>
              ))}
            </div>
          </Card>

          {/* Career Goals */}
          <Card>
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Career Goals & Development</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Short-term Goals (6-12 months) <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  value={formData.shortTermGoals}
                  onChange={(e) => handleInputChange('shortTermGoals', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 focus:border-growth-500 focus:outline-none transition-colors"
                  placeholder="What do you want to achieve in the next 6-12 months?"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Long-term Goals (2-5 years) <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  value={formData.longTermGoals}
                  onChange={(e) => handleInputChange('longTermGoals', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 focus:border-growth-500 focus:outline-none transition-colors"
                  placeholder="Where do you see yourself in 2-5 years?"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Areas for Growth <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  value={formData.areasForGrowth}
                  onChange={(e) => handleInputChange('areasForGrowth', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 focus:border-growth-500 focus:outline-none transition-colors"
                  placeholder="What skills or areas would you like to develop?"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Preferred Learning Methods (Select all that apply)
                </label>
                <div className="grid md:grid-cols-2 gap-3">
                  {learningOptions.map((option) => (
                    <label
                      key={option}
                      className="flex items-center gap-3 p-3 rounded-lg border-2 border-slate-200 hover:border-growth-300 cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={formData.learningPreferences.includes(option)}
                        onChange={() => handleLearningPreference(option)}
                        className="w-5 h-5 text-growth-600 rounded focus:ring-growth-500"
                      />
                      <span className="text-slate-700">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Additional Comments */}
          <Card>
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Additional Comments</h2>
            <textarea
              value={formData.additionalComments}
              onChange={(e) => handleInputChange('additionalComments', e.target.value)}
              rows={4}
              className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 focus:border-growth-500 focus:outline-none transition-colors"
              placeholder="Any additional thoughts, feedback, or information you'd like to share..."
            />
          </Card>

          {/* Submit Button */}
          <div className="flex justify-center">
            <Button type="submit" size="lg" className="min-w-[300px]">
              <Download className="w-5 h-5 mr-2" />
              Submit & Download Excel
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
