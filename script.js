document.addEventListener('DOMContentLoaded', () => {

  // =========================================
  // Nav — transparent → solid on scroll
  // =========================================
  const navbar = document.getElementById('navbar');

  const updateNav = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  };

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();


  // =========================================
  // Mobile menu
  // =========================================
  const hamburger   = document.querySelector('.hamburger');
  const mobileMenu  = document.getElementById('mobileMenu');
  const mobileClose = document.querySelector('.mobile-close');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  const overlay = document.createElement('div');
  overlay.className = 'mobile-overlay';
  document.body.appendChild(overlay);

  const openMenu = () => {
    mobileMenu.classList.add('open');
    overlay.classList.add('active');
    hamburger.classList.add('active');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  const closeMenu = () => {
    mobileMenu.classList.remove('open');
    overlay.classList.remove('active');
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  hamburger.addEventListener('click', () =>
    mobileMenu.classList.contains('open') ? closeMenu() : openMenu()
  );

  mobileClose.addEventListener('click', closeMenu);
  overlay.addEventListener('click', closeMenu);
  mobileLinks.forEach(l => l.addEventListener('click', closeMenu));

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) closeMenu();
  });


  // =========================================
  // Scroll reveal (.reveal + .reveal-left)
  // =========================================
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.02, rootMargin: '0px 0px 0px 0px' });

  document.querySelectorAll('.reveal, .reveal-left').forEach(el => revealObs.observe(el));

  // Fallback: forzar visibles si el observer no los activó
  setTimeout(() => {
    document.querySelectorAll('.reveal:not(.visible), .reveal-left:not(.visible)').forEach(el => {
      el.classList.add('visible');
    });
  }, 4000);


  // =========================================
  // Parallax en imágenes de fondo (desktop)
  // =========================================
  const parallaxImages = Array.from(document.querySelectorAll('.bg-image[data-parallax]'));

  if (parallaxImages.length) {
    const runParallax = () => {
      if (window.innerWidth < 769) return;
      parallaxImages.forEach(img => {
        const section = img.closest('section');
        const rect = section.getBoundingClientRect();
        const vh = window.innerHeight;
        if (rect.bottom < 0 || rect.top > vh) return;
        const progress = (vh - rect.top) / (vh + rect.height);
        const offset = (progress - 0.5) * 60;
        img.style.transform = `translateY(${offset}px)`;
      });
    };

    window.addEventListener('scroll', runParallax, { passive: true });
    runParallax();
  }


  // =========================================
  // Stats count-up
  // =========================================
  const ease = t => 1 - Math.pow(1 - t, 3);

  const animateNum = el => {
    const target   = +el.dataset.target;
    const prefix   = el.dataset.prefix || '';
    const suffix   = el.dataset.suffix || '';
    const duration = 1500;
    const start    = performance.now();

    const tick = now => {
      const p = Math.min((now - start) / duration, 1);
      el.textContent = prefix + Math.round(ease(p) * target) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  const statsObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('[data-target]').forEach(animateNum);
        statsObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  const statsSection = document.getElementById('stats');
  if (statsSection) statsObs.observe(statsSection);


  // =========================================
  // Contact form (Formspree async)
  // =========================================
  const form      = document.getElementById('contactForm');
  const feedback  = document.getElementById('formFeedback');
  const submitBtn = document.getElementById('submitBtn');

  if (form) {
    form.addEventListener('submit', async e => {
      e.preventDefault();

      const originalHTML = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Enviando…';
      feedback.textContent = '';
      feedback.className = 'form-feedback';

      try {
        const res = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' }
        });

        if (res.ok) {
          feedback.textContent = '¡Mensaje enviado! Te contactaremos a la brevedad.';
          feedback.classList.add('success');
          form.reset();
        } else {
          throw new Error();
        }
      } catch {
        feedback.textContent = 'Hubo un error. Escribinos a gerencia@gsadvisory.com.ar';
        feedback.classList.add('error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalHTML;
      }
    });
  }

});
