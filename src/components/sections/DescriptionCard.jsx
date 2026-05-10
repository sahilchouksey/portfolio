// DescriptionCard Component - About/description section
import React from 'react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

const getAge = () => {
  const dob = new Date(2003, 4, 18); // May 18, 2003
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  if (today < new Date(today.getFullYear(), dob.getMonth(), dob.getDate())) age--;
  return age;
};

const DescriptionCard = ({
  animationType = 'fadeInRight',
  delay = 800,
  threshold = 0.15,
  content = `I'm a ${getAge()}-year-old full-stack developer building software that democratizes technology - from AI agents to tools you actually own.<br /><span class="span-gray">I like open-source, Linux, and bike rides without a destination.</span>`
}) => {
  const animation = useScrollAnimation(animationType, {
    delay,
    threshold,
    callbacks: {
      onEnter: () => console.log('🎯 Description card animated in')
    }
  });

  return (
    <div
      id="w-node-b4038914-cd95-5e00-ab4b-a5ea4511b26b-003f9adc"
      className="card"
      ref={animation.ref}
    >
      <h3
        className="h3-heading"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
};

export default DescriptionCard;