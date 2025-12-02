import { useEffect, useRef } from 'react';
import AnimatedElement from '../components/AnimatedElement.js';
import ScrollTrigger from '../components/ScrollTrigger.js';

/**
 * React hook for scroll animations using the modular animation system
 * @param {string} animationType - Type of animation (fadeInUp, slideInUp, etc.)
 * @param {Object} config - Animation configuration
 * @returns {Object} - Ref object to attach to element
 */
export const useScrollAnimation = (animationType = 'fadeInUp', config = {}) => {
  const elementRef = useRef(null);
  const animatedElementRef = useRef(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Default config
    const defaultConfig = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
      triggerOnce: true,
      delay: config.delay || 0,
      ...config
    };

    try {
      // Create animated element instance
      animatedElementRef.current = new AnimatedElement(
        element,
        animationType,
        defaultConfig
      );
    } catch (error) {
      console.error('Failed to create animated element:', error);
    }

    // Cleanup
    return () => {
      if (animatedElementRef.current) {
        animatedElementRef.current.destroy();
        animatedElementRef.current = null;
      }
    };
  }, [animationType, config.delay, config.threshold, config.rootMargin, config.triggerOnce]);

  // Return ref and control methods
  return {
    ref: elementRef,
    show: () => animatedElementRef.current?.show(),
    hide: () => animatedElementRef.current?.hide(),
    reset: () => animatedElementRef.current?.reset(),
    getState: () => animatedElementRef.current?.getState()
  };
};

/**
 * React hook for multiple scroll animations with staggered delays
 * @param {number} count - Number of elements to animate
 * @param {string} animationType - Type of animation
 * @param {number} staggerDelay - Delay between each animation
 * @param {Object} config - Base configuration
 * @returns {Object} - Array of refs and control methods
 */
export const useMultipleScrollAnimations = (
  count,
  animationType = 'fadeInUp',
  staggerDelay = 100,
  config = {}
) => {
  const refs = useRef([]);
  const animatedElementsRef = useRef([]);

  useEffect(() => {
    const elements = refs.current.filter(Boolean);
    if (elements.length === 0) return;

    // Clean up previous instances
    animatedElementsRef.current.forEach(instance => {
      instance?.destroy();
    });
    animatedElementsRef.current = [];

    // Create new instances with staggered delays
    elements.forEach((element, index) => {
      const elementConfig = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
        triggerOnce: true,
        delay: index * staggerDelay + 50,
        ...config
      };

      try {
        const animatedElement = new AnimatedElement(
          element,
          animationType,
          elementConfig
        );
        animatedElementsRef.current.push(animatedElement);
      } catch (error) {
        console.error(`Failed to create animated element ${index}:`, error);
        animatedElementsRef.current.push(null);
      }
    });

    // Cleanup
    return () => {
      animatedElementsRef.current.forEach(instance => {
        instance?.destroy();
      });
      animatedElementsRef.current = [];
    };
  }, [count, animationType, staggerDelay, config.threshold, config.rootMargin, config.triggerOnce]);

  // Control methods
  const showAll = () => {
    animatedElementsRef.current.forEach(instance => instance?.show());
  };

  const hideAll = () => {
    animatedElementsRef.current.forEach(instance => instance?.hide());
  };

  const resetAll = () => {
    animatedElementsRef.current.forEach(instance => instance?.reset());
  };

  const getStates = () => {
    return animatedElementsRef.current.map(instance => instance?.getState());
  };

  return {
    refs,
    showAll,
    hideAll,
    resetAll,
    getStates
  };
};

/**
 * React hook for batch scroll animations with different types
 * @param {Array} animationConfigs - Array of {selector, animationType, config}
 * @returns {Object} - Control methods for the batch
 */
export const useBatchScrollAnimations = (animationConfigs = []) => {
  const scrollTriggerRef = useRef(null);

  useEffect(() => {
    if (animationConfigs.length === 0) return;

    // Create scroll trigger instance
    scrollTriggerRef.current = new ScrollTrigger({
      observer: {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
        debug: false
      }
    });

    // Add batch animations
    scrollTriggerRef.current.addBatch(animationConfigs);

    // Cleanup
    return () => {
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.destroy();
        scrollTriggerRef.current = null;
      }
    };
  }, [animationConfigs]);

  // Control methods
  const trigger = (selector, direction = 'enter') => {
    scrollTriggerRef.current?.trigger(selector, direction);
  };

  const reset = () => {
    scrollTriggerRef.current?.reset();
  };

  const getState = () => {
    return scrollTriggerRef.current?.getState();
  };

  return {
    trigger,
    reset,
    getState
  };
};
