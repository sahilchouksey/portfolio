// Navigation Component - Reusable site navigation
// Custom implementation to fix iOS Safari/Chrome touch issues
import React, { useState, useCallback, useEffect, useRef } from 'react';

const Navigation = ({logoText, navLinks}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navRef = useRef(null);

  // Toggle menu - handles both touch and click for iOS compatibility
  const toggleMenu = useCallback((e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setIsMenuOpen(prev => !prev);
  }, []);

  // Close menu
  const closeMenu = useCallback((e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setIsMenuOpen(false);
  }, []);

  // Handle link clicks - close menu after navigation
  const handleLinkClick = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  // Sync React state with Webflow CSS classes
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    const menuButton = nav.querySelector('.hamburger-menu');
    const closeButton = nav.querySelector('.close-button');
    const navMenu = nav.querySelector('.w-nav-menu');
    const overlay = nav.querySelector('.w-nav-overlay');
    const links = nav.querySelectorAll('.w-nav-link');

    if (isMenuOpen) {
      // Open state
      menuButton?.classList.add('w--open');
      closeButton?.classList.add('w--open');
      navMenu?.classList.add('w--nav-menu-open');
      navMenu?.setAttribute('data-nav-menu-open', '');
      if (overlay) {
        overlay.style.display = 'block';
        overlay.style.height = '100vh';
        overlay.style.width = '100%';
      }
      links?.forEach(link => link.classList.add('w--nav-link-open'));
      document.body.style.overflow = 'hidden';
    } else {
      // Closed state
      menuButton?.classList.remove('w--open');
      closeButton?.classList.remove('w--open');
      navMenu?.classList.remove('w--nav-menu-open');
      navMenu?.removeAttribute('data-nav-menu-open');
      if (overlay) {
        overlay.style.display = '';
        overlay.style.height = '';
        overlay.style.width = '';
      }
      links?.forEach(link => link.classList.remove('w--nav-link-open'));
      document.body.style.overflow = '';
    }
  }, [isMenuOpen]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isMenuOpen]);

  return (
    <div
      ref={navRef}
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
            {navLinks.map((link, index) => (
              <a 
                key={index}
                href={link.href} 
                aria-current="page" 
                className={`nav-link w-nav-link ${link.current ? "w--current" : ""}`}
                onClick={handleLinkClick}
                onTouchEnd={handleLinkClick}
              >
                {link.text}
              </a>
            ))}
          </div>

          {/* Close button (X) - visible when menu is open */}
          <button
            type="button"
            className="close-button w-nav-button"
            style={{
              cursor: 'pointer',
              touchAction: 'manipulation',
              WebkitTapHighlightColor: 'transparent',
              WebkitAppearance: 'none',
              background: 'transparent',
              border: 'none',
              padding: '12px'
            }}
            aria-label="Close menu"
            aria-expanded={isMenuOpen}
            onClick={closeMenu}
            onTouchStart={closeMenu}
          >
            <div className="close-button-lines" style={{ pointerEvents: 'none' }}>
              <div className="close-line" style={{ pointerEvents: 'none' }}></div>
              <div className="close-line _02" style={{ pointerEvents: 'none' }}></div>
            </div>
          </button>
        </nav>

        {/* Hamburger menu button */}
        <button
          type="button"
          className="hamburger-menu w-nav-button"
          style={{
            cursor: 'pointer',
            touchAction: 'manipulation',
            WebkitTapHighlightColor: 'transparent',
            WebkitAppearance: 'none',
            background: 'transparent',
            border: 'none'
          }}
          aria-label="Open menu"
          aria-expanded={isMenuOpen}
          aria-controls="w-nav-overlay-0"
          aria-haspopup="menu"
          onClick={toggleMenu}
          onTouchStart={toggleMenu}
        >
          <div className="menu-line" style={{ pointerEvents: 'none' }}>
            <div className="nav-line" style={{ pointerEvents: 'none' }}></div>
            <div className="nav-line" style={{ pointerEvents: 'none' }}></div>
            <div className="nav-line last" style={{ pointerEvents: 'none' }}></div>
          </div>
        </button>
      </div>

      <div className="w-nav-overlay" data-wf-ignore="" id="w-nav-overlay-0"></div>
    </div>
  );
};

export default Navigation;
