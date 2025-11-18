
    // Floating particles animation
        function createParticles() {
            const particlesContainer = document.querySelector('.particles');
            const particleCount = 50;

            for (let i = 0; i < particleCount; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.left = Math.random() * 100 + '%';
                particle.style.animationDelay = Math.random() * 6 + 's';
                particle.style.animationDuration = (Math.random() * 3 + 3) + 's';
                particlesContainer.appendChild(particle);
            }
        }

        // Scroll animations
        function handleScrollAnimations() {
            const elements = document.querySelectorAll('.fade-in-up');
            
            elements.forEach(element => {
                const elementTop = element.getBoundingClientRect().top;
                const elementVisible = 150;
                
                if (elementTop < window.innerHeight - elementVisible) {
                    element.classList.add('visible');
                }
            });

            
        }
        let lastScrollY = window.scrollY;
  const navbar = document.querySelector('nav');

  window.addEventListener('scroll', () => {
    if (window.scrollY > lastScrollY && window.scrollY > 80) {
      // Scrolling down → hide navbar
      navbar.classList.add('hide');
    } else {
      // Scrolling up → show navbar
      navbar.classList.remove('hide');
    }
    lastScrollY = window.scrollY;
  });

        // Smooth scrolling for navigation
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

        window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    if (loader) {
        loader.style.opacity = '0';
        loader.style.pointerEvents = 'none';
        setTimeout(() => loader.remove(), 500); // Optional: remove from DOM
    }
});



       window.addEventListener('scroll', () => {
    handleScrollAnimations();
});

        // Initialize
        document.addEventListener('DOMContentLoaded', () => {
            createParticles();
            handleScrollAnimations();
        });

        // Add some interactive hover effects
        document.querySelectorAll('.feature-card, .team-card').forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-10px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });

window.addEventListener('scroll', function () {
        const nav = document.querySelector('nav');
        if (window.scrollY > 10) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

  window.addEventListener('load', () => {
    const bar = document.querySelector('.progress-bar');
    bar.style.width = '100%';

    setTimeout(() => {
      document.getElementById('preloader').style.opacity = '0';
      setTimeout(() => {
        document.getElementById('preloader').remove();
      }, 600);
    }, 2200); // Wait for bar to fill
  });

    const form = document.getElementById('contactForm');
  const note = document.getElementById('contactNote');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    const webhookURL = "https://discord.com/api/webhooks/1436297264342761604/SVxJwSqk5VlldhRU-KOL3c8zC5c1Vou2A-ryuho_Cdf1pWMELVFRrum1lAfQUnN8iJ2Q" ; // <-- paste your Discord webhook URL here

    if (!name || !email || !message) {
      note.textContent = "⚠️ Please fill in all fields.";
      note.style.color = "#ff7b7b";
      return;
    }

    note.textContent = "⏳ Sending your message...";
    note.style.color = "#bbb";

    const payload = {
      content: `📩 **New Message**\n**Name:** ${name}\n**Email:** ${email}\n**Message:** ${message}`
    };

    try {
      const res = await fetch(webhookURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        note.textContent = "✅ Message sent successfully! We'll get back to you soon.";
        note.style.color = "#9cff9c";
        form.reset();
      } else {
        note.textContent = "❌ Failed to send message. Please try again later.";
        note.style.color = "#ff7b7b";
      }
    } catch (err) {
      console.error(err);
      note.textContent = "⚠️ Error sending message. Check your connection.";
      note.style.color = "#ff7b7b";
    }
  });

const navToggle = document.getElementById("navToggle");
const navLinks = document.querySelector(".nav-links");

navToggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
});

