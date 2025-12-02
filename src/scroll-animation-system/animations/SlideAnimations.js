export const slideAnimations = {
  slideInUp: {
    enter: {
      transform: 'translate3d(0px, 0px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)',
      transformStyle: 'preserve-3d',
      opacity: '1'
    },
    exit: {
      transform: 'translate3d(0px, 100%, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)',
      transformStyle: 'preserve-3d',
      opacity: '0'
    },
    duration: 800,
    easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
  },

  slideInDown: {
    enter: {
      transform: 'translate3d(0px, 0px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)',
      transformStyle: 'preserve-3d',
      opacity: '1'
    },
    exit: {
      transform: 'translate3d(0px, -100%, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)',
      transformStyle: 'preserve-3d',
      opacity: '0'
    },
    duration: 800,
    easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
  },

  slideInLeft: {
    enter: {
      transform: 'translate3d(0px, 0px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)',
      transformStyle: 'preserve-3d',
      opacity: '1'
    },
    exit: {
      transform: 'translate3d(-100%, 0px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)',
      transformStyle: 'preserve-3d',
      opacity: '0'
    },
    duration: 800,
    easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
  },

  slideInRight: {
    enter: {
      transform: 'translate3d(0px, 0px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)',
      transformStyle: 'preserve-3d',
      opacity: '1'
    },
    exit: {
      transform: 'translate3d(100%, 0px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)',
      transformStyle: 'preserve-3d',
      opacity: '0'
    },
    duration: 800,
    easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
  },

  // Smooth slide with less movement
  slideInUpSmooth: {
    enter: {
      transform: 'translate3d(0px, 0px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)',
      transformStyle: 'preserve-3d',
      opacity: '1'
    },
    exit: {
      transform: 'translate3d(0px, 60px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)',
      transformStyle: 'preserve-3d',
      opacity: '0'
    },
    duration: 600,
    easing: 'ease-out'
  }
};