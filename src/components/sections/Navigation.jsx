// Navigation Component - Reusable site navigation
import React, { useState, useEffect, useRef } from 'react';

const Navigation = ({ logoText, navLinks }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef(null);

  // Close menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 991) {
        setMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close menu on outside click
  useEffect(() => {
    if (!menuOpen) return;
    const handleClick = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [menuOpen]);

  // Prevent body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <header className="navigation w-nav" data-collapse="medium" ref={navRef}>
      <div className="navigation-container">
        <a href="/" className="logo w-nav-brand w--current" aria-label="home">
          <div className="logo-title">{logoText}</div>
        </a>

        {/* Desktop nav */}
        <nav className="nav-menu w-nav-menu">
          <div className="navlinks">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`nav-link w-nav-link${link.current ? ' w--current' : ''}`}
              >
                {link.text}
              </a>
            ))}
          </div>
        </nav>

        {/* Hamburger */}
        <button
          type="button"
          className={`hamburger-menu w-nav-button${menuOpen ? ' w--open' : ''}`}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((o) => !o)}
        >
          <div className="menu-line">
            <div className="nav-line"></div>
            <div className="nav-line"></div>
            <div className="nav-line last"></div>
          </div>
        </button>
      </div>

      {/* Mobile overlay */}
      {menuOpen && (
        <div className="w-nav-overlay" id="w-nav-overlay-0" style={{ display: 'block' }}>
          <nav className="nav-menu w-nav-menu" style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="navlinks" style={{ flexDirection: 'column', padding: '16px 0' }}>
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className={`nav-link w-nav-link${link.current ? ' w--current' : ''}`}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.text}
                </a>
              ))}
            </div>

            {/* Close button inside overlay */}
            <button
              type="button"
              className="close-button w-nav-button"
              aria-label="Close menu"
              onClick={() => setMenuOpen(false)}
            >
              <div className="close-button-lines">
                <div className="close-line"></div>
                <div className="close-line _02"></div>
              </div>
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navigation;
