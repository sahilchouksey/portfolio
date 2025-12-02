export const scaleAnimations = {
  scaleIn: {
    enter: {
      transform: 'translate3d(0px, 0px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)',
      transformStyle: 'preserve-3d',
      opacity: '1'
    },
    exit: {
      transform: 'translate3d(0px, 0px, 0px) scale3d(0.8, 0.8, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)',
      transformStyle: 'preserve-3d',
      opacity: '0'
    },
    duration: 500,
    easing: 'ease-out'
  },

  scaleInUp: {
    enter: {
      transform: 'translate3d(0px, 0px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)',
      transformStyle: 'preserve-3d',
      opacity: '1'
    },
    exit: {
      transform: 'translate3d(0px, 20px, 0px) scale3d(0.8, 0.8, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)',
      transformStyle: 'preserve-3d',
      opacity: '0'
    },
    duration: 600,
    easing: 'ease-out'
  },

  zoomIn: {
    enter: {
      transform: 'translate3d(0px, 0px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)',
      transformStyle: 'preserve-3d',
      opacity: '1'
    },
    exit: {
      transform: 'translate3d(0px, 0px, 0px) scale3d(0, 0, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)',
      transformStyle: 'preserve-3d',
      opacity: '0'
    },
    duration: 400,
    easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
  },

  scaleInDown: {
    enter: {
      transform: 'translate3d(0px, 0px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)',
      transformStyle: 'preserve-3d',
      opacity: '1'
    },
    exit: {
      transform: 'translate3d(0px, -20px, 0px) scale3d(0.8, 0.8, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)',
      transformStyle: 'preserve-3d',
      opacity: '0'
    },
    duration: 600,
    easing: 'ease-out'
  },

  // Bounce scale effect
  bounceScale: {
    enter: {
      transform: 'translate3d(0px, 0px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)',
      transformStyle: 'preserve-3d',
      opacity: '1'
    },
    exit: {
      transform: 'translate3d(0px, 0px, 0px) scale3d(0.3, 0.3, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)',
      transformStyle: 'preserve-3d',
      opacity: '0'
    },
    duration: 600,
    easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
  }
};