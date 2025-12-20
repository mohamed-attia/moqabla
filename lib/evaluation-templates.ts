
import { EvaluationSection } from '../types';

export const FRESH_EVALUATION_TEMPLATE: EvaluationSection[] = [
  {
    id: 'fundamentals',
    title: '1. أساسيات البرمجة (Programming Fundamentals)',
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
    id: 'problem-solving',
    title: '2. حل المشكلات والتفكير المنطقي (Problem-Solving)',
    weight: 25,
    items: [
      { skill: 'Understanding the problem', score: 3, notes: '' },
      { skill: 'Breaking problems into steps', score: 3, notes: '' },
      { skill: 'Writing a simple logical solution', score: 3, notes: '' },
      { skill: 'Handling simple edge cases', score: 3, notes: '' },
      { skill: 'Explaining the solution clearly', score: 3, notes: '' },
    ],
    summary: ''
  },
  {
    id: 'data-structures',
    title: '3. هياكل البيانات - الأساسيات (Data Structures Basics)',
    weight: 15,
    items: [
      { skill: 'Arrays / Lists usage', score: 3, notes: '' },
      { skill: 'Strings handling', score: 3, notes: '' },
      { skill: 'Basic Maps / Objects', score: 3, notes: '' },
      { skill: 'Choosing the right data structure', score: 3, notes: '' },
    ],
    summary: ''
  },
  {
    id: 'sw-dev-fundamentals',
    title: '4. أساسيات تطوير البرمجيات (SW Dev Fundamentals)',
    weight: 15,
    items: [
      { skill: 'Understanding software projects', score: 3, notes: '' },
      { skill: 'Awareness of SDLC basics', score: 3, notes: '' },
      { skill: 'Git basics (add, commit)', score: 3, notes: '' },
      { skill: 'Bug vs Feature understanding', score: 3, notes: '' },
    ],
    summary: ''
  },
  {
    id: 'attitude',
    title: '5. القدرة على التعلم والسلوك (Learning Ability & Attitude)',
    weight: 10,
    items: [
      { skill: 'Willingness to learn', score: 3, notes: '' },
      { skill: 'Accepting feedback', score: 3, notes: '' },
      { skill: 'Persistence when stuck', score: 3, notes: '' },
      { skill: 'Asking questions', score: 3, notes: '' },
    ],
    summary: ''
  },
  {
    id: 'communication',
    title: '6. أساسيات التواصل (Communication Basics)',
    weight: 5,
    items: [
      { skill: 'Clear explanation', score: 3, notes: '' },
      { skill: 'Understanding questions', score: 3, notes: '' },
      { skill: 'Honest communication', score: 3, notes: '' },
    ],
    summary: ''
  }
];

export const JUNIOR_EVALUATION_TEMPLATE: EvaluationSection[] = [
  {
    id: 'coding-quality',
    title: '1. جودة الكود والبرمجة (Programming & Coding Quality)',
    weight: 25,
    items: [
      { skill: 'Clean & maintainable code', score: 3, notes: '' },
      { skill: 'Functions & modular design', score: 3, notes: '' },
      { skill: 'Error handling basics', score: 3, notes: '' },
      { skill: 'OOP concepts (Inheritance, Classes)', score: 3, notes: '' },
      { skill: 'Code structure & naming', score: 3, notes: '' },
    ],
    summary: ''
  },
  {
    id: 'algorithms',
    title: '2. حل المشكلات والخوارزميات (Problem-Solving & Algorithms)',
    weight: 25,
    items: [
      { skill: 'Breaking complex problems', score: 3, notes: '' },
      { skill: 'Designing step-by-step solutions', score: 3, notes: '' },
      { skill: 'Handling edge cases', score: 3, notes: '' },
      { skill: 'Searching & Sorting algorithms', score: 3, notes: '' },
      { skill: 'Correctness vs Efficiency balance', score: 3, notes: '' },
    ],
    summary: ''
  },
  {
    id: 'ds-knowledge',
    title: '3. المعرفة بهياكل البيانات (Data Structures Knowledge)',
    weight: 15,
    items: [
      { skill: 'Arrays, Lists, Stacks, Queues', score: 3, notes: '' },
      { skill: 'Hash maps / Dictionaries usage', score: 3, notes: '' },
      { skill: 'Choosing right DS', score: 3, notes: '' },
      { skill: 'Time/Space trade-offs awareness', score: 3, notes: '' },
    ],
    summary: ''
  },
  {
    id: 'se-practices',
    title: '4. ممارسات هندسة البرمجيات (Software Engineering Practices)',
    weight: 15,
    items: [
      { skill: 'Git branching & workflow', score: 3, notes: '' },
      { skill: 'Simple Unit Testing', score: 3, notes: '' },
      { skill: 'Debugging & Troubleshooting', score: 3, notes: '' },
      { skill: 'Dev/Stage/Prod environments', score: 3, notes: '' },
      { skill: 'Documentation skills', score: 3, notes: '' },
    ],
    summary: ''
  },
  {
    id: 'system-basics',
    title: '5. أساسيات الأنظمة والمعمارية (System & Architecture Basics)',
    weight: 10,
    items: [
      { skill: 'Understanding of APIs', score: 3, notes: '' },
      { skill: 'Client-server concepts', score: 3, notes: '' },
      { skill: 'Basic database concepts', score: 3, notes: '' },
      { skill: 'Scalability & Performance awareness', score: 3, notes: '' },
    ],
    summary: ''
  },
  {
    id: 'teamwork',
    title: '6. التواصل والتعاون (Communication & Collaboration)',
    weight: 10,
    items: [
      { skill: 'Explaining technical ideas', score: 3, notes: '' },
      { skill: 'Working with feedback', score: 3, notes: '' },
      { skill: 'Pair programming & teamwork', score: 3, notes: '' },
      { skill: 'Asking clarifying questions', score: 3, notes: '' },
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
