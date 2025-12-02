export class PerformanceMonitor {
  constructor() {
    this.metrics = {
      animationsTriggered: 0,
      averageAnimationTime: 0,
      totalAnimationTime: 0,
      peakAnimationTime: 0,
      elementsObserved: 0
    };
    this.activeAnimations = new Map();
  }

  startAnimation(element, animationType) {
    const startTime = performance.now();
    const animationId = `${element.tagName}-${Date.now()}`;
    
    this.activeAnimations.set(animationId, {
      element,
      animationType,
      startTime
    });
    
    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      this.recordAnimation(duration, animationType);
      this.activeAnimations.delete(animationId);
    };
  }

  recordAnimation(duration, animationType = 'unknown') {
    this.metrics.animationsTriggered++;
    this.metrics.totalAnimationTime += duration;
    this.metrics.averageAnimationTime = 
      this.metrics.totalAnimationTime / this.metrics.animationsTriggered;
    
    if (duration > this.metrics.peakAnimationTime) {
      this.metrics.peakAnimationTime = duration;
    }

    // Log slow animations
    if (duration > 1000) {
      console.warn(`Slow animation detected: ${animationType} took ${duration.toFixed(2)}ms`);
    }
  }

  recordElementObserved() {
    this.metrics.elementsObserved++;
  }

  getMetrics() {
    return {
      ...this.metrics,
      activeAnimations: this.activeAnimations.size,
      formattedAverageTime: `${this.metrics.averageAnimationTime.toFixed(2)}ms`,
      formattedPeakTime: `${this.metrics.peakAnimationTime.toFixed(2)}ms`
    };
  }

  logMetrics() {
    console.group('🎯 Animation Performance Metrics');
    console.table(this.getMetrics());
    console.groupEnd();
  }

  reset() {
    this.metrics = {
      animationsTriggered: 0,
      averageAnimationTime: 0,
      totalAnimationTime: 0,
      peakAnimationTime: 0,
      elementsObserved: 0
    };
    this.activeAnimations.clear();
  }

  // Check if browser supports optimized animations
  checkOptimizedSupport() {
    return {
      intersectionObserver: 'IntersectionObserver' in window,
      requestAnimationFrame: 'requestAnimationFrame' in window,
      transforms3d: this.supportsTransforms3d(),
      willChange: this.supportsWillChange()
    };
  }

  supportsTransforms3d() {
    const el = document.createElement('div');
    el.style.transform = 'translateZ(0)';
    return el.style.transform !== '';
  }

  supportsWillChange() {
    const el = document.createElement('div');
    return 'willChange' in el.style;
  }
}

// Global instance
export const performanceMonitor = new PerformanceMonitor();

// Throttle function for performance
export function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Debounce function
export function debounce(func, wait, immediate) {
  let timeout;
  return function() {
    const context = this;
    const args = arguments;
    const later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

// Request animation frame helper
export function nextFrame(callback) {
  return requestAnimationFrame(() => {
    requestAnimationFrame(callback);
  });
}

// Optimize element for animations
export function optimizeElement(element) {
  if (performanceMonitor.supportsWillChange()) {
    element.style.willChange = 'transform, opacity';
  }
  
  // Promote to composite layer
  if (performanceMonitor.supportsTransforms3d()) {
    element.style.backfaceVisibility = 'hidden';
    element.style.perspective = '1000px';
  }
}

// Clean up optimization
export function cleanupOptimization(element) {
  element.style.willChange = '';
  element.style.backfaceVisibility = '';
  element.style.perspective = '';
}

// Performance-aware animation scheduler
export class AnimationScheduler {
  constructor() {
    this.queue = [];
    this.isRunning = false;
    this.maxConcurrent = 3; // Limit concurrent animations
    this.frameId = null;
  }

  schedule(animationFn, priority = 0) {
    this.queue.push({ animationFn, priority });
    this.queue.sort((a, b) => b.priority - a.priority);
    
    if (!this.isRunning) {
      this.process();
    }
  }

  process() {
    if (this.queue.length === 0) {
      this.isRunning = false;
      return;
    }

    this.isRunning = true;
    const batch = this.queue.splice(0, this.maxConcurrent);
    
    batch.forEach(({ animationFn }) => {
      try {
        animationFn();
      } catch (error) {
        console.error('Animation error:', error);
      }
    });

    this.frameId = requestAnimationFrame(() => this.process());
  }

  stop() {
    this.isRunning = false;
    if (this.frameId) {
      cancelAnimationFrame(this.frameId);
    }
    this.queue = [];
  }
}

export const animationScheduler = new AnimationScheduler();