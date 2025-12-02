import ScrollObserver from '../core/ScrollObserver.js';
import AnimationRegistry from '../core/AnimationRegistry.js';
import { validateConfig } from '../utils/validation.js';

class ScrollTrigger {
  constructor(options = {}) {
    this.config = validateConfig(options);
    this.observer = new ScrollObserver(this.config.observer);
    this.elements = [];
    
    this.initializeAnimations();
  }

  async initializeAnimations() {
    // Register all available animations
    try {
      const { fadeAnimations } = await import('../animations/FadeAnimations.js');
      const { slideAnimations } = await import('../animations/SlideAnimations.js');
      const { scaleAnimations } = await import('../animations/ScaleAnimations.js');
      
      AnimationRegistry.registerBatch({
        ...fadeAnimations,
        ...slideAnimations,
        ...scaleAnimations
      });
    } catch (error) {
      console.warn('Failed to load some animations:', error);
    }
  }

  // Add single element
  add(selector, animationType, config = {}) {
    const elements = this.getElements(selector);
    
    elements.forEach((element, index) => {
      const elementConfig = {
        ...config,
        delay: config.delay ? config.delay + (index * (config.stagger || 0)) : 0
      };

      // Set initial state
      this.setInitialState(element, animationType);

      this.observer.observe(element, animationType, elementConfig, config.callbacks);
      this.elements.push({ element, animationType, config: elementConfig });
    });

    return this; // For chaining
  }

  // Add multiple elements with different animations
  addBatch(configs) {
    configs.forEach(({ selector, animation, config }) => {
      this.add(selector, animation, config);
    });
    return this;
  }

  // Remove element from observation
  remove(selector) {
    const elements = this.getElements(selector);
    elements.forEach(element => {
      this.observer.unobserve(element);
      this.elements = this.elements.filter(item => item.element !== element);
    });
    return this;
  }

  // Trigger animation manually
  trigger(selector, direction = 'enter') {
    const elements = this.getElements(selector);
    elements.forEach(element => {
      const elementData = this.elements.find(item => item.element === element);
      if (elementData) {
        AnimationRegistry.trigger(
          element, 
          elementData.animationType, 
          elementData.config, 
          direction
        );
      }
    });
    return this;
  }

  // Set initial state for elements
  setInitialState(element, animationType) {
    if (AnimationRegistry.hasAnimation(animationType)) {
      const animation = AnimationRegistry.animations.get(animationType);
      if (animation && animation.exit) {
        Object.assign(element.style, animation.exit);
      }
    }
  }

  // Utility method to get elements
  getElements(selector) {
    if (typeof selector === 'string') {
      return Array.from(document.querySelectorAll(selector));
    } else if (selector instanceof Element) {
      return [selector];
    } else if (selector instanceof NodeList || Array.isArray(selector)) {
      return Array.from(selector);
    }
    return [];
  }

  // Reset all elements to initial state
  reset() {
    this.elements.forEach(({ element, animationType }) => {
      this.setInitialState(element, animationType);
    });
    return this;
  }

  // Pause all observations
  pause() {
    this.elements.forEach(({ element }) => {
      this.observer.unobserve(element);
    });
    return this;
  }

  // Resume all observations
  resume() {
    this.elements.forEach(({ element, animationType, config }) => {
      this.observer.observe(element, animationType, config);
    });
    return this;
  }

  // Get current state
  getState() {
    return {
      elementsCount: this.elements.length,
      observerInitialized: this.observer.isInitialized,
      registeredAnimations: AnimationRegistry.getAnimations()
    };
  }

  // Destroy instance
  destroy() {
    this.observer.destroy();
    this.elements = [];
  }
}

export default ScrollTrigger;