import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import ContactCard from './ContactCard';

const FooterSection = ({ 
  contactEmail = "hey@jenny.com",
  logoText = "jenny wilson.",
  copyrightText = "all rights reserved. © 2023",
  contactAnimationDelay = 0,
  footerAnimationDelay = 100,
  animationThreshold = 0.1
}) => {
  const footerContact = useScrollAnimation('fadeInUp', { 
    delay: contactAnimationDelay, 
    threshold: animationThreshold 
  });
  
  const footerCard = useScrollAnimation('fadeInUp', { 
    delay: footerAnimationDelay, 
    threshold: animationThreshold 
  });

  return (
    <section id="Footer" className="section footer">
      <div className="container">
        {/* Contact Card */}
        <div 
          data-w-id="c994cdaa-9032-4efe-5c8b-fe939a3870df" 
          className="contact-card" 
          ref={footerContact.ref}
        >
          <div className="card-content">
            <div className="card-shape">
              <div className="shape w-embed contact-shape-icon">
                <svg width="112" height="112" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ color: 'inherit' }}>
                  <path d="M56 12 L 70 56 L 56 100 L 42 56 Z" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M34 32 L 12 56 L 34 80 Z" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M78 32 L 100 56 L 78 80 Z" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
            <h2 className="h2-heading">Let's build<br />something great.</h2>
          </div>
          <a href={`mailto:${contactEmail}`} className="button w-button">{contactEmail}</a>
        </div>

        {/* Footer Card */}
        <div 
          data-w-id="c994cdaa-9032-4efe-5c8b-fe939a3870e9" 
          className="footer-card" 
          ref={footerCard.ref}
        >
          <a href="#" aria-current="page" className="logo w-inline-block w--current">
            <div className="footer-text">{logoText}</div>
          </a>
          <div 
            id="w-node-c994cdaa-9032-4efe-5c8b-fe939a3870ec-9a3870dd" 
            className="footer-text text-color-gray"
          >
            {copyrightText}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FooterSection;
