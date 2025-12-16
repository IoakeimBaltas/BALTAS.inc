document.addEventListener("DOMContentLoaded", () => {
    console.log(">>> Ioakeim Baltas Portfolio Initialized.");

    // HERO FADE-IN
    const heroContent = document.querySelector('.hero-content');
    const heroImage = document.querySelector('.hero-image-container');
    setTimeout(() => {
        heroContent.classList.add('visible');
        heroImage.classList.add('visible');
    }, 100);

    // FADE IN OTHER SECTIONS WITH DELAY
    const fadeSections = document.querySelectorAll('.fade-in');
    fadeSections.forEach((section, index) => {
        setTimeout(() => {
            section.classList.add('visible');
        }, 300 + index * 150); // 300ms initial delay + 150ms per section
    });


    // NAV ACTIVE LINK
    const navLinks = document.querySelectorAll('.main-nav a');
    const sections = document.querySelectorAll('main section');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting){
                navLinks.forEach(link => link.classList.remove('active'));
                const id = entry.target.getAttribute('id');
                const activeLink = document.querySelector(`.main-nav a[href="#${id}"]`);
                if(activeLink) activeLink.classList.add('active');
            }
        });
    }, { root:null, rootMargin:'0px', threshold:0.4 });

    sections.forEach(section => observer.observe(section));

    // PROJECT CARD ANIMATION
    const projectCards = document.querySelectorAll('.project-card');
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting){
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold:0.2 });

    projectCards.forEach(card => {
        card.style.transform = 'translateY(30px)';
        card.style.opacity = 0;
        card.style.transition = 'all 0.6s ease-out';
        cardObserver.observe(card);
    });
});

// ================================
// HTB-STYLE INTERACTIVE GRID BACKGROUND
// ================================

const canvas = document.getElementById('htb-bg');
const ctx = canvas.getContext('2d');

let width = window.innerWidth;
let height = window.innerHeight;
canvas.width = width;
canvas.height = height;

let mouse = { x: null, y: null };

window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
});

document.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

const gridSize = 40;
const glowRadius = 180;

function drawGrid() {
    ctx.clearRect(0, 0, width, height);

    for (let x = 0; x < width; x += gridSize) {
        for (let y = 0; y < height; y += gridSize) {
            let alpha = 0.06; // base line transparency

            if (mouse.x !== null) {
                const dx = x - mouse.x;
                const dy = y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < glowRadius) {
                    alpha = 0.9 * (1 - dist / glowRadius); // glow fades with distance
                }
            }

            ctx.strokeStyle = `rgba(180, 30, 40, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.strokeRect(x, y, gridSize, gridSize);
        }
    }
}

function animate() {
    drawGrid();
    requestAnimationFrame(animate);
}

animate();
