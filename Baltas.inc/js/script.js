document.addEventListener("DOMContentLoaded", () => {
    // Developer Touch: A subtle message in the console
    console.log("-----------------------------------------");
    console.log(">>> Ioakeim Baltas Portfolio Initialized.");
    console.log(">>> Built with modern web standards.");
    console.log("-----------------------------------------");

    // --- Active Navigation Highlighting ---
    const navLinks = document.querySelectorAll('.main-nav a');
    const sections = document.querySelectorAll('main section');
    
    const options = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.4 // Highlight when 40% of the section is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Remove 'active' class from all links
                navLinks.forEach(link => link.classList.remove('active'));

                // Find the corresponding link and add 'active' class
                const id = entry.target.getAttribute('id');
                const activeLink = document.querySelector(`.main-nav a[href="#${id}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }, options);

    // Observe each portfolio section
    sections.forEach(section => {
        observer.observe(section);
    });
    
    // Optional: Add a subtle text effect or initial animation to the hero section
    // (This is simple and doesn't require complex typing logic)
    const heroH1 = document.querySelector('.hero-section h1');
    if (heroH1) {
        heroH1.style.opacity = 0;
        setTimeout(() => {
            heroH1.style.transition = 'opacity 1s ease-in';
            heroH1.style.opacity = 1;
        }, 100);
    }
    
});