// Core components
import ScrollTrigger from './components/ScrollTrigger.js';
import AnimatedElement from './components/AnimatedElement.js';
import ScrollObserver from './core/ScrollObserver.js';
import AnimationRegistry from './core/AnimationRegistry.js';

// Animation libraries
import { fadeAnimations } from './animations/FadeAnimations.js';
import { slideAnimations } from './animations/SlideAnimations.js';
import { scaleAnimations } from './animations/ScaleAnimations.js';

// Utilities
import { performanceMonitor, animationScheduler } from './utils/performance.js';
import * as validation from './utils/validation.js';

// Auto-register default animations
AnimationRegistry.registerBatch({
  ...fadeAnimations,
  ...slideAnimations,
  ...scaleAnimations
});

// Simple API factory function
export function createScrollAnimation(options = {}) {
  return new ScrollTrigger(options);
}

// Quick element animation function
export function animateElement(element, animationType, config = {}) {
  return new AnimatedElement(element, animationType, config);
}

// Batch animation helper
export function animateElements(configs) {
  const scrollTrigger = new ScrollTrigger();
  return scrollTrigger.addBatch(configs);
}

// Register custom animation helper
export function registerAnimation(name, config) {
  AnimationRegistry.register(name, config);
}

// Register multiple animations helper
export function registerAnimations(animations) {
  AnimationRegistry.registerBatch(animations);
}

// Performance monitoring helpers
export function enablePerformanceMonitoring() {
  return performanceMonitor;
}

export function getAnimationMetrics() {
  return performanceMonitor.getMetrics();
}

export function logPerformance() {
  performanceMonitor.logMetrics();
}

// Main exports
export {
  // Core classes
  ScrollTrigger,
  AnimatedElement,
  ScrollObserver,
  AnimationRegistry,
  
  // Animation libraries
  fadeAnimations,
  slideAnimations,
  scaleAnimations,
  
  // Utilities
  performanceMonitor,
  animationScheduler,
  validation
};

// Default export for easy usage
export default ScrollTrigger;

// Global registration for script tag usage
if (typeof window !== 'undefined') {
  window.ScrollAnimationSystem = {
    ScrollTrigger,
    AnimatedElement,
    AnimationRegistry,
    createScrollAnimation,
    animateElement,
    animateElements,
    registerAnimation,
    registerAnimations,
    performanceMonitor,
    getAnimationMetrics,
    logPerformance
  };
  
  // Shorthand globals
  window.ScrollTrigger = ScrollTrigger;
  window.AnimatedElement = AnimatedElement;
}