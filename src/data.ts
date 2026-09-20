import { LeadershipMember, WorkshopEvent } from './types';

export const HONORED_GUESTS: LeadershipMember[] = [
  {
    id: 'santosh-rebello',
    name: 'Mr. Santosh Rebello',
    role: 'Guest of Honor',
    departmentRole: 'Salesforce',
    category: 'guest',
    subCategoryTitle: 'Keynote Speaker',
    initials: 'SR',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80',
    badge: 'KEYNOTE SPEAKER',
    tag: 'Guest of Honor'
  },
  {
    id: 'stephen-pinto',
    name: 'Mr. Stephen Pinto',
    role: 'Technical Mentor',
    departmentRole: 'Salesforce & SJEC Alumnus',
    category: 'guest',
    subCategoryTitle: 'Alumni Guide',
    initials: 'SP',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80',
    badge: 'ALUMNI GUIDE',
    tag: 'Technical Mentor'
  },
  {
    id: 'rio-dsouza',
    name: "Dr. Rio D'Souza",
    role: 'Presidential Address',
    departmentRole: 'Principal, SJEC',
    category: 'guest',
    subCategoryTitle: 'Patron',
    initials: 'RD',
    photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&auto=format&fit=crop&q=80',
    badge: 'PATRON',
    tag: 'Principal, SJEC'
  },
  {
    id: 'melwyn-dsouza',
    name: "Dr. Melwyn D'Souza",
    role: 'Program Chair',
    departmentRole: 'HOD, Computer Science & Engg',
    category: 'guest',
    subCategoryTitle: 'Department Head',
    initials: 'MD',
    photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&auto=format&fit=crop&q=80',
    badge: 'DEPARTMENT HEAD',
    tag: 'HOD, CSE'
  }
];

export const FACULTY_COUNCIL: LeadershipMember[] = [
  {
    id: 'nisha-roche',
    name: 'Ms. Nisha Roche',
    role: 'Assistant Professor, CSE',
    departmentRole: 'Faculty Coordinator',
    category: 'faculty',
    initials: 'NR',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80',
    badge: 'FACULTY COORDINATOR',
    tag: 'CSE Department'
  },
  {
    id: 'keith-fernandes',
    name: 'Mr. Keith Fernandes',
    role: 'Assistant Professor, CSE',
    departmentRole: 'Faculty Coordinator',
    category: 'faculty',
    initials: 'KF',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
    badge: 'LEADERSHIP',
    tag: 'CSE Department'
  }
];

export const STUDENT_OFFICERS: LeadershipMember[] = [
  {
    id: 'ruben-saldanha',
    name: 'Ruben Saldanha',
    role: 'President',
    subCategoryTitle: 'Executive President',
    departmentRole: 'Student President • AgentBlazer Club',
    category: 'core-officer',
    description: 'Guiding club vision, university collaborations, and strategic workshop series.',
    initials: 'RS',
    photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&auto=format&fit=crop&q=80',
    badge: 'LEADERSHIP',
    college: 'SJEC CSE'
  },
  {
    id: 'ajay-preenal-dsouza',
    name: 'Ajay Preenal Dsouza',
    role: 'Vice President',
    subCategoryTitle: 'Executive Vice President',
    departmentRole: 'Vice President • AgentBlazer Club',
    category: 'core-officer',
    description: 'Coordinating student mentorship, event operations, and community growth.',
    initials: 'AP',
    photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&auto=format&fit=crop&q=80',
    badge: 'LEADERSHIP',
    college: 'SJEC CSE'
  },
  {
    id: 'stevin-dsouza',
    name: 'Stevin Dsouza',
    role: 'Tech Lead',
    subCategoryTitle: 'Technical Director',
    departmentRole: 'Technical Director • AgentBlazer Club',
    category: 'core-officer',
    description: 'Technical architect, hands-on lab environments, and repository supervision.',
    initials: 'SD',
    photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80',
    badge: 'LEADERSHIP',
    college: 'SJEC CSE'
  },
  {
    id: 'frenny-chrystal-saldanha',
    name: 'Frenny Chrystal Saldanha',
    role: 'Resource Head',
    subCategoryTitle: 'Operations & Logistics',
    departmentRole: 'Resource Head • AgentBlazer Club',
    category: 'core-officer',
    description: 'Managing cloud compute budgets, venue infrastructure, and participant toolkits.',
    initials: 'FC',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
    badge: 'LEADERSHIP',
    college: 'SJEC CSE'
  },
  {
    id: 'joyline-galbao',
    name: 'Joyline Galbao',
    role: 'Secretary',
    subCategoryTitle: 'Administration',
    departmentRole: 'Secretary • AgentBlazer Club',
    category: 'core-officer',
    description: 'Documentation, accreditation reporting, meeting minutes, and member onboarding.',
    initials: 'JG',
    photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80',
    badge: 'LEADERSHIP',
    college: 'SJEC CSE'
  },
  {
    id: 'chinthan-nv',
    name: 'Chinthan N V',
    role: 'Media Head',
    subCategoryTitle: 'Creative Outreach',
    departmentRole: 'Media Head • AgentBlazer Club',
    category: 'core-officer',
    description: 'Brand storytelling, photo documentation, visual design, and social publications.',
    initials: 'CN',
    photoUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=600&auto=format&fit=crop&q=80',
    badge: 'LEADERSHIP',
    college: 'SJEC CSE'
  }
];

export const CORE_WORKING_COMMITTEE: LeadershipMember[] = [
  {
    id: 'prajwal-cordero',
    name: 'Prajwal Royston Cordero',
    role: 'AI & LLM Research Section',
    departmentRole: 'Core Working Committee • AI Research',
    category: 'working-committee',
    initials: 'PR',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80',
    description: 'Autonomous agents research, fine-tuning evaluations, and model benchmarking.',
    college: 'SJEC CSE'
  },
  {
    id: 'chacko-abraham',
    name: 'Chacko P Abraham',
    role: 'Model Evaluation Benchmarks',
    departmentRole: 'Core Working Committee • Benchmarks',
    category: 'working-committee',
    initials: 'CA',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80',
    description: 'Hardware profiling, local LLM quantization, and evaluation benchmarks.',
    college: 'SJEC CSE'
  },
  {
    id: 'alma-pereira',
    name: 'Alma Roxane Pereira',
    role: 'Field Operations & Logistics',
    departmentRole: 'Core Working Committee • Field Operations',
    category: 'working-committee',
    initials: 'AP',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop&q=80',
    description: 'Hackathon execution, lab resource allocation, and student participant coordination.',
    college: 'SJEC CSE'
  }
];

export const WORKSHOP_EVENTS: WorkshopEvent[] = [
  {
    id: 'gsoc-llm-workshop',
    date: 'February 14, 2026',
    tag: 'FLAGSHIP MASTERCLASS',
    tagType: 'flagship',
    title: 'Master the Future: A Hands-on GSoC & LLMs Workshop',
    description: 'Practical masterclass on open-source Git PR workflows, Retrieval-Augmented Generation (RAG), Gemini AI, LangChain, LlamaIndex, Crawl4AI, and live Gradio prototyping.',
    attendees: '80 Shortlisted Students',
    location: 'CSE Systems Lab 3',
    photosCount: 6,
    gallery: [
      {
        id: 'gsoc-1',
        url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=900&auto=format&fit=crop&q=80',
        title: 'Live RAG Architecture Walkthrough',
        caption: 'GSoC contributor and mentor demonstrating LangChain pipelines and local embeddings.',
        tag: 'Session Demo'
      },
      {
        id: 'gsoc-2',
        url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=900&auto=format&fit=crop&q=80',
        title: 'Hands-on Student Teams',
        caption: 'Undergraduate teams debugging Git branches and testing vector store retrieval limits.',
        tag: 'Lab Session'
      },
      {
        id: 'gsoc-3',
        url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=900&auto=format&fit=crop&q=80',
        title: 'Gradio Prototyping Showcase',
        caption: 'Live prototype deployment directly to HuggingFace Spaces within the workshop window.',
        tag: 'Deployment'
      }
    ]
  },
  {
    id: 'prompt-ops-2k26',
    date: 'March 25, 2026',
    tag: 'LIVE CONTEST',
    tagType: 'contest',
    title: 'PROMPT OPS-2K26 Challenge',
    description: 'Fast-paced prompt engineering hackathon featuring automated test suites, iterative refinement, teamwork, and live algorithmic problem solving.',
    tracks: ['Track 1: 1st Year Engineers', 'Track 2: 2nd Year Engineers'],
    photosCount: 10,
    attendees: '120 Registered Teams',
    location: 'CSE Department • Block 2',
    gallery: [
      {
        id: 'prompt-1',
        url: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=900&auto=format&fit=crop&q=80',
        title: 'PROMPT OPS-2K26 Challenge Banner & Live Arena',
        caption: 'CSE Department • AgentBlazer Club & Cipher hackathon kickoff and countdown.',
        tag: 'Official Contest'
      },
      {
        id: 'prompt-2',
        url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=900&auto=format&fit=crop&q=80',
        title: 'Contestants at Work',
        caption: 'First and second year engineers collaborating on test-driven prompt iterations.',
        tag: 'Hackathon Round'
      },
      {
        id: 'prompt-3',
        url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=900&auto=format&fit=crop&q=80',
        title: 'Evaluation Leaderboard',
        caption: 'Real-time scoring rubric evaluating zero-shot precision and token efficiency.',
        tag: 'Leaderboard'
      },
      {
        id: 'prompt-4',
        url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=900&auto=format&fit=crop&q=80',
        title: 'Award Ceremony & Recognition',
        caption: 'Cash prizes and Salesforce certification vouchers awarded to the top 3 finalists.',
        tag: 'Valedictory'
      }
    ]
  },
  {
    id: 'agentforce-symposium',
    date: 'August 25, 2025',
    tag: 'SYMPOSIUM KEYNOTE',
    tagType: 'symposium',
    title: 'Agentforce Technical Deep-Dive',
    description: 'Guiding undergraduate engineers from prompt prediction to autonomous agentic architectures, Salesforce Data Cloud integration, and real-time enterprise workflows.',
    guestSpeaker: 'Mr. Santosh Rebello (Salesforce)',
    location: 'CSE Auditorium',
    attendees: 'Inaugural Technical Session',
    photosCount: 5,
    gallery: [
      {
        id: 'agentforce-1',
        url: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=900&auto=format&fit=crop&q=80',
        title: 'Agentforce Keynote Session',
        caption: 'Keynote address exploring autonomous AI agents in production CRM architectures.',
        tag: 'Keynote'
      },
      {
        id: 'agentforce-2',
        url: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=900&auto=format&fit=crop&q=80',
        title: 'Department Auditorium Gathering',
        caption: 'Faculty, university delegates, and 300+ students during the inaugural launch.',
        tag: 'Auditorium'
      }
    ]
  },
  {
    id: 'demystifying-generative-models',
    date: 'March 19, 2026',
    tag: 'STUDENT LAB',
    tagType: 'student-lab',
    title: 'Demystifying Generative Models',
    description: 'Exploring Transformer mechanisms, multi-agent consensus networks, and comparative latency benchmarks of LLaMA, Groq, and Mistral architectures.',
    sessionLeads: 'Prajwal Royston Cordero & Chacko P Abraham',
    location: 'Systems Lab',
    attendees: 'Hands-on Code Walkthrough',
    photosCount: 4,
    gallery: [
      {
        id: 'gen-1',
        url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=900&auto=format&fit=crop&q=80',
        title: 'Attention Mechanism Visualization',
        caption: 'Mathematical breakdown of multi-head self-attention and KV cache memory constraints.',
        tag: 'Deep Dive'
      },
      {
        id: 'gen-2',
        url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=900&auto=format&fit=crop&q=80',
        title: 'Inference Benchmarking Lab',
        caption: 'Measuring token generation latencies across quantized model checkpoints.',
        tag: 'Benchmark'
      }
    ]
  },
  {
    id: 'cyber-security-pathways',
    date: 'April 01, 2026',
    tag: 'SECURITY WORKSHOP',
    tagType: 'security',
    title: 'Cyber Security & Career Pathways',
    description: 'Interactive demonstrations covering Shodan discovery, OSINT methods, CVE vulnerability analysis, SQL injection scenarios, and the Cyber Kill Chain.',
    guestSpeaker: 'Mr. Suhas Nayak (Cyber Security Specialist)',
    location: 'VI Sem CSE Cohort',
    attendees: 'Interactive Security Demo',
    photosCount: 3,
    gallery: [
      {
        id: 'sec-1',
        url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=900&auto=format&fit=crop&q=80',
        title: 'Cyber Security & Career Pathways Poster & Session',
        caption: 'Guest Speaker Mr. Suhas Nayak conducting real-time threat intelligence labs.',
        tag: 'Poster & Talk'
      },
      {
        id: 'sec-2',
        url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=900&auto=format&fit=crop&q=80',
        title: 'Live Network Packet Capture',
        caption: 'Demonstrating defensive OSINT tools and privilege escalation mitigation.',
        tag: 'Defense'
      }
    ]
  },
  {
    id: 'agentforce-dev-lab',
    date: 'May 22, 2026',
    tag: 'DEVELOPER LAB',
    tagType: 'developer-lab',
    title: 'Hands-on Agentforce & AI Agents',
    description: 'Applied development lab creating Flex Prompts, dynamic contextual Sales Email templates, and autonomous event triggers within modern CRM ecosystems.',
    platform: 'Salesforce Developer Sandbox',
    location: 'Cloud Computing Lab',
    attendees: 'Guided Practical Exercises',
    photosCount: 5,
    gallery: [
      {
        id: 'dev-1',
        url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=900&auto=format&fit=crop&q=80',
        title: 'Salesforce Agentforce Sandbox Environment',
        caption: 'Creating prompt templates with merge fields and automated action invocations.',
        tag: 'Sandbox Lab'
      },
      {
        id: 'dev-2',
        url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=900&auto=format&fit=crop&q=80',
        title: 'Autonomous Trigger Testing',
        caption: 'Students deploying real-time webhook listeners to invoke agent decision flows.',
        tag: 'Production'
      }
    ]
  }
];
