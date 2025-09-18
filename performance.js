// Performance Optimization and Professional Features
document.addEventListener('DOMContentLoaded', function() {
    
    // Lazy Loading for Images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
    
    // Smooth Scrolling for Navigation Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Progressive Web App Features
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => console.log('SW registered'))
            .catch(error => console.log('SW registration failed'));
    }
    
    // Performance Monitoring
    const performanceObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
            if (entry.entryType === 'navigation') {
                console.log('Page Load Time:', entry.loadEventEnd - entry.loadEventStart);
            }
        });
    });
    
    performanceObserver.observe({ entryTypes: ['navigation'] });
    
    // Preload Critical Resources
    const preloadLink = document.createElement('link');
    preloadLink.rel = 'preload';
    preloadLink.as = 'font';
    preloadLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/webfonts/fa-solid-900.woff2';
    preloadLink.crossOrigin = 'anonymous';
    document.head.appendChild(preloadLink);
    
    // Enhanced Mobile Navigation with better error handling
    function initMobileNavigation() {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        
        if (!hamburger || !navMenu) {
            console.warn('Mobile navigation elements not found');
            return;
        }
        
        // Remove any existing event listeners
        hamburger.replaceWith(hamburger.cloneNode(true));
        const newHamburger = document.querySelector('.hamburger');
        
        function closeMenu() {
            newHamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('nav-open');
            document.body.style.overflow = '';
        }
        
        function toggleMenu(e) {
            e.preventDefault();
            e.stopPropagation();
            
            newHamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('nav-open');
            
            // Prevent body scroll when menu is open
            if (navMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        }
        
        // Hamburger click handler
        newHamburger.addEventListener('click', toggleMenu);
        newHamburger.addEventListener('touchstart', toggleMenu, { passive: false });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!newHamburger.contains(e.target) && !navMenu.contains(e.target)) {
                closeMenu();
            }
        });
        
        // Close menu on nav link click (mobile)
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function(e) {
                // Don't close menu for logout button
                if (!this.classList.contains('logout-btn') && this.id !== 'logoutBtn') {
                    if (window.innerWidth <= 768) {
                        closeMenu();
                    }
                }
            });
        });
        
        // Handle orientation change
        window.addEventListener('orientationchange', function() {
            setTimeout(() => {
                if (navMenu.classList.contains('active')) {
                    closeMenu();
                }
            }, 100);
        });
        
        // Handle window resize
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
                closeMenu();
            }
        });
    }
    
    // Initialize mobile navigation
    initMobileNavigation();
    
    // Advanced Form Validation
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', validateField);
            input.addEventListener('input', clearErrors);
        });
    });
    
    function validateField(e) {
        const field = e.target;
        const value = field.value.trim();
        const type = field.type;
        
        clearFieldError(field);
        
        if (field.hasAttribute('required') && !value) {
            showFieldError(field, 'This field is required');
            return false;
        }
        
        if (type === 'email' && value && !isValidEmail(value)) {
            showFieldError(field, 'Please enter a valid email address');
            return false;
        }
        
        return true;
    }
    
    function clearErrors(e) {
        clearFieldError(e.target);
    }
    
    function showFieldError(field, message) {
        field.classList.add('error');
        let errorElement = field.parentNode.querySelector('.error-message');
        if (errorElement) {
            errorElement.textContent = message;
        }
    }
    
    function clearFieldError(field) {
        field.classList.remove('error');
        let errorElement = field.parentNode.querySelector('.error-message');
        if (errorElement) {
            errorElement.textContent = '';
        }
    }
    
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    
    // Advanced Analytics Tracking
    function trackEvent(category, action, label) {
        if (typeof gtag !== 'undefined') {
            gtag('event', action, {
                event_category: category,
                event_label: label
            });
        }
        
        // Custom analytics
        const eventData = {
            category,
            action,
            label,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href
        };
        
        // Store in localStorage for later sync
        let analytics = JSON.parse(localStorage.getItem('analytics') || '[]');
        analytics.push(eventData);
        localStorage.setItem('analytics', JSON.stringify(analytics));
    }
    
    // Track button clicks
    document.querySelectorAll('button, .btn, .cta-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            trackEvent('Button', 'Click', this.textContent.trim());
        });
    });
    
    // Enhanced Loading States
    function showLoading(element, text = 'Loading...') {
        const originalContent = element.innerHTML;
        element.dataset.originalContent = originalContent;
        element.innerHTML = `<div class="loading"></div> ${text}`;
        element.disabled = true;
    }
    
    function hideLoading(element) {
        if (element.dataset.originalContent) {
            element.innerHTML = element.dataset.originalContent;
            element.disabled = false;
        }
    }
    
    // Expose functions globally
    window.FutureFareAgency = {
        trackEvent,
        showLoading,
        hideLoading,
        validateField
    };
    
    // Page Visibility API for performance
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            // Page is hidden, pause animations
            document.body.classList.add('page-hidden');
        } else {
            // Page is visible, resume animations
            document.body.classList.remove('page-hidden');
        }
    });
    
    // Connection Quality Detection
    if ('connection' in navigator) {
        const connection = navigator.connection;
        if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
            document.body.classList.add('slow-connection');
        }
    }
    
    // Mobile Device Detection and Optimizations
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isTablet = /iPad|Android(?!.*Mobile)/i.test(navigator.userAgent);
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    if (isMobile) {
        document.body.classList.add('mobile-device');
        
        // Disable hover effects on mobile
        const style = document.createElement('style');
        style.textContent = `
            @media (hover: none) {
                .product-card:hover,
                .service-card:hover,
                .team-card:hover,
                .case-study-card:hover {
                    transform: none;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    if (isTablet) {
        document.body.classList.add('tablet-device');
    }
    
    if (isTouch) {
        document.body.classList.add('touch-device');
    }
    
    // Viewport Height Fix for Mobile
    function setVH() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    
    setVH();
    window.addEventListener('resize', setVH);
    window.addEventListener('orientationchange', () => {
        setTimeout(setVH, 100);
    });
    
    // Touch Gesture Improvements
    if (isTouch) {
        // Prevent zoom on double tap for buttons (except logout)
        document.querySelectorAll('button, .btn, .cta-btn, .auth-btn').forEach(btn => {
            if (!btn.classList.contains('logout-btn') && btn.id !== 'logoutBtn') {
                btn.addEventListener('touchend', function(e) {
                    e.preventDefault();
                    this.click();
                });
            }
        });
        
        // Improve scroll performance
        document.body.style.webkitOverflowScrolling = 'touch';
        
        // Fix iOS Safari viewport issues
        const viewport = document.querySelector('meta[name=viewport]');
        if (viewport) {
            viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
        }
    }
    
    // Responsive Image Loading
    function loadResponsiveImages() {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            if (img.dataset.src) {
                const screenWidth = window.innerWidth;
                let imageSrc = img.dataset.src;
                
                // Load smaller images on mobile
                if (screenWidth <= 768 && img.dataset.srcMobile) {
                    imageSrc = img.dataset.srcMobile;
                } else if (screenWidth <= 1200 && img.dataset.srcTablet) {
                    imageSrc = img.dataset.srcTablet;
                }
                
                img.src = imageSrc;
            }
        });
    }
    
    loadResponsiveImages();
    window.addEventListener('resize', debounce(loadResponsiveImages, 250));
    
    // Debounce function for performance
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // Optimize animations for mobile
    if (isMobile) {
        const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        if (reducedMotionQuery.matches) {
            document.body.classList.add('reduced-motion');
        }
        
        reducedMotionQuery.addEventListener('change', (e) => {
            if (e.matches) {
                document.body.classList.add('reduced-motion');
            } else {
                document.body.classList.remove('reduced-motion');
            }
        });
    }
});