/**
 * Hero Slider - Auto-rotating image slider with manual controls
 * Industry-grade, production-ready code
 */
class HeroSlider {
    constructor(config = {}) {
      // Configuration with defaults
      this.config = {
        interval: config.interval || 2000, // 2 seconds default
        autoPlay: config.autoPlay !== undefined ? config.autoPlay : true,
        pauseOnHover: config.pauseOnHover !== undefined ? config.pauseOnHover : true,
        transitionDuration: config.transitionDuration || 800,
        keyboardNavigation: config.keyboardNavigation !== undefined ? config.keyboardNavigation : true
      };
      
      // DOM Elements
      this.slides = document.querySelectorAll('.hero-slide');
      this.dots = document.querySelectorAll('.dot');
      this.prevBtn = document.querySelector('.hero-arrow-prev');
      this.nextBtn = document.querySelector('.hero-arrow-next');
      this.heroSlider = document.querySelector('.hero-slider');
      
      // State
      this.currentIndex = 0;
      this.totalSlides = this.slides.length;
      this.autoPlayTimer = null;
      this.isTransitioning = false;
      this.isPaused = false;
      
      // Initialize
      this.init();
    }
    
    /**
     * Initialize the slider
     */
    init() {
      if (this.totalSlides === 0) {
        console.warn('No slides found for hero slider');
        return;
      }
      
      // Set initial state
      this.goToSlide(0, false);
      
      // Bind event listeners
      this.bindEvents();
      
      // Start auto-play
      if (this.config.autoPlay) {
        this.startAutoPlay();
      }
      
      // Log initialization
      console.log(`HeroSlider initialized with ${this.totalSlides} slides`);
    }
    
    /**
     * Go to specific slide
     */
    goToSlide(index, animate = true) {
      if (this.isTransitioning || index === this.currentIndex) return;
      
      // Validate index
      if (index < 0) index = this.totalSlides - 1;
      if (index >= this.totalSlides) index = 0;
      
      this.isTransitioning = true;
      
      // Update slides
      this.slides.forEach((slide, i) => {
        slide.classList.remove('active');
      });
      this.slides[index].classList.add('active');
      
      // Update dots
      this.dots.forEach((dot, i) => {
        dot.classList.remove('active');
      });
      this.dots[index].classList.add('active');
      
      // Update current index
      this.currentIndex = index;
      
      // Reset transition lock after animation
      setTimeout(() => {
        this.isTransitioning = false;
      }, this.config.transitionDuration);
    }
    
    /**
     * Next slide
     */
    nextSlide() {
      if (this.isTransitioning) return;
      this.goToSlide(this.currentIndex + 1);
    }
    
    /**
     * Previous slide
     */
    prevSlide() {
      if (this.isTransitioning) return;
      this.goToSlide(this.currentIndex - 1);
    }
    
    /**
     * Start auto-play
     */
    startAutoPlay() {
      this.stopAutoPlay(); // Clear any existing timer
      
      this.autoPlayTimer = setInterval(() => {
        if (!this.isPaused && !this.isTransitioning) {
          this.nextSlide();
        }
      }, this.config.interval);
    }
    
    /**
     * Stop auto-play
     */
    stopAutoPlay() {
      if (this.autoPlayTimer) {
        clearInterval(this.autoPlayTimer);
        this.autoPlayTimer = null;
      }
    }
    
    /**
     * Pause auto-play
     */
    pause() {
      this.isPaused = true;
    }
    
    /**
     * Resume auto-play
     */
    resume() {
      this.isPaused = false;
    }
    
    /**
     * Bind event listeners
     */
    bindEvents() {
      // Next button
      if (this.nextBtn) {
        this.nextBtn.addEventListener('click', () => {
          this.nextSlide();
          this.resetAutoPlay();
        });
      }
      
      // Previous button
      if (this.prevBtn) {
        this.prevBtn.addEventListener('click', () => {
          this.prevSlide();
          this.resetAutoPlay();
        });
      }
      
      // Dot indicators
      this.dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
          this.goToSlide(index);
          this.resetAutoPlay();
        });
      });
      
      // Keyboard navigation
      if (this.config.keyboardNavigation) {
        document.addEventListener('keydown', (e) => {
          if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            e.preventDefault();
            this.nextSlide();
            this.resetAutoPlay();
          } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            e.preventDefault();
            this.prevSlide();
            this.resetAutoPlay();
          }
        });
      }
      
      // Pause on hover
      if (this.config.pauseOnHover && this.heroSlider) {
        this.heroSlider.addEventListener('mouseenter', () => {
          this.pause();
        });
        
        this.heroSlider.addEventListener('mouseleave', () => {
          this.resume();
        });
      }
      
      // Touch/swipe support for mobile
      this.setupTouchSupport();
      
      // Handle visibility change (pause when tab is not visible)
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          this.pause();
        } else {
          this.resume();
          this.resetAutoPlay();
        }
      });
    }
    
    /**
     * Setup touch support for mobile devices
     */
    setupTouchSupport() {
      if (!this.heroSlider) return;
      
      let touchStartX = 0;
      let touchStartY = 0;
      let touchEndX = 0;
      let touchEndY = 0;
      
      this.heroSlider.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
      }, { passive: true });
      
      this.heroSlider.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        touchEndY = e.changedTouches[0].screenY;
        this.handleSwipe(touchStartX, touchStartY, touchEndX, touchEndY);
      }, { passive: true });
    }
    
    /**
     * Handle swipe gesture
     */
    handleSwipe(startX, startY, endX, endY) {
      const deltaX = endX - startX;
      const deltaY = endY - startY;
      
      // Minimum swipe distance
      const minSwipeDistance = 50;
      
      // Check if horizontal swipe
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
        if (deltaX < 0) {
          // Swipe left - next slide
          this.nextSlide();
        } else {
          // Swipe right - previous slide
          this.prevSlide();
        }
        this.resetAutoPlay();
      }
    }
    
    /**
     * Reset auto-play timer
     */
    resetAutoPlay() {
      if (this.config.autoPlay) {
        this.startAutoPlay();
      }
    }
    
    /**
     * Cleanup method (for single-page apps)
     */
    destroy() {
      this.stopAutoPlay();
      // Remove event listeners if needed
    }
  }
  
  // Initialize slider when DOM is ready
  document.addEventListener('DOMContentLoaded', function() {
    // Check if slides exist
    if (document.querySelectorAll('.hero-slide').length > 0) {
      const heroSlider = new HeroSlider({
        interval: 3000, // 3 seconds
        autoPlay: true,
        pauseOnHover: true,
        keyboardNavigation: true,
        transitionDuration: 800
      });
      
      // Make slider globally accessible for debugging
      window.heroSlider = heroSlider;
    }
  });