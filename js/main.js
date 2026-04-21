// ===== Mobile Menu Toggle =====
document.addEventListener('DOMContentLoaded', function() {
  // Mobile menu toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (menuToggle) {
    menuToggle.addEventListener('click', function() {
      navLinks.classList.toggle('active');
    });
  }
  
  // Dropdown for mobile
  const dropdowns = document.querySelectorAll('.dropdown');
  dropdowns.forEach(dropdown => {
    const link = dropdown.querySelector('a');
    if (link && window.innerWidth <= 768) {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        dropdown.classList.toggle('active');
      });
    }
  });
  
  // Close mobile menu when clicking outside
  document.addEventListener('click', function(e) {
    if (navLinks && navLinks.classList.contains('active')) {
      if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
        navLinks.classList.remove('active');
      }
    }
  });
  
  // Track analytics
  trackClicks();
  
  // Lazy load images
  lazyLoadImages();
  
  // Smooth scroll
  smoothScroll();
});

// ===== Analytics Tracking =====
function trackClicks() {
  const trackElements = [
    { selector: '.call-track', event: 'call_click' },
    { selector: '.whatsapp-track', event: 'whatsapp_click' },
    { selector: '.direction-track', event: 'directions_click' },
    { selector: '.order-track', event: 'order_click' },
    { selector: '.book-track', event: 'book_table_click' }
  ];
  
  trackElements.forEach(({ selector, event }) => {
    document.querySelectorAll(selector).forEach(el => {
      el.addEventListener('click', function() {
        trackEvent(event, window.location.pathname);
      });
    });
  });
}

function trackEvent(action, label) {
  console.log(`[ANALYTICS] ${action} | ${label} | ${new Date().toISOString()}`);
  
  // Store in localStorage for analytics
  let events = JSON.parse(localStorage.getItem('analytics_events') || '[]');
  events.push({ action, label, time: Date.now() });
  if (events.length > 100) events.shift();
  localStorage.setItem('analytics_events', JSON.stringify(events));
  
  // Send to Google Analytics if available
  if (typeof gtag !== 'undefined') {
    gtag('event', action, {
      event_category: 'engagement',
      event_label: label
    });
  }
}

// ===== Lazy Load Images =====
function lazyLoadImages() {
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.classList.add('loaded');
          }
          imageObserver.unobserve(img);
        }
      });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }
}

// ===== Smooth Scroll =====
function smoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href !== '#' && href !== '') {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });
}

// ===== Form Validation =====
function validateForm(formId) {
  const form = document.getElementById(formId);
  if (!form) return true;
  
  const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
  let isValid = true;
  
  inputs.forEach(input => {
    if (!input.value.trim()) {
      isValid = false;
      input.style.borderColor = '#DC2626';
      
      // Show error message
      let errorMsg = input.parentElement.querySelector('.error-message');
      if (!errorMsg) {
        errorMsg = document.createElement('small');
        errorMsg.className = 'error-message';
        errorMsg.style.color = '#DC2626';
        errorMsg.style.marginTop = '0.25rem';
        errorMsg.style.display = 'block';
        input.parentElement.appendChild(errorMsg);
      }
      errorMsg.textContent = 'This field is required';
    } else {
      input.style.borderColor = '#E5E7EB';
      const errorMsg = input.parentElement.querySelector('.error-message');
      if (errorMsg) errorMsg.remove();
    }
  });
  
  return isValid;
}

// ===== Show Notification =====
function showNotification(message, type = 'success') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 1rem 1.5rem;
    background: ${type === 'success' ? '#10B981' : '#EF4444'};
    color: white;
    border-radius: 12px;
    font-weight: 600;
    z-index: 10000;
    animation: slideIn 0.3s ease;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Add notification animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// ===== Export functions for global use =====
window.MasalaJunction = {
  trackEvent,
  validateForm,
  showNotification
};