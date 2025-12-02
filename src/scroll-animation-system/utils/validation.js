export function validateConfig(config) {
  const defaults = {
    observer: {
      threshold: [0, 0.1, 0.5, 1],
      rootMargin: '50px',
      triggerOnce: true,
      debug: false
    }
  };

  // Validate threshold
  if (config.observer?.threshold) {
    const threshold = config.observer.threshold;
    if (Array.isArray(threshold)) {
      if (!threshold.every(t => t >= 0 && t <= 1)) {
        console.warn('Threshold values must be between 0 and 1');
      }
    } else if (typeof threshold === 'number') {
      if (threshold < 0 || threshold > 1) {
        console.warn('Threshold value must be between 0 and 1');
      }
    }
  }

  // Validate rootMargin
  if (config.observer?.rootMargin) {
    const rootMargin = config.observer.rootMargin;
    if (typeof rootMargin !== 'string') {
      console.warn('rootMargin must be a string (e.g., "50px", "10% 20px")');
    }
  }

  return {
    ...defaults,
    ...config,
    observer: {
      ...defaults.observer,
      ...config.observer
    }
  };
}

export function validateElement(element) {
  if (!element) {
    throw new Error('Element is required');
  }
  
  if (typeof element === 'string') {
    const found = document.querySelector(element);
    if (!found) {
      throw new Error(`Element with selector "${element}" not found`);
    }
    return found;
  }
  
  if (!(element instanceof Element)) {
    throw new Error('Element must be a DOM element or valid selector');
  }
  
  return element;
}

export function validateAnimationType(animationType, animationRegistry) {
  if (!animationType) {
    throw new Error('Animation type is required');
  }
  
  if (typeof animationType !== 'string') {
    throw new Error('Animation type must be a string');
  }
  
  if (animationRegistry && !animationRegistry.hasAnimation(animationType)) {
    console.warn(`Animation type "${animationType}" is not registered`);
  }
  
  return animationType;
}

export function validateCallbacks(callbacks) {
  if (!callbacks || typeof callbacks !== 'object') {
    return {};
  }
  
  const validCallbacks = {};
  
  if (callbacks.onEnter && typeof callbacks.onEnter === 'function') {
    validCallbacks.onEnter = callbacks.onEnter;
  }
  
  if (callbacks.onExit && typeof callbacks.onExit === 'function') {
    validCallbacks.onExit = callbacks.onExit;
  }
  
  return validCallbacks;
}

export function validateDelay(delay) {
  if (delay === undefined || delay === null) {
    return 0;
  }
  
  if (typeof delay !== 'number' || delay < 0) {
    console.warn('Delay must be a positive number, defaulting to 0');
    return 0;
  }
  
  return delay;
}

export function validateDuration(duration) {
  if (duration === undefined || duration === null) {
    return 600; // default
  }
  
  if (typeof duration !== 'number' || duration <= 0) {
    console.warn('Duration must be a positive number, defaulting to 600ms');
    return 600;
  }
  
  return duration;
}