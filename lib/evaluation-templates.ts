
import { EvaluationSection } from '../types';

export const JUNIOR_FE_EVALUATION_TEMPLATE: EvaluationSection[] = [
  {
    id: 'junior-fe-fundamentals',
    title: '1. Frontend Fundamentals',
    weight: 25,
    items: [
      { skill: 'HTML semantics & accessibility', score: 3, notes: '' },
      { skill: 'CSS layout (Flex/Grid) & responsiveness', score: 3, notes: '' },
      { skill: 'JavaScript (ES6+) fundamentals', score: 3, notes: '' },
      { skill: 'Clean component structure', score: 3, notes: '' },
    ],
    summary: ''
  },
  {
    id: 'junior-fe-component-design',
    title: '2. Component Design & State Management',
    weight: 25,
    items: [
      { skill: 'State vs Props / Inputs flow', score: 3, notes: '' },
      { skill: 'Lifting state up patterns', score: 3, notes: '' },
      { skill: 'Component reusability & modularity', score: 3, notes: '' },
    ],
    summary: ''
  },
  {
    id: 'junior-fe-framework',
    title: '3. Framework Knowledge (React / Angular)',
    weight: 20,
    items: [
      { skill: 'Lifecycle (Hooks/Effects or Lifecycle Hooks)', score: 3, notes: '' },
      { skill: 'Controlled forms / Two-way binding', score: 3, notes: '' },
      { skill: 'Architecture (Smart vs Dumb / Services & DI)', score: 3, notes: '' },
    ],
    summary: ''
  },
  {
    id: 'junior-fe-data',
    title: '4. Data Handling & API Integration',
    weight: 15,
    items: [
      { skill: 'Fetching data & Async management', score: 3, notes: '' },
      { skill: 'UX Awareness (Loading/Error/Empty states)', score: 3, notes: '' },
      { skill: 'UI-Data synchronization & Updating', score: 3, notes: '' },
    ],
    summary: ''
  },
  {
    id: 'junior-fe-debugging',
    title: '5. Debugging & Dev Practices',
    weight: 10,
    items: [
      { skill: 'Browser DevTools mastery', score: 3, notes: '' },
      { skill: 'Git basics (Branching/PR workflow)', score: 3, notes: '' },
      { skill: 'Code review awareness & troubleshooting', score: 3, notes: '' },
    ],
    summary: ''
  },
  {
    id: 'junior-fe-communication',
    title: '6. Communication & Ownership',
    weight: 5,
    items: [
      { skill: 'Feature walkthrough (Verbal clarity)', score: 3, notes: '' },
      { skill: 'Handling requirements ambiguity', score: 3, notes: '' },
      { skill: 'Receptiveness to technical feedback', score: 3, notes: '' },
    ],
    summary: ''
  }
];

export const FRESH_FE_EVALUATION_TEMPLATE: EvaluationSection[] = [
  {
    id: 'fe-fundamentals',
    title: '1. Frontend Fundamentals',
    weight: 30,
    items: [
      { skill: 'HTML / CSS basics', score: 3, notes: '' },
      { skill: 'JavaScript fundamentals', score: 3, notes: '' },
      { skill: 'Component structure', score: 3, notes: '' },
      { skill: 'DOM & UI updates', score: 3, notes: '' },
    ],
    summary: ''
  },
  {
    id: 'problem-solving-ui',
    title: '2. Problem‑Solving & UI Thinking',
    weight: 25,
    items: [
      { skill: 'Understanding requirements (Clarifying questions)', score: 3, notes: '' },
      { skill: 'Problem decomposition', score: 3, notes: '' },
      { skill: 'UI Planning & User Perspective', score: 3, notes: '' },
      { skill: 'Handling Edge Cases (Loading/Empty states)', score: 3, notes: '' },
    ],
    summary: ''
  },
  {
    id: 'js-data-handling',
    title: '3. JavaScript & Data Handling',
    weight: 15,
    items: [
      { skill: 'Arrays & Objects manipulation', score: 3, notes: '' },
      { skill: 'Rendering dynamic data (map/filter)', score: 3, notes: '' },
      { skill: 'Logic & UI synchronization', score: 3, notes: '' },
    ],
    summary: ''
  },
  {
    id: 'framework-basics',
    title: '4. Framework Basics (React / Angular)',
    weight: 15,
    items: [
      { skill: 'State Management (useState / Inputs)', score: 3, notes: '' },
      { skill: 'Lifecycle & Effects (useEffect / Hooks)', score: 3, notes: '' },
      { skill: 'Services & Data Fetching (Angular Service / API calls)', score: 3, notes: '' },
      { skill: 'Observables vs Promises (Async handling)', score: 3, notes: '' },
    ],
    summary: ''
  },
  {
    id: 'learning-ability',
    title: '5. Learning Ability & Attitude',
    weight: 10,
    items: [
      { skill: 'Growth Mindset & Flexibility', score: 3, notes: '' },
      { skill: 'Handling Feedback', score: 3, notes: '' },
      { skill: 'Problem solving approach when stuck', score: 3, notes: '' },
    ],
    summary: ''
  },
  {
    id: 'communication-fe',
    title: '6. Communication',
    weight: 5,
    items: [
      { skill: 'Technical clarity (Explaining solutions)', score: 3, notes: '' },
      { skill: 'Honesty & Professionalism', score: 3, notes: '' },
    ],
    summary: ''
  }
];

export const FRESH_BE_EVALUATION_TEMPLATE: EvaluationSection[] = [
  {
    id: 'be-fundamentals',
    title: '1. Programming Fundamentals (Java / .NET)',
    weight: 30,
    items: [
      { skill: 'Variables & Data Types', score: 3, notes: '' },
      { skill: 'Conditions & Loops', score: 3, notes: '' },
      { skill: 'Methods / Functions', score: 3, notes: '' },
      { skill: 'Basic OOP Concepts (Inheritance, Polymorphism)', score: 3, notes: '' },
      { skill: 'Code Readability & Naming', score: 3, notes: '' },
    ],
    summary: ''
  },
  {
    id: 'be-problem-solving',
    title: '2. Problem‑Solving & Logical Thinking',
    weight: 25,
    items: [
      { skill: 'Understanding requirements', score: 3, notes: '' },
      { skill: 'Breaking problems into steps', score: 3, notes: '' },
      { skill: 'Writing logical solutions', score: 3, notes: '' },
      { skill: 'Handling edge cases (nulls, empty input)', score: 3, notes: '' },
      { skill: 'Explaining the solution clearly', score: 3, notes: '' },
    ],
    summary: ''
  },
  {
    id: 'be-data-structures',
    title: '3. Data Structures – Basics',
    weight: 15,
    items: [
      { skill: 'Arrays / Lists usage', score: 3, notes: '' },
      { skill: 'Maps / Dictionaries handling', score: 3, notes: '' },
      { skill: 'Basic collections usage', score: 3, notes: '' },
      { skill: 'Choosing the right structure', score: 3, notes: '' },
    ],
    summary: ''
  },
  {
    id: 'be-api-fundamentals',
    title: '4. Backend & API Fundamentals',
    weight: 15,
    items: [
      { skill: 'REST API Concepts', score: 3, notes: '' },
      { skill: 'HTTP methods & Status codes', score: 3, notes: '' },
      { skill: 'Request / Response flow', score: 3, notes: '' },
      { skill: 'Basic Error Handling', score: 3, notes: '' },
    ],
    summary: ''
  },
  {
    id: 'be-attitude',
    title: '5. Learning Ability & Attitude',
    weight: 10,
    items: [
      { skill: 'Willingness to learn', score: 3, notes: '' },
      { skill: 'Accepting feedback', score: 3, notes: '' },
      { skill: 'Persistence when stuck', score: 3, notes: '' },
      { skill: 'Asking clarifying questions', score: 3, notes: '' },
    ],
    summary: ''
  },
  {
    id: 'be-communication',
    title: '6. Communication Basics',
    weight: 5,
    items: [
      { skill: 'Clear explanation', score: 3, notes: '' },
      { skill: 'Understanding questions', score: 3, notes: '' },
      { skill: 'Honest communication', score: 3, notes: '' },
    ],
    summary: ''
  }
];

export const FRESH_MOBILE_EVALUATION_TEMPLATE: EvaluationSection[] = [
  {
    id: 'mobile-programming',
    title: '1. Programming Fundamentals (Mobile)',
    weight: 30,
    items: [
      { skill: 'Variables & Data Types', score: 3, notes: '' },
      { skill: 'Conditions & Loops', score: 3, notes: '' },
      { skill: 'Functions / Methods', score: 3, notes: '' },
      { skill: 'Basic OOP Concepts', score: 3, notes: '' },
      { skill: 'Code Readability & Naming', score: 3, notes: '' },
    ],
    summary: ''
  },
  {
    id: 'mobile-ui',
    title: '2. Mobile UI & Screen Thinking',
    weight: 25,
    items: [
      { skill: 'Understanding UI Requirements', score: 3, notes: '' },
      { skill: 'Screen Layout Basics', score: 3, notes: '' },
      { skill: 'Handling User Interaction', score: 3, notes: '' },
      { skill: 'Simple Navigation Flow', score: 3, notes: '' },
      { skill: 'Explaining UI Logic', score: 3, notes: '' },
    ],
    summary: ''
  },
  {
    id: 'mobile-data',
    title: '3. Data Handling & State (Basics)',
    weight: 15,
    items: [
      { skill: 'Lists / Collections usage', score: 3, notes: '' },
      { skill: 'Passing data between screens', score: 3, notes: '' },
      { skill: 'Simple State Handling', score: 3, notes: '' },
      { skill: 'Updating UI with Data', score: 3, notes: '' },
    ],
    summary: ''
  },
  {
    id: 'mobile-fundamentals',
    title: '4. Mobile Development Fundamentals',
    weight: 15,
    items: [
      { skill: 'App Lifecycle (Basic awareness)', score: 3, notes: '' },
      { skill: 'Navigation Basics', score: 3, notes: '' },
      { skill: 'API usage (High-level)', score: 3, notes: '' },
      { skill: 'Basic Error Handling', score: 3, notes: '' },
    ],
    summary: ''
  },
  {
    id: 'mobile-attitude',
    title: '5. Learning Ability & Attitude',
    weight: 10,
    items: [
      { skill: 'Willingness to learn', score: 3, notes: '' },
      { skill: 'Accepting feedback', score: 3, notes: '' },
      { skill: 'Persistence', score: 3, notes: '' },
      { skill: 'Asking clarifying questions', score: 3, notes: '' },
    ],
    summary: ''
  },
  {
    id: 'mobile-communication',
    title: '6. Communication Basics',
    weight: 5,
    items: [
      { skill: 'Clear Explanation', score: 3, notes: '' },
      { skill: 'Understanding requirements', score: 3, notes: '' },
      { skill: 'Honest communication', score: 3, notes: '' },
    ],
    summary: ''
  }
];

export const FRESH_UX_EVALUATION_TEMPLATE: EvaluationSection[] = [
  {
    id: 'ux-fundamentals',
    title: '1. UX Fundamentals & Design Thinking',
    weight: 30,
    items: [
      { skill: 'Understanding UX vs UI', score: 3, notes: '' },
      { skill: 'User-centered thinking', score: 3, notes: '' },
      { skill: 'Problem definition', score: 3, notes: '' },
      { skill: 'Basic design principles', score: 3, notes: '' },
      { skill: 'Design reasoning', score: 3, notes: '' },
    ],
    summary: ''
  },
  {
    id: 'user-research',
    title: '2. User Research & Understanding',
    weight: 20,
    items: [
      { skill: 'Understanding target users', score: 3, notes: '' },
      { skill: 'Personas awareness', score: 3, notes: '' },
      { skill: 'User pain points', score: 3, notes: '' },
      { skill: 'Asking the right questions', score: 3, notes: '' },
    ],
    summary: ''
  },
  {
    id: 'wireframing-ia',
    title: '3. Wireframing & Information Architecture',
    weight: 20,
    items: [
      { skill: 'Screen layout structure', score: 3, notes: '' },
      { skill: 'Wireframing basics', score: 3, notes: '' },
      { skill: 'Navigation flow', score: 3, notes: '' },
      { skill: 'Content hierarchy', score: 3, notes: '' },
    ],
    summary: ''
  },
  {
    id: 'ux-tools',
    title: '4. UX Tools & Collaboration Basics',
    weight: 15,
    items: [
      { skill: 'Design tools (Figma, etc.)', score: 3, notes: '' },
      { skill: 'Basic prototyping', score: 3, notes: '' },
      { skill: 'Handoff awareness', score: 3, notes: '' },
      { skill: 'Working with developers', score: 3, notes: '' },
    ],
    summary: ''
  },
  {
    id: 'ux-learning',
    title: '5. Learning Ability & Attitude',
    weight: 10,
    items: [
      { skill: 'Willingness to learn', score: 3, notes: '' },
      { skill: 'Accepting feedback', score: 3, notes: '' },
      { skill: 'Curiosity', score: 3, notes: '' },
      { skill: 'Self-improvement', score: 3, notes: '' },
    ],
    summary: ''
  },
  {
    id: 'ux-communication',
    title: '6. Communication & Presentation',
    weight: 5,
    items: [
      { skill: 'Explaining design decisions', score: 3, notes: '' },
      { skill: 'Storytelling', score: 3, notes: '' },
      { skill: 'Understanding feedback', score: 3, notes: '' },
    ],
    summary: ''
  }
];

export const JUNIOR_UX_EVALUATION_TEMPLATE: EvaluationSection[] = [
  {
    id: 'jr-ux-thinking',
    title: '1. UX Thinking & Problem Solving',
    weight: 30,
    items: [
      { skill: 'UX vs UI understanding', score: 3, notes: '' },
      { skill: 'Problem framing', score: 3, notes: '' },
      { skill: 'User-centered decisions', score: 3, notes: '' },
      { skill: 'Design trade-offs', score: 3, notes: '' },
      { skill: 'Reasoning & justification', score: 3, notes: '' },
    ],
    summary: ''
  },
  {
    id: 'jr-ux-research',
    title: '2. User Research & Insights',
    weight: 20,
    items: [
      { skill: 'Personas creation', score: 3, notes: '' },
      { skill: 'User journeys', score: 3, notes: '' },
      { skill: 'Pain points identification', score: 3, notes: '' },
      { skill: 'Turning insights into design', score: 3, notes: '' },
    ],
    summary: ''
  },
  {
    id: 'jr-ux-flows',
    title: '3. Wireframing, IA & UX Flows',
    weight: 20,
    items: [
      { skill: 'User flows', score: 3, notes: '' },
      { skill: 'Information architecture', score: 3, notes: '' },
      { skill: 'Edge cases & empty states', score: 3, notes: '' },
      { skill: 'Multi-screen consistency', score: 3, notes: '' },
    ],
    summary: ''
  },
  {
    id: 'jr-ux-handoff',
    title: '4. Tools, Prototyping & Handoff',
    weight: 15,
    items: [
      { skill: 'Figma components', score: 3, notes: '' },
      { skill: 'Interactive prototyping', score: 3, notes: '' },
      { skill: 'Design systems awareness', score: 3, notes: '' },
      { skill: 'Developer handoff', score: 3, notes: '' },
    ],
    summary: ''
  },
  {
    id: 'jr-ux-collab',
    title: '5. Collaboration, Feedback & Ownership',
    weight: 10,
    items: [
      { skill: 'Receiving feedback', score: 3, notes: '' },
      { skill: 'Iteration mindset', score: 3, notes: '' },
      { skill: 'Cross-team collaboration', score: 3, notes: '' },
      { skill: 'Design ownership', score: 3, notes: '' },
    ],
    summary: ''
  },
  {
    id: 'jr-ux-soft',
    title: '6. Communication & Storytelling',
    weight: 5,
    items: [
      { skill: 'Design storytelling', score: 3, notes: '' },
      { skill: 'Explaining decisions', score: 3, notes: '' },
      { skill: 'Stakeholder clarity', score: 3, notes: '' },
    ],
    summary: ''
  }
];

export const JUNIOR_MOBILE_EVALUATION_TEMPLATE: EvaluationSection[] = [
  {
    id: 'jr-mobile-coding',
    title: '1. Programming & OOP Fundamentals',
    weight: 25,
    items: [
      { skill: 'Clean code & Readability', score: 3, notes: '' },
      { skill: 'OOP principles', score: 3, notes: '' },
      { skill: 'Reusable functions/classes', score: 3, notes: '' },
      { skill: 'Error Handling', score: 3, notes: '' },
    ],
    summary: ''
  },
  {
    id: 'jr-mobile-ui',
    title: '2. Mobile UI & Screen Architecture',
    weight: 25,
    items: [
      { skill: 'Screen composition', score: 3, notes: '' },
      { skill: 'Navigation flow', score: 3, notes: '' },
      { skill: 'Handling user interactions', score: 3, notes: '' },
      { skill: 'UI edge cases', score: 3, notes: '' },
    ],
    summary: ''
  },
  {
    id: 'jr-mobile-state',
    title: '3. State Management & Data Flow',
    weight: 15,
    items: [
      { skill: 'Managing state', score: 3, notes: '' },
      { skill: 'Passing data between screens', score: 3, notes: '' },
      { skill: 'Updating UI with data', score: 3, notes: '' },
    ],
    summary: ''
  },
  {
    id: 'jr-mobile-lifecycle',
    title: '4. Mobile App Lifecycle & Platform Knowledge',
    weight: 15,
    items: [
      { skill: 'App lifecycle understanding', score: 3, notes: '' },
      { skill: 'Background / foreground handling', score: 3, notes: '' },
      { skill: 'Navigation lifecycle', score: 3, notes: '' },
    ],
    summary: ''
  },
  {
    id: 'jr-mobile-api',
    title: '5. API Integration & Async Handling',
    weight: 15,
    items: [
      { skill: 'Calling APIs', score: 3, notes: '' },
      { skill: 'Async handling', score: 3, notes: '' },
      { skill: 'Error & loading states', score: 3, notes: '' },
    ],
    summary: ''
  },
  {
    id: 'jr-mobile-soft',
    title: '6. Communication & Ownership',
    weight: 5,
    items: [
      { skill: 'Explaining decisions', score: 3, notes: '' },
      { skill: 'Handling unclear requirements', score: 3, notes: '' },
      { skill: 'Ownership mindset', score: 3, notes: '' },
    ],
    summary: ''
  }
];

export const JUNIOR_BE_EVALUATION_TEMPLATE: EvaluationSection[] = [
  {
    id: 'jr-be-coding',
    title: '1. Programming & OOP Fundamentals',
    weight: 25,
    items: [
      { skill: 'Clean code & Readability', score: 3, notes: '' },
      { skill: 'OOP principles (SOLID Basics)', score: 3, notes: '' },
      { skill: 'Exception Handling', score: 3, notes: '' },
      { skill: 'Code Reusability', score: 3, notes: '' },
    ],
    summary: ''
  },
  {
    id: 'jr-be-logic',
    title: '2. Problem‑Solving & Logical Thinking',
    weight: 25,
    items: [
      { skill: 'Analyzing requirements', score: 3, notes: '' },
      { skill: 'Designing solution', score: 3, notes: '' },
      { skill: 'Handling edge cases', score: 3, notes: '' },
      { skill: 'Explaining Decisions', score: 3, notes: '' },
    ],
    summary: ''
  },
  {
    id: 'jr-be-ds',
    title: '3. Data Structures & Performance Basics',
    weight: 15,
    items: [
      { skill: 'Lists / Maps / Sets usage', score: 3, notes: '' },
      { skill: 'Choosing proper structure', score: 3, notes: '' },
      { skill: 'Basic Performance awareness', score: 3, notes: '' },
    ],
    summary: ''
  },
  {
    id: 'jr-be-api',
    title: '4. Backend & API Design',
    weight: 20,
    items: [
      { skill: 'RESTful Design', score: 3, notes: '' },
      { skill: 'HTTP Status codes', score: 3, notes: '' },
      { skill: 'Validation & Error handling', score: 3, notes: '' },
      { skill: 'Layered architecture', score: 3, notes: '' },
    ],
    summary: ''
  },
  {
    id: 'jr-be-framework',
    title: '5. Framework & Runtime Knowledge',
    weight: 10,
    items: [
      { skill: 'Spring Boot / ASP.NET Pipeline', score: 3, notes: '' },
      { skill: 'Dependency Injection', score: 3, notes: '' },
      { skill: 'Annotations / Middleware basics', score: 3, notes: '' },
    ],
    summary: ''
  },
  {
    id: 'jr-be-soft',
    title: '6. Communication & Ownership',
    weight: 5,
    items: [
      { skill: 'Explaining backend flow', score: 3, notes: '' },
      { skill: 'Handling unclear requirements', score: 3, notes: '' },
      { skill: 'Taking responsibility', score: 3, notes: '' },
    ],
    summary: ''
  }
];

export const SENIOR_EVALUATION_TEMPLATE: EvaluationSection[] = [
  {
    id: 'system-design',
    title: '1. System Design & Architecture',
    weight: 30,
    items: [
      { skill: 'Designing scalable systems', score: 3, notes: '' },
      { skill: 'Breaking architecture into components', score: 3, notes: '' },
      { skill: 'API design & integration', score: 3, notes: '' },
      { skill: 'Database modeling & optimization', score: 3, notes: '' },
      { skill: 'Considering performance, security, reliability', score: 3, notes: '' },
    ],
    summary: ''
  },
  {
    id: 'problem-solving-adv',
    title: '2. Advanced Problem-Solving & Code Quality',
    weight: 20,
    items: [
      { skill: 'Solving complex engineering problems', score: 3, notes: '' },
      { skill: 'Optimizing algorithms & performance', score: 3, notes: '' },
      { skill: 'Writing clean, maintainable, scalable code', score: 3, notes: '' },
      { skill: 'Applying design patterns effectively', score: 3, notes: '' },
      { skill: 'Handling ambiguity in requirements', score: 3, notes: '' },
    ],
    summary: ''
  },
  {
    id: 'tech-leadership',
    title: '3. Technical Leadership & Collaboration',
    weight: 15,
    items: [
      { skill: 'Mentoring junior/mid engineers', score: 3, notes: '' },
      { skill: 'Leading technical discussions', score: 3, notes: '' },
      { skill: 'Driving engineering decisions', score: 3, notes: '' },
      { skill: 'Cross-team collaboration', score: 3, notes: '' },
      { skill: 'Communicating complex ideas clearly', score: 3, notes: '' },
    ],
    summary: ''
  },
  {
    id: 'best-practices-adv',
    title: '4. Software Engineering Best Practices',
    weight: 15,
    items: [
      { skill: 'Code reviews (depth, clarity, impact)', score: 3, notes: '' },
      { skill: 'Testing strategy (unit, integration, automation)', score: 3, notes: '' },
      { skill: 'CI/CD pipeline understanding', score: 3, notes: '' },
      { skill: 'Observability (logging, metrics, tracing)', score: 3, notes: '' },
      { skill: 'DevOps & deployment awareness', score: 3, notes: '' },
    ],
    summary: ''
  },
  {
    id: 'ownership-delivery',
    title: '5. Ownership & Delivery',
    weight: 10,
    items: [
      { skill: 'Taking ownership of projects end-to-end', score: 3, notes: '' },
      { skill: 'Estimation accuracy & planning', score: 3, notes: '' },
      { skill: 'Delivering high-quality work on time', score: 3, notes: '' },
      { skill: 'Managing ambiguity & risk', score: 3, notes: '' },
    ],
    summary: ''
  },
  {
    id: 'stakeholder-interaction',
    title: '6. Communication & Stakeholder Interaction',
    weight: 10,
    items: [
      { skill: 'Communicating with non-technical stakeholders', score: 3, notes: '' },
      { skill: 'Presenting architecture / solution proposals', score: 3, notes: '' },
      { skill: 'Managing technical disagreements', score: 3, notes: '' },
      { skill: 'Documentation quality', score: 3, notes: '' },
    ],
    summary: ''
  }
];

export const STAFF_EVALUATION_TEMPLATE: EvaluationSection[] = [
  {
    id: 'strategy-leadership',
    title: '1. Technical Strategy & Architecture Leadership',
    weight: 30,
    items: [
      { skill: 'Defining long‑term technical direction', score: 3, notes: '' },
      { skill: 'Architecture for large-scale systems', score: 3, notes: '' },
      { skill: 'Designing for reliability, performance & cost', score: 3, notes: '' },
      { skill: 'Setting engineering standards & best practices', score: 3, notes: '' },
      { skill: 'Making high‑impact technical decisions', score: 3, notes: '' },
    ],
    summary: ''
  },
  {
    id: 'deep-expertise',
    title: '2. Complex System Design & Deep Technical Expertise',
    weight: 20,
    items: [
      { skill: 'Designing distributed systems', score: 3, notes: '' },
      { skill: 'Deep expertise in critical tech stack', score: 3, notes: '' },
      { skill: 'Understanding of data architecture & flows', score: 3, notes: '' },
      { skill: 'Handling ambiguity in complex designs', score: 3, notes: '' },
      { skill: 'Innovating technical solutions', score: 3, notes: '' },
    ],
    summary: ''
  },
  {
    id: 'cross-team-influence',
    title: '3. Cross‑Team Technical Leadership & Influence',
    weight: 15,
    items: [
      { skill: 'Influencing across multiple teams/orgs', score: 3, notes: '' },
      { skill: 'Leading architecture reviews', score: 3, notes: '' },
      { skill: 'Driving alignment between engineering groups', score: 3, notes: '' },
      { skill: 'Supporting and unblocking teams', score: 3, notes: '' },
      { skill: 'Communicating technical vision', score: 3, notes: '' },
    ],
    summary: ''
  },
  {
    id: 'mentorship-culture',
    title: '4. Mentorship, Talent Development & Engineering Culture',
    weight: 10,
    items: [
      { skill: 'Mentoring senior/mid engineers', score: 3, notes: '' },
      { skill: 'Growing technical leaders', score: 3, notes: '' },
      { skill: 'Raising engineering quality standards', score: 3, notes: '' },
      { skill: 'Fostering impactful learning culture', score: 3, notes: '' },
    ],
    summary: ''
  },
  {
    id: 'execution-impact',
    title: '5. Execution, Ownership & Impact Delivery',
    weight: 15,
    items: [
      { skill: 'Executing large, multi-quarter initiatives', score: 3, notes: '' },
      { skill: 'Driving clarity in ambiguous situations', score: 3, notes: '' },
      { skill: 'Managing risk, trade-offs, and dependencies', score: 3, notes: '' },
      { skill: 'Delivering measurable business impact', score: 3, notes: '' },
      { skill: 'Ensuring long-term maintainability', score: 3, notes: '' },
    ],
    summary: ''
  },
  {
    id: 'stakeholder-alignment',
    title: '6. Communication, Stakeholder Alignment & Influence',
    weight: 10,
    items: [
      { skill: 'Communicating with executives & non-technical leads', score: 3, notes: '' },
      { skill: 'Translating strategy into actionable engineering plans', score: 3, notes: '' },
      { skill: 'Writing high-quality technical documents', score: 3, notes: '' },
      { skill: 'Handling conflict and technical disagreements', score: 3, notes: '' },
    ],
    summary: ''
  }
];
