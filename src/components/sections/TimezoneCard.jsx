// TimezoneCard Component - Location and timezone display
import React from 'react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

const TimezoneCard = ({ 
  animationType = 'slideInLeft',
  delay = 600,
  threshold = 0.15,
  location = "Brooklyn,<br />New York",
  timezone = "GMT-5"
}) => {
  const animation = useScrollAnimation(animationType, { 
    delay,
    threshold,
    callbacks: {
      onEnter: () => console.log('🎯 Timezone card animated in')
    }
  });

  return (
    <div 
      id="w-node-b4038914-cd95-5e00-ab4b-a5ea4511b262-003f9adc" 
      className="card timezone" 
      ref={animation.ref}
    >
      <div className="card-shape">
        <div className="shape w-embed">
          <svg width="112" height="112" viewBox="0 0 112 112" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M104 56C104 70.912 82.51 83 56 83C29.49 83 8 70.912 8 56C8 41.088 29.49 29 56 29C82.51 29 104 41.088 104 56Z" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8 56H104" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M56 29V83" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M56 29C66 29 74 41 74 56C74 71 66 83 56 83" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M56 29C46 29 38 41 38 56C38 71 46 83 56 83" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M56 29C82 29 92 41 92 56C92 71 82 83 56 83" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M56 29C30 29 20 41 20 56C20 71 30 83 56 83" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
      
      <h2 className="h2-heading timezone">
        Based in<br />
        <span dangerouslySetInnerHTML={{ __html: location }} />
        <br />‍
        <span className="span-gray">{timezone}</span>
      </h2>
    </div>
  );
};

export default TimezoneCard;