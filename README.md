# � UX Designer Self-Assessment Form

A professional web-based self-assessment form for UX Designers with automatic Excel export functionality.

## ✨ Features

- **Personal Information**: Capture name, email, role, and experience level
- **Skills Assessment**: Rate proficiency across three key areas:
  - UX Research Skills (User Interviews, Usability Testing, Data Analysis, Research Planning)
  - Design Systems Skills (Component Libraries, Design Tokens, Documentation, Accessibility)
  - Leadership Skills (Team Mentoring, Project Management, Stakeholder Communication, Strategic Thinking)
- **Career Goals**: Capture short-term and long-term career aspirations
- **Growth Areas**: Identify areas for professional development
- **Learning Preferences**: Select preferred learning methods
- **Excel Export**: Automatically downloads responses as a formatted Excel file

## � Purpose

This form helps UX teams:
- ✅ Understand individual skill levels and growth areas
- ✅ Support career development conversations
- ✅ Identify training and mentorship opportunities
- ✅ Collect structured feedback for team planning

## � Journey Steps

### 1. Welcome Screen
- Introduction to the growth journey
- Clear messaging about purpose and intent
- Reassurance that this is not a performance review

### 2. Personal Information
- Name, email, and current role
- Sets context for personalized recommendations

### 3. Career Aspirations
- Where do you want your career to grow?
- Future vision (2-year outlook)
- Important growth areas (multi-select)

### 4. Learning Track Selection
- **Track A (Early Career)**: Fundamentals and execution
- **Track B (Experienced)**: Strategy, leadership, and business impact

### 5. Self Assessment (Gamified)
- Rate skills using levels: Explorer 🟢, Practitioner 🔵, Advanced 🟣, Expert 🟡
- Provide examples for each capability
- No traditional 1-5 ratings

### 6. Discover Your Superpowers
- Identify top 3 strengths
- What teammates value about you
- Recent accomplishments

### 7. Growth Opportunities
- Skills to improve (choose 3)
- Current growth limitations
- Preferred learning styles

### 8. Community Contribution
- Topics you could teach others
- Interest in mentoring or facilitating

### 9. Personal Commitment
- 6-month growth goal
- Why it matters to your career

### 10. Results Dashboard
- **Growth Snapshot**: Current track, aspirations, readiness
- **Top Strengths**: Achievement badges
- **Growth Opportunities**: Development focus areas
- **Recommended Learning Path**: Personalized suggestions
- **Career Roadmap**: Current → Next Milestone → Future
- **Potential Outcomes**: Encouraging summary
- **PDF Download**: Complete growth summary

## �🛠️ Tech Stack

- **React 18** - Modern UI library
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool
- **TailwindCSS** - Utility-first styling with custom color palette
- **Lucide React** - Beautiful, consistent icons
- **jsPDF** - PDF generation for growth summaries

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ and npm/yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## � How to Use

1. **Fill out the form**: Team members complete all required fields
2. **Submit**: Click "Submit & Download Excel" button
3. **Automatic Download**: An Excel file is automatically downloaded with all responses
4. **Collect Responses**: Gather all Excel files from team members
5. **Review**: Use the Excel files for career development discussions

## 📁 Project Structure

```
src/
├── components/
│   ├── SelfAssessmentForm.tsx  # Main form component
│   ├── Button.tsx              # Reusable button
│   └── Card.tsx                # Card container
├── lib/
│   └── utils.ts                # Utility functions
├── App.tsx                     # Main app component
├── main.tsx                    # Application entry point
└── index.css                   # Global styles
```

## 🎨 Color Palette

- **Growth Blue** - Primary actions and progress
- **Leadership Purple** - Leadership and mentoring
- **Progress Green** - Completed tasks and success
- **Achievement Gold** - Badges and accomplishments

## 🌟 Key Pages

### Welcome Page
### Phase 2 - Admin Dashboard
- Team competency heatmap
- Skill distribution charts
- Capability gap analysis
- Most requested learning topics
- Identify future mentors/champions
- Growth trends by role
- Workshop recommendation engine

### Phase 3 - Advanced Features
- Hero section with compelling messaging
- Feature highlightorgitudina trcking
- Progress trackl-gtiventogm
adreders
##I tegrDhbonrwithlanmanagemnt sysm
- Progress overview across competencies
- Quick staguate sspport
- Mobile app version

### Phase 4 - AI-Powered Insights
- AI-generated le rnina recommendations
- Personalized carenr pathd mggestions
- Skill gae tredictions
- Automated mentri macchings
- Recent achievements showcase
- Quick action buttons

### Skills Assessment
- Interactive skill selection
- Category-based organization
- Visual feedback on selections
- Personalized recommendations

### Growth Roadmap
- Visual timeline of milestones
- Progress tracking per milestone
- Task breakdowns
- Locked/unlocked progression

### Achievements
- Badge collection display
- Completion statistics
- Earned vs. locked achievements
- Motivational messaging

## 🌐 Deployment & Distribution

### Option 1: Deploy to Web Hosting
1. Build the production version: `npm run build`
2. Deploy the `dist` folder to any static hosting service:
   - Netlify
   - Vercel
   - GitHub Pages
   - Azure Static Web Apps
3. Share the URL with your team via email

### Option 2: Local Network
1. Run `npm run dev` on a local machine
2. Share the local network URL with team members on the same network
3. They can access and fill out the form

### Collecting Responses
- Each submission generates a unique Excel file
- File naming: `UX_Self_Assessment_[Name]_[Date].xlsx`
- Collect files via email or shared folder
- Consolidate responses for team analysis

## 🔮 Future Enhancements

- Backend integration for centralized data collection
- Database storage instead of Excel downloads
- Admin dashboard to view all responses
- Email notifications on submission
- Analytics and reporting features
- Integration with HR systems
- Multi-language support

## 📄 License

This project is proprietary and confidential.

## 🤝 Contributing

This is an internal enterprise application. For questions or contributions, please contact the development team.

---

**Built with ❤️ for UX professionals**
