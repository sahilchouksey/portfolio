#import "@preview/guided-resume-starter-cgc:2.0.0": *

#show: resume.with(
  author: "Sahil Chouksey",
  location: "Jabalpur, IN",
  contacts: (
    [#link("mailto:me@sahilchouksey.in")[Email]],
    [#link("https://sahilchouksey.in")[Website]],
    [#link("https://github.com/sahilchouksey")[GitHub]],
    [#link("https://linkedin.com/in/sahilchouksey")[LinkedIn]],
  ),
  // footer: [#align(center)[#emph[References available on request]]]
)

= Education
#edu(
  institution: link("rgpv.ac.in")[Rajiv Gandhi Proudyogiki Vishwavidyalaya (RGPV)],
  date: "July 2024 - Aug 2026",
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

= Skills
#skills((
  ("Programming Languages", (
    [JavaScript (ESNext)],
    [TypeScript],
    [Python],
    [Go],
    [PHP],
  )),
  ("Frameworks & Libraries", (
    [Node.js],
    [Next.js],
    [React.js],
    [NestJS],
    [LangChain],
    [LangGraph],
    [Express.js],
    [React Native],
    [Tailwind CSS],
  )),
  ("Databases & DevOps", (
    [PostgreSQL],
    [MongoDB],
    [MySQL],
    [Docker],
    [Git],
    [GitLab CI/CD],
    [Linux],
  )),
  ("Technical Skills", (
    [Full-Stack Development],
    [RAG Architecture],
    [LLM Integration],
    [API Design (RESTful)],
  )),
))


= Experience
#exp(
  role: "Full Stack Developer",
  project: "Suryavanshi Ventures",
  date: "July 2023 - Present",
  location: "Jabalpur, India",
  summary: [Led backend for #link("https://briohealth.ai")[BRIO Health AI] and owned cross-team integrations],
  details: [
    - Created *LangGraph* agent with custom *RAG pipeline* for intelligent query routing
    - Achieved *80% performance gains* in data pipelines using *Python/FastAPI* and *Redis*
    - Migrated to *Poetry* and optimized *GitLab CI/CD* for faster builds
    - Led 4-developer team delivering *Stripe-integrated* payment system in 2 weeks
  ]
)

#exp(
  role: "Full-Stack Software Engineer",
  project: "TVM Consulting Private Limited",
  date: "Aug 2023 - July 2024",
  location: "India",
  summary: "Engineered a platform for secure healthcare data management",
  details: [
    - Built healthcare platform with *Golang*, *Next.js/TypeScript*, *PostgreSQL* achieving *99.9% uptime*
    - Optimized GraphQL data layer reducing API calls by 60%, added Socket.IO notifications
    - Containerized with Docker, automated CI/CD achieving 95% test coverage
  ]
)

#exp(
  role: "Freelance Full-Stack Developer",
  project: "Independent Contractor",
  date: "Feb 2022 - July 2023",
  location: "India",
  summary: "Custom Full-Stack Application Development",
  details: [
    - Delivered 4 full-stack applications in *EdTech*, *career services*, *eSports* using MERN stack
  ]
)


= Projects
#exp(
  role: "Monefy - Expense Manager",
  project: "Sole Developer & Creator",
  date: "May 2025 - Aug 2025",
  summary: "Developed a secure, self-hosted expense management app to ensure user data privacy",
  details: [
    - Built solo: React/Next.js frontend, Node.js backend, deployed with Docker on Vercel
    - Designed secure PostgreSQL schema ensuring data integrity and privacy
  ]
)

#exp(
  role: link("https://soundrex.netlify.app")[Soundrex - Music Player],
  project: "Creator & Full-Stack Developer",
  date: "Aug 2021 - Feb 2022",
  summary: "Developed a full-stack frontend for YouTube Music with an integrated downloader service",
  details: [
    - Built Node.js downloader service with youtube-dl for YouTube audio streaming
    - Used MongoDB for metadata, React/Material UI for responsive frontend
  ]
)


= Certifications
#exp(
  role: link("https://www.udemy.com/certificate/UC-6721939e-bf79-40c2-8802-b1d45886a35d/")[React Native - The Practical Guide],
  project: "Udemy",
  date: "",
  details: []
)

#exp(
  role: link("https://www.udemy.com/certificate/UC-c3978598-a38c-4ede-ba2d-b52bedf4d5ca/")[NodeJS - The Complete Guide (MVC, REST APIs, GraphQL, Deno)],
  project: "Udemy",
  date: "",
  details: []
)

