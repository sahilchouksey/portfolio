// SocialLinks Component - Social media navigation
import React from 'react';

const SocialLinks = () => {
  const socialLinks = [
    { id: 'resume', name: 'resume.', href: '/resume.pdf', highlight: true },
    { id: 'github', name: 'github.', href: 'https://github.com/sahilchouksey' },
    { id: 'linkedin', name: 'linkedin.', href: 'https://linkedin.com/in/sahilchouksey' },
    { id: 'x', name: 'x.', href: 'https://x.com/SahilChouksey9' },
    { id: 'wakatime', name: 'wakatime.', href: 'https://wakatime.com/@sahilchouksey' },
    { id: 'email', name: 'email.', href: 'mailto:hey@sahilchouksey.in' }
  ];

  return (
    <div 
      data-w-id="13178215-d686-c168-448e-0d8825524200" 
      className="social-links"
    >
      {socialLinks.map((link) => (
        <a 
          key={link.id}
          href={link.href} 
          className={`social-link w-inline-block${link.highlight ? ' social-link-highlight' : ''}`}
          aria-label={`Visit ${link.id} profile`}
          target={link.id !== 'email' ? '_blank' : undefined}
          rel={link.id !== 'email' ? 'noopener noreferrer' : undefined}
        >
          <div>{link.name}</div>
        </a>
      ))}
    </div>
  );
};

export default SocialLinks;
