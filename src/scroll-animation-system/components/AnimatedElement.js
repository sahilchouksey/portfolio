import AnimationRegistry from '../core/AnimationRegistry.js';
import { validateElement } from '../utils/validation.js';

class AnimatedElement {
  constructor(element, animationType, config = {}) {
    this.element = validateElement(element);
    this.animationType = animationType;
    this.config = {
      triggerOnce: true,
      threshold: 0.1,
      rootMargin: '50px',
      ...config
    };

    this.isVisible = false;
    this.callbacks = config.callbacks || {};
    this.observer = null;
    
    this.init();
  }

  init() {
    // Set initial state
    this.setInitialState();
    
    // Create observer for this specific element
    this.observer = new IntersectionObserver(
      this.handleIntersection.bind(this),
      {
        threshold: this.config.threshold,
        rootMargin: this.config.rootMargin
      }
    );

    this.observer.observe(this.element);
  }

  setInitialState() {
    if (AnimationRegistry.hasAnimation(this.animationType)) {
      const animation = AnimationRegistry.animations.get(this.animationType);
      if (animation && animation.exit) {
        Object.assign(this.element.style, animation.exit);
      }
    }
  }

  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting && !this.isVisible) {
        this.animateIn();
      } else if (!entry.isIntersecting && !this.config.triggerOnce && this.isVisible) {
        this.animateOut();
      }
    });
  }

  animateIn() {
    this.isVisible = true;
    AnimationRegistry.trigger(this.element, this.animationType, this.config, 'enter');
    this.callbacks.onEnter?.(this.element);

    if (this.config.triggerOnce) {
      this.observer.unobserve(this.element);
    }
  }

  animateOut() {
    this.isVisible = false;
    AnimationRegistry.trigger(this.element, this.animationType, this.config, 'exit');
    this.callbacks.onExit?.(this.element);
  }

  // Manual controls
  show() {
    this.animateIn();
    return this;
  }

  hide() {
    this.animateOut();
    return this;
  }

  // Reset to initial state
  reset() {
    this.isVisible = false;
    this.setInitialState();
    return this;
  }

  // Update configuration
  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
    this.callbacks = this.config.callbacks || {};
    
    // Recreate observer with new config
    this.observer?.disconnect();
    this.observer = new IntersectionObserver(
      this.handleIntersection.bind(this),
      {
        threshold: this.config.threshold,
        rootMargin: this.config.rootMargin
      }
    );
    
    if (!this.isVisible || !this.config.triggerOnce) {
      this.observer.observe(this.element);
    }
    
    return this;
  }

  // Change animation type
  changeAnimation(newAnimationType) {
    this.animationType = newAnimationType;
    this.setInitialState();
    return this;
  }

  // Get current state
  getState() {
    return {
      isVisible: this.isVisible,
      animationType: this.animationType,
      element: this.element,
      config: this.config
    };
  }

  // Pause observation
  pause() {
    this.observer?.unobserve(this.element);
    return this;
  }

  // Resume observation
  resume() {
    if (!this.isVisible || !this.config.triggerOnce) {
      this.observer?.observe(this.element);
    }
    return this;
  }

  // Destroy instance
  destroy() {
    this.observer?.disconnect();
    this.observer = null;
  }
}

export default AnimatedElement;