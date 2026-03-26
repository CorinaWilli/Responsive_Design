// DOM-Elemente aus dem HTML holen
const menuBtn = document.getElementById('menuBtn');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-overlay a');
const soundBtn = document.getElementById('soundBtn');
const bgAudio = document.getElementById('bgAudio');
const heroBobImg = document.querySelector('.bob-img');
const bubbleLayer = document.getElementById('bubbleLayer');
const heroBubbleLayer = document.querySelector('.hero-bubble-layer');

let heroBubbleInterval = null;

// Öffnet/schliesst das Overlay-Menü und aktualisiert aria-expanded
function toggleMenu() {
    const isOpen = navMenu.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', isOpen);
}

// Schliesst das Overlay-Menü
function closeMenu() {
    navMenu.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
}

// Klick auf die Menü-Schaltfläche
menuBtn.addEventListener('click', (event) => {
    event.stopPropagation();
    toggleMenu();
});

// Klick ausserhalb des Menüs -> closed
document.addEventListener('click', () => {
    closeMenu();
});

// Klick innerhalb des Menüs -> bleibt offen
navMenu.addEventListener('click', (event) => {
    event.stopPropagation();
});

// Klick auf Menü-Link schliesst das Menü
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        closeMenu();
    });
});

// Hintergrund-Ton ein/aus
function toggleSound() {
    if (bgAudio.paused) {
        bgAudio.play();
        soundBtn.setAttribute('aria-label', 'Ton ausschalten');
        soundBtn.setAttribute('aria-pressed', 'true');
    } else {
        bgAudio.pause();
        soundBtn.setAttribute('aria-label', 'Ton einschalten');
        soundBtn.setAttribute('aria-pressed', 'false');
    }
}

soundBtn.addEventListener('click', (event) => {
    event.stopPropagation();
    toggleSound();
});

// Parallax-Effekt: Hintergrund und Bubbles
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const background = document.getElementById('bg');

    background.style.transform = `translateY(${scrolled * 0.3}px)`;
    if (bubbleLayer) {
        bubbleLayer.style.transform = `translateY(${scrolled * 0.1}px)`;
    }
});

// Bubble-Hintergrund: zufällig verteilte, kleine PNG-Bilder
function placeRandomBubbles() {
    const bubbleFiles = [
        '8-bubble.png',
        '9-bubble.png',
        '10-bubble.png',
        '11-bubble.png',
        '12-bubble.png'
    ];
    const layer = document.getElementById('bubbleLayer');
    if (!layer) return;

    const isDesktop = window.matchMedia('(min-width: 1210px)').matches;
    const count = isDesktop ? 65 : 40;
    for (let i = 0; i < count; i++) {
        const img = document.createElement('img');
        const file = bubbleFiles[Math.floor(Math.random() * bubbleFiles.length)];
        const size = isDesktop
            ? Math.round(30 + Math.random() * 95)
            : Math.round(18 + Math.random() * 70);
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        const opacity = 0.25 + Math.random() * 0.5;
        const rotate = Math.round(Math.random() * 360);

        img.src = file;
        img.alt = '';
        img.className = 'bubble';
        img.style.width = `${size}px`;
        img.style.left = `${left}%`;
        img.style.top = `${top}%`;
        img.style.opacity = opacity;
        img.style.transform = `rotate(${rotate}deg)`;

        // Leicht unterschiedliches Float-Verhalten
        const duration = 10 + Math.random() * 8;
        const delay = Math.random() * 5;
        img.style.animation = `bubbleFloat ${duration}s ease-in-out ${delay}s infinite`;

        layer.appendChild(img);
    }
}

function emitHeroBubble() {
    if (!heroBubbleLayer) return;

    const heroBubbleFiles = [
        '8-bubble.png',
        '9-bubble.png',
        '10-bubble.png',
        '11-bubble.png',
        '12-bubble.png'
    ];

    const heroBubbleStyles = getComputedStyle(heroBubbleLayer);
    const originX = heroBubbleStyles.getPropertyValue('--bubble-origin-x').trim() || '76%';
    const originY = heroBubbleStyles.getPropertyValue('--bubble-origin-y').trim() || '50%';
    const bubble = document.createElement('img');
    const size = Math.round(16 + Math.random() * 22);
    const driftX = `${Math.round(-18 + Math.random() * 36)}px`;
    const delay = Math.random() * 0.08;
    const duration = 2.9 + Math.random() * 0.9;

    bubble.src = heroBubbleFiles[Math.floor(Math.random() * heroBubbleFiles.length)];
    bubble.alt = '';
    bubble.className = 'bubble hero-bubble';
    bubble.style.width = `${size}px`;
    bubble.style.left = `calc(${originX} - ${size / 2}px)`;
    bubble.style.top = `calc(${originY} - ${size / 2}px)`;
    bubble.style.setProperty('--drift-x', driftX);
    bubble.style.animationDelay = `${delay}s`;
    bubble.style.setProperty('--bubble-duration', `${duration}s`);

    heroBubbleLayer.appendChild(bubble);

    window.setTimeout(() => {
        bubble.remove();
    }, 5000);
}

function startHeroBubbleStream() {
    if (!heroBobImg || !heroBubbleLayer || heroBubbleInterval) return;

    emitHeroBubble();
    heroBubbleInterval = window.setInterval(() => {
        emitHeroBubble();
        if (Math.random() < 0.35) {
            emitHeroBubble();
        }
    }, 140);
}

function stopHeroBubbleStream() {
    if (!heroBubbleInterval) return;

    window.clearInterval(heroBubbleInterval);
    heroBubbleInterval = null;
}

// Bubble platzieren sobald DOM geladen ist
window.addEventListener('DOMContentLoaded', placeRandomBubbles);

if (heroBobImg && heroBubbleLayer) {
    heroBobImg.addEventListener('pointerenter', startHeroBubbleStream);
    heroBobImg.addEventListener('pointerleave', stopHeroBubbleStream);
    heroBobImg.addEventListener('pointercancel', stopHeroBubbleStream);
}

// Smooth Scroll: beim eines Navigations Buttons
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

const backToTopBtn = document.getElementById('backToTop');
const heroSection = document.getElementById('intro');

if (heroSection && backToTopBtn) {
    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                backToTopBtn.classList.remove('show');
            } else {
                backToTopBtn.classList.add('show');
            }
        });
    }, { threshold: 0.1 });

    heroObserver.observe(heroSection);

    backToTopBtn.addEventListener('click', () => {
        heroSection.scrollIntoView({ behavior: 'smooth' });
    });
}
