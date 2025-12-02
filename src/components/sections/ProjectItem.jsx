import React from 'react';
import './Timeline.css';

const ProjectItem = ({
    title,
    subtitle,
    description,
    tags = [],
    link,
    imageSrc,
    isReverse
}) => {
    return (
        <div className={`project-row ${isReverse ? 'reverse' : ''}`}>
            <div className="project-content">
                <div className="timeline-header">
                    <div className="timeline-title-row">
                        <h3 className="timeline-title">{title}</h3>
                        {link && (
                            <a href={link} target="_blank" rel="noopener noreferrer" className="link-arrow">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </a>
                        )}
                    </div>
                    {subtitle && <div className="timeline-subtitle">{subtitle}</div>}
                </div>

                <p className="timeline-description">{description}</p>

                {tags.length > 0 && (
                    <div className="timeline-tags">
                        {tags.map((tag, index) => (
                            <span key={index} className="timeline-tag">
                                {tag}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            <div className="project-image-wrapper">
                {imageSrc && (
                    <img src={imageSrc} alt={title} className="project-image" />
                )}
            </div>
        </div>
    );
};

export default ProjectItem;
