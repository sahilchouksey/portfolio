import React from 'react';

import { useMultipleScrollAnimations } from '../../hooks/useScrollAnimation';

const ProjectSection = () => {
    const projects = [
        {
            id: 1,
            title: "BRIO Health AI",
            subtitle: "AI-Powered Medical Search Engine",
            description: "Architected an AI-powered medical search engine for healthcare professionals, orchestrating 5+ specialized agents via LangGraph that doubled response quality. Custom PDF extraction pipeline processes 60-page documents in 16 seconds - down from 50.",
            link: "https://briohealth.ai",
            tags: ["LangGraph", "Vertex AI", "Gemini"],
            imageSrc: "/images/brio-logo.svg",
            logoScale: 2, // 2x bigger (reduced from 4x)
            year: "2025"
        },
        {
            id: 2,
            title: "Study in Woods",
            subtitle: "AI-Powered Academic Platform",
            description: "What if your notes could talk back? An AI study companion I built to solve my own frustration with scattered resources - upload any document and have intelligent conversations with your study material.",
            link: "https://github.com/sahilchouksey/study-in-woods",
            tags: ["Go", "PostgreSQL", "Redis"],
            imageSrc: "/images/woods-bg.jpg",
            isCustom: true,
            year: "2025"
        },
        {
            id: 4,
            title: "Monefy",
            subtitle: "Expense Manager",
            description: "Your finances, your server. A self-hosted expense tracker that keeps your spending data completely private - no third-party access, no data harvesting, just you and your money.",
            link: "#",
            tags: ["React", "Docker", "Node.js"],
            imageSrc: "/images/monefy-logo.svg",
            isRounded: true,
            year: "2025"
        },
        {
            id: 3,
            title: "Doct App",
            subtitle: "Healthcare Platform",
            description: "Built a patient records system in Golang, cutting API latency by 4X (200ms→50ms). Features encrypted health records, role-based access for doctors and assistants, and HIPAA-compliant architecture from the ground up.",
            link: "#",
            tags: ["Golang", "Next.js", "HIPAA"],
            imageSrc: "/images/doct-logo.svg",
            isRounded: true,
            year: "2023"
        },
        {
            id: 5,
            title: "Soundrex",
            subtitle: "Music Player",
            description: "Built my own music player to test my skills building something like YouTube Music. Search any song, album, or artist through a clean, ad-free interface - exactly how streaming should feel.",
            link: "https://soundrex.netlify.app",
            tags: ["Material UI", "MongoDB", "Streaming"],
            imageSrc: "/images/soundrex-logo.svg",
            logoClass: "project-logo--light-black",
            logoScale: 4, // 4x bigger (reduced from 8x)
            year: "2021-22"
        }
    ];

    const { refs } = useMultipleScrollAnimations(projects.length, "fadeInUp", 100);

    const VisualCard = ({ project, isReverse }) => {
        const yearPositionClass = isReverse ? 'year-left' : 'year-right';
        const isClickable = project.link && project.link !== '#';

        if (project.isCustom) {
            const cardClassName = `project-card project-visual-card custom-card${isClickable ? ' project-card--clickable' : ' project-card--static'}`;

            if (!isClickable) {
                return (
                    <div
                        className={cardClassName}
                        style={{ position: 'relative', overflow: 'hidden' }}
                    >
                        {/* Background Image with Zoom Effect */}
                        <div
                            className="custom-card-bg"
                            style={{
                                backgroundImage: `url(${project.imageSrc})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                            }}
                        ></div>

                        {/* Dark Overlay */}
                        <div className="custom-card-overlay"></div>

                        <div className="project-logo-container custom-logo-container">
                            <h3 className="custom-logo-text">Study in Woods 🪵</h3>
                        </div>

                        <div className="project-title-group" style={{ zIndex: 2 }}>
                            <div className="project-subtitle custom-subtitle">{project.subtitle}</div>
                            <div className="project-tech-stack">
                                {project.tags.map((tag, i) => (
                                    <span key={i} className="project-tech-tag">{tag}</span>
                                ))}
                            </div>
                        </div>

                        {/* Year Indicator */}
                        <div className={`project-year ${yearPositionClass}`}>{project.year}</div>
                    </div>
                );
            }

            return (
                <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cardClassName}
                    style={{ position: 'relative', overflow: 'hidden' }}
                >
                    {/* Background Image with Zoom Effect */}
                    <div
                        className="custom-card-bg"
                        style={{
                            backgroundImage: `url(${project.imageSrc})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    ></div>

                    {/* Dark Overlay */}
                    <div className="custom-card-overlay"></div>

                    <div className="project-link-icon custom-arrow">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>

                    <div className="project-logo-container custom-logo-container">
                        <h3 className="custom-logo-text">Study in Woods 🪵</h3>
                    </div>

                    <div className="project-title-group" style={{ zIndex: 2 }}>
                        <div className="project-subtitle custom-subtitle">{project.subtitle}</div>
                        <div className="project-tech-stack">
                            {project.tags.map((tag, i) => (
                                <span key={i} className="project-tech-tag">{tag}</span>
                            ))}
                        </div>
                    </div>

                    {/* Year Indicator */}
                    <div className={`project-year ${yearPositionClass}`}>{project.year}</div>
                </a>
            );
        }

        const cardClassName = `project-card project-visual-card${isClickable ? ' project-card--clickable' : ' project-card--static'}`;

        if (!isClickable) {
            return (
                <div className={cardClassName}>
                    <div className="project-logo-container">
                        <img
                            src={project.imageSrc}
                            alt={project.title}
                            className={`project-logo ${project.isRounded ? 'rounded' : ''} ${project.logoClass || ''}`.trim()}
                            style={project.logoScale ? { transform: `scale(${project.logoScale})`, transformOrigin: 'left center' } : {}}
                        />
                    </div>
                    <div className="project-title-group">
                        <h3 className="project-title">{project.title}</h3>
                        <div className="project-subtitle">{project.subtitle}</div>
                        <div className="project-tech-stack">
                            {project.tags.map((tag, i) => (
                                <span key={i} className="project-tech-tag">{tag}</span>
                            ))}
                        </div>
                    </div>

                    {/* Year Indicator */}
                    <div className={`project-year ${yearPositionClass}`}>{project.year}</div>
                </div>
            );
        }

        return (
            <a href={project.link} target="_blank" rel="noopener noreferrer" className={cardClassName}>
                <div className="project-link-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
                <div className="project-logo-container">
                    <img
                        src={project.imageSrc}
                        alt={project.title}
                        className={`project-logo ${project.isRounded ? 'rounded' : ''} ${project.logoClass || ''}`.trim()}
                        style={project.logoScale ? { transform: `scale(${project.logoScale})`, transformOrigin: 'left center' } : {}}
                    />
                </div>
                <div className="project-title-group">
                    <h3 className="project-title">{project.title}</h3>
                    <div className="project-subtitle">{project.subtitle}</div>
                    <div className="project-tech-stack">
                        {project.tags.map((tag, i) => (
                            <span key={i} className="project-tech-tag">{tag}</span>
                        ))}
                    </div>
                </div>

                {/* Year Indicator */}
                <div className={`project-year ${yearPositionClass}`}>{project.year}</div>
            </a>
        );
    };

    const ContentCard = ({ project }) => (
        <div className="project-card project-content-card">
            <p className="project-description">{project.description}</p>
        </div>
    );

    return (
        <section id="Projects" className="section">
            <div className="container">
                <div className="project-bento-grid">
                    <div className="project-card project-title-card">
                        <h2 className="sg-heading" style={{ marginBottom: '0' }}>projects.</h2>
                    </div>
                    {projects.map((project, index) => {
                        const isReverse = index % 2 !== 0;
                        return (
                            <div key={project.id} className={`project-bento-row ${isReverse ? 'reverse' : ''}`} ref={el => refs.current[index] = el}>
                                {isReverse ? (
                                    <>
                                        <ContentCard project={project} />
                                        <VisualCard project={project} isReverse={isReverse} />
                                    </>
                                ) : (
                                    <>
                                        <VisualCard project={project} isReverse={isReverse} />
                                        <ContentCard project={project} />
                                    </>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default ProjectSection;
