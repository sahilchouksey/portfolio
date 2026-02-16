// HeroCard Component - Main hero section with ASCII avatar and intro
import React, { useEffect, useState } from 'react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import RotatingText from '../RotatingText';

const HeroCard = ({
  animationType = 'fadeInUp',
  delay = 200,
  threshold = 0.15,
  name,
  title,
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
    ? ['Full Stack Dev', 'Applied AI Eng', 'Backend Dev', 'AI Agents', 'Linux Builder']
    : ['Full Stack Developer', 'Applied AI Engineer', 'Backend Developer', 'AI Agents', 'Linux Enthusiast'];

  const animation = useScrollAnimation(animationType, {
    delay,
    threshold,
    callbacks: {
      onEnter: () => console.log('🎯 Hero card animated in')
    }
  });

  return (
    <div
      id="w-node-_6d7a91e3-1796-9bef-6cf4-0eccd6b5b420-003f9adc"
      className="card"
      ref={animation.ref}
      style={{ position: 'relative' }}
    >
      {themeToggle ? <div className="hero-theme-toggle-wrap">{themeToggle}</div> : null}
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
