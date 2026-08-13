// Curated learning resources

export interface Resource {
  title: string
  type: 'course' | 'book' | 'article' | 'tutorial' | 'tool' | 'community'
  url: string
  provider: string
  free: boolean
  level: 'beginner' | 'intermediate' | 'advanced'
  recommended?: boolean
}

export const RESOURCES: Record<string, Resource[]> = {
  'Design Systems': [
    {
      title: 'Design Systems 101',
      type: 'course',
      url: 'https://www.coursera.org/learn/design-systems',
      provider: 'Coursera',
      free: true,
      level: 'beginner',
      recommended: true
    },
    {
      title: 'Building Design Systems',
      type: 'course',
      url: 'https://frontendmasters.com/courses/design-systems/',
      provider: 'Frontend Masters',
      free: false,
      level: 'intermediate'
    },
    {
      title: 'Atomic Design',
      type: 'book',
      url: 'https://atomicdesign.bradfrost.com/',
      provider: 'Brad Frost',
      free: true,
      level: 'beginner',
      recommended: true
    },
    {
      title: 'Design Systems Handbook',
      type: 'book',
      url: 'https://www.designbetter.co/design-systems-handbook',
      provider: 'InVision',
      free: true,
      level: 'intermediate'
    }
  ],
  'User Research': [
    {
      title: 'User Research Methods',
      type: 'course',
      url: 'https://www.nngroup.com/courses/user-research/',
      provider: 'Nielsen Norman Group',
      free: false,
      level: 'intermediate',
      recommended: true
    },
    {
      title: 'Just Enough Research',
      type: 'book',
      url: 'https://abookapart.com/products/just-enough-research',
      provider: 'A Book Apart',
      free: false,
      level: 'beginner'
    },
    {
      title: 'User Interviews',
      type: 'article',
      url: 'https://www.nngroup.com/articles/user-interviews/',
      provider: 'Nielsen Norman Group',
      free: true,
      level: 'beginner',
      recommended: true
    }
  ],
  'Visual Design': [
    {
      title: 'Refactoring UI',
      type: 'book',
      url: 'https://www.refactoringui.com/',
      provider: 'Adam Wathan & Steve Schoger',
      free: false,
      level: 'intermediate',
      recommended: true
    },
    {
      title: 'Visual Design Fundamentals',
      type: 'course',
      url: 'https://www.linkedin.com/learning/visual-design-fundamentals',
      provider: 'LinkedIn Learning',
      free: false,
      level: 'beginner'
    },
    {
      title: 'The Non-Designer\'s Design Book',
      type: 'book',
      url: 'https://www.amazon.com/Non-Designers-Design-Book-4th/dp/0133966151',
      provider: 'Robin Williams',
      free: false,
      level: 'beginner'
    }
  ],
  'Prototyping': [
    {
      title: 'Advanced Figma Techniques',
      type: 'tutorial',
      url: 'https://www.figma.com/resources/learn-design/',
      provider: 'Figma',
      free: true,
      level: 'intermediate',
      recommended: true
    },
    {
      title: 'Prototyping for Designers',
      type: 'course',
      url: 'https://www.interaction-design.org/courses/prototyping',
      provider: 'Interaction Design Foundation',
      free: false,
      level: 'beginner'
    }
  ],
  'Accessibility': [
    {
      title: 'Web Accessibility (WCAG) Guide',
      type: 'article',
      url: 'https://www.w3.org/WAI/WCAG21/quickref/',
      provider: 'W3C',
      free: true,
      level: 'beginner',
      recommended: true
    },
    {
      title: 'Accessibility for Designers',
      type: 'course',
      url: 'https://www.udemy.com/course/accessibility-for-designers/',
      provider: 'Udemy',
      free: false,
      level: 'intermediate'
    },
    {
      title: 'Inclusive Design Principles',
      type: 'article',
      url: 'https://inclusivedesignprinciples.org/',
      provider: 'Inclusive Design',
      free: true,
      level: 'beginner'
    }
  ],
  'Interaction Design': [
    {
      title: 'Microinteractions',
      type: 'book',
      url: 'https://www.oreilly.com/library/view/microinteractions/9781491945902/',
      provider: 'Dan Saffer',
      free: false,
      level: 'intermediate',
      recommended: true
    },
    {
      title: 'Interaction Design Fundamentals',
      type: 'course',
      url: 'https://www.interaction-design.org/courses/interaction-design',
      provider: 'Interaction Design Foundation',
      free: false,
      level: 'beginner'
    }
  ],
  'Usability Testing': [
    {
      title: 'Rocket Surgery Made Easy',
      type: 'book',
      url: 'https://sensible.com/rocket-surgery-made-easy/',
      provider: 'Steve Krug',
      free: false,
      level: 'beginner',
      recommended: true
    },
    {
      title: 'Usability Testing 101',
      type: 'article',
      url: 'https://www.nngroup.com/articles/usability-testing-101/',
      provider: 'Nielsen Norman Group',
      free: true,
      level: 'beginner'
    }
  ],
  'Stakeholder Communication': [
    {
      title: 'Articulating Design Decisions',
      type: 'book',
      url: 'https://www.oreilly.com/library/view/articulating-design-decisions/9781491921555/',
      provider: 'Tom Greever',
      free: false,
      level: 'intermediate',
      recommended: true
    },
    {
      title: 'Presenting UX Work',
      type: 'course',
      url: 'https://www.linkedin.com/learning/presenting-ux-work',
      provider: 'LinkedIn Learning',
      free: false,
      level: 'beginner'
    }
  ]
}

export const LEARNING_STYLE_TIPS: Record<string, string[]> = {
  'Hands-on projects': [
    'Join design challenges like Daily UI or 100 Days of UX',
    'Build side projects that stretch your weak areas',
    'Recreate designs from apps you admire',
    'Contribute to open-source design projects'
  ],
  'Online courses': [
    'Platforms: Coursera, Udemy, LinkedIn Learning, Interaction Design Foundation',
    'Set aside dedicated learning time each week',
    'Take notes and apply learnings immediately',
    'Join course communities for peer support'
  ],
  'Reading books and articles': [
    'Follow design blogs: Nielsen Norman Group, Smashing Magazine, A List Apart',
    'Join Medium publications focused on UX',
    'Create a reading list and track progress',
    'Write summaries to solidify learning'
  ],
  'Mentorship and coaching': [
    'Find mentors on ADPList (free) or MentorCruise',
    'Join design communities: Designer Hangout, UX Mastery',
    'Attend local meetups and networking events',
    'Consider 1-on-1 coaching for focused growth'
  ],
  'Workshops and conferences': [
    'Attend: UXDX, Interaction, Config (Figma)',
    'Look for local UX meetups and workshops',
    'Many conferences offer virtual options',
    'Apply learnings immediately after attending'
  ],
  'Learning from peers': [
    'Join design critique groups',
    'Participate in design communities (Slack, Discord)',
    'Share work and get feedback regularly',
    'Organize knowledge-sharing sessions with colleagues'
  ]
}

export const COMMUNITIES = [
  {
    name: 'Designer Hangout',
    type: 'Slack Community',
    url: 'https://www.designerhangout.co/',
    description: 'Large Slack community for UX professionals'
  },
  {
    name: 'UX Mastery Community',
    type: 'Forum',
    url: 'https://community.uxmastery.com/',
    description: 'Supportive community for UX learners'
  },
  {
    name: 'Interaction Design Foundation',
    type: 'Platform',
    url: 'https://www.interaction-design.org/',
    description: 'Courses and community for designers'
  },
  {
    name: 'ADPList',
    type: 'Mentorship',
    url: 'https://adplist.org/',
    description: 'Free mentorship platform for designers'
  }
]
