export interface SkillWithRating {
  name: string
  idealRating: number // Expected rating for this role (1-5)
}

export interface MultiSelectQuestion {
  question: string
  options: string[]
}

export interface RoleQuestion {
  skillCategories: Array<{
    category: string
    description: string
    skills: Array<string | SkillWithRating> // Can be simple string or object with ideal rating
    isScored?: boolean // If false, this category won't contribute to XP (default: true)
    questionType?: 'rating' | 'multiselect' // Type of question (default: 'rating')
    multiSelectQuestions?: MultiSelectQuestion[] // For multiselect type categories
  }>
  careerOptions: string[]
  futureVisionOptions: string[]
  growthAreasOptions: string[]
  strengthsOptions: string[]
  growthLimitsOptions: string[]
  learningStyleOptions: string[]
  customQuestions?: {
    superpowers?: {
      strengthsPrompt?: string
      teammatesFeedbackPrompt?: string
      proudAccomplishmentPrompt?: string
    }
    growth?: {
      skillsToImprovePrompt?: string
      growthLimitsPrompt?: string
      learningStylePrompt?: string
    }
    community?: {
      teachingTopicPrompt?: string
      mentorInterestPrompt?: string
    }
    careerVision?: {
      careerGrowthPrompt?: string
      futureVisionPrompt?: string
      growthAreasPrompt?: string
    }
  }
}

export const roleBasedQuestions: Record<string, RoleQuestion> = {
  "Associate UX Designer": {
    skillCategories: [
      {
        category: "Problem Discovery & Product Understanding",
        description: "Understanding user needs, business goals, and product context to inform design decisions.",
        skills: [
          { name: "Before starting design work, how effectively do you define the user problem, business objective, and success criteria?", idealRating: 3 },
          { name: "How consistently do you create discovery briefs, problem statements, or design intent documentation before beginning design work?", idealRating: 3 },
          { name: "How often are your design decisions linked to research findings, business goals, constraints, or metrics?", idealRating: 3 },
          { name: "How comfortable are you facilitating alignment discussions with Product Managers and Engineers before moving into design?", idealRating: 3 }
        ]
      },
      {
        category: "UX Research and Validation",
        description: "Conducting research to understand users and validate design solutions.",
        skills: [
          { name: "How confident are you planning and conducting usability testing or evaluative research?", idealRating: 3 },
          { name: "How effectively do you identify actionable insights from user feedback?", idealRating: 3 },
          { name: "How frequently do research findings influence design changes in your projects?", idealRating: 3 },
          { name: "How comfortable are you measuring UX improvements using qualitative or quantitative evidence?", idealRating: 2 }
        ]
      },
      {
        category: "Design Execution and Craft",
        description: "Creating high-quality design deliverables with attention to detail and user experience.",
        skills: [
          { name: "How effectively do you translate requirements into flows, wireframes, and high-fidelity designs?", idealRating: 3 },
          { name: "How confident are you designing solutions that balance business needs, user needs, and technical constraints?", idealRating: 3 },
          { name: "How effectively do you create interactive prototypes to communicate ideas and validate concepts?", idealRating: 3 },
          { name: "How comfortable are you receiving feedback and iterating on designs?", idealRating: 4 }
        ]
      },
      {
        category: "AI and Design Integration",
        description: "Leveraging AI tools and designing AI-powered experiences.",
        skills: [
          { name: "How actively do you use AI tools to support your UX workflow?", idealRating: 3 },
          { name: "How effectively do you use AI to accelerate activities such as research synthesis, content creation, documentation, or ideation?", idealRating: 3 },
          { name: "How confident are you identifying opportunities where AI can improve the user experience or design process?", idealRating: 2 },
          { name: "How effectively have you demonstrated measurable productivity gains using AI-enabled workflows?", idealRating: 2 }
        ]
      },
      {
        category: "Design System and Consistency",
        description: "Using and contributing to design systems to ensure consistency across products.",
        skills: [
          { name: "How consistently do you use approved Design System components and patterns?", idealRating: 4 },
          { name: "How often do you review existing patterns before creating new components?", idealRating: 4 },
          { name: "How well do you understand accessibility and consistency guidelines within the Design System?", idealRating: 3 },
          { name: "How actively do you contribute feedback or improvements to Design System assets?", idealRating: 2 }
        ]
      },
      {
        category: "Documentation and Knowledge Sharing",
        description: "Creating clear documentation and sharing knowledge with the team.",
        skills: [
          { name: "How consistently do you create complete documentation to support design handoffs?", idealRating: 4 },
          { name: "How clearly do your documentation artifacts communicate design intent, decisions, and requirements?", idealRating: 3 },
          { name: "How effectively do you maintain artifacts such as FigJam boards, process flows, and supporting documentation?", idealRating: 3 },
          { name: "How easy would it be for another designer or engineer to continue your work using your documentation?", idealRating: 4 }
        ]
      },
      {
        category: "Collaboration and Stakeholder Management",
        description: "Working effectively with cross-functional teams and managing stakeholder expectations.",
        skills: [
          { name: "How comfortable are you presenting your work to Product Managers, Engineers, and UX Leads?", idealRating: 3 },
          { name: "How proactively do you engage key stakeholders throughout the design process?", idealRating: 3 },
          { name: "How effectively do you incorporate cross-functional feedback into your design decisions?", idealRating: 3 },
          { name: "How comfortable are you co-facilitating workshops, discovery sessions, or readouts?", idealRating: 2 },
          { name: "How consistently do you communicate project updates through Teams, channels, or project forums?", idealRating: 4 }
        ]
      },
      {
        category: "Professional Growth and Community Contribution",
        description: "Continuous learning and contributing to the design community.",
        skills: [
          { name: "How actively do you invest in developing new UX skills and knowledge?", idealRating: 4 },
          { name: "How comfortable are you sharing knowledge through presentations, demos, or learning sessions?", idealRating: 2 },
          { name: "How often do you apply learning from courses, workshops, or coaching sessions to real project work?", idealRating: 3 },
          { name: "How prepared do you feel for your next career step?", idealRating: 3 }
        ]
      },
      {
        category: "Career Aspirations (Non Scored)",
        description: "Your career goals and future vision.",
        skills: [],
        isScored: false,
        questionType: 'multiselect',
        multiSelectQuestions: [
          {
            question: "What role would you like to grow into over the next 2 years?",
            options: [
              "Senior UX Designer",
              "UX Researcher",
              "Lead design projects",
              "Specialize in research",
              "Build design systems expertise",
              "Move into management"
            ]
          },
          {
            question: "Which areas would you like support in?",
            options: [
              "Mentorship",
              "Strategy",
              "Research",
              "Facilitation",
              "Prototyping",
              "Communication",
              "AI",
              "Accessibility",
              "Stakeholder Management",
              "Design Systems"
            ]
          }
        ]
      }
    ],
    careerOptions: [
      "UX Designer",
      "Senior UX Designer",
      "UX Specialist",
      "Not Sure Yet"
    ],
    futureVisionOptions: [
      "Growing into my next role",
      "Becoming a domain expert",
      "Leading projects",
      "Driving product strategy"
    ],
    growthAreasOptions: [
      "Research",
      "Strategy",
      "Communication",
      "Accessibility",
      "AI for Design",
      "Business Acumen",
      "Stakeholder Management",
      "Design Systems",
      "Product Thinking"
    ],
    strengthsOptions: [
      "User Research",
      "Visual Design",
      "Interaction Design",
      "Communication",
      "Storytelling",
      "Facilitation",
      "Accessibility",
      "Systems Thinking",
      "Problem Solving"
    ],
    growthLimitsOptions: [
      "Need more experience",
      "Need coaching",
      "Need mentorship",
      "Need project exposure",
      "Need structured learning",
      "Need confidence",
      "Time constraints"
    ],
    learningStyleOptions: [
      "Workshops",
      "Mentorship",
      "Peer Learning",
      "Online Courses",
      "Self Learning",
      "Hands-on Projects",
      "Shadowing"
    ]
  },
  
  "UX Designer": {
    skillCategories: [
      {
        category: "Problem Discovery & Product Understanding",
        description: "Understanding user needs, business goals, and product context to inform design decisions.",
        skills: [
          { name: "How effectively do you define and document the problem statement, user needs, business goals, risks, and success metrics before beginning design work?", idealRating: 4 },
          { name: "How consistently do you create discovery briefs before moving into wireframes or solutioning?", idealRating: 4 },
          { name: "How effectively do you identify dependencies, constraints, and risks that may impact design outcomes?", idealRating: 4 },
          { name: "How often do you facilitate alignment activities with PMs, Engineers, or Stakeholders before finalizing design direction?", idealRating: 4 },
          { name: "How consistently are your design decisions traceable to research findings, business goals, constraints, or metrics?", idealRating: 4 }
        ]
      },
      {
        category: "UX Research and Validation",
        description: "Conducting research to understand users and validate design solutions.",
        skills: [
          { name: "How confident are you in independently planning and executing usability studies or evaluative research?", idealRating: 4 },
          { name: "How effectively do you synthesize findings into actionable design recommendations?", idealRating: 4 },
          { name: "How frequently do research findings directly influence your design decisions?", idealRating: 4 },
          { name: "How confident are you in prioritizing and communicating research insights to stakeholders?", idealRating: 4 },
          { name: "How effectively do you measure and demonstrate improvements in user experience after design changes?", idealRating: 4 },
          { name: "How comfortable are you selecting appropriate research methods based on project goals?", idealRating: 4 }
        ]
      },
      {
        category: "Design Execution and Product Thinking",
        description: "Creating high-quality design deliverables with attention to detail and user experience.",
        skills: [
          { name: "How effectively do you translate complex requirements into end-to-end user journeys and solutions?", idealRating: 4 },
          { name: "How well do you balance user needs, business goals, and technical constraints in your designs?", idealRating: 4 },
          { name: "How effectively do you use prototyping to validate concepts and communicate design intent?", idealRating: 4 },
          { name: "How frequently do you explore multiple solution approaches before committing to a final direction?", idealRating: 4 },
          { name: "How comfortable are you defending design decisions using evidence and reasoning?", idealRating: 4 }
        ]
      },
      {
        category: "AI and Design Integration",
        description: "Leveraging AI tools and designing AI-powered experiences.",
        skills: [
          { name: "How frequently do you use AI tools to improve your design workflow?", idealRating: 4 },
          { name: "How effectively do you use AI for activities such as research synthesis, ideation, documentation, content generation, or prototyping?", idealRating: 4 },
          { name: "How confident are you identifying opportunities to integrate AI within product experiences?", idealRating: 4 },
          { name: "How effectively have AI tools helped reduce effort or improve efficiency in your work?", idealRating: 4 },
          { name: "How often do you share AI learnings, workflows, or best practices with your team?", idealRating: 4 }
        ]
      },
      {
        category: "Design System and Consistency",
        description: "Using and contributing to design systems to ensure consistency across products.",
        skills: [
          { name: "How consistently do you use approved Design System patterns and components?", idealRating: 4 },
          { name: "How frequently do you validate your designs against accessibility and usability standards?", idealRating: 4 },
          { name: "How often do you identify and raise design system gaps, inconsistencies, or improvement opportunities?", idealRating: 4 },
          { name: "How effectively do you advocate for reusable patterns over custom solutions?", idealRating: 4 }
        ]
      },
      {
        category: "Documentation and Knowledge Sharing",
        description: "Creating clear documentation and sharing knowledge with the team.",
        skills: [
          { name: "How consistently do your design handoffs meet team documentation standards?", idealRating: 4 },
          { name: "How effectively does your documentation communicate intent, rationale, and implementation requirements?", idealRating: 4 },
          { name: "How well do you maintain FigJam artifacts, process maps, and project documentation?", idealRating: 4 },
          { name: "How easy would it be for another designer or engineer to pick up your work using your documentation?", idealRating: 4 }
        ]
      },
      {
        category: "Collaboration and Stakeholder Management",
        description: "Working effectively with cross-functional teams and managing stakeholder expectations.",
        skills: [
          { name: "How effectively do you collaborate with Product Managers, Engineers, Researchers, and Stakeholders throughout the design lifecycle?", idealRating: 4 },
          { name: "How comfortable are you presenting design decisions to cross-functional stakeholders?", idealRating: 4 },
          { name: "How effectively do you handle conflicting stakeholder feedback?", idealRating: 4 },
          { name: "How confident are you facilitating workshops, alignment sessions, or design reviews?", idealRating: 3 },
          { name: "How consistently do you communicate project progress, decisions, and updates through team channels?", idealRating: 4 }
        ]
      },
      {
        category: "Professional Growth and Community Contribution",
        description: "Continuous learning and contributing to the design community.",
        skills: [
          { name: "How actively do you invest in learning new UX, product, business, or AI-related skills?", idealRating: 4 },
          { name: "How consistently do you apply newly learned concepts in your project work?", idealRating: 4 },
          { name: "How comfortable are you sharing knowledge through Design Cafés, workshops, mentoring, or presentations?", idealRating: 4 },
          { name: "How often do you contribute to the growth of the design community within your team?", idealRating: 4 }
        ]
      },
      {
        category: "Career Aspirations (Non Scored)",
        description: "Your career goals and future vision.",
        skills: [],
        isScored: false,
        questionType: 'multiselect',
        multiSelectQuestions: [
          {
            question: "What role would you like to grow into over the next 2 years?",
            options: [
              "Senior UX Designer",
              "Lead UX Designer",
              "UX Researcher",
              "Design Manager",
              "Product Designer",
              "Not Sure Yet"
            ]
          },
          {
            question: "Which areas would you like support in?",
            options: [
              "Leadership",
              "Strategy",
              "Research",
              "Facilitation",
              "Prototyping",
              "Communication",
              "AI",
              "Accessibility",
              "Stakeholder Management",
              "Design Systems"
            ]
          }
        ]
      }
    ],
    careerOptions: [
      "Senior UX Designer",
      "Lead UX Designer",
      "UX Specialist",
      "Not Sure Yet"
    ],
    futureVisionOptions: [
      "Growing into my next role",
      "Becoming a domain expert",
      "Leading projects",
      "Driving product strategy"
    ],
    growthAreasOptions: [
      "Research",
      "Strategy",
      "Communication",
      "Accessibility",
      "Leadership",
      "AI for Design",
      "Business Acumen",
      "Stakeholder Management",
      "Design Systems",
      "Product Thinking"
    ],
    strengthsOptions: [
      "User Research",
      "Visual Design",
      "Interaction Design",
      "Communication",
      "Storytelling",
      "Facilitation",
      "Accessibility",
      "Systems Thinking",
      "Strategic Thinking",
      "Problem Solving"
    ],
    growthLimitsOptions: [
      "Need more experience",
      "Need coaching",
      "Need mentorship",
      "Need project exposure",
      "Need stakeholder visibility",
      "Need structured learning",
      "Need confidence",
      "Time constraints"
    ],
    learningStyleOptions: [
      "Workshops",
      "Mentorship",
      "Peer Learning",
      "Online Courses",
      "Self Learning",
      "Hands-on Projects",
      "Shadowing",
      "External Speakers"
    ]
  },
  
  "Senior UX Designer": {
    skillCategories: [
      {
        category: "Discovery Leadership & Strategic Alignment",
        description: "Leading discovery activities and creating strategic alignment across teams.",
        skills: [
          { name: "How effectively do you ensure problem statements, business goals, risks, assumptions, and success metrics are clearly defined before design work begins?", idealRating: 4 },
          { name: "How consistently do you review and enforce Discovery Brief quality across projects within your workstream?", idealRating: 4 },
          { name: "How effectively do you identify and communicate dependencies, risks, and implementation constraints to stakeholders?", idealRating: 4 },
          { name: "How comfortable are you facilitating alignment workshops across multiple teams or product areas?", idealRating: 4 },
          { name: "How effectively do you create alignment between Product, Engineering, and UX around problem understanding and priorities?", idealRating: 4 },
          { name: "How consistently are major design decisions traceable to research, business goals, data, or stakeholder needs?", idealRating: 4 }
        ]
      },
      {
        category: "Research Leadership & Insight Generation",
        description: "Leading research activities and generating actionable insights.",
        skills: [
          { name: "How confident are you leading research activities that influence product or workstream decisions?", idealRating: 4 },
          { name: "How effectively do you create and maintain personas, user segments, or domain knowledge repositories?", idealRating: 4 },
          { name: "How well do you synthesize research findings into actionable recommendations for stakeholders?", idealRating: 4 },
          { name: "How effectively do you identify patterns and opportunities across multiple research studies?", idealRating: 4 },
          { name: "How confident are you prioritizing insights based on business impact and user value?", idealRating: 4 },
          { name: "How effectively do your research findings influence roadmap, feature, or business decisions?", idealRating: 4 }
        ]
      },
      {
        category: "Product Thinking & Design Leadership",
        description: "Connecting UX decisions to product outcomes and business goals.",
        skills: [
          { name: "How effectively do you connect UX decisions to product outcomes and business goals?", idealRating: 4 },
          { name: "How comfortable are you challenging requirements or assumptions when evidence suggests a better direction?", idealRating: 4 },
          { name: "How often do you help teams prioritize solutions based on impact rather than effort alone?", idealRating: 4 },
          { name: "How effectively do you balance user needs, technical constraints, business priorities, and delivery timelines?", idealRating: 4 },
          { name: "How confident are you making decisions in ambiguous or incomplete situations?", idealRating: 4 }
        ]
      },
      {
        category: "AI Adoption & Innovation Leadership",
        description: "Leading AI adoption and innovation within teams.",
        skills: [
          { name: "How effectively do you apply AI tools to improve research, design, documentation, or decision-making workflows?", idealRating: 4 },
          { name: "How frequently do you identify opportunities for AI-driven user experiences or AI-enabled workflows?", idealRating: 4 },
          { name: "How effectively have you used AI to improve productivity or reduce effort within your team?", idealRating: 4 },
          { name: "How actively do you promote and encourage AI adoption within your squad?", idealRating: 4 },
          { name: "How often do you share AI learnings, frameworks, prompts, or best practices with others?", idealRating: 4 }
        ]
      },
      {
        category: "Design System and Consistency",
        description: "Ensuring design system adoption and consistency across products.",
        skills: [
          { name: "How consistently do you ensure Design System usage and adoption within your workstream?", idealRating: 4 },
          { name: "How effectively do you identify opportunities to improve or extend Design System standards?", idealRating: 4 },
          { name: "How actively do you contribute to Design System discussions, governance, or standards initiatives?", idealRating: 4 },
          { name: "How effectively do you advocate for accessibility, consistency, and reuse across products?", idealRating: 4 }
        ]
      },
      {
        category: "Documentation & Operational Excellence",
        description: "Maintaining high-quality documentation and operational standards.",
        skills: [
          { name: "How consistently do you ensure project documentation meets organizational standards?", idealRating: 4 },
          { name: "How effectively do you maintain decision logs, design rationale, and project artifacts?", idealRating: 4 },
          { name: "How easy would it be for another designer, PM, or engineer to understand and continue work based on your documentation?", idealRating: 4 },
          { name: "How effectively do you use documentation to improve transparency and reduce team dependencies?", idealRating: 4 },
          { name: "How consistently do you share project learnings, demos, or best practices with broader teams?", idealRating: 5 }
        ]
      },
      {
        category: "Mentoring & Capability Building",
        description: "Mentoring designers and building team capability.",
        skills: [
          { name: "How actively do you mentor designers and support their professional growth?", idealRating: 4 },
          { name: "How effectively do you provide actionable feedback that improves others' performance?", idealRating: 4 },
          { name: "How confident are you helping team members create development goals and growth plans?", idealRating: 5 },
          { name: "How frequently do you share domain knowledge, frameworks, or best practices with the team?", idealRating: 4 },
          { name: "How effectively do you contribute to building team capability and design maturity?", idealRating: 4 }
        ]
      },
      {
        category: "Collaboration, Influence & Facilitation",
        description: "Managing stakeholder expectations and driving alignment across teams.",
        skills: [
          { name: "How effectively do you manage stakeholder expectations and align competing priorities?", idealRating: 4 },
          { name: "How comfortable are you facilitating large-scale workshops and alignment sessions?", idealRating: 4 },
          { name: "How effectively do you drive backlog discussions, prioritization, and decision-making conversations?", idealRating: 4 },
          { name: "How consistently do you follow up on unresolved discussions and drive closure across teams?", idealRating: 4 },
          { name: "How effectively do you influence decisions without relying on formal authority?", idealRating: 4 },
          { name: "How often do stakeholders seek your input on product, process, or strategic decisions?", idealRating: 4 }
        ]
      },
      {
        category: "Career Aspirations (Non Scored)",
        description: "Your career goals and future vision.",
        skills: [],
        isScored: false,
        questionType: 'multiselect',
        multiSelectQuestions: [
          {
            question: "What role would you like to grow into over the next 2 years?",
            options: [
              "Lead UX Designer",
              "Principal Designer",
              "Design Manager",
              "Director of Design",
              "Specialist (Research/Systems)",
              "Not Sure Yet"
            ]
          },
          {
            question: "Which areas would you like support in?",
            options: [
              "Leadership",
              "Strategy",
              "Mentorship",
              "Team Building",
              "Executive Communication",
              "Design Operations",
              "AI",
              "Accessibility"
            ]
          }
        ]
      }
    ],
    careerOptions: [
      "Lead Designer",
      "Design Manager",
      "Principal Designer",
      "Product Strategist",
      "Design Systems Specialist",
      "Not Sure Yet"
    ],
    futureVisionOptions: [
      "Leading teams",
      "Driving product strategy",
      "Influencing business decisions",
      "Becoming a domain expert",
      "Building design capability"
    ],
    growthAreasOptions: [
      "Leadership",
      "Strategy",
      "Business Acumen",
      "Stakeholder Management",
      "Team Development",
      "AI for Design",
      "Design Operations",
      "Product Thinking",
      "Data & Analytics"
    ],
    strengthsOptions: [
      "Strategic Thinking",
      "Stakeholder Management",
      "Leadership",
      "Mentoring",
      "Systems Thinking",
      "User Research",
      "Visual Design",
      "Interaction Design",
      "Communication",
      "Facilitation",
      "Problem Solving"
    ],
    growthLimitsOptions: [
      "Need leadership opportunities",
      "Need stakeholder visibility",
      "Need strategic project exposure",
      "Need executive presence",
      "Need coaching",
      "Time constraints",
      "Need organizational influence"
    ],
    learningStyleOptions: [
      "Executive Coaching",
      "Mentorship",
      "Peer Learning",
      "Leadership Programs",
      "Strategic Projects",
      "External Speakers",
      "Industry Events"
    ]
  },
  
  "Lead UX Designer": {
    skillCategories: [
      {
        category: "Strategic Vision & Portfolio Leadership",
        description: "Connecting UX initiatives to business goals and organizational priorities.",
        skills: [
          { name: "How effectively do you connect UX initiatives to business goals, customer outcomes, and organizational priorities?", idealRating: 5 },
          { name: "How clearly do you define and communicate UX vision, success metrics, and desired outcomes across initiatives?", idealRating: 5 },
          { name: "How effectively do you ensure teams understand the 'why' behind major product and design decisions?", idealRating: 5 },
          { name: "How consistently do initiatives under your influence begin with a validated problem statement and Discovery Gate review?", idealRating: 5 },
          { name: "How effectively do you prioritize work based on customer value, business impact, and strategic objectives?", idealRating: 5 },
          { name: "How often do stakeholders rely on your guidance when making strategic product decisions?", idealRating: 5 }
        ]
      },
      {
        category: "Research Operations & Evidence-Based Decision Making",
        description: "Establishing research practices and building evidence-backed roadmaps.",
        skills: [
          { name: "How effectively do you establish and maintain research practices across your domain or workstream?", idealRating: 5 },
          { name: "How confident are you building evidence-backed roadmaps using research insights and customer data?", idealRating: 5 },
          { name: "How effectively do you ensure personas, user segments, and behavioral patterns remain current and actionable?", idealRating: 5 },
          { name: "How often do research findings influence prioritization and roadmap decisions across teams?", idealRating: 5 },
          { name: "How effectively do you identify organizational research gaps and create plans to address them?", idealRating: 5 }
        ]
      },
      {
        category: "AI Strategy & Innovation Leadership",
        description: "Defining AI principles and driving AI-driven innovation.",
        skills: [
          { name: "How effectively do you define and advocate responsible AI principles within design processes and products?", idealRating: 5 },
          { name: "How actively do you identify strategic opportunities for AI-driven innovation within products and workflows?", idealRating: 5 },
          { name: "How effectively do you encourage and enable AI adoption across teams?", idealRating: 4 },
          { name: "How consistently do you evaluate AI initiatives against ethical, usability, risk, and business considerations?", idealRating: 5 },
          { name: "How effectively do you measure and communicate the impact of AI experiments or initiatives?", idealRating: 4 },
          { name: "How actively do you share AI frameworks, best practices, or operating models with the wider design organization?", idealRating: 4 }
        ]
      },
      {
        category: "Design Systems, Standards & Governance",
        description: "Driving design system adoption and defining design standards.",
        skills: [
          { name: "How effectively do you drive design system adoption across teams and products?", idealRating: 5 },
          { name: "How actively do you contribute to defining design standards, governance, and consistency practices?", idealRating: 5 },
          { name: "How effectively do you influence design quality through standards, reviews, and reusable patterns?", idealRating: 5 },
          { name: "How confident are you making decisions that balance standardization with product-specific needs?", idealRating: 4 },
          { name: "How effectively do you communicate design standards and expectations across the UX organization?", idealRating: 4 }
        ]
      },
      {
        category: "Design Operations & Documentation Culture",
        description: "Establishing documentation practices and improving team efficiency.",
        skills: [
          { name: "How effectively do you establish documentation practices that improve transparency and reduce dependency on individuals?", idealRating: 5 },
          { name: "How consistently do teams under your influence maintain high-quality documentation and decision records?", idealRating: 5 },
          { name: "How effectively do you use documentation to improve onboarding, knowledge transfer, and team efficiency?", idealRating: 5 },
          { name: "How successful have your documentation initiatives been in reducing duplicate effort or rework?", idealRating: 5 },
          { name: "How effectively do you promote documentation as a core part of design excellence?", idealRating: 5 }
        ]
      },
      {
        category: "Talent Development, Mentoring & Role Clarity",
        description: "Mentoring designers and building organizational capability.",
        skills: [
          { name: "How effectively do you mentor designers and help accelerate their career growth?", idealRating: 5 },
          { name: "How confident are you identifying capability gaps and creating development plans for team members?", idealRating: 5 },
          { name: "How actively do you contribute to defining career ladders, role expectations, or progression frameworks?", idealRating: 5 },
          { name: "How effectively do you provide guidance on role clarity, responsibilities, and growth opportunities?", idealRating: 5 },
          { name: "How frequently do designers seek you out for coaching, feedback, or career advice?", idealRating: 5 },
          { name: "How effectively do you build capability across the design organization rather than just within your immediate team?", idealRating: 5 }
        ]
      },
      {
        category: "Organizational Influence & Stakeholder Leadership",
        description: "Building alignment and influencing organizational decisions.",
        skills: [
          { name: "How effectively do you build alignment across multiple teams, functions, or business units?", idealRating: 5 },
          { name: "How confident are you facilitating leadership discussions involving competing priorities or viewpoints?", idealRating: 5 },
          { name: "How effectively do you influence outcomes without direct authority?", idealRating: 5 },
          { name: "How often do senior stakeholders seek your input on strategic or organizational decisions?", idealRating: 5 },
          { name: "How effectively do you drive organizational forums, leadership connects, or cross-functional planning activities?", idealRating: 5 },
          { name: "How consistently do you establish communication practices that improve collaboration across the organization?", idealRating: 5 },
          { name: "How effectively do you represent and advocate for UX within leadership discussions?", idealRating: 5 }
        ]
      },
      {
        category: "Organizational Growth & UX Evangelization",
        description: "Promoting UX thinking and building design culture.",
        skills: [
          { name: "How effectively do you promote UX thinking and customer-centric decision making across the organization?", idealRating: 5 },
          { name: "How actively do you create opportunities for knowledge sharing, thought leadership, and design culture building?", idealRating: 5 },
          { name: "How effectively do you identify future organizational capability needs and take action to address them?", idealRating: 5 },
          { name: "How consistently do you champion initiatives that improve UX maturity across teams?", idealRating: 5 },
          { name: "How effectively do you influence long-term organizational design direction?", idealRating: 5 }
        ]
      },
      {
        category: "Career Aspirations (Non Scored)",
        description: "Your career goals and future vision.",
        skills: [],
        isScored: false,
        questionType: 'multiselect',
        multiSelectQuestions: [
          {
            question: "What role would you like to grow into over the next 2 years?",
            options: [
              "Principal Designer",
              "Design Director",
              "VP of Design",
              "Design Strategist",
              "Design Operations Lead",
              "Stay in current role"
            ]
          },
          {
            question: "Which areas would you like support in?",
            options: [
              "Executive Leadership",
              "Strategic Vision",
              "Team Scaling",
              "Design Operations",
              "Organizational Change",
              "Executive Communication",
              "Business Strategy",
              "Innovation"
            ]
          }
        ]
      }
    ],
    careerOptions: [
      "Design Manager",
      "Principal Designer",
      "Director of Design",
      "VP of Design",
      "Design Strategist",
      "Not Sure Yet"
    ],
    futureVisionOptions: [
      "Leading teams",
      "Driving product strategy",
      "Influencing business decisions",
      "Building design capability",
      "Shaping organizational culture"
    ],
    growthAreasOptions: [
      "Leadership",
      "Strategy",
      "Business Acumen",
      "Stakeholder Management",
      "Team Development",
      "AI for Design",
      "Design Operations",
      "Product Thinking",
      "Data & Analytics",
      "Executive Presence"
    ],
    strengthsOptions: [
      "Strategic Thinking",
      "Stakeholder Management",
      "Leadership",
      "Mentoring",
      "Systems Thinking",
      "User Research",
      "Visual Design",
      "Interaction Design",
      "Communication",
      "Facilitation",
      "Problem Solving",
      "Team Development"
    ],
    growthLimitsOptions: [
      "Need leadership opportunities",
      "Need stakeholder visibility",
      "Need strategic project exposure",
      "Need executive presence",
      "Need coaching",
      "Time constraints",
      "Need organizational influence",
      "Need C-suite exposure"
    ],
    learningStyleOptions: [
      "Executive Coaching",
      "Mentorship",
      "Peer Learning",
      "Leadership Programs",
      "Strategic Projects",
      "External Speakers",
      "Industry Events",
      "Executive Education"
    ]
  }
}
