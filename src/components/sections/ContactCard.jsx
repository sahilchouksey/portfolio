// ContactCard Component - Reusable contact card with icon
import React from 'react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import AsciiAvatar from './AsciiAvatar';
import AsciiFrame from './AsciiFrame';

const ContactCard = ({
  animationType = 'fadeInUp',
  delay = 400,
  threshold = 0.15,
  title = "Have a project in mind?",
  email = "hey@jenny.com",
  className = "contact-card",
  showButton = true,
  showFrame = true,
  frameColor = '#FFD700',
  themeToggle
}) => {
  const animation = useScrollAnimation(animationType, {
    delay,
    threshold,
    callbacks: {
      onEnter: () => console.log('Contact card animated in')
    }
  });

  return (
    <div
      className={className}
      ref={animation.ref}
      style={{ 
        position: 'relative', 
        padding: 0, 
        overflow: 'hidden'
        // All sizing handled by CSS .grid-header > .contact-card
      }}
    >
      {/* Theme toggle - highest z-index */}
      {themeToggle && (
        <div className="contact-theme-toggle-wrap">{themeToggle}</div>
      )}
      
      {/* Avatar layer - relative positioned to give card its size */}
      <div style={{ 
        position: 'relative',
        width: '100%', 
        height: '100%',
        zIndex: 5,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '300px'
      }}>
        <AsciiAvatar />
      </div>
      
      {/* Golden frame overlay - decorative only */}
      {showFrame && (
        <AsciiFrame 
          color={frameColor}
          opacity={0.85}
          enableGlow={true}
        />
      )}
    </div>
  );
};

export default ContactCard;
