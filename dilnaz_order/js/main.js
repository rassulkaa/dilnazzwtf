// Main JavaScript - Navigation, Theme Toggle, and Enhanced Animations
document.addEventListener('DOMContentLoaded', function () {
    // ===== Page Load Animations =====
    initializePageLoadAnimations();

    // ===== Navigation =====
    const navLinks = document.querySelectorAll('.nav-link');

    // Smooth scroll to sections and update active link
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                // Update active link
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });

    // Update active nav link on scroll
    const sections = document.querySelectorAll('section[id]');
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -70% 0px',
        threshold: 0
    };

    const sectionObserver = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // ===== Theme Toggle =====
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('.theme-icon');

    // Check for saved theme preference or default to 'light'
    const currentTheme = localStorage.getItem('theme') || 'light';
    if (currentTheme === 'dark') {
        document.body.classList.add('dark-theme');
        themeIcon.textContent = '☀️';
    }

    themeToggle.addEventListener('click', function () {
        document.body.classList.toggle('dark-theme');

        if (document.body.classList.contains('dark-theme')) {
            themeIcon.textContent = '☀️';
            localStorage.setItem('theme', 'dark');
        } else {
            themeIcon.textContent = '🌙';
            localStorage.setItem('theme', 'light');
        }
    });

    // ===== Background Music Control =====
    const bgMusic = document.getElementById('bgMusic');
    let musicStarted = false;

    // Start music on first user interaction (browser autoplay policy)
    document.addEventListener('click', function startMusic() {
        if (!musicStarted) {
            bgMusic.volume = 0.15; // Set low volume for background music
            bgMusic.play().catch(err => {
                console.log('Music autoplay prevented:', err);
            });
            musicStarted = true;
        }
    }, { once: true });

    // ===== Enhanced Scroll Animations =====
    setupScrollAnimations();

    // ===== Parallax Effect =====
    setupParallaxEffect();

    // ===== CTA Button smooth scroll =====
    const ctaButtons = document.querySelectorAll('.hero-cta .btn, .cta-buttons .btn');
    ctaButtons.forEach(btn => {
        btn.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
});

// ===== Page Load Animation Function =====
function initializePageLoadAnimations() {
    // Animate navbar
    setTimeout(() => {
        const navbar = document.querySelector('.navbar');
        if (navbar) navbar.classList.add('animate-in');
    }, 100);

    // Animate hero section
    setTimeout(() => {
        const hero = document.querySelector('.hero');
        if (hero) hero.classList.add('animate-in');
    }, 300);

    // Animate statistics with number counter
    setTimeout(() => {
        const statCards = document.querySelectorAll('.stat-card');
        statCards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('animate-in');

                // Animate numbers
                const statNumber = card.querySelector('.stat-number');
                if (statNumber) {
                    animateStatNumber(statNumber);
                }
            }, index * 150);
        });
    }, 800);
}

// ===== Number Counter Animation =====
function animateStatNumber(element) {
    const text = element.textContent;
    const hasPercent = text.includes('%');
    const hasYears = text.includes('Жыл');
    const isRealtime = text.includes('Нақты');

    if (isRealtime) {
        // Just fade in
        element.classList.add('counting');
        return;
    }

    let target;
    if (hasPercent) {
        target = parseInt(text);
    } else if (hasYears) {
        target = parseInt(text);
    } else {
        return;
    }

    const duration = 2000; // 2 seconds
    const steps = 60;
    const stepValue = target / steps;
    const stepDuration = duration / steps;
    let current = 0;

    element.classList.add('counting');

    const counter = setInterval(() => {
        current += stepValue;
        if (current >= target) {
            current = target;
            clearInterval(counter);
        }

        if (hasPercent) {
            element.textContent = Math.round(current) + '%';
        } else if (hasYears) {
            element.textContent = Math.round(current) + ' Жыл';
        }
    }, stepDuration);
}

// ===== Enhanced Scroll Animations =====
function setupScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal');
                // Don't unobserve to allow repeated animations if needed
                // revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all animated elements
    const animatedElements = document.querySelectorAll(
        '.about-card, .chart-container, .explanation-card, ' +
        '.dashboard-card, .overview-card, .insight-item'
    );

    animatedElements.forEach(el => {
        revealObserver.observe(el);
    });
}

// ===== Parallax Scrolling Effect =====
function setupParallaxEffect() {
    const hero = document.querySelector('.hero');

    if (!hero) return;

    window.addEventListener('scroll', function () {
        const scrolled = window.pageYOffset;
        const rate = scrolled * 0.3;

        if (hero) {
            hero.style.transform = `translateY(${rate}px)`;
        }
    });
}
