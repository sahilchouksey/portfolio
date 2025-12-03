// Navigation Component - Reusable site navigation
import React, { useCallback } from 'react';

const Navigation = ({logoText, navLinks}) => {
  // iOS Safari/Chrome fix: Empty handler to make div clickable on iOS
  // iOS WebKit doesn't fire click events on non-interactive elements without this
  const handleTouchEnd = useCallback((e) => {
    // This helps iOS recognize the element as interactive
    // The actual click handling is done by Webflow's JS
  }, []);

  return (
    <div
      data-animation="default"
      data-collapse="medium"
      data-duration="400"
      data-easing="ease"
      data-easing2="ease"
      role="banner"
      className="navigation w-nav"
    >
      <div
        data-w-id="329fe08e-d699-68dc-ca70-edeaa19b4037"
        className="navigation-container"
        style={{
          opacity: 1,
          transform: 'translate3d(0px, 0px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)',
          transformStyle: 'preserve-3d'
        }}
      >
        <a href="#" aria-current="page" className="logo w-nav-brand w--current" aria-label="home">
          <div className="logo-title">{logoText}</div>
        </a>

        <nav role="navigation" className="nav-menu w-nav-menu">
          <div className="navlinks">
            {
                navLinks.map((link) => {

                    return (
                        <a href={link.href} aria-current="page" className={`nav-link w-nav-link ${link.current ? "w--current" : ""}`}>
                            {link.text}
                        </a>
                    )
                })

            }
          </div>

          <div
            className="close-button w-nav-button"
            style={{
              WebkitUserSelect: 'text',
              cursor: 'pointer',
              touchAction: 'manipulation',
              WebkitTapHighlightColor: 'transparent'
            }}
            aria-label="menu"
            role="button"
            tabIndex="0"
            aria-controls="w-nav-overlay-0"
            aria-haspopup="menu"
            aria-expanded="false"
            onClick={() => {}} // iOS fix: empty onclick makes element "clickable" for iOS WebKit
            onTouchEnd={handleTouchEnd} // iOS fix: touchend as backup for iOS
          >
            <div className="close-button-lines" style={{ pointerEvents: 'none' }}>
              <div className="close-line" style={{ pointerEvents: 'none' }}></div>
              <div className="close-line _02" style={{ pointerEvents: 'none' }}></div>
            </div>
          </div>
        </nav>

        <div
          className="hamburger-menu w-nav-button"
          style={{
            WebkitUserSelect: 'text',
            cursor: 'pointer',
            touchAction: 'manipulation',
            WebkitTapHighlightColor: 'transparent'
          }}
          aria-label="menu"
          role="button"
          tabIndex="0"
          aria-controls="w-nav-overlay-0"
          aria-haspopup="menu"
          aria-expanded="false"
          onClick={() => {}} // iOS fix: empty onclick makes element "clickable" for iOS WebKit
          onTouchEnd={handleTouchEnd} // iOS fix: touchend as backup for iOS
        >
          <div className="menu-line" style={{ pointerEvents: 'none' }}>
            <div className="nav-line" style={{ pointerEvents: 'none' }}></div>
            <div className="nav-line" style={{ pointerEvents: 'none' }}></div>
            <div className="nav-line last" style={{ pointerEvents: 'none' }}></div>
          </div>
        </div>
      </div>

      <div className="w-nav-overlay" data-wf-ignore="" id="w-nav-overlay-0"></div>
    </div>
  );
};

export default Navigation;
