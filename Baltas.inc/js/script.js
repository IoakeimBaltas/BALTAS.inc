document.addEventListener("DOMContentLoaded", () => {
    console.log(">>> Ioakeim Baltas Portfolio Initialized.");

    // HERO FADE-IN
    const heroContent = document.querySelector('.hero-content');
    const heroImage = document.querySelector('.hero-image-container');
    setTimeout(() => {
        heroContent.classList.add('visible');
        heroImage.classList.add('visible');
    }, 100);

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
