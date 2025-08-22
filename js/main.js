/* ========================================
   SKILLFORGE WEBSITE - MAIN JAVASCRIPT
   ======================================== */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // ========================================
    // 1. MOBILE HAMBURGER MENU FUNCTIONALITY
    // ========================================
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Prevent body scroll when menu is open
            if (navMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });

        // Close menu when clicking on a link
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // ========================================
    // 2. SMOOTH SCROLLING FOR ANCHOR LINKS
    // ========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ========================================
    // 3. HEADER BACKGROUND CHANGE ON SCROLL
    // ========================================
    const header = document.querySelector('.header');
    let lastScrollTop = 0;

    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (header) {
            if (scrollTop > 100) {
                header.style.background = 'rgba(102, 126, 234, 0.95)';
                header.style.backdropFilter = 'blur(10px)';
                header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
            } else {
                header.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                header.style.backdropFilter = 'blur(10px)';
                header.style.boxShadow = 'none';
            }

            // Hide/show header on scroll (optional)
            if (scrollTop > lastScrollTop && scrollTop > 200) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }
            
            lastScrollTop = scrollTop;
        }
    });

    // ========================================
    // 4. EMAIL SIGNUP FORM VALIDATION
    // ========================================
    const emailInput = document.querySelector('.email-input');
    const signupBtn = document.querySelector('.cta-section .btn-primary');

    if (emailInput && signupBtn) {
        signupBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const email = emailInput.value.trim();
            
            if (validateEmail(email)) {
                // Show success message
                showNotification('Thank you for signing up! We\'ll be in touch soon.', 'success');
                emailInput.value = '';
                
                // Optional: Send to analytics or tracking
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'sign_up', {
                        method: 'email'
                    });
                }
            } else {
                showNotification('Please enter a valid email address.', 'error');
                emailInput.focus();
            }
        });

        // Real-time validation
        emailInput.addEventListener('input', () => {
            const email = emailInput.value.trim();
            if (email && !validateEmail(email)) {
                emailInput.style.borderColor = '#e53e3e';
            } else {
                emailInput.style.borderColor = '';
            }
        });

        // Enter key support
        emailInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                signupBtn.click();
            }
        });
    }

    // ========================================
    // 5. SCROLL-BASED ANIMATIONS
    // ========================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.feature-item, .instructor-card, .section-header').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // ========================================
    // 6. PERFORMANCE OPTIMIZATIONS
    // ========================================
    
    // Debounce scroll events
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

    // Optimized scroll handler
    const optimizedScrollHandler = debounce(() => {
        // Header scroll effects
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (header) {
            if (scrollTop > 100) {
                header.style.background = 'rgba(102, 126, 234, 0.95)';
            } else {
                header.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
            }
        }
    }, 10);

    window.addEventListener('scroll', optimizedScrollHandler);

    // ========================================
    // 7. TOUCH DEVICE OPTIMIZATIONS
    // ========================================
    if ('ontouchstart' in window) {
        // Add touch-specific classes
        document.body.classList.add('touch-device');
        
        // Optimize touch interactions
        document.querySelectorAll('.btn, .feature-item, .instructor-card').forEach(el => {
            el.addEventListener('touchstart', function() {
                this.style.transform = 'scale(0.98)';
            });
            
            el.addEventListener('touchend', function() {
                this.style.transform = '';
            });
        });
    }

    // ========================================
    // 8. ACCESSIBILITY IMPROVEMENTS
    // ========================================
    
    // Keyboard navigation for mobile menu
    if (hamburger) {
        hamburger.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                hamburger.click();
            }
        });
    }

    // Focus management for mobile menu
    if (navMenu) {
        const menuLinks = navMenu.querySelectorAll('a');
        const firstLink = menuLinks[0];
        const lastLink = menuLinks[menuLinks.length - 1];

        navMenu.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey && document.activeElement === firstLink) {
                    e.preventDefault();
                    lastLink.focus();
                } else if (!e.shiftKey && document.activeElement === lastLink) {
                    e.preventDefault();
                    firstLink.focus();
                }
            }
        });
    }

    // ========================================
    // 9. UTILITY FUNCTIONS
    // ========================================
    
    // Email validation
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Notification system
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? '#48bb78' : type === 'error' ? '#e53e3e' : '#4299e1'};
            color: white;
            padding: 1rem;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
            z-index: 10000;
            max-width: 400px;
            animation: slideInRight 0.3s ease;
        `;

        // Add to page
        document.body.appendChild(notification);

        // Close button functionality
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.remove();
        });

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }

    // ========================================
    // 10. INITIALIZATION AND CLEANUP
    // ========================================
    
    // Initialize any additional features
    initializeFeatures();
    
    // Cleanup function
    function cleanup() {
        // Remove event listeners if needed
        window.removeEventListener('scroll', optimizedScrollHandler);
    }

    // Initialize additional features
    function initializeFeatures() {
        // Add loading states to buttons
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('click', function() {
                if (this.classList.contains('btn-primary')) {
                    this.style.opacity = '0.7';
                    this.style.pointerEvents = 'none';
                    
                    setTimeout(() => {
                        this.style.opacity = '';
                        this.style.pointerEvents = '';
                    }, 1000);
                }
            });
        });

        // Add hover effects for non-touch devices
        if (!('ontouchstart' in window)) {
            document.querySelectorAll('.feature-item, .instructor-card').forEach(card => {
                card.addEventListener('mouseenter', function() {
                    this.style.transform = 'translateY(-5px)';
                });
                
                card.addEventListener('mouseleave', function() {
                    this.style.transform = '';
                });
            });
        }
    }

    // ========================================
    // 11. ERROR HANDLING
    // ========================================
    
    // Global error handler
    window.addEventListener('error', (e) => {
        console.error('JavaScript error:', e.error);
        // Could send to analytics service here
    });

    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', (e) => {
        console.error('Unhandled promise rejection:', e.reason);
        // Could send to analytics service here
    });

    // ========================================
    // 12. ANALYTICS AND TRACKING (OPTIONAL)
    // ========================================
    
    // Track page views
    if (typeof gtag !== 'undefined') {
        gtag('config', 'GA_MEASUREMENT_ID', {
            page_title: document.title,
            page_location: window.location.href
        });
    }

    // Track button clicks
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const buttonText = this.textContent.trim();
            if (typeof gtag !== 'undefined') {
                gtag('event', 'button_click', {
                    button_text: buttonText,
                    button_location: this.closest('section')?.id || 'unknown'
                });
            }
        });
    });

    // ========================================
    // 13. SERVICE WORKER REGISTRATION (PWA)
    // ========================================
    
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then((registration) => {
                    console.log('SW registered: ', registration);
                })
                .catch((registrationError) => {
                    console.log('SW registration failed: ', registrationError);
                });
        });
    }

    // ========================================
    // 14. PERFORMANCE MONITORING
    // ========================================
    
    // Monitor page load performance
    window.addEventListener('load', () => {
        if ('performance' in window) {
            const perfData = performance.getEntriesByType('navigation')[0];
            const loadTime = perfData.loadEventEnd - perfData.loadEventStart;
            
            if (loadTime > 3000) {
                console.warn('Page load time is slow:', loadTime + 'ms');
            }
        }
    });

    // ========================================
    // 15. CLEANUP ON PAGE UNLOAD
    // ========================================
    
    window.addEventListener('beforeunload', cleanup);
});

// ========================================
// ADDITIONAL CSS ANIMATIONS
// ========================================

// Add slide-in animation for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .notification-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        line-height: 1;
    }
    
    .notification-close:hover {
        opacity: 0.8;
    }
`;
document.head.appendChild(style);
