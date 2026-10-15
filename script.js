/* ============================================
   PORTFOLIO — Main JavaScript
   Interactions, animations & typing effect
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ── Cache DOM elements ──────────────────────
  const header    = document.getElementById('header');
  const burgerBtn = document.getElementById('burger-btn');
  const mobileMenu= document.getElementById('mobile-menu');
  const codeBlock = document.getElementById('code-block');
  const form      = document.getElementById('contact-form');
  const yearEl    = document.getElementById('footer-year');

  // ── Footer year ─────────────────────────────
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // ============================================
  // HEADER — Scroll-based glass effect
  // ============================================
  let lastScroll = 0;

  function onScroll() {
    const scrollY = window.scrollY;

    // Add glass background after 50px scroll
    header.classList.toggle('header--scrolled', scrollY > 50);

    lastScroll = scrollY;
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // Initial check

  // ============================================
  // ACTIVE NAV LINK — Highlight based on scroll
  // ============================================
  const sections = document.querySelectorAll('.section[id]');
  const navLinks = document.querySelectorAll('[data-nav]');

  function updateActiveNav() {
    const scrollY = window.scrollY + 200;

    sections.forEach(section => {
      const top    = section.offsetTop;
      const height = section.offsetHeight;
      const id     = section.getAttribute('id');

      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach(link => {
          link.classList.toggle(
            'header__link--active',
            link.getAttribute('href') === `#${id}`
          );
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });

  // ============================================
  // MOBILE MENU — Toggle
  // ============================================
  function toggleMobileMenu() {
    const isOpen = mobileMenu.classList.toggle('mobile-menu--open');
    burgerBtn.classList.toggle('header__burger--active', isOpen);
    burgerBtn.setAttribute('aria-expanded', isOpen);
    mobileMenu.setAttribute('aria-hidden', !isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  burgerBtn.addEventListener('click', toggleMobileMenu);

  // Close on link click
  document.querySelectorAll('[data-mobile-nav]').forEach(link => {
    link.addEventListener('click', () => {
      if (mobileMenu.classList.contains('mobile-menu--open')) {
        toggleMobileMenu();
      }
    });
  });

  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('mobile-menu--open')) {
      toggleMobileMenu();
    }
  });

  // ============================================
  // TYPING ANIMATION — Code block in hero
  // ============================================
  const codeLines = [
    '<span class="kw">const</span> <span class="var">developer</span> <span class="op">=</span> <span class="op">{</span>',
    '  <span class="fn">name</span><span class="op">:</span> <span class="str">"Roman Skorokhod"</span><span class="op">,</span>',
    '  <span class="fn">role</span><span class="op">:</span> <span class="str">"Full-Stack Dev"</span><span class="op">,</span>',
    '  <span class="fn">skills</span><span class="op">:</span> <span class="op">[</span>',
    '    <span class="str">"React"</span><span class="op">,</span> <span class="str">"Next.js"</span><span class="op">,</span>',
    '    <span class="str">"Node.js"</span><span class="op">,</span> <span class="str">"TypeScript"</span>',
    '  <span class="op">],</span>',
    '  <span class="fn">passion</span><span class="op">:</span> <span class="str">"Clean code"</span><span class="op">,</span>',
    '  <span class="fn">available</span><span class="op">:</span> <span class="num">true</span>',
    '<span class="op">};</span>',
    '',
    '<span class="cm">// Ready for new projects! 🚀</span>',
  ];

  let currentLine = 0;

  function typeNextLine() {
    if (!codeBlock || currentLine >= codeLines.length) return;

    const lineEl = document.createElement('div');
    lineEl.innerHTML = codeLines[currentLine];
    lineEl.style.opacity = '0';
    lineEl.style.transform = 'translateX(-10px)';
    codeBlock.appendChild(lineEl);

    // Animate in
    requestAnimationFrame(() => {
      lineEl.style.transition = 'opacity .3s ease, transform .3s ease';
      lineEl.style.opacity = '1';
      lineEl.style.transform = 'translateX(0)';
    });

    currentLine++;

    // Schedule next line with increasing delay
    if (currentLine < codeLines.length) {
      setTimeout(typeNextLine, 100 + Math.random() * 120);
    } else {
      // Add blinking cursor at the end
      const cursor = document.createElement('span');
      cursor.className = 'cursor-blink';
      codeBlock.lastChild.appendChild(cursor);
    }
  }

  // Start typing when hero is visible
  const heroObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(typeNextLine, 600);
          heroObserver.disconnect();
        }
      });
    },
    { threshold: 0.3 }
  );

  if (codeBlock) {
    heroObserver.observe(codeBlock.closest('.hero__visual') || codeBlock);
  }

  // ============================================
  // SCROLL REVEAL — Intersection Observer
  // ============================================
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal--visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    }
  );

  revealElements.forEach(el => revealObserver.observe(el));

  // ============================================
  // CONTACT FORM — Basic handling
  // ============================================
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const submitBtn = form.querySelector('#form-submit');
      const originalText = submitBtn.innerHTML;

      // Show success state
      submitBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        Sent!
      `;
      submitBtn.style.background = '#28C840';
      submitBtn.style.boxShadow = '0 4px 20px rgba(40, 200, 64, .3)';
      submitBtn.disabled = true;

      // Reset after 3 seconds
      setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.style.background = '';
        submitBtn.style.boxShadow = '';
        submitBtn.disabled = false;
        form.reset();
      }, 3000);

      // 🔧 TODO: Hook up to your backend / email service
      // Example: fetch('/api/contact', { method: 'POST', body: new FormData(form) })
      console.log('Form submitted:', {
        name:    form.querySelector('#form-name').value,
        email:   form.querySelector('#form-email').value,
        message: form.querySelector('#form-message').value,
      });
    });
  }

  // ============================================
  // SMOOTH SCROLL — For Safari & older browsers
  // ============================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ============================================
  // PARALLAX-LIKE TILT — Project cards (desktop)
  // ============================================
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const cards = document.querySelectorAll('.project-card');

    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -3;
        const rotateY = ((x - centerX) / centerX) * 3;

        card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }
});
