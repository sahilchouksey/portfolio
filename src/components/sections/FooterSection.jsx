import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import MicroFigure from '../../micro/MicroFigure';
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
            <div
              className="card-shape shape-in-place"
              style={{ width: 208, height: 'auto', aspectRatio: '199/192', flex: '0 0 auto' }}
            >
              <div className="shape w-embed contact-shape-icon" style={{ width: '100%', height: '100%' }}>
                <MicroFigure name="crystal" read={false} style={{ width: '100%', height: '100%', aspectRatio: 'auto', '--hairline-stroke': 1.35 }} />
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
