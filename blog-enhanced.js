// Enhanced Blog Functionality - Professional Level
document.addEventListener('DOMContentLoaded', function() {
    
    // Blog Category Filter
    const categoryBtns = document.querySelectorAll('.category-btn');
    const blogPosts = document.querySelectorAll('.blog-post');
    
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.dataset.category;
            
            // Update active button
            categoryBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Filter posts with animation
            blogPosts.forEach(post => {
                if (category === 'all' || post.dataset.category === category) {
                    post.style.display = 'block';
                    setTimeout(() => {
                        post.style.opacity = '1';
                        post.style.transform = 'translateY(0)';
                    }, 100);
                } else {
                    post.style.opacity = '0';
                    post.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        post.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
    
    // Blog Search Functionality
    const searchInput = document.getElementById('blogSearch');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            
            blogPosts.forEach(post => {
                const title = post.querySelector('h2, h3').textContent.toLowerCase();
                const content = post.querySelector('p').textContent.toLowerCase();
                const category = post.querySelector('.post-category').textContent.toLowerCase();
                
                if (title.includes(searchTerm) || content.includes(searchTerm) || category.includes(searchTerm)) {
                    post.style.display = 'block';
                    post.style.opacity = '1';
                    post.style.transform = 'translateY(0)';
                } else {
                    post.style.opacity = '0';
                    post.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        if (post.style.opacity === '0') {
                            post.style.display = 'none';
                        }
                    }, 300);
                }
            });
        });
    }
    
    // Post Action Buttons
    const actionBtns = document.querySelectorAll('.action-btn');
    actionBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const action = this.title.toLowerCase();
            const icon = this.querySelector('i');
            
            // Add animation and feedback
            this.style.transform = 'scale(1.2)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 200);
            
            // Handle different actions
            switch(action) {
                case 'like':
                    icon.classList.toggle('fas');
                    icon.classList.toggle('far');
                    if (icon.classList.contains('fas')) {
                        this.style.color = '#e74c3c';
                        showNotification('Added to favorites!', 'success');
                    } else {
                        this.style.color = 'white';
                        showNotification('Removed from favorites', 'info');
                    }
                    break;
                    
                case 'share':
                    if (navigator.share) {
                        const post = this.closest('.blog-post');
                        const title = post.querySelector('h2, h3').textContent;
                        navigator.share({
                            title: title,
                            text: 'Check out this article from FutureFareAgency Blog',
                            url: window.location.href
                        });
                    } else {
                        // Fallback: copy to clipboard
                        navigator.clipboard.writeText(window.location.href);
                        showNotification('Link copied to clipboard!', 'success');
                    }
                    break;
                    
                case 'bookmark':
                    icon.classList.toggle('fas');
                    icon.classList.toggle('far');
                    if (icon.classList.contains('fas')) {
                        this.style.color = '#f39c12';
                        showNotification('Article bookmarked!', 'success');
                    } else {
                        this.style.color = 'white';
                        showNotification('Bookmark removed', 'info');
                    }
                    break;
            }
        });
    });
    
    // Reading Progress Indicator
    function createReadingProgress() {
        const progressBar = document.createElement('div');
        progressBar.className = 'reading-progress';
        progressBar.style.cssText = `
            position: fixed;
            top: 70px;
            left: 0;
            width: 0%;
            height: 4px;
            background: linear-gradient(90deg, #16a085, #2c5aa0);
            z-index: 1000;
            transition: width 0.3s ease;
        `;
        document.body.appendChild(progressBar);
        
        window.addEventListener('scroll', () => {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            progressBar.style.width = scrolled + '%';
        });
    }
    
    createReadingProgress();
    
    // Smooth Scroll for Popular Posts
    const popularPosts = document.querySelectorAll('.popular-post');
    popularPosts.forEach(post => {
        post.addEventListener('click', function() {
            const title = this.querySelector('h4').textContent;
            const targetPost = Array.from(blogPosts).find(p => {
                const postTitle = p.querySelector('h2, h3').textContent;
                return postTitle.includes(title.split(' ').slice(0, 2).join(' '));
            });
            
            if (targetPost) {
                targetPost.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
                
                // Highlight the post
                targetPost.style.boxShadow = '0 0 30px rgba(22, 160, 133, 0.5)';
                setTimeout(() => {
                    targetPost.style.boxShadow = '';
                }, 2000);
            }
        });
    });
    
    // Category List Click Handler
    const categoryItems = document.querySelectorAll('.category-item');
    categoryItems.forEach(item => {
        item.addEventListener('click', function() {
            const categoryName = this.querySelector('span').textContent.toLowerCase().replace(' ', '-');
            const categoryBtn = document.querySelector(`[data-category="${categoryName}"]`);
            if (categoryBtn) {
                categoryBtn.click();
            }
        });
    });
    
    // Newsletter Subscription
    const sidebarNewsletter = document.querySelector('.sidebar-newsletter');
    if (sidebarNewsletter) {
        sidebarNewsletter.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            
            if (email) {
                const btn = this.querySelector('button');
                const originalText = btn.textContent;
                
                btn.textContent = 'Subscribing...';
                btn.disabled = true;
                
                // Simulate subscription
                setTimeout(() => {
                    showNotification('Successfully subscribed to newsletter!', 'success');
                    this.reset();
                    btn.textContent = originalText;
                    btn.disabled = false;
                }, 1500);
            }
        });
    }
    
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
    
    // Scroll Animations
    const animateElements = document.querySelectorAll('.blog-post, .sidebar-widget');
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        scrollObserver.observe(el);
    });
    
    // Social Media Tracking
    const socialBtns = document.querySelectorAll('.social-btn');
    socialBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const platform = this.classList[1]; // instagram, linkedin, twitter
            trackEvent('Social', 'Click', platform);
        });
    });
    
    // Reading Time Calculator
    function calculateReadingTime() {
        const posts = document.querySelectorAll('.blog-post');
        posts.forEach(post => {
            const content = post.querySelector('p').textContent;
            const words = content.split(' ').length;
            const readingTime = Math.ceil(words / 200); // Average reading speed
            
            const timeElement = post.querySelector('.reading-time');
            if (timeElement && !timeElement.textContent.includes('min')) {
                timeElement.innerHTML = `<i class="fas fa-clock"></i> ${readingTime} min read`;
            }
        });
    }
    
    calculateReadingTime();
    
    // Notification System
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `blog-notification ${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
        `;
        
        switch(type) {
            case 'success':
                notification.style.background = '#27ae60';
                break;
            case 'error':
                notification.style.background = '#e74c3c';
                break;
            default:
                notification.style.background = '#3498db';
        }
        
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after delay
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
    
    // Track Events (if analytics is available)
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
            page: 'blog'
        };
        
        let analytics = JSON.parse(localStorage.getItem('blog_analytics') || '[]');
        analytics.push(eventData);
        localStorage.setItem('blog_analytics', JSON.stringify(analytics));
    }
    
    // Performance Monitoring
    window.addEventListener('load', () => {
        const loadTime = performance.now();
        console.log(`Blog page loaded in ${Math.round(loadTime)}ms`);
        trackEvent('Performance', 'PageLoad', Math.round(loadTime));
    });
});