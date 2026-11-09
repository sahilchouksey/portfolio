// HeroCard Component - Main hero section with ASCII avatar and intro
import React, { useEffect, useState } from 'react';
import RotatingText from '../RotatingText';
import MicroFigure from '../../micro/MicroFigure';

const HeroCard = ({
  name,
  subtitle,
  themeToggle
}) => {
  const [isTinyScreen, setIsTinyScreen] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(max-width: 400px)').matches;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 400px)');
    const handleChange = (event) => setIsTinyScreen(event.matches);

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const skills = isTinyScreen
    ? ['AI Engineer', 'Voice Agents', 'Agentic Systems', 'Full Stack Dev', 'Backend Dev']
    : ['AI Engineer', 'Voice Agents', 'Agentic Systems', 'Full Stack Developer', 'Backend Developer', 'Linux Enthusiast'];

  return (
    <div
      id="w-node-_6d7a91e3-1796-9bef-6cf4-0eccd6b5b420-003f9adc"
      className="card"
      style={{ position: 'relative' }}
    >
      {themeToggle && <div className="hero-theme-toggle-wrap">{themeToggle}</div>}
      <h1 className="h1-heading">
        {name}<br />
        <RotatingText skills={skills} interval={2500} />
        <br />
        <span className="span-gray">{subtitle}</span>
      </h1>
    </div>
  );
};

export default HeroCard;
