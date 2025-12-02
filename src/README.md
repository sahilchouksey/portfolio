# 🎯 Modular Scroll Animation System

A powerful, performance-optimized, and modular scroll animation system built on the Intersection Observer API.

## ✨ Features

- **🚀 High Performance**: Built on Intersection Observer API - no scroll event listeners
- **🧩 Modular Design**: Import only what you need with tree-shaking support
- **🎨 Rich Animation Library**: Pre-built fade, slide, and scale animations
- **⚛️ React Integration**: Custom hooks for seamless React integration
- **📊 Performance Monitoring**: Built-in performance metrics and optimization
- **🔧 Highly Configurable**: Extensive configuration options
- **🎭 Custom Animations**: Easy to register custom animation types
- **🔄 Batch Operations**: Handle multiple elements efficiently

## 📁 Architecture

```
scroll-animation-system/
├── core/
│   ├── ScrollObserver.js       # Intersection Observer wrapper
│   └── AnimationRegistry.js    # Animation management
├── animations/
│   ├── FadeAnimations.js       # Fade effects
│   ├── SlideAnimations.js      # Slide effects
│   └── ScaleAnimations.js      # Scale effects
├── components/
│   ├── ScrollTrigger.js        # Main component wrapper
│   └── AnimatedElement.js      # Individual element control
├── hooks/
│   └── useScrollAnimation.js   # React hooks
├── utils/
│   ├── validation.js           # Input validation
│   └── performance.js          # Performance monitoring
└── index.js                    # Main exports
```

## 🚀 Quick Start

### Basic Usage

```javascript
import { createScrollAnimation } from './scroll-animation-system';

const scrollTrigger = createScrollAnimation();

// Add animations
scrollTrigger
  .add('.hero-title', 'fadeInUp', { delay: 200 })
  .add('.hero-subtitle', 'slideInLeft', { delay: 400 })
  .add('.hero-button', 'scaleIn', { delay: 600 });
```

### React Hooks

```jsx
import { useModularScrollAnimation } from './useScrollAnimation';

function MyComponent() {
  const animation = useModularScrollAnimation('fadeInUp', {
    delay: 200,
    threshold: 0.2
  });

  return (
    <div ref={animation.ref}>
      <h1>Animated Title</h1>
      <button onClick={animation.show}>Show</button>
      <button onClick={animation.hide}>Hide</button>
    </div>
  );
}
```

## 🎨 Available Animations

### Fade Animations
- `fadeIn` - Simple opacity fade
- `fadeInUp` - Fade with upward movement
- `fadeInDown` - Fade with downward movement  
- `fadeInLeft` - Fade with left movement
- `fadeInRight` - Fade with right movement
- `fadeOpacity` - Opacity only (for special cases)

### Slide Animations
- `slideInUp` - Slide from bottom
- `slideInDown` - Slide from top
- `slideInLeft` - Slide from left
- `slideInRight` - Slide from right
- `slideInUpSmooth` - Gentler slide up

### Scale Animations
- `scaleIn` - Scale from small to normal
- `scaleInUp` - Scale with upward movement
- `zoomIn` - Dramatic scale effect
- `scaleInDown` - Scale with downward movement
- `bounceScale` - Bouncy scale effect

## 🔧 Configuration Options

```javascript
const config = {
  // Intersection Observer options
  threshold: 0.1,              // When to trigger (0-1)
  rootMargin: '50px',          // Trigger offset
  triggerOnce: true,           // Only animate once
  
  // Animation options
  delay: 200,                  // Animation delay (ms)
  duration: 600,               // Animation duration (ms)
  easing: 'ease-out',          // CSS easing function
  
  // Callbacks
  callbacks: {
    onEnter: (element) => {},  // When element enters
    onExit: (element) => {}    // When element exits
  }
};
```

## 📊 Performance Monitoring

```javascript
import { performanceMonitor, logPerformance } from './scroll-animation-system';

// Get metrics
const metrics = performanceMonitor.getMetrics();
console.log(metrics);

// Log performance table
logPerformance();

// Monitor specific animation
const endMonitoring = performanceMonitor.startAnimation(element, 'fadeInUp');
// ... animation completes
endMonitoring();
```

## 🎭 Custom Animations

```javascript
import { registerAnimation } from './scroll-animation-system';

// Register custom animation
registerAnimation('customSlide', {
  enter: {
    transform: 'translateX(0) rotate(0deg)',
    opacity: '1'
  },
  exit: {
    transform: 'translateX(-100px) rotate(-5deg)', 
    opacity: '0'
  },
  duration: 800,
  easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
});

// Use custom animation
scrollTrigger.add('.my-element', 'customSlide');
```

## ⚛️ React Hooks API

### useModularScrollAnimation
Single element animation with full control.

```jsx
const { ref, show, hide, reset, getState } = useModularScrollAnimation(
  'fadeInUp',  // animation type
  {            // config
    delay: 200,
    threshold: 0.2,
    callbacks: {
      onEnter: (el) => console.log('Entered'),
      onExit: (el) => console.log('Exited')
    }
  }
);
```

### useModularMultipleScrollAnimations
Multiple elements with staggered animations.

```jsx
const { refs, showAll, hideAll, resetAll } = useModularMultipleScrollAnimations(
  4,           // count
  'fadeInUp',  // animation type
  150,         // stagger delay
  { threshold: 0.1 }  // base config
);

// Usage
{items.map((item, index) => (
  <div key={item.id} ref={el => refs.current[index] = el}>
    {item.content}
  </div>
))}
```

### useBatchScrollAnimations
Different animations for different elements.

```jsx
const { trigger, reset } = useBatchScrollAnimations([
  {
    selector: '.header',
    animation: 'fadeInUp',
    config: { delay: 100 }
  },
  {
    selector: '.content', 
    animation: 'slideInLeft',
    config: { delay: 200 }
  }
]);
```

## 🧪 Examples

### Staggered Card Grid
```jsx
function CardGrid({ cards }) {
  const { refs } = useModularMultipleScrollAnimations(
    cards.length,
    'fadeInUp',
    100
  );

  return (
    <div className="grid">
      {cards.map((card, index) => (
        <div 
          key={card.id}
          ref={el => refs.current[index] = el}
          className="card"
        >
          {card.content}
        </div>
      ))}
    </div>
  );
}
```

### Hero Section
```jsx
function HeroSection() {
  const title = useModularScrollAnimation('fadeInUp', { delay: 200 });
  const subtitle = useModularScrollAnimation('fadeInUp', { delay: 400 });
  const cta = useModularScrollAnimation('scaleIn', { delay: 600 });

  return (
    <section className="hero">
      <h1 ref={title.ref}>Amazing Title</h1>
      <p ref={subtitle.ref}>Compelling subtitle</p>
      <button ref={cta.ref}>Call to Action</button>
    </section>
  );
}
```

### Testimonial Carousel
```jsx
function TestimonialCarousel() {
  const testimonial = useModularScrollAnimation('fadeOpacity', {
    triggerOnce: false,  // Allow re-triggering
    threshold: 0.5
  });

  return (
    <div ref={testimonial.ref} className="testimonial">
      <blockquote>Great product!</blockquote>
      <cite>Happy Customer</cite>
    </div>
  );
}
```

## 🎯 Migration from CSS-based System

The new system is designed to be a drop-in replacement:

```jsx
// Old CSS-based approach
const elementRef = useScrollAnimation(200); // delay

// New modular approach  
const { ref } = useModularScrollAnimation('fadeInUp', { delay: 200 });

// Both work the same way
<div ref={ref}>Content</div>
```

## 🔬 Performance Optimization

The system includes several performance optimizations:

1. **Intersection Observer**: No scroll event listeners
2. **Hardware Acceleration**: Uses `translate3d` and `transform-style: preserve-3d`
3. **Batch Operations**: Efficient handling of multiple elements
4. **Tree Shaking**: Import only what you need
5. **Performance Monitoring**: Built-in metrics tracking
6. **Animation Scheduling**: Prevents excessive concurrent animations

## 🐛 Browser Support

- ✅ Chrome 58+
- ✅ Firefox 55+ 
- ✅ Safari 12.1+
- ✅ Edge 16+
- ⚠️ IE 11 (with polyfill)

For IE support, include the Intersection Observer polyfill:
```html
<script src="https://polyfill.io/v3/polyfill.min.js?features=IntersectionObserver"></script>
```

## 📈 Performance Metrics

Monitor your animations with built-in metrics:

```javascript
const metrics = performanceMonitor.getMetrics();
// {
//   animationsTriggered: 15,
//   averageAnimationTime: 45.2,
//   peakAnimationTime: 120.5,
//   elementsObserved: 25,
//   activeAnimations: 0
// }
```

## 🤝 Contributing

1. Follow the modular architecture
2. Add tests for new animations
3. Update documentation
4. Ensure backward compatibility
5. Monitor performance impact

## 📄 License

MIT License - feel free to use in your projects!

---

*Built with ❤️ for optimal web performance and developer experience.*