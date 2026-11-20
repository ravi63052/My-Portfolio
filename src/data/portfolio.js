// Null links intentionally stay hidden until a repository or asset is verified.
export const profile = {
  name: 'Ravi Goud', email: 'uduthalaravigoud4@gmail.com',
  github: 'https://github.com/ravi63052',
  linkedin: 'https://www.linkedin.com/in/ravi-goud-uduthala',
  location: 'Hyderabad, India', availability: 'Open to conversations',
  resume: '/resume/Ravi-Goud.pdf',
};

export const skillGroups = [
  { name: 'Frontend', mark: '</>', summary: 'Interfaces that feel intuitive, on every screen.', skills: ['HTML', 'CSS', 'JavaScript', 'React.js', 'Responsive Design'] },
  { name: 'Backend', mark: '{ }', summary: 'Secure APIs and reliable application logic.', skills: ['Node.js', 'Express.js', 'REST APIs', 'JWT Authentication', 'Input Validation'] },
  { name: 'Databases', mark: 'DB', summary: 'Thoughtful schemas. Useful, efficient queries.', skills: ['MongoDB', 'MySQL', 'SQL', 'Query Optimization'] },
  { name: 'AI & GenAI', mark: '✳', summary: 'Connecting language models to practical workflows.', skills: ['LLMs', 'OpenAI GPT API', 'Google Gemini API', 'Groq AI', 'Prompt Engineering', 'Structured Output'] },
  { name: 'Languages & tools', mark: 'git', summary: 'The foundations behind the build.', skills: ['Python', 'JavaScript', 'Java', 'Git', 'GitHub', 'Vercel', 'VS Code'] },
  { name: 'Currently learning', mark: '+', summary: 'Exploring the next layer, one project at a time.', learning: true, skills: ['Spring Boot', 'RAG', 'LangChain', 'FAISS', 'ChromaDB', 'FastAPI', 'Machine Learning basics'] },
];

export const projects = [
  {
    id: 'mediguide', title: 'MediGuide', fullTitle: 'MediGuide Healthcare Assistance Platform',
    category: 'FULL STACK · HEALTHCARE · AI', accent: 'mint',
    description: 'Bringing appointments, prescriptions, and medicine information into one connected healthcare experience.',
    problem: 'Healthcare tasks often live in separate workflows. Patients need a clear way to manage appointments and understand prescription information.',
    solution: 'A React interface connects patient profiles and appointments with an Express API, MongoDB records, OCR, and AI-assisted medicine information.',
    stack: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'JWT', 'Groq AI', 'Tesseract.js'],
    features: ['Registration and login with bcrypt password hashing', 'JWT authentication using HttpOnly cookies and protected profiles', 'Appointment booking and cancellation', 'Prescription image OCR and PDF text extraction', 'Medicine matching against MongoDB records', 'Hospital search with OpenStreetMap', 'MongoDB caching with stale-cache fallback'],
    decisions: ['Keep authentication tokens in HttpOnly cookies to reduce exposure to client-side scripts.', 'Match extracted medicine names with database records before enriching information through AI.', 'Use a stale cached response when an upstream lookup is unavailable.'],
    challenges: [['Unstructured prescriptions', 'Separate OCR extraction, medicine matching, and AI enrichment into understandable stages.'], ['External service availability', 'Use caching and a stale-cache fallback instead of making every request depend on an upstream service.']],
    architecture: [
      ['Patient interface', 'React handles profiles, appointments, and prescription uploads.'],
      ['Secure API', 'Express routes apply input validation and JWT cookie authentication.'],
      ['Processing layer', 'Tesseract.js and PDF extraction turn prescriptions into text. Groq enriches medicine information.'],
      ['Data & discovery', 'MongoDB stores records and cache entries. OpenStreetMap supports hospital search.'],
    ],
    note: 'Core features were confirmed in the local MediGuide source. This is an educational healthcare demo, not a clinical system. Google Places is optional; the dedicated prescription workspace is still a placeholder, while extraction is available in medicine lookup.',
    github: 'https://github.com/ravi63052/MediGuide', demo: null,
  },
  {
    id: 'text-to-sql', title: 'AI Text-to-SQL', fullTitle: 'AI Text-to-SQL Assistant',
    category: 'GENERATIVE AI · DATA TOOLS', accent: 'violet',
    description: 'Ask a question in plain English. Follow its journey into validated SQL and readable results.',
    problem: 'Getting an answer from a relational database usually requires knowing both SQL syntax and the underlying schema.',
    solution: 'Supply schema context to Gemini, generate SQL from a natural-language question, validate it, and present the query alongside its results.',
    stack: ['React.js', 'JavaScript', 'Node.js', 'Express.js', 'MySQL', 'Google Gemini API'],
    features: ['Natural-language questions with database schema context', 'Gemini-generated SQL with validation', 'SELECT-only query restrictions', 'Generated SQL and query results display', 'Database schema viewer and query history', 'Loading states and error handling'],
    decisions: ['Provide schema context so generation uses known tables and columns.', 'Treat model output as untrusted input and validate it before database execution.', 'Show generated SQL so the translation remains visible to the user.'],
    challenges: [['Unsafe model output', 'The source applies SELECT-only, single-statement, keyword, table, and column checks. A restricted read-only database account remains a deployment recommendation.'], ['Ambiguous questions', 'Make the schema and generated SQL visible so users can inspect the interpretation.']],
    architecture: [['Question', 'The user describes the information they need.'], ['Gemini AI', 'The prompt includes the database schema as context.'], ['SQL validation', 'Check generated SQL and enforce SELECT-only restrictions.'], ['MySQL', 'Execute the validated query against the configured database.'], ['Results', 'Display rows and retain query history in the browser.']],
    note: 'The portfolio demonstration uses fixed, local sample data. It does not call Gemini or connect to a database. Core project functionality and repository identity were checked against the local source.',
    github: 'https://github.com/ravi63052/AI-SQL-Assistant', demo: null,
  },
  {
    id: 'energy-agent', title: 'Energy Maintenance Agent', fullTitle: 'Renewable-Energy Maintenance Ticket Prioritization Agent',
    category: 'APPLIED AI · RENEWABLE ENERGY', accent: 'amber',
    description: 'Turning maintenance tickets into explainable priorities and practical team-routing recommendations.',
    problem: 'Maintenance teams need a consistent way to triage incoming renewable-energy issues and identify safety-sensitive tickets.',
    solution: 'Combine keyword classification, TF-IDF retrieval, cosine similarity, severity rules, and a safety override to suggest actions and team routing.',
    stack: ['Python', 'FastAPI', 'scikit-learn', 'TF-IDF', 'Gemini API'],
    features: ['Maintenance ticket analysis and issue classification', 'Severity scoring with a safety override', 'TF-IDF retrieval and cosine similarity', 'Root-cause hypotheses and recommended actions', 'Maintenance-team routing recommendations', 'Optional Gemini explanations'],
    decisions: ['Use interpretable rules and retrieved examples to make recommendations inspectable.', 'Apply a safety override before normal severity routing.', 'Keep Gemini explanations optional so the core workflow can operate independently.'],
    challenges: [['Limited training material', 'Use a small bundled example dataset transparently; avoid claims of production-trained predictive accuracy.'], ['Safety-sensitive reports', 'Elevate explicit hazard keywords for human review and keep recommendations advisory.']],
    architecture: [['Ticket', 'Receive the maintenance issue through FastAPI.'], ['Classification', 'Keyword rules identify the issue category.'], ['Retrieval', 'TF-IDF and cosine similarity find relevant bundled examples.'], ['Priority & routing', 'Severity rules and safety overrides recommend a team.'], ['Explanation', 'Return hypotheses and actions, with optional Gemini enrichment.']],
    note: 'The resume describes retrieval over six bundled examples, not a production-trained predictive ML system. The preview illustrates the workflow using local samples. The Python repository has not been independently inspected.',
    github: null, demo: null,
  },
];
