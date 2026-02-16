import React from 'react';
import './Timeline.css';

const EducationCard = ({
    degree,
    university,
    date,
    gpa,
    logoSrc,
    link
}) => {
    const CardContent = () => (
        <>
            <div className="education-logo-container">
                {logoSrc ? (
                    <img 
                        src={logoSrc} 
                        alt={university} 
                        className="education-logo"
                        loading="lazy"
                        decoding="async"
                    />
                ) : (
                    <div className="education-logo-placeholder"></div>
                )}
            </div>
            <div className="education-content">
                <h3 className="education-degree">{degree}</h3>
                <div className="education-university">{university}</div>
                <div className="education-meta">
                    <span className="education-date">{date}</span>
                    {gpa && <span className="education-gpa">{gpa}</span>}
                </div>
            </div>
        </>
    );

    if (link) {
        return (
            <a href={link} target="_blank" rel="noopener noreferrer" className="education-card clickable">
                <CardContent />
            </a>
        );
    }

    return (
        <div className="education-card">
            <CardContent />
        </div>
    );
};

export default EducationCard;
