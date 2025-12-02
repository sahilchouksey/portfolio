export const fadeAnimations = {
  fadeIn: {
    enter: {
      opacity: '1',
      visibility: 'visible'
    },
    exit: {
      opacity: '0',
      visibility: 'hidden'
    },
    duration: 600
  },

  fadeInUp: {
    enter: {
      opacity: '1',
      transform: 'translate3d(0px, 0px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)',
      transformStyle: 'preserve-3d'
    },
    exit: {
      opacity: '0',
      transform: 'translate3d(0px, 44px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)',
      transformStyle: 'preserve-3d'
    },
    duration: 700,
    easing: 'ease-out'
  },

  fadeInDown: {
    enter: {
      opacity: '1',
      transform: 'translate3d(0px, 0px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)',
      transformStyle: 'preserve-3d'
    },
    exit: {
      opacity: '0',
      transform: 'translate3d(0px, -44px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)',
      transformStyle: 'preserve-3d'
    },
    duration: 700,
    easing: 'ease-out'
  },

  fadeInLeft: {
    enter: {
      opacity: '1',
      transform: 'translate3d(0px, 0px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)',
      transformStyle: 'preserve-3d'
    },
    exit: {
      opacity: '0',
      transform: 'translate3d(-44px, 0px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)',
      transformStyle: 'preserve-3d'
    },
    duration: 700,
    easing: 'ease-out'
  },

  fadeInRight: {
    enter: {
      opacity: '1',
      transform: 'translate3d(0px, 0px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)',
      transformStyle: 'preserve-3d'
    },
    exit: {
      opacity: '0',
      transform: 'translate3d(44px, 0px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)',
      transformStyle: 'preserve-3d'
    },
    duration: 700,
    easing: 'ease-out'
  },

  // Special fade for testimonial content (opacity only)
  fadeOpacity: {
    enter: {
      opacity: '1'
    },
    exit: {
      opacity: '0'
    },
    duration: 700,
    easing: 'ease-out'
  }
};