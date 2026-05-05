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
  // Scroll reveal
  // =========================================
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05, rootMargin: '50px' });

  document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

  // Fallback: forzar elementos visibles que el observer haya omitido
  setTimeout(() => {
    document.querySelectorAll('.reveal:not(.visible)').forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight + 200) {
        el.classList.add('visible');
      }
    });
  }, 3000);


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
