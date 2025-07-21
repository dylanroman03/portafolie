document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });

        // Close menu when a link is clicked
        navMenu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
            });
        });
    }

    // Scroll effect for navbar
    document.addEventListener('scroll', () => {
        const navbar = document.getElementById('navbar');
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    });

    // Scroll reveal effect (Intersection Observer)
    const revealElements = document.querySelectorAll('.scroll-reveal');
    const observer = new window.IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('opacity-100', 'translate-y-0');
                entry.target.classList.remove('opacity-0', 'translate-y-8');
                // Optional: add delay based on index for staggered effect
                entry.target.style.transitionDelay = `${i * 100}ms`;
                observer.unobserve(entry.target); // Animate only once
            }
        });
    }, {
        threshold: 0.18 // Animate when 18% visible
    });

    revealElements.forEach(el => {
        observer.observe(el);
    });
});

// Form submission feedback (if using contact form with id 'contact-form')
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const form = this;
        const messageDiv = document.getElementById('form-message');

        fetch(form.action, {
            method: form.method,
            body: new FormData(form),
            headers: {
                'Accept': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    messageDiv.innerHTML = '<p style="color:green;">Message sent successfully!</p>';
                    form.reset();
                } else {
                    messageDiv.innerHTML = '<p style="color:red;">Failed to send message. Please try again.</p>';
                }
            })
            .catch(error => {
                messageDiv.innerHTML = '<p style="color:red;">An error occurred. Please try again later.</p>';
            });
    });
}