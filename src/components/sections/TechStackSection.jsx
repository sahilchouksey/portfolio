import { useScrollAnimation } from '../../hooks/useScrollAnimation';

import EducationCard from './EducationCard';
import AIWorkflowDiagram from './AIWorkflowDiagram';
import './Timeline.css';
import { useState, useEffect } from 'react';

const TechStackSection = () => {
    const animation = useScrollAnimation('fadeInUp', { delay: 0, threshold: 0.1 });

    // Calculate years of experience from Aug 2023
    const [yoe, setYoe] = useState('');

    useEffect(() => {
        const startDate = new Date('2023-08-01');
        const currentDate = new Date();

        let years = currentDate.getFullYear() - startDate.getFullYear();
        let months = currentDate.getMonth() - startDate.getMonth();

        if (months < 0) {
            years--;
            months += 12;
        }

        const formattedYoe = `${String(years).padStart(2, '0')}.${String(months).padStart(2, '0')}`;
        setYoe(formattedYoe);
    }, []);

    // Tech icon mapping (using Simple Icons)
    const techIcons = {
        // Languages & Frameworks
        'JavaScript/TypeScript': 'javascript',
        'Python': 'python',
        'Go': 'go',
        'Next.js': 'nextdotjs',
        'React.js': 'react',
        'Node.js': 'nodedotjs',
        'Fiber v3': 'go',
        'LangChain/LangGraph': 'langchain',

        // AI/ML & Cloud
        'Vertex AI': 'googlecloud',
        'RAG Architecture': 'anthropic',
        'LLM Integration': 'huggingface',
        'Gemini APIs': 'googlegemini',
        'Google Cloud': 'googlecloud',
        'DigitalOcean GenAI': 'digitalocean',

        // Databases & DevOps
        'PostgreSQL': 'postgresql',
        'MongoDB': 'mongodb',
        'Redis': 'redis',
        'Docker': 'docker',
        'Git/GitLab CI/CD': 'gitlab',

        // Development Tools
        'Neovim': 'neovim',
        'Tmux': 'tmux',
        'dwm/Hyprland/i3': 'linux',
        'Zed': 'zedindustries',
        'Linux': 'linux'
    };

    const techStack = {
        'Languages & Frameworks': [
            'JavaScript/TypeScript',
            'Python',
            'Go',
            'Next.js',
            'React.js',
            'Node.js',
            'Fiber v3',
            'LangChain/LangGraph'
        ],
        'AI/ML & Cloud': [
            'Vertex AI',
            'RAG Architecture',
            'LLM Integration',
            'Gemini APIs',
            'Google Cloud',
            'DigitalOcean GenAI'
        ],
        'Databases & DevOps': [
            'PostgreSQL',
            'MongoDB',
            'Redis',
            'Docker',
            'Git/GitLab CI/CD'
        ]
    };

    const highlights = [
        {
            category: "Development Tools",
            items: [
                "Neovim",
                "Tmux",
                "dwm/Hyprland/i3",
                "Zed",
                "Linux"
            ]
        }
    ];

    const education = [
        {
            id: 1,
            degree: "Master of Computer Applications",
            university: "RGPV, Bhopal",
            date: "July 2024 - Aug 2026 (Part-Time)",
            gpa: "GPA: 7.8/10",
            logoSrc: "/images/rgpv-logo.png",
            link: "https://www.rgpv.ac.in"
        },
        {
            id: 2,
            degree: "Bachelor of Computer Applications",
            university: "Makhanlal Chaturvedi University",
            date: "July 2020 - Aug 2023",
            gpa: "GPA: 7.9/10",
            logoSrc: "/images/makhanlal-logo.png",
            link: "https://www.mcu.ac.in"
        }
    ];
    const experience = [
        // {
        //   period: 'Looking for opportunities',
        //   role: 'Available for hire',
        //   company: 'Your Company?',
        //   location: 'Remote',
        //   highlights: [],
        //   isHireMe: true
        // },
        {
            period: 'July 2024 - Nov 2025',
            role: 'Full Stack Developer',
            company: 'Suryavanshi Ventures',
            location: 'Remote, India',
            highlights: ['BRIO Health AI', 'Serma Events', 'Zuno Training', 'Whisp'],
            description: 'From agentic AI systems with LangGraph to payment automation with Stripe - shipped 4 products including BRIO Health AI, Serma Events, and Zuno Training. Promoted within 5 months.',
            logo: '/images/suryavanshi-logo.svg',
            link: 'https://suryavanshi.io'
        },
        {
            period: 'Aug 2023 - July 2024',
            role: 'Software Developer',
            company: 'TVM Consulting',
            location: 'Jabalpur, India',
            highlights: ['Doct App', 'Salesman Analytics', 'Pose Detection'],
            description: 'Built a healthcare platform with 4X faster APIs using Golang, automated stock management eliminating paper-based orders, and developed pose detection ML models with custom datasets.',
            logo: '/images/tvm-llc-logo.svg',
            link: 'https://tvm-llc.com'
        }
    ];

    return (
        <section id="Experience" className="section" ref={animation.ref}>
            <div className="container">
                {/* Bento Grid Layout */}
                <div className="w-layout-grid tech-experience-grid">
                    {/* Tech Stack Card */}
                    <div className="card tech-card">
                        <h3 className="h3-heading">tech stack.</h3>
                        <div className="tech-stack-container">
                            <div className="tech-stack-grid">
                                {Object.entries(techStack).map(([category, skills]) => (
                                    <div key={category} className="tech-category">
                                        <h6 className="h6-heading text-color-white">{category}</h6>
                                        <div className="tech-skills">
                                            {skills.map((skill, idx) => {
                                                const iconName = techIcons[skill];
                                                return (
                                                    <span key={idx} className="tech-skill" data-tooltip={skill}>
                                                        {skill}
                                                        {iconName && (
                                                            <span className="tech-icon-tooltip">
                                                                <img
                                                                    src={`https://cdn.simpleicons.org/${iconName}/fff`}
                                                                    alt={skill}
                                                                    className="tech-icon"
                                                                />
                                                            </span>
                                                        )}
                                                    </span>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}

                                {/* Highlights merged into same grid */}
                                {highlights.map((section, idx) => (
                                    <div key={`highlight-${idx}`} className="tech-category">
                                        <h6 className="h6-heading text-color-white">{section.category}</h6>
                                        <div className="tech-skills">
                                            {section.items.map((item, i) => {
                                                const iconName = techIcons[item];
                                                return (
                                                    <span key={i} className="tech-skill" data-tooltip={item}>
                                                        {item}
                                                        {iconName && (
                                                            <span className="tech-icon-tooltip">
                                                                <img
                                                                    src={`https://cdn.simpleicons.org/${iconName}/fff`}
                                                                    alt={item}
                                                                    className="tech-icon"
                                                                />
                                                            </span>
                                                        )}
                                                    </span>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Experience Card */}
                    <div className="card experience-card">
                        <div className="experience-header">
                            <h3 className="h3-heading">experience.</h3>
                            {yoe && (
                                <div className="experience-yoe">
                                    {yoe} YOE
                                </div>
                            )}
                        </div>
                        <div className="timeline">
                            {experience.map((exp, idx) => (
                                <div key={idx} className="timeline-item">
                                    {/* Marker with logo */}
                                    <div className="timeline-marker">
                                        {exp.isHireMe ? (
                                            <div className="timeline-marker-question">?</div>
                                        ) : (
                                            <a 
                                                href={exp.link ?? "#"} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="timeline-marker-link"
                                            >
                                                <img
                                                    src={exp.logo}
                                                    alt={exp.company}
                                                    className="timeline-marker-logo"
                                                />
                                                <div className="timeline-marker-overlay">
                                                    <svg
                                                        className="timeline-marker-arrow"
                                                        width="20"
                                                        height="20"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                    >
                                                        <path
                                                            d="M7 17L17 7M17 7H7M17 7V17"
                                                            stroke="currentColor"
                                                            strokeWidth="2"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        />
                                                    </svg>
                                                </div>
                                            </a>
                                        )}
                                    </div>

                                    {/* 2-column layout: left = details, right = description */}
                                    {exp.link ? (
                                        <a
                                            href={exp.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="timeline-content-link"
                                        >
                                            <div className="timeline-item-grid">
                                                {/* Left side: Job details */}
                                                <div className="timeline-content">
                                                    <div className="timeline-period">{exp.period}</div>
                                                    <h6 className="h6-heading text-color-white">{exp.role}</h6>
                                                    <div className="body-large text-color-gray">
                                                        {exp.company}{exp.location && ` • ${exp.location}`}
                                                    </div>
                                                    {exp.highlights.length > 0 && (
                                                        <div className="timeline-highlights">
                                                            {exp.highlights.map((h, i) => (
                                                                <span key={i} className="highlight-tag">
                                                                    {h}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Right side: Description */}
                                                {exp.description && (
                                                    <div className="timeline-description-container">
                                                        <p className="timeline-description">{exp.description}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </a>
                                    ) : (
                                        <div className="timeline-item-grid">
                                            {/* Left side: Job details */}
                                            <div className="timeline-content">
                                                <div className="timeline-period">{exp.period}</div>
                                                <h6 className="h6-heading text-color-white">{exp.role}</h6>
                                                <div className="body-large text-color-gray">
                                                    {exp.company}{exp.location && ` • ${exp.location}`}
                                                </div>
                                                {exp.isHireMe && (
                                                    <a
                                                        href="mailto:your-email@example.com"
                                                        className="hire-me-button"
                                                    >
                                                        Hire Me
                                                    </a>
                                                )}
                                                {exp.highlights.length > 0 && (
                                                    <div className="timeline-highlights">
                                                        {exp.highlights.map((h, i) => (
                                                            <span key={i} className="highlight-tag">
                                                                {h}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Right side: Description */}
                                            {exp.description && (
                                                <div className="timeline-description-container">
                                                    <p className="timeline-description">{exp.description}</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Education Card */}
                    <div className="card education-bento-card">
                        <h3 className="h3-heading">education.</h3>
                        <div className="education-list">
                            {education.map((edu) => (
                                <EducationCard key={edu.id} {...edu} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TechStackSection;
