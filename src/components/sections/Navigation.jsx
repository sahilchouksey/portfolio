// Navigation Component - Reusable site navigation
import React from 'react';

const Navigation = ({logoText, navLinks}) => {
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
                navLinks.map((link, index) => {

                    return (
                        <a key={index} href={link.href} aria-current="page" className={`nav-link w-nav-link ${link.current ? "w--current" : ""}`}>
                            {link.text}
                        </a>
                    )
                })

            }
          </div>

          <div
            className="close-button w-nav-button"
            style={{WebkitUserSelect: 'text'}}
            aria-label="menu"
            role="button"
            tabIndex="0"
            aria-controls="w-nav-overlay-0"
            aria-haspopup="menu"
            aria-expanded="false"
          >
            <div className="close-button-lines">
              <div className="close-line"></div>
              <div className="close-line _02"></div>
            </div>
          </div>
        </nav>

        <div
          className="hamburger-menu w-nav-button"
          style={{WebkitUserSelect: 'text'}}
          aria-label="menu"
          role="button"
          tabIndex="0"
          aria-controls="w-nav-overlay-0"
          aria-haspopup="menu"
          aria-expanded="false"
        >
          <div className="menu-line">
            <div className="nav-line"></div>
            <div className="nav-line"></div>
            <div className="nav-line last"></div>
          </div>
        </div>
      </div>

      <div className="w-nav-overlay" data-wf-ignore="" id="w-nav-overlay-0"></div>
    </div>
  );
};

export default Navigation;
