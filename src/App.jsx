import { useEffect, useState, lazy, Suspense } from 'react';

// Import all modular components
import Navigation from './components/sections/Navigation';
import HeroCard from './components/sections/HeroCard';
import ContactCard from './components/sections/ContactCard';
import TimezoneCard from './components/sections/TimezoneCard';
import DescriptionCard from './components/sections/DescriptionCard';
import SocialLinks from './components/sections/SocialLinks';
import TechStackSection from './components/sections/TechStackSection';
import SunMoonToggle from './micro/SunMoonToggle';
import { useTheme } from './hooks/useTheme';


import ProjectSection from './components/sections/ProjectSection';
import FooterSection from './components/sections/FooterSection';

const ResumeEditor = lazy(() => import('./resume-editor/ResumeEditor.jsx'));

function App() {
  const { resolvedTheme, toggleTheme } = useTheme();

  const [showBombers, setShowBombers] = useState(false);
  const [route, setRoute] = useState(
    typeof window !== 'undefined' && window.location.hash.startsWith('#/resume-editor')
      ? 'editor'
      : 'home'
  );

  useEffect(() => {
    const onHash = () => {
      if (window.location.hash.startsWith('#/resume-editor')) setRoute('editor');
      else setRoute('home');
    };
    window.addEventListener('hashchange', onHash);
    onHash();
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  useEffect(() => {
    const scrollToCurrentHash = () => {
      const hash = window.location.hash;
      if (!hash || hash.startsWith('#/')) return;

      const targetId = hash.slice(1);
      if (!targetId) return;

      const targetElement = document.getElementById(targetId);
      if (!targetElement) return;

      targetElement.scrollIntoView({ block: 'start' });
    };

    // Re-run after initial render so hash targets inside React content are reachable.
    requestAnimationFrame(scrollToCurrentHash);
    window.addEventListener('hashchange', scrollToCurrentHash);

    return () => {
      window.removeEventListener('hashchange', scrollToCurrentHash);
    };
  }, []);

  if (route === 'editor') {
    return (
      <Suspense fallback={<div style={{ padding: 40, color: '#888' }}>Loading editor…</div>}>
        <ResumeEditor />
      </Suspense>
    );
  }

  return (
    <div className="page-wrapper">
      {/* Navigation */}
      <Navigation
        logoText="@sahilchouksey"
        navLinks={[
          { text: "home.", href: "#", current: true },
          { text: "experience.", href: "#Experience" },
          { text: "contact.", href: "#Footer" },
        ]}
      />

      {/* Main Content */}
      <main>
        {/* Header Section */}
        <section id="Header" className="section">
          <div className="container">
            {/* Top Grid - Hero and Contact */}
            <div className="w-layout-grid grid-header">
              <HeroCard
                name="Sahil Chouksey"
                subtitle="Democratizing technology, one open solution at a time"
                themeToggle={(
                  <SunMoonToggle
                    resolvedTheme={resolvedTheme}
                    toggleTheme={toggleTheme}
                    className="hero-theme-toggle"
                  />
                )}
              />
              <ContactCard
                bombers={showBombers}
                bomberToggle={(
                  <button
                    className="contact-bomber-toggle"
                    onClick={() => setShowBombers((v) => !v)}
                    aria-pressed={showBombers}
                    aria-label={showBombers ? "Hide the bombers" : "Release the bombers"}
                    title={showBombers ? "hide the B2s" : "release the B2s"}
                  >
                    <svg viewBox="0 0 26 14" width="15" height="8" aria-hidden="true" className="contact-bomber-icon">
                      <path fill="currentColor" d="M13 0 L25 12 L15 9 L13 13 L11 9 L1 12 Z" />
                    </svg>
                  </button>
                )}
                themeToggle={(
                  <SunMoonToggle
                    resolvedTheme={resolvedTheme}
                    toggleTheme={toggleTheme}
                    className="contact-theme-toggle"
                  />
                )}
                iconComponent={
                  <svg width="112" height="112" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ color: '#fff' }}>
                    <path d="M56 12 L 70 56 L 56 100 L 42 56 Z" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M34 32 L 12 56 L 34 80 Z" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M78 32 L 100 56 L 78 80 Z" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                }
              />
            </div>

            {/* Social Links */}
            <SocialLinks />

            {/* Bottom Grid - Timezone and Description */}
            <div className="w-layout-grid grid-header-reverse">
              <TimezoneCard
                location='<span class="loc-jbp">Jabalpur,</span><br />India'
                timezone="GMT+5:30"
                iconComponent={
                  <svg width="112" height="112" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M104 56c0 14.912-21.49 27-48 27m48-27c0-14.912-21.49-27-48-27m48 27H8m48 27C29.49 83 8 70.912 8 56m48 27V29m0 54c12.876 0 21.306-12.088 21.306-27S68.876 29 56 29m0 54c-12.876 0-21.306-12.088-21.306-27S43.124 29 56 29m0 54c12.876 0 37.002-12.088 37.002-27S68.876 29 56 29m0 54c-12.876 0-36.216-12.088-36.216-27S43.124 29 56 29m0 54c4.816 0 8.72-12.088 8.72-27S60.816 29 56 29m0 54c-4.816 0-8.72-12.088-8.72-27S51.184 29 56 29M8 56c0-14.912 21.49-27 48-27" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"></path>
                  </svg>
                }
              />
              <DescriptionCard
                description="I build intuitive and performant web applications, transforming complex challenges into elegant digital solutions. Specialized in AI-powered healthcare systems, RAG architectures, and scalable backend development."
                subdescription="Passionate about leveraging LangGraph, Vertex AI, and modern technologies to create impactful solutions that improve lives."
                animationDelay={0}
              />
            </div>
          </div>
        </section>

        {/* Tech Stack & Experience Section */}
        <TechStackSection />



        {/* Work Section */}


        {/* Projects Section */}
        <ProjectSection />

        {/* Blog Section (temporarily disabled) */}
      </main>

      {/* Footer Section */}
      <FooterSection
        contactEmail="hey@sahilchouksey.in"
        logoText="sahil chouksey."
        copyrightText="all rights reserved. © 2026"
      />
    </div>
  );
}

export default App;
