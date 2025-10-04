// Theme toggle functionality
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle.querySelector('i');
const themeText = themeToggle.querySelector('span');

document.addEventListener("DOMContentLoaded", () => {
    const hintEncoded = "4oaRIOKGkSDihpMg4oaTIOKGkCDihpIg4oaQIOKGkiBCIEE=";

    const div = document.createElement("div");
    div.className = "secret-hint";

    const icon = document.createElement("i");
    icon.className = "fas fa-gamepad";

    const span = document.createElement("span");
    span.className = "secret-text";

    div.appendChild(icon);
    div.appendChild(span);
    document.body.appendChild(div);

    // Decode on hover
    div.addEventListener("mouseenter", () => {
        span.textContent = b64DecodeUnicode(hintEncoded);
    });

    // Hide on mouse leave
    div.addEventListener("mouseleave", () => {
        span.textContent = ""; // Or leave as Base64 if you prefer
    });
});

function b64DecodeUnicode(str) {
    const bytes = atob(str);
    const arr = Uint8Array.from(bytes, c => c.charCodeAt(0));
    return new TextDecoder('utf-8').decode(arr);
}

// Check for saved theme preference or default to 'dark'
const currentTheme = localStorage.getItem('theme') || 'dark';
document.documentElement.setAttribute('data-theme', currentTheme);
updateThemeToggle(currentTheme);

function updateThemeToggle(theme) {
    if (theme === 'light') {
        themeIcon.className = 'fas fa-sun';
        themeText.textContent = 'Light';
    } else {
        themeIcon.className = 'fas fa-moon';
        themeText.textContent = 'Dark';
    }
}

themeToggle.addEventListener('click', function () {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeToggle(newTheme);
});

// Mobile Nav Toggle
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");

hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("show");
    hamburger.classList.toggle("active");
});

let backgroundOnly = false;
let toastShown = false; // track if we've already shown it once

function toggleBackgroundMode() {
    backgroundOnly = !backgroundOnly;
    const bgToggleBtn = document.getElementById("backgroundToggle");

    if (backgroundOnly) {
        document.body.classList.add("background-only");
        if (bgToggleBtn) bgToggleBtn.querySelector("span").textContent = "Show Content";

        // Show toast only the first time
        if (!toastShown) {
            showToast("Background mode enabled!");
            toastShown = true;
        }
    } else {
        document.body.classList.remove("background-only");
        if (bgToggleBtn) bgToggleBtn.querySelector("span").textContent = "Background Only";
    }
}

function showToast(message) {
    const toast = document.getElementById("toast");
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000); // visible for 3 seconds
}

// Button click
const bgToggleBtn = document.getElementById("backgroundToggle");
if (bgToggleBtn) {
    bgToggleBtn.addEventListener("click", toggleBackgroundMode);
}

// Animated Background Logic
const wrapper = document.getElementById("wrapper");

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

const uniqueRand = (min, max, prev) => {
    let next = prev;
    while (prev === next) next = rand(min, max);
    return next;
};

// Generate all possible combinations dynamically
const configurations = [1, 2, 3];
const roundnessLevels = [1, 2, 3];

const combinations = [];
configurations.forEach(cfg => {
    roundnessLevels.forEach(rnd => {
        combinations.push({ configuration: cfg, roundness: rnd });
    });
});

let prev = 0;

setInterval(() => {
    const index = uniqueRand(0, combinations.length - 1, prev);
    const combination = combinations[index];

    wrapper.dataset.configuration = combination.configuration;
    wrapper.dataset.roundness = combination.roundness;

    prev = index;
}, 4000);

// Active navigation highlighting
const allNavLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('.section, .hero');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    allNavLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Smooth scrolling for navigation links
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

// Parallax effect
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallax1 = document.querySelector('.parallax-1');
    const parallax2 = document.querySelector('.parallax-2');

    if (parallax1) parallax1.style.transform = `translateY(${scrolled * 0.2}px)`;
    if (parallax2) parallax2.style.transform = `translateY(${scrolled * -0.1}px)`;
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.8s ease-out forwards';
        }
    });
}, observerOptions);

// Observe all sections for animations
document.querySelectorAll('.section').forEach(section => {
    observer.observe(section);
});

// Skill tag hover effects
document.querySelectorAll('.skill-tag').forEach(tag => {
    tag.addEventListener('mouseenter', function () {
        this.style.background = 'rgba(102, 126, 234, 0.2)';
        this.style.transform = 'translateY(-2px)';
    });

    tag.addEventListener('mouseleave', function () {
        this.style.background = 'rgba(102, 126, 234, 0.1)';
        this.style.transform = 'translateY(0)';
    });
});

// Project card tilt effect
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', function (e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;

        this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
    });

    card.addEventListener('mouseleave', function () {
        this.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
    });
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease-in-out';

    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Add scroll-to-top functionality
const scrollToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
};

// Contact form submission with Formspree
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const submitButton = this.querySelector('.submit-button');
        const buttonText = submitButton.querySelector('.button-text');
        const buttonLoading = submitButton.querySelector('.button-loading');
        const formStatus = document.getElementById('formStatus');
        
        // Disable button and show loading state
        submitButton.disabled = true;
        buttonText.style.display = 'none';
        buttonLoading.style.display = 'inline';
        formStatus.textContent = '';
        formStatus.className = 'form-status';
        
        try {
            const formData = new FormData(this);
            const response = await fetch(this.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                formStatus.textContent = 'Thanks for your message! I\'ll get back to you soon.';
                formStatus.classList.add('success');
                this.reset();
                showToast("Message sent successfully!");
            } else {
                throw new Error('Form submission failed');
            }
        } catch (error) {
            formStatus.textContent = 'Oops! There was a problem sending your message. Please try again or email me directly.';
            formStatus.classList.add('error');
        } finally {
            // Re-enable button and restore original state
            submitButton.disabled = false;
            buttonText.style.display = 'inline';
            buttonLoading.style.display = 'none';
        }
    });
}

// Show/hide scroll-to-top button based on scroll position
window.addEventListener('scroll', () => {
    const scrollButton = document.getElementById('scrollToTop');
    if (scrollButton) {
        if (window.pageYOffset > 300) {
            scrollButton.style.display = 'block';
        } else {
            scrollButton.style.display = 'none';
        }
    }
});

// Add easter egg - Konami code
let konamiCode = [];
const konamiSequence = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'KeyB', 'KeyA'
];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.code);

    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }

    if (konamiCode.length === konamiSequence.length &&
        konamiCode.every((code, index) => code === konamiSequence[index])) {

        // Easter egg: Add rainbow colors to the background shapes
        document.querySelectorAll('.shape').forEach((shape, index) => {
            shape.style.animation = `rainbow 2s infinite ${index * 0.1}s`;
        });

        // Add rainbow keyframes if not already added
        if (!document.querySelector('#rainbow-keyframes')) {
            const style = document.createElement('style');
            style.id = 'rainbow-keyframes';
            style.textContent = `
                @keyframes rainbow {
                    0% { filter: hue-rotate(0deg); }
                    100% { filter: hue-rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }

        console.log('🌈 Rainbow mode activated!');
    }
});
