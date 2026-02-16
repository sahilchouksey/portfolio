import React from 'react';

// Import all modular components
import Navigation from './components/sections/Navigation';
import HeroCard from './components/sections/HeroCard';
import ContactCard from './components/sections/ContactCard';
import TimezoneCard from './components/sections/TimezoneCard';
import DescriptionCard from './components/sections/DescriptionCard';
import SocialLinks from './components/sections/SocialLinks';
import TechStackSection from './components/sections/TechStackSection';


import ProjectSection from './components/sections/ProjectSection';
import BlogSection from './components/sections/BlogSection';
import FooterSection from './components/sections/FooterSection';

function App() {
  return (
    <div className="page-wrapper">
      {/* Navigation */}
      <Navigation
        logoText="@sahilchouksey"
        navLinks={[
          { text: "home.", href: "#", current: true },
          { text: "experience.", href: "#Experience" },
          { text: "blog.", href: "#Blog" },
          { text: "contact.", href: "#Footer" }
        ]}
      />

      {/* Header Section */}
      <section id="Header" className="section">
        <div className="container">
          {/* Top Grid - Hero and Contact */}
          <div className="w-layout-grid grid-header">
            <HeroCard
              avatarSrc="/images/avatar.png"
              name="Sahil Chouksey"
              title="Full Stack Developer"
              subtitle="Democratizing technology, one open solution at a time"
            />
            <ContactCard
              title="Have a project in mind?"
              email="hey@sahilchouksey.in"
              showButton={true}
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
              location="Jabalpur,<br />India"
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

      {/* Blog Section */}
      <BlogSection />

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
