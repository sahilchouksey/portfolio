// ContactCard Component - Reusable contact card with icon
import React from 'react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import MicroFigure from '../../micro/MicroFigure';

const ContactCard = ({
  animationType = 'fadeInUp',
  delay = 400,
  threshold = 0.15,
  className = "contact-card",
  showFrame = true,
  themeToggle,
  bombers = false,
  bomberToggle
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
      {/* Theme toggle - highest z-index on the right component only */}
      {themeToggle && (
        <div className="contact-theme-toggle-wrap">{themeToggle}</div>
      )}
      {/* B2 bomber trigger - icon only, top-right */}
      {bomberToggle && (
        <div className="contact-bomber-wrap">{bomberToggle}</div>
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
        {/* the contact sheet: the sky-frame border and the portrait on one
            hairline plate — one pointer, one wave, the border lights with the
            face under the same hand */}
        <MicroFigure
          name={showFrame ? "skyplate" : "portrait"}
          read={false}
          stretch
          bombers={bombers}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', aspectRatio: 'auto' }}
        />
      </div>
    </div>
  );
};

export default ContactCard;
