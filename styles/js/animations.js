// ===== ADVANCED ANIMATION SYSTEM =====

class AnimationManager {
    constructor() {
        this.observers = [];
        this.scrollEffects = new Map();
        this.init();
    }

    init() {
        this.setupLoadingAnimation();
        this.setupScrollAnimations();
        this.setupIntersectionObserver();
        this.setupParallax();
        this.setupCountUpAnimations();
    }

    // Loading Screen Management
    setupLoadingAnimation() {
        const loadingScreen = document.getElementById('loadingScreen');
        const progressFill = document.querySelector('.progress-fill');
        
        if (!loadingScreen) return;

        // Simulate loading progress
        let progress = 0;
        const loadingInterval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress >= 100) {
                progress = 100;
                clearInterval(loadingInterval);
                
                // Complete loading
                setTimeout(() => {
                    loadingScreen.classList.add('fade-out');
                    setTimeout(() => {
                        loadingScreen.remove();
                        this.triggerEvent('loadingComplete');
                    }, 500);
                }, 500);
            }
            
            if (progressFill) {
                progressFill.style.transform = `scaleX(${progress / 100})`;
            }
        }, 200);
    }

    // Scroll-based Animations
    setupScrollAnimations() {
        let ticking = false;
        
        const updateScrollAnimations = () => {
            const scrollY = window.pageYOffset;
            const windowHeight = window.innerHeight;
            
            // Update parallax elements
            this.updateParallax(scrollY);
            
            // Update progress indicators
            this.updateScrollProgress(scrollY);
            
            ticking = false;
        };
        
        const requestTick = () => {
            if (!ticking) {
                requestAnimationFrame(updateScrollAnimations);
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', requestTick, { passive: true });
    }

    // Intersection Observer for fade-in animations
    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    this.animateStaggerChildren(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observe elements with data-animate attribute
        document.querySelectorAll('[data-animate]').forEach(el => {
            observer.observe(el);
        });
    }

    // Stagger animation for child elements
    animateStaggerChildren(parent) {
        const children = parent.querySelectorAll('.stagger-children > *');
        children.forEach((child, index) => {
            child.style.animationDelay = `${index * 0.1}s`;
        });
    }

    // Parallax Effect System
    setupParallax() {
        this.parallaxElements = document.querySelectorAll('.parallax-layer');
    }

    updateParallax(scrollY) {
        this.parallaxElements.forEach(layer => {
            const depth = layer.getAttribute('data-depth') || 0.5;
            const movement = -(scrollY * depth);
            layer.style.transform = `translateY(${movement}px)`;
        });
    }

    // Count Up Animations for Statistics
    setupCountUpAnimations() {
        const stats = document.querySelectorAll('.stat');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCountUp(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        stats.forEach(stat => observer.observe(stat));
    }

    animateCountUp(statElement) {
        const numberElement = statElement.querySelector('.stat-number');
        const target = parseInt(statElement.getAttribute('data-count') || numberElement.textContent);
        const duration = 2000; // 2 seconds
        const steps = 60;
        const step = target / steps;
        let current = 0;

        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            numberElement.textContent = Math.floor(current);
        }, duration / steps);
    }

    // Progress Bar Animations
    updateScrollProgress(scrollY) {
        const progressBars = document.querySelectorAll('.progress-circle');
        
        progressBars.forEach(bar => {
            const progress = bar.getAttribute('data-progress');
            if (progress) {
                const degrees = (progress / 100) * 360;
                bar.style.background = `conic-gradient(#e53935 ${degrees}deg, #e0e0e0 0deg)`;
                bar.querySelector('span').textContent = `${progress}%`;
            }
        });
    }

    // Add to Cart Flying Animation
    createCartAnimation(productImage, cartButton) {
        const animation = document.createElement('div');
        animation.className = 'cart-animation';
        
        // Clone the product image
        const clone = productImage.cloneNode(true);
        clone.style.width = '50px';
        clone.style.height = '50px';
        clone.style.borderRadius = '8px';
        clone.style.objectFit = 'cover';
        
        animation.appendChild(clone);
        document.body.appendChild(animation);
        
        // Calculate positions
        const startRect = productImage.getBoundingClientRect();
        const endRect = cartButton.getBoundingClientRect();
        
        const startX = startRect.left + startRect.width / 2;
        const startY = startRect.top + startRect.height / 2;
        const endX = endRect.left + endRect.width / 2;
        const endY = endRect.top + endRect.height / 2;
        
        // Set CSS variables for animation
        animation.style.setProperty('--tx', `${endX - startX}px`);
        animation.style.setProperty('--ty', `${endY - startY}px`);
        animation.style.left = `${startX}px`;
        animation.style.top = `${startY}px`;
        
        // Remove after animation
        setTimeout(() => {
            animation.remove();
        }, 1000);
    }

    // Modal Animation System
    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    hideModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    // Voice Search Animation
    startVoiceSearch() {
        const voiceBtn = document.querySelector('.voice-search');
        voiceBtn.classList.add('listening');
        
        // Simulate voice listening
        setTimeout(() => {
            voiceBtn.classList.remove('listening');
        }, 3000);
    }

    // Success Animation
    showSuccessAnimation(element) {
        const success = document.createElement('div');
        success.className = 'success-checkmark';
        success.innerHTML = `
            <div class="check-icon">
                <span class="icon-line line-tip"></span>
                <span class="icon-line line-long"></span>
                <div class="icon-circle"></div>
                <div class="icon-fix"></div>
            </div>
        `;
        
        element.appendChild(success);
        
        setTimeout(() => {
            success.remove();
        }, 3000);
    }

    // Event System for Animation Coordination
    on(event, callback) {
        this.observers.push({ event, callback });
    }

    triggerEvent(event, data) {
        this.observers.forEach(observer => {
            if (observer.event === event) {
                observer.callback(data);
            }
        });
    }

    // Page Transition System
    navigateTo(url) {
        const loadingScreen = document.getElementById('loadingScreen') || this.createLoadingScreen();
        
        loadingScreen.classList.remove('fade-out');
        
        setTimeout(() => {
            window.location.href = url;
        }, 500);
    }

    createLoadingScreen() {
        const loadingScreen = document.createElement('div');
        loadingScreen.id = 'loadingScreen';
        loadingScreen.className = 'loading-screen';
        loadingScreen.innerHTML = `
            <div class="loading-content">
                <div class="logo-loader">
                    <div class="logo-icon pulse">EB</div>
                </div>
                <div class="loading-text">
                    <h2>ElssyBoutique</h2>
                    <p>Loading...</p>
                </div>
                <div class="loading-progress">
                    <div class="progress-bar">
                        <div class="progress-fill"></div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(loadingScreen);
        return loadingScreen;
    }
}

// ===== GLOBAL ANIMATION FUNCTIONS =====

// Initialize Animation Manager
const animationManager = new AnimationManager();

// Chatbot Functions
function toggleChatbot() {
    const chatbot = document.getElementById('chatbot');
    const toggle = document.querySelector('.chatbot-toggle');
    
    if (chatbot.classList.contains('active')) {
        chatbot.classList.remove('active');
        toggle.innerHTML = '<i class="fas fa-robot"></i>';
    } else {
        chatbot.classList.add('active');
        toggle.innerHTML = '<i class="fas fa-times"></i>';
    }
}

// Theme Toggle with Animation
function toggleTheme() {
    const body = document.body;
    const themeToggle = document.querySelector('.theme-toggle i');
    
    body.style.transition = 'all 0.3s ease';
    
    if (body.classList.contains('light-mode')) {
        body.classList.replace('light-mode', 'dark-mode');
        themeToggle.classList.replace('fa-moon', 'fa-sun');
        localStorage.setItem('theme', 'dark');
    } else {
        body.classList.replace('dark-mode', 'light-mode');
        themeToggle.classList.replace('fa-sun', 'fa-moon');
        localStorage.setItem('theme', 'light');
    }
}

// Virtual Try-On Starter
function startVirtualTryOn() {
    animationManager.showModal('virtualTryonModal');
    // In a real implementation, this would initialize camera and AR
    console.log('Starting virtual try-on experience...');
}

// AI Prompt System
function openAIPrompt() {
    animationManager.showModal('aiPromptModal');
    
    // Load AI style questions
    const styleQuestions = document.querySelector('.style-questions');
    styleQuestions.innerHTML = `
        <div class="style-question">
            <p>What's your primary workout activity?</p>
            <div class="style-options">
                <button class="style-option" data-activity="weightlifting">Weightlifting</button>
                <button class="style-option" data-activity="cardio">Cardio</button>
                <button class="style-option" data-activity="yoga">Yoga/Pilates</button>
                <button class="style-option" data-activity="crossfit">CrossFit</button>
            </div>
        </div>
    `;
}

function closeAIPrompt() {
    animationManager.hideModal('aiPromptModal');
}

// User Menu Toggle
function toggleUserMenu() {
    const userDropdown = document.querySelector('.user-dropdown');
    userDropdown.classList.toggle('active');
}

// Wishlist Toggle
function toggleWishlist() {
    const wishlist = document.getElementById('wishlist');
    wishlist.classList.toggle('active');
}

// Cart Toggle
function toggleCart() {
    const cartPreview = document.querySelector('.cart-preview');
    cartPreview.classList.toggle('active');
}

// Social Login
function socialLogin(provider) {
    animationManager.showSuccessAnimation(document.body);
    console.log(`Logging in with ${provider}...`);
    // In real implementation, this would handle OAuth flow
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Set initial theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        document.body.classList.replace('light-mode', 'dark-mode');
        const themeToggle = document.querySelector('.theme-toggle i');
        if (themeToggle) {
            themeToggle.classList.replace('fa-moon', 'fa-sun');
        }
    }
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.user-menu')) {
            document.querySelector('.user-dropdown')?.classList.remove('active');
        }
        if (!e.target.closest('.cart-container')) {
            document.querySelector('.cart-preview')?.classList.remove('active');
        }
    });
});

// Export for global use
window.animationManager = animationManager;
window.toggleChatbot = toggleChatbot;
window.toggleTheme = toggleTheme;
window.startVirtualTryOn = startVirtualTryOn;
window.openAIPrompt = openAIPrompt;
window.closeAIPrompt = closeAIPrompt;
window.toggleUserMenu = toggleUserMenu;
window.toggleWishlist = toggleWishlist;
window.toggleCart = toggleCart;
window.socialLogin = socialLogin;
