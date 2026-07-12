'use strict';

/* ==========================================================================
   RZFARM — Main Script (Vanilla JS)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- 1. LOADING SCREEN ---------- */
  const loader = document.querySelector('.loader');
  window.addEventListener('load', () => {
    setTimeout(() => loader && loader.classList.add('is-hidden'), 500);
  });

  /* ---------- 2. SCROLL PROGRESS BAR ---------- */
  const progressBar = document.querySelector('.scroll-progress');
  const backToTop = document.querySelector('.back-to-top');
  const updateProgress = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (progressBar) progressBar.style.width = progress + '%';
  };

  /* ---------- 3. STICKY NAVBAR + ACTIVE LINK ---------- */
  const navbar = document.querySelector('.navbar');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.navbar__link');

  const handleScrollEffects = () => {
    if (window.scrollY > 40) {
      navbar.classList.add('is-scrolled');
    } else {
      navbar.classList.remove('is-scrolled');
    }

    let currentSection = '';
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 140;
      if (window.scrollY >= sectionTop) {
        currentSection = section.getAttribute('id');
      }
    });
    navLinks.forEach((link) => {
      link.classList.toggle('is-active', link.getAttribute('href') === `#${currentSection}`);
    });

    updateProgress();
    toggleBackToTop();
  };

  window.addEventListener('scroll', handleScrollEffects, { passive: true });
  handleScrollEffects();

  /* ---------- 4. MOBILE MENU ---------- */
  const burger = document.querySelector('.navbar__burger');
  const menu = document.querySelector('.navbar__menu');

  if (burger && menu) {
    burger.addEventListener('click', () => {
      burger.classList.toggle('is-active');
      menu.classList.toggle('is-open');
    });

    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        burger.classList.remove('is-active');
        menu.classList.remove('is-open');
      });
    });
  }

  /* ---------- 5. SMOOTH SCROLL ---------- */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId.length <= 1) return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const offset = 90;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ---------- 6. INTERSECTION OBSERVER — SCROLL REVEAL ---------- */
  const revealEls = document.querySelectorAll('[data-reveal]');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => entry.target.classList.add('is-visible'), delay);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach((el) => revealObserver.observe(el));

  /* ---------- 7. COUNTER ANIMATION ---------- */
  const counters = document.querySelectorAll('[data-counter]');
  const animateCounter = (el) => {
    const target = parseFloat(el.dataset.counter);
    const decimals = el.dataset.counter.includes('.') ? 1 : 0;
    const duration = 1800;
    let startTime = null;

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = target * eased;
      el.textContent = decimals ? value.toFixed(1) : Math.floor(value).toLocaleString('id-ID');
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = decimals ? target.toFixed(1) : target.toLocaleString('id-ID');
      }
    };
    requestAnimationFrame(step);
  };

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });
  counters.forEach((c) => counterObserver.observe(c));

  /* ---------- 8. PRODUCT TABS FILTER ---------- */
  const tabs = document.querySelectorAll('.products__tab');
  const productCards = document.querySelectorAll('.product-card');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.remove('is-active'));
      tab.classList.add('is-active');
      const filter = tab.dataset.filter;

      productCards.forEach((card) => {
        const match = filter === 'semua' || card.dataset.category === filter;
        card.style.display = match ? '' : 'none';
      });
    });
  });

  /* ---------- 9. GALLERY LIGHTBOX ---------- */
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.querySelector('.lightbox');
  const lightboxContent = document.querySelector('.lightbox__content .lightbox__media');
  const lightboxCaption = document.querySelector('.lightbox__caption');
  const lightboxClose = document.querySelector('.lightbox__close');
  const lightboxPrev = document.querySelector('.lightbox__prev');
  const lightboxNext = document.querySelector('.lightbox__next');
  let currentIndex = 0;

  const openLightbox = (index) => {
    currentIndex = index;
    const item = galleryItems[index];
    const media = item.querySelector('svg, img');
    if (media) {
      lightboxContent.innerHTML = media.outerHTML;
    }
    lightboxCaption.textContent = item.dataset.caption || '';
    lightbox.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    lightbox.classList.remove('is-open');
    document.body.style.overflow = '';
  };

  galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => openLightbox(index));
  });
  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
  lightboxNext.addEventListener('click', () => openLightbox((currentIndex + 1) % galleryItems.length));
  lightboxPrev.addEventListener('click', () => openLightbox((currentIndex - 1 + galleryItems.length) % galleryItems.length));
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') openLightbox((currentIndex + 1) % galleryItems.length);
    if (e.key === 'ArrowLeft') openLightbox((currentIndex - 1 + galleryItems.length) % galleryItems.length);
  });

  /* ---------- 10. LAZY LOADING (native + fade-in) ---------- */
  document.querySelectorAll('img[loading="lazy"]').forEach((img) => {
    img.addEventListener('load', () => img.classList.add('is-loaded'));
  });

  /* ---------- 11. AUTO TESTIMONIAL SLIDER ---------- */
  const track = document.querySelector('.testimonials__track');
  const testimonialCards = document.querySelectorAll('.testimonial-card');
  const dotsWrap = document.querySelector('.testimonials__dots');
  let testiIndex = 0;
  let testiTimer;

  if (track && testimonialCards.length) {
    testimonialCards.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.classList.add('testimonials__dot');
      dot.setAttribute('aria-label', `Testimoni ${i + 1}`);
      if (i === 0) dot.classList.add('is-active');
      dot.addEventListener('click', () => goToTesti(i));
      dotsWrap.appendChild(dot);
    });

    const dots = document.querySelectorAll('.testimonials__dot');

    function goToTesti(i) {
      testiIndex = i;
      track.style.transform = `translateX(-${i * 100}%)`;
      dots.forEach((d, idx) => d.classList.toggle('is-active', idx === i));
      resetTimer();
    }

    function nextTesti() {
      goToTesti((testiIndex + 1) % testimonialCards.length);
    }

    function resetTimer() {
      clearInterval(testiTimer);
      testiTimer = setInterval(nextTesti, 5000);
    }
    resetTimer();
  }

  /* ---------- 12. ACCORDION FAQ ---------- */
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach((item) => {
    const question = item.querySelector('.faq-item__question');
    const answer = item.querySelector('.faq-item__answer');

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');
      faqItems.forEach((other) => {
        other.classList.remove('is-open');
        other.querySelector('.faq-item__answer').style.maxHeight = null;
        other.querySelector('.faq-item__question').setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('is-open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ---------- 13. BACK TO TOP ---------- */
  function toggleBackToTop() {
    if (!backToTop) return;
    backToTop.classList.toggle('is-visible', window.scrollY > 500);
  }
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ---------- 14. TYPING EFFECT (hero eyebrow) ---------- */
  const typingEl = document.querySelector('[data-typing]');
  if (typingEl) {
    const words = JSON.parse(typingEl.dataset.typing);
    let wordIndex = 0, charIndex = 0, deleting = false;

    const type = () => {
      const current = words[wordIndex];
      if (!deleting) {
        charIndex++;
        typingEl.textContent = current.slice(0, charIndex);
        if (charIndex === current.length) {
          deleting = true;
          setTimeout(type, 1500);
          return;
        }
      } else {
        charIndex--;
        typingEl.textContent = current.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          wordIndex = (wordIndex + 1) % words.length;
        }
      }
      setTimeout(type, deleting ? 40 : 80);
    };
    type();
  }

  /* ---------- 15. HERO PARALLAX ---------- */
  const heroGlow = document.querySelector('.hero__glow');
  const heroHills = document.querySelector('.hero__hills');
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    if (scrolled < window.innerHeight) {
      if (heroGlow) heroGlow.style.transform = `translateY(${scrolled * 0.25}px)`;
      if (heroHills) heroHills.style.transform = `translateY(${scrolled * 0.15}px)`;
    }
  }, { passive: true });

  /* Mouse glow follow (subtle) */
  const hero = document.querySelector('.hero');
  if (hero) {
    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 20;
      if (heroGlow) heroGlow.style.marginLeft = `${x}px`;
      if (heroGlow) heroGlow.style.marginTop = `${y}px`;
    });
  }

  /* ---------- 16. HERO PARTICLES ---------- */
  const particlesWrap = document.querySelector('.hero__particles');
  if (particlesWrap) {
    for (let i = 0; i < 18; i++) {
      const p = document.createElement('span');
      p.style.left = Math.random() * 100 + '%';
      p.style.animationDuration = 6 + Math.random() * 10 + 's';
      p.style.animationDelay = Math.random() * 8 + 's';
      particlesWrap.appendChild(p);
    }
  }

  /* ---------- 17. RIPPLE BUTTON EFFECT ---------- */
  document.querySelectorAll('.btn').forEach((btn) => {
    btn.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.classList.add('ripple');
      ripple.style.left = (e.clientX - rect.left) + 'px';
      ripple.style.top = (e.clientY - rect.top) + 'px';
      ripple.style.width = ripple.style.height = Math.max(rect.width, rect.height) + 'px';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 650);
    });
  });

});