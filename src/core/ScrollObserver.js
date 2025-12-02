class ScrollObserver {
  constructor(options = {}) {
    this.defaultOptions = {
      threshold: [0, 0.1, 0.5, 1],
      rootMargin: '50px',
      triggerOnce: true,
      debug: false
    };
    
    this.options = { ...this.defaultOptions, ...options };
    this.observer = null;
    this.elements = new Map();
    this.isInitialized = false;
    
    this.init();
  }

  init() {
    if (!this.isSupported()) {
      this.handleFallback();
      return;
    }

    this.observer = new IntersectionObserver(
      this.handleIntersection.bind(this),
      {
        threshold: this.options.threshold,
        rootMargin: this.options.rootMargin
      }
    );
    
    this.isInitialized = true;
    this.log('ScrollObserver initialized');
  }

  handleIntersection(entries) {
    entries.forEach(entry => {
      const elementData = this.elements.get(entry.target);
      if (!elementData) return;

      const { animation, config, callback } = elementData;
      
      if (entry.isIntersecting) {
        this.triggerAnimation(entry.target, animation, config, 'enter');
        callback?.onEnter?.(entry);
        
        if (config.triggerOnce) {
          this.unobserve(entry.target);
        }
      } else if (!config.triggerOnce) {
        this.triggerAnimation(entry.target, animation, config, 'exit');
        callback?.onExit?.(entry);
      }
    });
  }

  observe(element, animationType, config = {}, callbacks = {}) {
    if (!this.isInitialized) {
      this.log('Observer not initialized', 'error');
      return;
    }

    const finalConfig = { ...this.options, ...config };
    
    this.elements.set(element, {
      animation: animationType,
      config: finalConfig,
      callback: callbacks
    });

    this.observer.observe(element);
    this.log(`Observing element with ${animationType} animation`);
  }

  unobserve(element) {
    this.observer?.unobserve(element);
    this.elements.delete(element);
  }

  triggerAnimation(element, animationType, config, direction) {
    // This will be handled by AnimationRegistry
    if (window.AnimationRegistry) {
      window.AnimationRegistry.trigger(element, animationType, config, direction);
    }
  }

  isSupported() {
    return 'IntersectionObserver' in window;
  }

  handleFallback() {
    // Fallback for older browsers
    this.log('IntersectionObserver not supported, using fallback', 'warn');
    // Could implement scroll-based fallback here if needed
  }

  log(message, type = 'info') {
    if (this.options.debug) {
      console[type](`[ScrollObserver] ${message}`);
    }
  }

  destroy() {
    this.observer?.disconnect();
    this.elements.clear();
    this.isInitialized = false;
  }
}

export default ScrollObserver;