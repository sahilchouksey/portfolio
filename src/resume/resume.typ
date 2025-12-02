#import "templates/resume.template.typ": *

#set text(size: 9pt)

#show: resume.with(
  author: "Sahil Chouksey",
  location: "Jabalpur, IN",
  contacts: (
    [#link("mailto:me@sahilchouksey.in")[me\@sahilchouksey.in]],
    [#link("https://sahilchouksey.in")[sahilchouksey.in]],
    [#link("https://github/sahilchouksey")[github/sahilchouksey]],
    [#link("https://linkedin/sahilchouksey")[linkedin/sahilchouksey]],
  ),
  // footer: [#align(center)[#emph[References available on request]]]
)

= Experience

#exp(
  role: "Full Stack Developer (Promoted)",
  project: "SV (Suryavanshi Ventures)",
  date: "July 2023 - Present",
  location: "Jabalpur, India",
  summary: [Led backend for #link("https://briohealth.ai")[BRIO AI] and enterprise apps],
  details: [
    - *BRIO Health AI*: Built agentic search engine (autonomous system with multi-step reasoning) using *LangGraph*, *Vertex AI RAG*, *Gemini-2.5-Flash*
    - Reduced PDF processing time by *60-65%* (10min to 3.5min for 100-page medical documents) with custom OCR and intelligent chunk processing (semantic document segmentation to preserve medical context)
    - Built backend systems for Research Studio, Paper Vault, AI Notebook, AI Transcribe with RAG capabilities, accelerating literature review by 40% and improving document retrieval efficiency by 35%
    - Implemented *Mem0.ai* memory system, achieving *2X better response quality* (50% reduction in hallucination rates, 30% increase in user satisfaction) through persistent context and conversation state management
    - *Serma Event Management*: Led Finance system with *Stripe webhooks*, automated invoice generation
    - *Zuno Training*: Built canvas-based course creation with *D3.js*, unified multimedia interface
    - *Whisp Landing Page*: Optimized UI with *Tailwind CSS*, improved load time by *50%* (4s to 2s, measured via Lighthouse)
  ]
)

#exp(
  role: "Software Developer (Promoted)",
  project: "TVM Consulting Private Limited",
  date: "Aug 2022 - July 2023",
  location: "India",
  summary: "Engineered healthcare platforms and analytics systems",
  details: [
    - *Doct App*: Built healthcare platform with *Golang/GIN*, *Next.js 13*, *PostgreSQL*, achieving *4X faster APIs* (200ms to 50ms response time, outperforming industry benchmarks of 150ms)
    - Implemented role-based access control, encrypted database entries for *HIPAA compliance*, reducing data breach risks by 70%
    - Developed patient document management with S3 integration, enabling progress monitoring with 20% greater precision in recovery tracking
    - *Salesman Analytics*: Created admin dashboard with *Vite + React.js*, automated MARG ERP extraction
    - Improved salesman experience by *50%* eliminating paper-based orders, real-time price transparency
    - *Pose Detection*: Developed CNN and MediaPipe solution for posture analysis with custom datasets (5,000+ annotated images across diverse demographics and posture types)
  ]
)

= Skills
#skills((
  ("Languages & Frameworks", (
    [JavaScript (ES6+)/TypeScript],
    [Python],
    [Go],
    [Next.js],
    [React.js],
    [Node.js],
    [LangChain/LangGraph],
  )),
  ("AI/ML & Cloud", (
    [Vertex AI],
    [RAG Architecture],
    [LLM Integration],
    [Google Cloud],
    [S3/GCS],
    [Gemini APIs],
  )),
  ("Databases & DevOps", (
    [PostgreSQL],
    [MongoDB],
    [Redis],
    [Docker],
    [Git/GitLab CI/CD],
    [Linux],
  )),
  ("Technical Skills", (
    [Full-Stack Development (scalable microservices)],
    [API Design (RESTful, performance optimization)],
    [Payment Integration],
    [Healthcare Compliance (HIPAA)],
  )),
))

= Education
#edu(
  institution: link("rgpv.ac.in")[Rajiv Gandhi Proudyogiki Vishwavidyalaya (RGPV)],
  date: "July 2024 - Aug 2026 (Part-Time)",
  location: "Bhopal, India",
  gpa: "7.8/10",
  degrees: (
    ("Master of Computer Applications", "Computer Science and Engineering"),
  ),
)

#edu(
  institution: link("mcu.ac.in")[Makhanlal Chaturvedi University],
  date: "July 2020 - Aug 2023",
  location: "Bhopal, India",
  gpa: "7.9/10",
  degrees: (
    ("Bachelor of Computer Applications", "Computer Applications"),
  ),
)

= Certifications
- #link("https://www.udemy.com/certificate/UC-6721939e-bf79-40c2-8802-b1d45886a35d/")[*React Native - The Practical Guide*] - Udemy
- #link("https://www.udemy.com/certificate/UC-c3978598-a38c-4ede-ba2d-b52bedf4d5ca/")[*NodeJS - The Complete Guide (MVC, REST APIs, GraphQL, Deno)*] - Udemy





