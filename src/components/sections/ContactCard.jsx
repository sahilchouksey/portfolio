// ContactCard Component - Reusable contact card with icon
import React from 'react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import AsciiAvatar from './AsciiAvatar';

const ContactCard = ({
  animationType = 'fadeInUp',
  delay = 400,
  threshold = 0.15,
  title = "Have a project in mind?",
  email = "hey@jenny.com",
  className = "contact-card",
  showButton = true
}) => {
  const animation = useScrollAnimation(animationType, {
    delay,
    threshold,
    callbacks: {
      onEnter: () => console.log('🎯 Contact card animated in')
    }
  });

  return (
    <div
      className={className}
      ref={animation.ref}
      style={{ position: 'relative', padding: 0, overflow: 'hidden' }}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%' }}>
        <AsciiAvatar />
      </div>
    </div>
  );
};

export default ContactCard;