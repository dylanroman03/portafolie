document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (menuToggle && navMenu) {
        // Toggle menú móvil
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('hidden');
        });

        // Cierra el menú móvil al hacer click en una opción
        navMenu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth < 768) { // Solo en móvil
                    navMenu.classList.add('hidden');
                }
            });
        });

        // Forzar estado correcto al cambiar de tamaño
        window.addEventListener('resize', () => {
            if (window.innerWidth >= 768) {
                navMenu.classList.remove('hidden');
            } else {
                navMenu.classList.add('hidden');
            }
        });
    }

    // Scroll effect for navbar
    // document.addEventListener('scroll', () => {
    //     const navbar = document.getElementById('navbar');
    //     if (navbar) {
    //         if (window.scrollY > 50) {
    //             navbar.classList.add('scrolled');
    //         } else {
    //             navbar.classList.remove('scrolled');
    //         }
    //     }
    // });

    // Scroll reveal observer function
    function observeScrollReveal() {
        const revealElements = document.querySelectorAll('.scroll-reveal');
        const observer = new window.IntersectionObserver((entries) => {
            entries.forEach((entry, i) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('opacity-100', 'translate-y-0');
                    entry.target.classList.remove('opacity-0', 'translate-y-8');
                    entry.target.style.transitionDelay = `${i * 100}ms`;
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.18
        });

        revealElements.forEach(el => {
            observer.observe(el);
        });
    }

    // Initial call
    observeScrollReveal();

    // Re-observe after htmx swaps content (cards loaded)
    document.body.addEventListener('htmx:afterSwap', function (evt) {
        observeScrollReveal();
    });

    // Form submission feedback (if using contact form with id 'contact-form')
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
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

    // Delegación para abrir modal
    document.body.addEventListener('click', function (e) {
        if (e.target.closest('.card-action')) return;
        // Busca si hizo click en un card o dentro de un card
        let card = e.target.closest('.project-card');
        if (card) {
            const project = card.getAttribute('data-project');
            showProjectModal(project);
        }
    });

    // Botón cerrar
    document.getElementById('close-modal-btn').onclick = closeProjectModal;

    // Atajo para cerrar el modal con la tecla Escape
    document.addEventListener('keydown', function(e) {
        const overlay = document.getElementById('project-modal-overlay');
        if (!overlay.classList.contains('hidden') && (e.key === 'Escape' || e.key === 'Esc')) {
            closeProjectModal();
        }
    });

    // Cierra el modal clicando el fondo (overlay)
    document.getElementById('project-modal-overlay').onclick = function (e) {
        if (e.target === this) closeProjectModal();
    };
});

function showProjectModal(project) {
    const overlay = document.getElementById('project-modal-overlay');
    const modalContent = document.getElementById('modal-content');
    // Puedes usar fetch/htmx para cargar info detallada o ponerlo aquí
    fetch(`projects/details/${project}.html`)
        .then(res => res.text())
        .then(html => {
            modalContent.innerHTML = html;
            overlay.classList.remove('hidden');

            const galleryLength = {
                "adn_mobile": 6,
                "easy_resend": 1,
                "ciclope": 1,
            };

            const images = Array.from({length: galleryLength[project]}, (_, i) =>
                `assets/images/projects/${project}/${i+1}.png`
            );
            setupGallery(images);
        });
}

function closeProjectModal() {
    document.getElementById('project-modal-overlay').classList.add('hidden');
}

function setupGallery(images) {
    let current = 0;
    let intervalId = null;

    const imgEl = document.getElementById('main-gallery-image');
    const prevBtn = document.getElementById('gallery-prev');
    const nextBtn = document.getElementById('gallery-next');
    const indicators = document.getElementById('gallery-indicators');

    function render() {
        imgEl.src = images[current];
        indicators.innerHTML = images.map((_, i) =>
            `<button class="btn-no-animation w-2 h-2 rounded-full mx-1 ${i === current ? 'bg-[var(--color-primary)]' : 'bg-gray-300'}"></button>`
        ).join('');
    }

    function next() {
        current = (current + 1) % images.length;
        render();
    }

    function prev() {
        current = (current - 1 + images.length) % images.length;
        render();
    }

    function goto(i) {
        current = i;
        render();
    }

    nextBtn.onclick = () => { next(); restart(); };
    prevBtn.onclick = () => { prev(); restart(); };
    indicators.onclick = (e) => {
        if (e.target.tagName === 'BUTTON') {
            const idx = [...indicators.children].indexOf(e.target);
            goto(idx);
            restart();
        }
    };

    function autoplay() {
        intervalId = setInterval(next, 2700);
    }
    function restart() {
        clearInterval(intervalId);
        autoplay();
    }

    render();
    autoplay();
}
