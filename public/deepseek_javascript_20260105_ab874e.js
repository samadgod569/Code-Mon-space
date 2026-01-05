// ============================================
// SUPER NEXT-LEVEL JAVASCRIPT FOR CODE MON
// ============================================

// 1. DOM Elements
const DOM = {
    // Core Elements
    body: document.body,
    html: document.documentElement,
    
    // UI Elements
    navbar: document.getElementById('navbar'),
    themeToggle: document.getElementById('themeToggle'),
    sidebarThemeToggle: document.getElementById('sidebarThemeToggle'),
    navMenuBtn: document.getElementById('navMenuBtn'),
    sidebar: document.getElementById('sidebar'),
    closeSidebar: document.getElementById('closeSidebar'),
    
    // Hero Elements
    hero: document.getElementById('hero'),
    generateBtn: document.getElementById('generateBtn'),
    learnMoreBtn: document.getElementById('learnMoreBtn'),
    
    // Hosting Elements
    hostingCards: document.querySelectorAll('.hosting-card'),
    selectHostingBtns: document.querySelectorAll('.select-hosting'),
    notifyMeBtns: document.querySelectorAll('.notify-me'),
    
    // Generator Elements
    websiteIdea: document.getElementById('websiteIdea'),
    generateWebsiteBtn: document.getElementById('generateWebsiteBtn'),
    animationPreview: document.getElementById('animationPreview'),
    
    // Feature Elements
    featureCards: document.querySelectorAll('.feature-card'),
    
    // Modal Elements
    demoModal: document.getElementById('demoModal'),
    closeDemoModal: document.getElementById('closeDemoModal'),
    planModal: document.getElementById('planModal'),
    closePlanModal: document.getElementById('closePlanModal'),
    selectedPlan: document.getElementById('selectedPlan'),
    
    // Notification Element
    notification: document.getElementById('notification'),
    
    // Loading Screen
    loadingScreen: document.getElementById('loadingScreen'),
    
    // Floating Elements
    floatingElements: document.getElementById('floatingElements'),
    
    // Confetti Container
    confettiContainer: document.getElementById('confettiContainer'),
    
    // Newsletter Form
    newsletterForm: document.getElementById('newsletterForm'),
    
    // Stat Numbers
    statNumbers: document.querySelectorAll('.stat-number')
};

// 2. State Management
const State = {
    theme: localStorage.getItem('theme') || 'dark',
    sidebarOpen: false,
    generating: false,
    particlesInitialized: false,
    scrollPosition: 0,
    mousePosition: { x: 0, y: 0 },
    activeAnimations: new Set(),
    notifications: [],
    hostingPlans: {
        website: { name: 'Website Hosting', price: 9.99 },
        app: { name: 'App Hosting', price: 19.99 },
        database: { name: 'Database Hosting', price: 14.99 },
        game: { name: 'Game Hosting', price: 24.99 },
        mods: { name: 'Mods Hosting', price: 29.99 }
    }
};

// 3. Theme Management
class ThemeManager {
    constructor() {
        this.init();
    }
    
    init() {
        // Set initial theme
        this.setTheme(State.theme);
        
        // Add event listeners
        DOM.themeToggle.addEventListener('click', () => this.toggleTheme());
        DOM.sidebarThemeToggle.addEventListener('click', () => this.toggleTheme());
    }
    
    setTheme(theme) {
        State.theme = theme;
        DOM.body.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        this.updateThemeToggle(theme);
        this.animateThemeChange();
    }
    
    toggleTheme() {
        const newTheme = State.theme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
    }
    
    updateThemeToggle(theme) {
        const toggles = [DOM.themeToggle, DOM.sidebarThemeToggle];
        toggles.forEach(toggle => {
            toggle.style.background = theme === 'dark' 
                ? 'var(--card-bg)' 
                : 'var(--darker-bg)';
        });
    }
    
    animateThemeChange() {
        DOM.body.style.transition = 'none';
        DOM.body.style.opacity = '0.7';
        
        requestAnimationFrame(() => {
            DOM.body.style.transition = 'opacity 0.5s ease';
            DOM.body.style.opacity = '1';
        });
        
        setTimeout(() => {
            DOM.body.style.transition = '';
        }, 500);
    }
}

// 4. Sidebar Management
class SidebarManager {
    constructor() {
        this.init();
    }
    
    init() {
        DOM.navMenuBtn.addEventListener('click', () => this.toggleSidebar());
        DOM.closeSidebar.addEventListener('click', () => this.closeSidebar());
        
        // Close sidebar when clicking outside
        document.addEventListener('click', (e) => {
            if (State.sidebarOpen && 
                !DOM.sidebar.contains(e.target) && 
                !DOM.navMenuBtn.contains(e.target)) {
                this.closeSidebar();
            }
        });
        
        // Close sidebar on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && State.sidebarOpen) {
                this.closeSidebar();
            }
        });
    }
    
    toggleSidebar() {
        State.sidebarOpen = !State.sidebarOpen;
        DOM.sidebar.classList.toggle('active', State.sidebarOpen);
        DOM.navMenuBtn.classList.toggle('active', State.sidebarOpen);
        DOM.body.style.overflow = State.sidebarOpen ? 'hidden' : '';
        
        if (State.sidebarOpen) {
            this.animateSidebarOpen();
        }
    }
    
    openSidebar() {
        State.sidebarOpen = true;
        DOM.sidebar.classList.add('active');
        DOM.navMenuBtn.classList.add('active');
        DOM.body.style.overflow = 'hidden';
        this.animateSidebarOpen();
    }
    
    closeSidebar() {
        State.sidebarOpen = false;
        DOM.sidebar.classList.remove('active');
        DOM.navMenuBtn.classList.remove('active');
        DOM.body.style.overflow = '';
    }
    
    animateSidebarOpen() {
        const links = DOM.sidebar.querySelectorAll('.sidebar-links li');
        links.forEach((link, index) => {
            link.style.transform = 'translateX(100px)';
            link.style.opacity = '0';
            link.style.transition = 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            
            setTimeout(() => {
                link.style.transform = 'translateX(0)';
                link.style.opacity = '1';
            }, index * 100 + 300);
        });
    }
}

// 5. Animation Manager
class AnimationManager {
    constructor() {
        this.init();
    }
    
    init() {
        // Initialize scroll animations
        this.initScrollAnimations();
        
        // Initialize hover animations
        this.initHoverAnimations();
        
        // Initialize click animations
        this.initClickAnimations();
        
        // Initialize floating elements
        this.initFloatingElements();
        
        // Initialize typing effect
        this.initTypingEffect();
    }
    
    initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    
                    // Add additional animation based on element type
                    if (entry.target.classList.contains('stat-number')) {
                        this.animateCounter(entry.target);
                    }
                    
                    if (entry.target.classList.contains('hosting-card')) {
                        this.addHoverEffect(entry.target);
                    }
                }
            });
        }, observerOptions);
        
        // Observe all scroll-animate elements
        document.querySelectorAll('.scroll-animate').forEach(el => {
            observer.observe(el);
        });
    }
    
    initHoverAnimations() {
        // Card hover effects
        DOM.hostingCards.forEach(card => {
            card.addEventListener('mouseenter', (e) => {
                this.createRipple(e, card);
                this.tiltCard(e, card);
            });
            
            card.addEventListener('mousemove', (e) => {
                this.tiltCard(e, card);
            });
            
            card.addEventListener('mouseleave', () => {
                this.resetTilt(card);
            });
        });
        
        // Button hover effects
        document.querySelectorAll('.cta-button').forEach(button => {
            button.addEventListener('mouseenter', (e) => {
                this.createParticles(e, 10);
            });
        });
    }
    
    initClickAnimations() {
        // Add click ripple effect to all interactive elements
        document.querySelectorAll('button, a, .hosting-card, .feature-card').forEach(element => {
            element.addEventListener('click', (e) => {
                this.createRipple(e, element);
                this.createClickEffect(e);
            });
        });
    }
    
    initFloatingElements() {
        // Create additional floating elements
        for (let i = 0; i < 15; i++) {
            this.createFloatingElement();
        }
        
        // Animate existing floating elements
        DOM.floatingElements.querySelectorAll('.floating-element').forEach(el => {
            el.style.animationDelay = `${Math.random() * 10}s`;
            el.style.animationDuration = `${15 + Math.random() * 20}s`;
        });
    }
    
    initTypingEffect() {
        const typingText = document.querySelector('.typing-text');
        if (!typingText) return;
        
        const texts = [
            "Digital Reality",
            "Stunning Websites",
            "AI-Powered Designs",
            "Instant Creation",
            "Future of Web Dev"
        ];
        
        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let isPaused = false;
        
        function type() {
            if (isPaused) return;
            
            const currentText = texts[textIndex];
            
            if (isDeleting) {
                typingText.textContent = currentText.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typingText.textContent = currentText.substring(0, charIndex + 1);
                charIndex++;
            }
            
            if (!isDeleting && charIndex === currentText.length) {
                isPaused = true;
                setTimeout(() => {
                    isPaused = false;
                    isDeleting = true;
                    setTimeout(type, 100);
                }, 2000);
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
                setTimeout(type, 500);
            } else {
                setTimeout(type, isDeleting ? 50 : 100);
            }
        }
        
        // Start typing effect after a delay
        setTimeout(type, 1000);
    }
    
    createRipple(event, element) {
        const ripple = document.createElement('div');
        ripple.classList.add('ripple');
        
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 1000);
    }
    
    createParticles(event, count) {
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            
            const x = event.clientX;
            const y = event.clientY;
            
            particle.style.left = `${x}px`;
            particle.style.top = `${y}px`;
            
            const angle = Math.random() * Math.PI * 2;
            const speed = 2 + Math.random() * 3;
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed;
            
            DOM.body.appendChild(particle);
            
            let opacity = 1;
            const animate = () => {
                opacity -= 0.02;
                particle.style.opacity = opacity;
                particle.style.transform = `translate(${vx * (1 - opacity) * 50}px, ${vy * (1 - opacity) * 50}px)`;
                
                if (opacity > 0) {
                    requestAnimationFrame(animate);
                } else {
                    particle.remove();
                }
            };
            
            animate();
        }
    }
    
    createClickEffect(event) {
        const clickEffect = document.createElement('div');
        clickEffect.style.position = 'fixed';
        clickEffect.style.width = '20px';
        clickEffect.style.height = '20px';
        clickEffect.style.borderRadius = '50%';
        clickEffect.style.background = 'radial-gradient(circle, var(--accent-cyan), transparent)';
        clickEffect.style.pointerEvents = 'none';
        clickEffect.style.zIndex = '10000';
        clickEffect.style.left = `${event.clientX - 10}px`;
        clickEffect.style.top = `${event.clientY - 10}px`;
        clickEffect.style.transform = 'scale(0)';
        
        DOM.body.appendChild(clickEffect);
        
        clickEffect.animate([
            { transform: 'scale(0)', opacity: 1 },
            { transform: 'scale(3)', opacity: 0 }
        ], {
            duration: 500,
            easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        });
        
        setTimeout(() => clickEffect.remove(), 500);
    }
    
    tiltCard(event, card) {
        const rect = card.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateY = ((x - centerX) / centerX) * 5;
        const rotateX = ((centerY - y) / centerY) * 5;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        card.style.transition = 'transform 0.1s ease';
    }
    
    resetTilt(card) {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
        card.style.transition = 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    }
    
    addHoverEffect(element) {
        element.addEventListener('mouseenter', () => {
            element.style.zIndex = '10';
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.zIndex = '';
        });
    }
    
    createFloatingElement() {
        const element = document.createElement('div');
        element.classList.add('floating-element');
        
        const size = 20 + Math.random() * 80;
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const delay = Math.random() * 10;
        const duration = 15 + Math.random() * 20;
        
        element.style.width = `${size}px`;
        element.style.height = `${size}px`;
        element.style.top = `${y}%`;
        element.style.left = `${x}%`;
        element.style.animationDelay = `${delay}s`;
        element.style.animationDuration = `${duration}s`;
        element.style.background = `linear-gradient(45deg, 
            hsl(${Math.random() * 360}, 100%, 60%), 
            hsl(${Math.random() * 360}, 100%, 60%)
        )`;
        element.style.opacity = `${0.05 + Math.random() * 0.1}`;
        
        DOM.floatingElements.appendChild(element);
    }
    
    animateCounter(element) {
        const target = parseInt(element.getAttribute('data-count'));
        const suffix = element.textContent.includes('%') ? '%' : '';
        const duration = 2000;
        const steps = 60;
        const step = target / steps;
        let current = 0;
        
        const counter = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(counter);
            }
            
            if (suffix === '%') {
                element.textContent = current.toFixed(1) + suffix;
            } else {
                element.textContent = Math.floor(current) + suffix;
            }
        }, duration / steps);
    }
}

// 6. Particle System
class ParticleSystem {
    constructor() {
        this.particles = [];
        this.initialized = false;
    }
    
    init() {
        if (this.initialized) return;
        
        particlesJS('hero', {
            particles: {
                number: { value: 80, density: { enable: true, value_area: 800 } },
                color: { value: "#00ffff" },
                shape: { type: "circle" },
                opacity: { value: 0.3, random: true },
                size: { value: 3, random: true },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: "#00ffff",
                    opacity: 0.1,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 2,
                    direction: "none",
                    random: true,
                    straight: false,
                    out_mode: "out",
                    bounce: false
                }
            },
            interactivity: {
                detect_on: "canvas",
                events: {
                    onhover: { enable: true, mode: "repulse" },
                    onclick: { enable: true, mode: "push" },
                    resize: true
                }
            },
            retina_detect: true
        });
        
        this.initialized = true;
    }
    
    createConfetti(count = 150) {
        const colors = [
            '#00ffff', '#9d4edd', '#ff4098', '#00ff88', '#ffcc00',
            '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'
        ];
        
        for (let i = 0; i < count; i++) {
            const confetti = document.createElement('div');
            confetti.classList.add('confetti');
            
            // Random properties
            const color = colors[Math.floor(Math.random() * colors.length)];
            const size = 5 + Math.random() * 10;
            const left = Math.random() * 100;
            const duration = 2 + Math.random() * 3;
            const delay = Math.random() * 1;
            
            confetti.style.width = `${size}px`;
            confetti.style.height = `${size * 2}px`;
            confetti.style.background = color;
            confetti.style.left = `${left}vw`;
            confetti.style.animationDuration = `${duration}s`;
            confetti.style.animationDelay = `${delay}s`;
            
            DOM.confettiContainer.appendChild(confetti);
            
            // Remove after animation
            setTimeout(() => {
                confetti.remove();
            }, duration * 1000);
        }
    }
    
    clearConfetti() {
        DOM.confettiContainer.innerHTML = '';
    }
}

// 7. Notification System
class NotificationSystem {
    constructor() {
        this.queue = [];
        this.isShowing = false;
    }
    
    show(message, type = 'info', duration = 5000) {
        const notification = {
            id: Date.now(),
            message,
            type,
            duration
        };
        
        this.queue.push(notification);
        
        if (!this.isShowing) {
            this.showNext();
        }
    }
    
    showNext() {
        if (this.queue.length === 0) {
            this.isShowing = false;
            return;
        }
        
        this.isShowing = true;
        const notification = this.queue.shift();
        
        DOM.notification.textContent = notification.message;
        DOM.notification.className = `notification ${notification.type}`;
        DOM.notification.style.display = 'block';
        
        // Add icon based on type
        let icon = 'ℹ️';
        switch (notification.type) {
            case 'success': icon = '✅'; break;
            case 'error': icon = '❌'; break;
            case 'warning': icon = '⚠️'; break;
        }
        
        DOM.notification.innerHTML = `${icon} ${notification.message}`;
        
        // Show notification
        setTimeout(() => {
            DOM.notification.classList.add('show');
        }, 10);
        
        // Hide after duration
        setTimeout(() => {
            this.hide();
        }, notification.duration);
    }
    
    hide() {
        DOM.notification.classList.remove('show');
        
        setTimeout(() => {
            DOM.notification.style.display = 'none';
            this.showNext();
        }, 500);
    }
    
    success(message, duration = 3000) {
        this.show(message, 'success', duration);
    }
    
    error(message, duration = 5000) {
        this.show(message, 'error', duration);
    }
    
    warning(message, duration = 4000) {
        this.show(message, 'warning', duration);
    }
}

// 8. Website Generator
class WebsiteGenerator {
    constructor() {
        this.templates = [
            {
                name: 'E-commerce',
                description: 'Modern online store with product catalog, cart, and checkout',
                preview: '🛍️'
            },
            {
                name: 'Portfolio',
                description: 'Creative portfolio with gallery, about section, and contact',
                preview: '🎨'
            },
            {
                name: 'Blog',
                description: 'Content-focused blog with categories, tags, and comments',
                preview: '📝'
            },
            {
                name: 'Landing Page',
                description: 'High-converting landing page with hero, features, and CTA',
                preview: '🚀'
            },
            {
                name: 'Dashboard',
                description: 'Admin dashboard with charts, tables, and user management',
                preview: '📊'
            }
        ];
    }
    
    async generate(description, options = {}) {
        if (State.generating) return;
        
        State.generating = true;
        
        // Show loading state
        DOM.generateWebsiteBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
        DOM.generateWebsiteBtn.disabled = true;
        
        // Show progress animation
        this.showGenerationProgress();
        
        try {
            // Simulate API call
            await this.simulateGeneration(description, options);
            
            // Show success
            this.showSuccess();
            
            // Create confetti celebration
            particleSystem.createConfetti();
            
            // Show preview
            this.showPreview(description, options);
            
        } catch (error) {
            notificationSystem.error('Failed to generate website. Please try again.');
        } finally {
            // Reset button state
            setTimeout(() => {
                DOM.generateWebsiteBtn.innerHTML = '<i class="fas fa-magic"></i> Generate Website';
                DOM.generateWebsiteBtn.disabled = false;
                State.generating = false;
            }, 1000);
        }
    }
    
    async simulateGeneration(description, options) {
        return new Promise((resolve) => {
            // Simulate generation steps
            const steps = [
                'Analyzing description...',
                'Generating layout...',
                'Creating components...',
                'Optimizing for performance...',
                'Adding animations...',
                'Finalizing...'
            ];
            
            let step = 0;
            const interval = setInterval(() => {
                if (step < steps.length) {
                    this.updateProgress((step + 1) / steps.length, steps[step]);
                    step++;
                } else {
                    clearInterval(interval);
                    resolve();
                }
            }, 500);
        });
    }
    
    showGenerationProgress() {
        DOM.animationPreview.innerHTML = `
            <div class="code-editor">
                <div class="code-header">
                    <div class="code-dots">
                        <div class="code-dot red"></div>
                        <div class="code-dot yellow"></div>
                        <div class="code-dot green"></div>
                    </div>
                </div>
                <div class="code-content">
                    <div class="code-line">$ <span class="typing-container"><span class="typing-text">code-mon generate --description="${DOM.websiteIdea.value.substring(0, 30)}..."</span></span></div>
                    <div class="code-line">Initializing AI model...</div>
                    <div class="code-line">Parsing requirements...</div>
                    <div class="code-line" id="progress-line">█▒▒▒▒▒▒▒▒▒ 10%</div>
                </div>
            </div>
        `;
    }
    
    updateProgress(percentage, message) {
        const progressLine = document.getElementById('progress-line');
        if (progressLine) {
            const progress = Math.floor(percentage * 100);
            const bars = '█'.repeat(Math.floor(progress / 10));
            const spaces = '▒'.repeat(10 - Math.floor(progress / 10));
            progressLine.textContent = `${bars}${spaces} ${progress}% - ${message}`;
        }
    }
    
    showSuccess() {
        notificationSystem.success('Website generated successfully! 🎉');
    }
    
    showPreview(description, options) {
        // Find matching template
        const template = this.findMatchingTemplate(description);
        
        DOM.animationPreview.innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <div style="font-size: 4rem; margin-bottom: 1rem;">${template.preview}</div>
                <h3 style="font-family: 'Orbitron', sans-serif; margin-bottom: 0.5rem; color: var(--accent-cyan);">
                    ${template.name} Website
                </h3>
                <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">${template.description}</p>
                <div style="display: flex; gap: 1rem; justify-content: center; margin-top: 2rem;">
                    <button class="cta-button cta-primary" id="viewCodeBtn">
                        <i class="fas fa-code"></i> View Code
                    </button>
                    <button class="cta-button cta-secondary" id="deployBtn">
                        <i class="fas fa-rocket"></i> Deploy Now
                    </button>
                </div>
            </div>
        `;
        
        // Add event listeners to preview buttons
        setTimeout(() => {
            document.getElementById('viewCodeBtn').addEventListener('click', () => {
                this.showCodePreview(template);
            });
            
            document.getElementById('deployBtn').addEventListener('click', () => {
                this.deployWebsite(template);
            });
        }, 100);
    }
    
    findMatchingTemplate(description) {
        const desc = description.toLowerCase();
        
        for (const template of this.templates) {
            if (desc.includes(template.name.toLowerCase())) {
                return template;
            }
        }
        
        // Return random template if no match
        return this.templates[Math.floor(Math.random() * this.templates.length)];
    }
    
    showCodePreview(template) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay active';
        modal.innerHTML = `
            <div class="modal" style="max-width: 800px;">
                <div class="modal-header">
                    <h3 class="modal-title">Generated Code Preview</h3>
                    <button class="modal-close" id="closeCodeModal">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-content">
                    <div class="code-editor">
                        <div class="code-header">
                            <div class="code-dots">
                                <div class="code-dot red"></div>
                                <div class="code-dot yellow"></div>
                                <div class="code-dot green"></div>
                            </div>
                        </div>
                        <div class="code-content">
                            <div class="code-line"><span style="color: #569cd6">&lt;!DOCTYPE</span> <span style="color: #9cdcfe">html</span><span style="color: #569cd6">&gt;</span></div>
                            <div class="code-line"><span style="color: #569cd6">&lt;html</span> <span style="color: #9cdcfe">lang</span>=<span style="color: #ce9178">"en"</span><span style="color: #569cd6">&gt;</span></div>
                            <div class="code-line">  <span style="color: #569cd6">&lt;head&gt;</span></div>
                            <div class="code-line">    <span style="color: #569cd6">&lt;meta</span> <span style="color: #9cdcfe">charset</span>=<span style="color: #ce9178">"UTF-8"</span><span style="color: #569cd6">&gt;</span></div>
                            <div class="code-line">    <span style="color: #569cd6">&lt;title&gt;</span>${template.name} - Generated by Code Mon<span style="color: #569cd6">&lt;/title&gt;</span></div>
                            <div class="code-line">    <span style="color: #808080">&lt;!-- AI Generated Code --&gt;</span></div>
                            <div class="code-line">  <span style="color: #569cd6">&lt;/head&gt;</span></div>
                            <div class="code-line"><span style="color: #569cd6">&lt;/html&gt;</span></div>
                        </div>
                    </div>
                    <div style="margin-top: 2rem; text-align: center;">
                        <button class="cta-button cta-primary" id="downloadCodeBtn">
                            <i class="fas fa-download"></i> Download Code
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        DOM.body.appendChild(modal);
        
        // Add event listeners
        modal.querySelector('#closeCodeModal').addEventListener('click', () => {
            modal.remove();
        });
        
        modal.querySelector('#downloadCodeBtn').addEventListener('click', () => {
            this.downloadCode(template);
            modal.remove();
        });
        
        // Close when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }
    
    downloadCode(template) {
        // Create a fake download
        const code = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${template.name} - Generated by Code Mon</title>
    <style>
        /* AI Generated CSS by Code Mon */
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; }
        /* Your website code would be here */
    </style>
</head>
<body>
    <h1>Welcome to Your ${template.name}</h1>
    <p>Generated by Code Mon AI</p>
    <script>
        // AI Generated JavaScript by Code Mon
        console.log('Website generated successfully!');
    <\/script>
</body>
</html>`;
        
        const blob = new Blob([code], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${template.name.toLowerCase().replace(' ', '-')}-code-mon.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        notificationSystem.success('Code downloaded successfully!');
    }
    
    deployWebsite(template) {
        notificationSystem.show(`Deploying ${template.name} website...`, 'info');
        
        // Simulate deployment
        setTimeout(() => {
            notificationSystem.success(`${template.name} deployed successfully! 🚀`);
            
            // Open deployment URL
            setTimeout(() => {
                window.open(`generate.html?template=${template.name.toLowerCase()}`, '_blank');
            }, 1000);
        }, 2000);
    }
}

// 9. Hosting System
class HostingSystem {
    constructor() {
        this.init();
    }
    
    init() {
        // Select hosting plan buttons
        DOM.selectHostingBtns.forEach(button => {
            button.addEventListener('click', (e) => {
                const plan = e.target.getAttribute('data-plan');
                this.selectPlan(plan);
            });
        });
        
        // Notify me buttons
        DOM.notifyMeBtns.forEach(button => {
            button.addEventListener('click', (e) => {
                const plan = e.target.getAttribute('data-plan');
                this.notifyAboutPlan(plan);
            });
        });
    }
    
    selectPlan(plan) {
        const planData = State.hostingPlans[plan];
        if (!planData) return;
        
        DOM.selectedPlan.textContent = planData.name;
        DOM.planModal.classList.add('active');
        
        // Add selection animation
        const card = document.querySelector(`[data-plan="${plan}"]`).closest('.hosting-card');
        card.style.animation = 'pulse 0.5s ease';
        
        setTimeout(() => {
            card.style.animation = '';
        }, 500);
    }
    
    notifyAboutPlan(plan) {
        const planData = State.hostingPlans[plan];
        notificationSystem.show(`We'll notify you when ${planData.name} is available!`, 'info');
        
        // Store notification preference
        localStorage.setItem(`notify-${plan}`, 'true');
    }
}

// 10. Scroll Manager
class ScrollManager {
    constructor() {
        this.init();
    }
    
    init() {
        // Navbar scroll effect
        window.addEventListener('scroll', () => this.handleScroll());
        
        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href');
                if (targetId === '#') return;
                
                const target = document.querySelector(targetId);
                if (target) {
                    this.smoothScrollTo(target);
                }
            });
        });
        
        // Parallax effect
        window.addEventListener('scroll', () => this.updateParallax());
        
        // Mouse move effects
        document.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    }
    
    handleScroll() {
        State.scrollPosition = window.scrollY;
        
        // Navbar effect
        if (State.scrollPosition > 100) {
            DOM.navbar.classList.add('scrolled');
        } else {
            DOM.navbar.classList.remove('scrolled');
        }
        
        // Update active section
        this.updateActiveSection();
    }
    
    smoothScrollTo(target) {
        const targetPosition = target.offsetTop - 100;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        const duration = 1000;
        let start = null;
        
        function animation(currentTime) {
            if (start === null) start = currentTime;
            const timeElapsed = currentTime - start;
            const run = ease(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        }
        
        function ease(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        }
        
        requestAnimationFrame(animation);
    }
    
    updateParallax() {
        const scrolled = window.pageYOffset;
        const hero = DOM.hero;
        
        if (hero) {
            hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
        
        // Parallax for other elements
        document.querySelectorAll('.parallax-layer').forEach((layer, index) => {
            const speed = 0.3 + (index * 0.1);
            layer.style.transform = `translateY(${scrolled * speed}px)`;
        });
    }
    
    handleMouseMove(e) {
        State.mousePosition = { x: e.clientX, y: e.clientY };
        
        // Cursor effect
        this.updateCursorEffect();
        
        // Update floating elements position
        this.updateFloatingElements();
    }
    
    updateCursorEffect() {
        // You can add custom cursor effects here
    }
    
    updateFloatingElements() {
        const elements = DOM.floatingElements.querySelectorAll('.floating-element');
        const mouseX = State.mousePosition.x / window.innerWidth;
        const mouseY = State.mousePosition.y / window.innerHeight;
        
        elements.forEach((el, index) => {
            const speed = 0.01 + (index * 0.002);
            const x = (mouseX - 0.5) * speed * 100;
            const y = (mouseY - 0.5) * speed * 100;
            
            el.style.transform = `translate(${x}px, ${y}px)`;
        });
    }
    
    updateActiveSection() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const top = section.offsetTop;
            const bottom = top + section.offsetHeight;
            const id = section.getAttribute('id');
            
            if (scrollPos >= top && scrollPos <= bottom) {
                // Update active nav link if you have navigation
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
}

// 11. Form Handler
class FormHandler {
    constructor() {
        this.init();
    }
    
    init() {
        // Newsletter form
        if (DOM.newsletterForm) {
            DOM.newsletterForm.addEventListener('submit', (e) => this.handleNewsletterSubmit(e));
        }
        
        // Generator form
        DOM.generateWebsiteBtn.addEventListener('click', (e) => this.handleGenerateSubmit(e));
        
        // Modal forms
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-close') || 
                e.target.closest('.modal-close')) {
                this.closeModal(e.target.closest('.modal-overlay'));
            }
            
            if (e.target.classList.contains('modal-overlay')) {
                this.closeModal(e.target);
            }
        });
    }
    
    handleNewsletterSubmit(e) {
        e.preventDefault();
        const email = DOM.newsletterForm.querySelector('input[type="email"]').value;
        
        if (!this.validateEmail(email)) {
            notificationSystem.error('Please enter a valid email address.');
            return;
        }
        
        // Simulate API call
        setTimeout(() => {
            notificationSystem.success('Successfully subscribed to newsletter!');
            DOM.newsletterForm.reset();
        }, 1000);
    }
    
    handleGenerateSubmit(e) {
        e.preventDefault();
        
        const description = DOM.websiteIdea.value.trim();
        if (!description) {
            notificationSystem.error('Please describe your website idea.');
            DOM.websiteIdea.focus();
            return;
        }
        
        if (description.length < 10) {
            notificationSystem.error('Please provide more details about your website idea.');
            return;
        }
        
        const options = {
            responsive: document.getElementById('responsive').checked,
            seo: document.getElementById('seo').checked,
            animations: document.getElementById('animations').checked,
            darkmode: document.getElementById('darkmode').checked
        };
        
        websiteGenerator.generate(description, options);
    }
    
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    closeModal(modal) {
        if (modal) {
            modal.classList.remove('active');
        }
    }
}

// 12. Initialize Application
class App {
    constructor() {
        this.init();
    }
    
    init() {
        // Initialize components
        this.themeManager = new ThemeManager();
        this.sidebarManager = new SidebarManager();
        this.animationManager = new AnimationManager();
        this.particleSystem = new ParticleSystem();
        this.notificationSystem = new NotificationSystem();
        this.websiteGenerator = new WebsiteGenerator();
        this.hostingSystem = new HostingSystem();
        this.scrollManager = new ScrollManager();
        this.formHandler = new FormHandler();
        
        // Initialize event listeners
        this.initEventListeners();
        
        // Initialize particles after a delay
        setTimeout(() => {
            this.particleSystem.init();
        }, 1000);
        
        // Hide loading screen
        this.hideLoadingScreen();
        
        // Initial notification
        setTimeout(() => {
            this.notificationSystem.show('Welcome to Code Mon! 🚀', 'info', 3000);
        }, 2000);
    }
    
    initEventListeners() {
        // Demo modal
        DOM.learnMoreBtn.addEventListener('click', () => {
            DOM.demoModal.classList.add('active');
        });
        
        DOM.closeDemoModal.addEventListener('click', () => {
            DOM.demoModal.classList.remove('active');
        });
        
        DOM.demoModal.addEventListener('click', (e) => {
            if (e.target === DOM.demoModal) {
                DOM.demoModal.classList.remove('active');
            }
        });
        
        // Plan modal
        DOM.closePlanModal.addEventListener('click', () => {
            DOM.planModal.classList.remove('active');
        });
        
        DOM.planModal.addEventListener('click', (e) => {
            if (e.target === DOM.planModal) {
                DOM.planModal.classList.remove('active');
            }
        });
        
        // Generate button in hero
        DOM.generateBtn.addEventListener('click', () => {
            DOM.generator.scrollIntoView({ behavior: 'smooth' });
            DOM.websiteIdea.focus();
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + / to focus search
            if ((e.ctrlKey || e.metaKey) && e.key === '/') {
                e.preventDefault();
                DOM.websiteIdea.focus();
            }
            
            // Escape to close modals/sidebar
            if (e.key === 'Escape') {
                DOM.demoModal.classList.remove('active');
                DOM.planModal.classList.remove('active');
                this.sidebarManager.closeSidebar();
            }
        });
        
        // Window resize
        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }
    
    hideLoadingScreen() {
        setTimeout(() => {
            DOM.loadingScreen.classList.add('hidden');
            
            setTimeout(() => {
                DOM.loadingScreen.style.display = 'none';
            }, 500);
        }, 1500);
    }
    
    handleResize() {
        // Handle responsive behaviors
        if (window.innerWidth > 768 && State.sidebarOpen) {
            this.sidebarManager.closeSidebar();
        }
    }
}

// 13. Utility Functions
const Utils = {
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },
    
    randomBetween(min, max) {
        return Math.random() * (max - min) + min;
    },
    
    randomColor() {
        return `hsl(${Math.random() * 360}, 100%, 60%)`;
    },
    
    formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    },
    
    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }
};

// 14. Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Create app instance
    window.app = new App();
    
    // Make utils available globally
    window.utils = Utils;
    
    // Performance monitoring
    if (typeof PerformanceObserver !== 'undefined') {
        const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                console.log(`${entry.name}: ${entry.duration}ms`);
            }
        });
        
        observer.observe({ entryTypes: ['measure'] });
    }
});

// 15. Service Worker Registration (for PWA)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(
            (registration) => {
                console.log('ServiceWorker registration successful');
            },
            (err) => {
                console.log('ServiceWorker registration failed: ', err);
            }
        );
    });
}

// 16. Error Boundary
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    notificationSystem.error('An error occurred. Please refresh the page.');
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    notificationSystem.error('Something went wrong. Please try again.');
});

// 17. Export for module usage (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ThemeManager,
        SidebarManager,
        AnimationManager,
        ParticleSystem,
        NotificationSystem,
        WebsiteGenerator,
        HostingSystem,
        ScrollManager,
        FormHandler,
        App,
        Utils
    };
}