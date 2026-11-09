import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import tools from '../../micro/tools.json';
import React from 'react';

import EducationCard from './EducationCard';
import './Timeline.css';
import { useState, useEffect } from 'react';


const TOOLS_BY_LABEL = Object.fromEntries(tools.map((t) => [t.label, t]));

/**
 * TechGlyph: one of our micro-infographic glyphs in its plate, with a spark
 * that snaps to the nearest outline point under the pointer — no clock, the
 * pointer drives it.
 */
function TechGlyph({ tool }) {
    const svgRef = React.useRef(null);
    const pathRef = React.useRef(null);
    const dotRef = React.useRef(null);
    React.useEffect(() => {
        const svg = svgRef.current;
        const path = pathRef.current;
        const chip = svg?.closest('.tech-skill');
        if (!svg || !path || !chip) return undefined;
        /* the tooltip is pointer-events:none, so the spark listens on the chip */
        const samples = [];
        const L = path.getTotalLength();
        for (let k = 0; k <= 48; k++) samples.push(path.getPointAtLength((k / 48) * L));
        const onMove = (e) => {
            const r = svg.getBoundingClientRect();
            if (!r.width || !r.height) return;
            const px = ((e.clientX - r.left) / r.width) * 40;
            const py = ((e.clientY - r.top) / r.height) * 40;
            const gx = (px - TX) / SC;
            const gy = (py - TY) / SC;
            let best = null;
            let bd = 1e9;
            for (const p of samples) {
                const d = (p.x - gx) ** 2 + (p.y - gy) ** 2;
                if (d < bd) { bd = d; best = p; }
            }
            const dot = dotRef.current;
            if (best && bd < 120) {
                dot.setAttribute('display', 'inline');
                dot.setAttribute('cx', (best.x * SC + TX).toFixed(2));
                dot.setAttribute('cy', (best.y * SC + TY).toFixed(2));
            } else {
                dot.setAttribute('display', 'none');
            }
        };
        const onLeave = () => dotRef.current?.setAttribute('display', 'none');
        chip.addEventListener('pointermove', onMove);
        chip.addEventListener('pointerleave', onLeave);
        return () => {
            chip.removeEventListener('pointermove', onMove);
            chip.removeEventListener('pointerleave', onLeave);
        };
    }, [tool]);

    const vb = (tool.vb || '0 0 24 24').split(' ').map(Number);
    const vw = vb[2] || 24;
    const SC = 26 / vw;
    const TX = 20 - (vw * SC) / 2;
    const TY = 20 - (vw * SC) / 2;

    return (
        <svg
            ref={svgRef}
            viewBox="0 0 40 40"
            width="30"
            height="30"
            style={{ display: 'block', overflow: 'visible' }}
            aria-hidden="true"
        >
            <rect x="2" y="2" width="36" height="36" rx="11" fill="none" stroke="currentColor" strokeWidth="1.1" style={{ opacity: 0.35 }} />
            <path
                ref={pathRef}
                className="glyph"
                d={tool.d}
                transform={`translate(${TX.toFixed(2)} ${TY.toFixed(2)}) scale(${SC.toFixed(4)})`}
                fill="none"
                stroke="currentColor"
                strokeWidth={1.3}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <circle ref={dotRef} r="2.05" display="none" stroke="none" fill="currentColor" />
        </svg>
    );
}

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

    // Our own micro-infographic set for the tooltips (tools.json), with the
    // pointer spark riding the glyph outline. Anything missing falls back to
    // the Simple Icons CDN.
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
        'Harness Engineering': 'frigate',

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
            'DigitalOcean GenAI',
            'Harness Engineering'
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
            date: "July 2024 - June 2026",
            logoSrc: "/images/rgpv-logo.webp",
            link: "https://www.rgpv.ac.in"
        },
        {
            id: 2,
            degree: "Bachelor of Computer Applications",
            university: "Makhanlal Chaturvedi University",
            date: "July 2020 - Aug 2023",
            logoSrc: "/images/makhanlal-logo.webp",
            link: "https://www.mcu.ac.in"
        }
    ];
    const experience = [
        {
            period: 'Nov 2025 - Present',
            role: 'Full Stack Engineer',
            company: 'Saval AI',
            location: 'Remote, India',
            highlights: ['Agent Aggregation', 'Content Pipelines', 'Assessment Engine', 'React Native'],
            description: 'Building core learning workflows across a service-based architecture — shipped blogging, test exam, and mock test pipelines, implemented multi-agent aggregation features, and drove React Native and web performance optimization.',
            logo: '/images/savalai-logo.png',
            link: 'https://saval.ai'
        },
        {
            period: 'July 2024 - Nov 2025',
            role: 'Full Stack Developer',
            company: 'Suryavanshi Ventures',
            location: 'Remote, India',
            highlights: ['BRIO Health AI', 'Serma Events', 'Zuno Training', 'Whisp'],
            description: 'From agentic AI systems with LangGraph to payment automation with Stripe - shipped 4 products including BRIO Health AI, Serma Events, and Zuno Training. Promoted within 5 months.',
            logo: '/images/suryavanshi-logo.png',
            link: 'https://suryavanshi.io'
        },
        {
            period: 'Aug 2023 - July 2024',
            role: 'Software Developer',
            company: 'TVM Consulting',
            location: 'Jabalpur, India',
            highlights: ['Doct App', 'Salesman Analytics', 'Pose Detection'],
            description: 'Built a healthcare platform with 4X faster APIs using Golang, automated stock management eliminating paper-based orders, and developed pose detection ML models with custom datasets.',
            logo: '/images/tvm-logo.png',
            link: 'https://tvm-llc.com'
        }
    ];

    return (
        <section id="TechStack" className="section" ref={animation.ref}>
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
                                                        {TOOLS_BY_LABEL[skill] ? (
                                                            <span className="tech-icon-tooltip">
                                                                <TechGlyph tool={TOOLS_BY_LABEL[skill]} />
                                                            </span>
                                                        ) : iconName && (
                                                            <span className="tech-icon-tooltip">
                                                                 <img
                                                                    src={`https://cdn.simpleicons.org/${iconName}/fff`}
                                                                    alt={skill}
                                                                    className="tech-icon"
                                                                    loading="lazy"
                                                                    decoding="async"
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
                                                        {TOOLS_BY_LABEL[item] ? (
                                                            <span className="tech-icon-tooltip">
                                                                <TechGlyph tool={TOOLS_BY_LABEL[item]} />
                                                            </span>
                                                        ) : iconName && (
                                                            <span className="tech-icon-tooltip">
                                                                 <img
                                                                    src={`https://cdn.simpleicons.org/${iconName}/fff`}
                                                                    alt={item}
                                                                    className="tech-icon"
                                                                    loading="lazy"
                                                                    decoding="async"
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
                    <div id="Experience" className="card experience-card">
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
                                                    loading="lazy"
                                                    decoding="async"
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
