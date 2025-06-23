document.addEventListener("DOMContentLoaded", () => {
  console.log("Baltas.inc Portal Initialized");

  // Remove loader when page loads
  setTimeout(() => {
    document.querySelector('.loader').style.opacity = '0';
    setTimeout(() => {
      document.querySelector('.loader').remove();
    }, 500);
  }, 2000);

  // Animation elements
  const welcome = document.querySelector(".welcome-window");
  const welcomeText = welcome.querySelector("h2");
  const grid = document.querySelector(".gateway-grid");

  // Enhanced typing effect with cursor
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

    // Wait 1 second, then move welcome window up
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

  // Initialize gateway box interactions
  const initGatewayInteractivity = () => {
    const boxes = document.querySelectorAll('.gateway-box');
    
    boxes.forEach((box, index) => {
      // Staggered fade-in for each box
      box.style.animation = `boxFadeIn 0.5s ease forwards ${index * 0.1}s`;
      
      // Enhanced hover effects
      box.addEventListener('mouseenter', () => {
        box.style.transform = 'translateY(-8px)';
        box.style.boxShadow = '0 10px 20px rgba(217, 166, 83, 0.3)';
        box.querySelector('.box-highlight').style.opacity = '1';
      });
      
      box.addEventListener('mouseleave', () => {
        box.style.transform = 'translateY(0)';
        box.style.boxShadow = 'none';
        box.querySelector('.box-highlight').style.opacity = '0';
      });
      
      // Click effect
      box.addEventListener('click', () => {
        box.style.animation = 'boxPress 0.3s ease';
        const target = box.getAttribute('data-target');
        console.log(`Launching ${target}...`);
        // Add your actual navigation logic here
      });
    });
  };

  // Start animation sequence
  runAnimations();

  // Handle window resize
  window.addEventListener('resize', () => {
    // Re-center elements on resize
    if (welcome.classList.contains('pin-to-top')) {
      welcome.style.left = '50%';
    }
    grid.style.left = '50%';
  });
});
