document.addEventListener("DOMContentLoaded", () => {
    console.log("Baltas.inc Portal Initialized");

    // Remove loader animation
    setTimeout(() => {
        document.querySelector('.loader').style.opacity = '0';
        setTimeout(() => document.querySelector('.loader').remove(), 500);
    }, 2000);

    // Get DOM elements
    const welcome = document.querySelector(".welcome-window");
    const welcomeText = welcome.querySelector("h2");
    const grid = document.querySelector(".gateway-grid");

    // Typing animation function
    const typeText = (element, text, speed, callback) => {
        let i = 0;
        element.innerHTML = ''; // Clear existing content
        
        const typingInterval = setInterval(() => {
            if (i < text.length) {
                element.innerHTML = text.substring(0, i+1) + 
                                 `<span class="typing-cursor"></span>`;
                i++;
            } else {
                clearInterval(typingInterval);
                element.innerHTML = text; // Remove cursor when done
                if (callback) callback();
            }
        }, speed);
    };

    // Animation sequence controller
    const runAnimations = async () => {
        // First typing animation ("Welcome back, sir")
        await new Promise(resolve => {
            typeText(welcomeText, "Welcome back, sir", 100, resolve);
        });

        // Pause before moving up
        await new Promise(resolve => setTimeout(resolve, 1000));
        welcome.classList.add("pin-to-top");

        // Second typing animation ("What's today's poison?")
        await new Promise(resolve => {
            welcomeText.innerHTML = ''; // Clear previous text
            typeText(welcomeText, "What's today's poison?", 100, resolve);
        });

        // Show grid after typing completes
        await new Promise(resolve => setTimeout(resolve, 500));
        grid.classList.remove("hidden");
        grid.style.animation = "gridFadeIn 1s ease forwards";
        
        // Initialize box interactions
        initGatewayInteractivity();
    };

    // Initialize gateway boxes with images and clickable URLs
    const initGatewayInteractivity = () => {
        const boxes = document.querySelectorAll('.gateway-box');
        
        boxes.forEach((box, index) => {
            // Staggered appearance animation
            box.style.animation = `boxFadeIn 0.5s ease forwards ${index * 0.1}s`;
            
            // Enhanced hover effects
            box.addEventListener('mouseenter', () => {
                box.style.transform = 'translateY(-8px)';
                box.style.boxShadow = '0 10px 20px rgba(217, 166, 83, 0.3)';
                box.querySelector('.box-highlight').style.opacity = '1';
                
                // Image hover effect
                const img = box.querySelector('img');
                if (img) img.style.transform = 'scale(1.1)';
            });
            
            box.addEventListener('mouseleave', () => {
                box.style.transform = 'translateY(0)';
                box.style.boxShadow = 'none';
                box.querySelector('.box-highlight').style.opacity = '0';
                
                // Reset image effect
                const img = box.querySelector('img');
                if (img) img.style.transform = 'scale(1)';
            });
            
            // Click handler for URL navigation
            box.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Get URL from data attribute
                const url = box.getAttribute('data-url');
                if (!url) return;
                
                // Click animation
                box.style.animation = 'boxPress 0.3s ease';
                
                // Navigate after animation completes
                setTimeout(() => {
                    window.location.href = url;
                }, 300);
            });
            
            // Make boxes keyboard accessible
            box.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    box.click();
                }
            });
            
            // Set tabindex for keyboard navigation
            box.setAttribute('tabindex', '0');
        });
    };

    // Handle window resize
    const handleResize = () => {
        // Re-center elements on resize
        if (welcome.classList.contains('pin-to-top')) {
            welcome.style.left = '50%';
        }
        grid.style.left = '50%';
    };
    window.addEventListener('resize', handleResize);

    // Start animation sequence
    runAnimations();
});