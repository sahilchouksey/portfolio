import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const RotatingText = ({ 
  skills = [], 
  interval = 3000,
  className = ""
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (skills.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % skills.length);
    }, interval);

    return () => clearInterval(timer);
  }, [skills.length, interval]);

  if (skills.length === 0) return null;

  return (
    <div className={`rotating-text-container ${className}`}>
      <AnimatePresence mode="wait">
        <motion.span
          key={currentIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ 
            duration: 0.5,
            ease: "easeInOut"
          }}
          className="rotating-text"
        >
          {skills[currentIndex]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
};

export default RotatingText;