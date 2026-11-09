// DescriptionCard Component - About/description section
import React, { useRef, useState } from 'react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import MicroFigure from '../../micro/MicroFigure';

const DOB = "May 18, 2003";
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
}) => {
  const age = getAge();
  const cakeRef = useRef(null);
  const [hot, setHot] = useState(false);
  const open = () => { setHot(true); cakeRef.current?.set?.(1); };
  const close = () => { setHot(false); cakeRef.current?.set?.(0); };
  const move = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    cakeRef.current?.lean?.(2 * (e.clientX - r.left) / r.width - 1);
  };
  const toggle = () => { (hot ? close : open)(); };
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
      <h3 className="h3-heading">
        I'm a{' '}
        <span
          className={`age-dob${hot ? ' hot' : ''}`}
          onMouseMove={move}
          onClick={toggle}
          title="click to toggle the birthday popup"
        >
          {age}-year-old
          <span className={`dob-tip${hot ? ' open' : ''}`} aria-hidden={!hot}>
            <MicroFigure name="cake" read={false} figRef={cakeRef} />
            <span className="dob-lines">
              {DOB.toLowerCase()}<br />
              <span className="span-gray">the candle day. taurus.</span>
            </span>
          </span>
        </span>{' '}
        full-stack developer. I design, build, and ship agentic systems and voice agents for production. I develop open-source software that makes complex technology easier to understand, use, and extend.{' '}
        <span className="span-gray">Away from the keyboard, I ride my bike wherever curiosity leads me.</span>
      </h3>
    </div>
  );
};

export default DescriptionCard;
