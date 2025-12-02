class AnimationRegistry {
  constructor() {
    this.animations = new Map();
    this.defaultDuration = 600;
    this.defaultEasing = 'cubic-bezier(0.4, 0, 0.2, 1)';
  }

  register(name, animationConfig) {
    this.animations.set(name, {
      enter: animationConfig.enter || {},
      exit: animationConfig.exit || animationConfig.enter || {},
      duration: animationConfig.duration || this.defaultDuration,
      easing: animationConfig.easing || this.defaultEasing,
      delay: animationConfig.delay || 0
    });
  }

  trigger(element, animationType, config, direction = 'enter') {
    const animation = this.animations.get(animationType);
    if (!animation) {
      console.warn(`Animation "${animationType}" not found`);
      return;
    }

    const animationData = animation[direction];
    const duration = config.duration || animation.duration;
    const easing = config.easing || animation.easing;
    const delay = config.delay || animation.delay;

    // Apply animation
    this.applyAnimation(element, animationData, duration, easing, delay);
  }

  applyAnimation(element, animationData, duration, easing, delay) {
    // Set initial state
    Object.assign(element.style, {
      transition: `all ${duration}ms ${easing}`,
      transitionDelay: `${delay}ms`,
      ...animationData
    });

    // Trigger reflow to ensure transition works
    element.offsetHeight;
  }

  // Batch register multiple animations
  registerBatch(animations) {
    Object.entries(animations).forEach(([name, config]) => {
      this.register(name, config);
    });
  }

  // Get all registered animations
  getAnimations() {
    return Array.from(this.animations.keys());
  }

  // Check if animation exists
  hasAnimation(name) {
    return this.animations.has(name);
  }

  // Remove animation
  unregister(name) {
    return this.animations.delete(name);
  }

  // Clear all animations
  clear() {
    this.animations.clear();
  }
}

// Create global instance
const animationRegistry = new AnimationRegistry();

// Make it globally available
if (typeof window !== 'undefined') {
  window.AnimationRegistry = animationRegistry;
}

export default animationRegistry;