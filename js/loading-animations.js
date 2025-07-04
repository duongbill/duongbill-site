/**
 * Loading Animations & Performance Optimization
 * Includes skeleton loading, progressive image loading, lazy loading
 */

class LoadingAnimations {
    constructor() {
        this.init();
    }

    init() {
        this.createSkeletonLoaders();
        this.setupLazyLoading();
        this.setupProgressiveImageLoading();
        this.setupSmoothPageTransitions();
        this.setupIntersectionObserver();
    }

    createSkeletonLoaders() {
        // Add skeleton CSS
        const skeletonCSS = `
            .skeleton {
                background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
                background-size: 200% 100%;
                animation: skeleton-loading 1.5s infinite;
            }

            @keyframes skeleton-loading {
                0% { background-position: 200% 0; }
                100% { background-position: -200% 0; }
            }

            .skeleton-text {
                height: 16px;
                border-radius: 4px;
                margin-bottom: 8px;
            }

            .skeleton-title {
                height: 24px;
                border-radius: 4px;
                margin-bottom: 16px;
                width: 60%;
            }

            .skeleton-image {
                height: 200px;
                border-radius: 8px;
                margin-bottom: 16px;
            }

            .skeleton-card {
                padding: 20px;
                border-radius: 10px;
                background: white;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                margin-bottom: 20px;
            }

            .content-loaded .skeleton {
                display: none;
            }

            .fade-in {
                opacity: 0;
                transform: translateY(20px);
                transition: all 0.6s ease;
            }

            .fade-in.visible {
                opacity: 1;
                transform: translateY(0);
            }

            .loading-spinner {
                display: inline-block;
                width: 20px;
                height: 20px;
                border: 3px solid rgba(89, 236, 255, 0.3);
                border-radius: 50%;
                border-top-color: #59ECFF;
                animation: spin 1s ease-in-out infinite;
            }

            @keyframes spin {
                to { transform: rotate(360deg); }
            }

            .page-transition {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(45deg, #59ECFF, #667eea);
                z-index: 9999;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
            }

            .page-transition.active {
                opacity: 1;
                visibility: visible;
            }

            .transition-content {
                text-align: center;
                color: white;
            }

            .transition-spinner {
                width: 50px;
                height: 50px;
                border: 4px solid rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                border-top-color: white;
                animation: spin 1s linear infinite;
                margin: 0 auto 20px;
            }
        `;

        const style = document.createElement('style');
        style.textContent = skeletonCSS;
        document.head.appendChild(style);

        // Create page transition overlay
        const transition = document.createElement('div');
        transition.className = 'page-transition';
        transition.innerHTML = `
            <div class="transition-content">
                <div class="transition-spinner"></div>
                <p>Loading...</p>
            </div>
        `;
        document.body.appendChild(transition);
    }

    setupLazyLoading() {
        // Lazy loading for images
        const images = document.querySelectorAll('img[data-src]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        this.loadImage(img);
                        observer.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: 0.01
            });

            images.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback for older browsers
            images.forEach(img => this.loadImage(img));
        }

        // Convert existing images to lazy loading
        this.convertToLazyLoading();
    }

    convertToLazyLoading() {
        const images = document.querySelectorAll('img:not([data-src])');
        images.forEach(img => {
            if (img.src && !img.classList.contains('no-lazy')) {
                img.dataset.src = img.src;
                img.src = this.createPlaceholder(img.width || 300, img.height || 200);
                img.classList.add('lazy-image');
            }
        });
    }

    createPlaceholder(width, height) {
        // Create a simple SVG placeholder
        const svg = `
            <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
                <rect width="100%" height="100%" fill="#f0f0f0"/>
                <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#999">Loading...</text>
            </svg>
        `;
        return 'data:image/svg+xml;base64,' + btoa(svg);
    }

    loadImage(img) {
        return new Promise((resolve, reject) => {
            const imageLoader = new Image();
            
            imageLoader.onload = () => {
                // Add fade-in effect
                img.style.opacity = '0';
                img.src = imageLoader.src;
                
                setTimeout(() => {
                    img.style.transition = 'opacity 0.3s ease';
                    img.style.opacity = '1';
                    img.classList.add('loaded');
                    resolve();
                }, 50);
            };
            
            imageLoader.onerror = reject;
            imageLoader.src = img.dataset.src;
        });
    }

    setupProgressiveImageLoading() {
        // Progressive loading for large images
        const largeImages = document.querySelectorAll('.progressive-image');
        
        largeImages.forEach(container => {
            const img = container.querySelector('img');
            const lowSrc = img.dataset.lowSrc;
            const highSrc = img.dataset.highSrc || img.dataset.src;
            
            if (lowSrc && highSrc) {
                // Load low quality first
                img.src = lowSrc;
                img.style.filter = 'blur(5px)';
                
                // Then load high quality
                const highQualityImg = new Image();
                highQualityImg.onload = () => {
                    img.src = highQualityImg.src;
                    img.style.filter = 'none';
                    img.style.transition = 'filter 0.3s ease';
                };
                highQualityImg.src = highSrc;
            }
        });
    }

    setupSmoothPageTransitions() {
        // Smooth transitions for internal links
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="#"]');
            if (link) {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const target = document.getElementById(targetId);
                
                if (target) {
                    this.smoothScrollTo(target);
                }
            }
        });

        // Page transition for external links
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href]:not([href^="#"]):not([target="_blank"])');
            if (link && link.hostname === window.location.hostname) {
                e.preventDefault();
                this.showPageTransition();
                
                setTimeout(() => {
                    window.location.href = link.href;
                }, 300);
            }
        });
    }

    smoothScrollTo(target) {
        const targetPosition = target.offsetTop - 80; // Account for fixed header
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        const duration = 800;
        let start = null;

        const animation = (currentTime) => {
            if (start === null) start = currentTime;
            const timeElapsed = currentTime - start;
            const run = this.easeInOutQuad(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            
            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            }
        };

        requestAnimationFrame(animation);
    }

    easeInOutQuad(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }

    showPageTransition() {
        const transition = document.querySelector('.page-transition');
        transition.classList.add('active');
    }

    hidePageTransition() {
        const transition = document.querySelector('.page-transition');
        transition.classList.remove('active');
    }

    setupIntersectionObserver() {
        // Animate elements when they come into view
        const animatedElements = document.querySelectorAll('.fade-in, .slide-in, .scale-in');
        
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });

            animatedElements.forEach(el => observer.observe(el));
        }
    }

    // Skeleton loading for specific sections
    showSkeletonForSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (!section) return;

        const skeletonHTML = `
            <div class="skeleton-card">
                <div class="skeleton skeleton-title"></div>
                <div class="skeleton skeleton-text"></div>
                <div class="skeleton skeleton-text" style="width: 80%;"></div>
                <div class="skeleton skeleton-image"></div>
            </div>
        `;

        section.innerHTML = skeletonHTML;
    }

    hideSkeletonForSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (!section) return;

        section.classList.add('content-loaded');
    }

    // Loading state management
    setLoadingState(element, isLoading) {
        if (isLoading) {
            element.classList.add('loading');
            const spinner = document.createElement('span');
            spinner.className = 'loading-spinner';
            element.appendChild(spinner);
        } else {
            element.classList.remove('loading');
            const spinner = element.querySelector('.loading-spinner');
            if (spinner) spinner.remove();
        }
    }
}

// Initialize loading animations
document.addEventListener('DOMContentLoaded', () => {
    const loadingAnimations = new LoadingAnimations();
    
    // Hide page transition after load
    window.addEventListener('load', () => {
        setTimeout(() => {
            loadingAnimations.hidePageTransition();
        }, 500);
    });
    
    // Make it globally available
    window.LoadingAnimations = loadingAnimations;
});
