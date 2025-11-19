/* =========================================
   Main Script
   ========================================= */

// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initHeroCanvas();
    initScrollAnimations();
    initContactForm();
});

/* =========================================
   Navigation Logic
   ========================================= */
function initNavigation() {
    const hamburger = document.getElementById('js-hamburger');
    const nav = document.getElementById('js-nav');
    const links = document.querySelectorAll('.nav__link');

    // Toggle Menu
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('is-active');
        nav.classList.toggle('is-active');
    });

    // Close menu when link is clicked
    links.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('is-active');
            nav.classList.remove('is-active');
        });
    });

    // Smooth Scroll (Native behavior is set in CSS, but this ensures offset if needed)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElem = document.querySelector(targetId);
            if (targetElem) {
                const headerOffset = 80;
                const elementPosition = targetElem.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });
}

/* =========================================
   Scroll Animations (GSAP)
   ========================================= */
function initScrollAnimations() {
    // Hero Animations (On Load)
    const heroTimeline = gsap.timeline();
    heroTimeline
        .to('.hero__label', { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' })
        .to('.hero__title', { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, '-=0.6')
        .to('.hero__bio', { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, '-=0.6')
        .to('.hero__actions', { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, '-=0.6');

    // General Fade Up for Sections
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-text');
    revealElements.forEach(el => {
        gsap.fromTo(el, 
            { opacity: 0, y: 30 },
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 85%',
                }
            }
        );
    });

    // Staggered Animations for Cards
    const gridSections = ['.skills__grid', '.projects__list', '.services__grid'];
    gridSections.forEach(section => {
        const items = document.querySelectorAll(`${section} > *`);
        if(items.length > 0) {
            gsap.fromTo(items,
                { opacity: 0, y: 30 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    stagger: 0.1,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: section,
                        start: 'top 85%',
                    }
                }
            );
        }
    });

    // Process Steps Animation
    const steps = document.querySelectorAll('.process__step');
    steps.forEach((step, index) => {
        gsap.fromTo(step,
            { opacity: 0, x: -30 },
            {
                opacity: 1,
                x: 0,
                duration: 0.6,
                delay: index * 0.1,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: step,
                    start: 'top 90%',
                }
            }
        );
    });
}

/* =========================================
   Hero Canvas Animation (Network/Nodes)
   ========================================= */
function initHeroCanvas() {
    const canvas = document.getElementById('hero-canvas');
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];

    // Config
    const particleCount = window.innerWidth < 768 ? 30 : 60;
    const connectionDistance = 150;
    const moveSpeed = 0.5;

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * moveSpeed;
            this.vy = (Math.random() - 0.5) * moveSpeed;
            this.size = Math.random() * 2 + 1;
            this.color = '#3b82f6'; // Blue accent
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Bounce off edges
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.globalAlpha = 0.5;
            ctx.fill();
        }
    }

    function initParticles() {
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        
        // Update and draw particles
        particles.forEach(p => {
            p.update();
            p.draw();
        });

        // Draw connections
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < connectionDistance) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = '#3b82f6';
                    ctx.globalAlpha = 1 - (distance / connectionDistance);
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(animate);
    }

    // Init
    resize();
    initParticles();
    animate();

    window.addEventListener('resize', () => {
        resize();
        initParticles();
    });
}

/* =========================================
   Contact Form
   ========================================= */
function initContactForm() {
    const form = document.getElementById('contact-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        // Dummy alert as requested
        alert('お問い合わせありがとうございます。\n（※これはデモサイトのため送信されません）');
        form.reset();
    });
}

