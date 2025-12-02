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
          <svg width="112" height="112" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path 
              d="M104 56c0 14.912-21.49 27-48 27m48-27c0-14.912-21.49-27-48-27m48 27H8m48 27C29.49 83 8 70.912 8 56m48 27V29m0 54c12.876 0 21.306-12.088 21.306-27S68.876 29 56 29m0 54c-12.876 0-21.306-12.088-21.306-27S43.124 29 56 29m0 54c12.876 0 37.002-12.088 37.002-27S68.876 29 56 29m0 54c-12.876 0-36.216-12.088-36.216-27S43.124 29 56 29m0 54c4.816 0 8.72-12.088 8.72-27S60.816 29 56 29m0 54c-4.816 0-8.72-12.088-8.72-27S51.184 29 56 29M8 56c0-14.912 21.49-27 48-27" 
              stroke="currentColor" 
              strokeWidth="4" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
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