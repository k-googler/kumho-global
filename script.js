/* ==========================================================================
   KUMHO GLOBAL — Interactions
   ========================================================================== */
(() => {
  'use strict';

  /* ---------- Loading state ---------- */
  document.body.classList.add('is-loading');
  window.addEventListener('load', () => {
    setTimeout(() => document.body.classList.remove('is-loading'), 100);
  });

  /* ---------- Custom cursor ---------- */
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursor-follower');
  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  if (cursor && follower && window.matchMedia('(pointer: fine)').matches) {
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    });

    const animate = () => {
      followerX += (mouseX - followerX) * 0.18;
      followerY += (mouseY - followerY) * 0.18;
      follower.style.transform = `translate(${followerX}px, ${followerY}px) translate(-50%, -50%)`;
      requestAnimationFrame(animate);
    };
    animate();

    const hoverables = document.querySelectorAll('a, button, .product, .cta');
    hoverables.forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });

    document.querySelectorAll('[data-cursor="view"]').forEach(el => {
      el.addEventListener('mouseenter', () => {
        document.body.classList.add('cursor-view');
        const lbl = document.createElement('span');
        lbl.textContent = 'VIEW';
        lbl.style.cssText = 'position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-size:11px;letter-spacing:.3em;color:#111;font-weight:500;';
        follower.appendChild(lbl);
        follower.dataset.label = 'yes';
      });
      el.addEventListener('mouseleave', () => {
        document.body.classList.remove('cursor-view');
        if (follower.dataset.label) {
          follower.innerHTML = '';
          delete follower.dataset.label;
        }
      });
    });
    document.querySelectorAll('[data-cursor="link"]').forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-link'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-link'));
    });
  }

  /* ---------- Nav scroll state ---------- */
  const nav = document.getElementById('nav');
  const progress = document.getElementById('nav-progress');
  const hero = document.querySelector('.hero');
  const onScroll = () => {
    const y = window.scrollY;
    nav.classList.toggle('is-scrolled', y > 60);
    const h = document.documentElement.scrollHeight - window.innerHeight;
    const pct = h > 0 ? (y / h) * 100 : 0;
    progress.style.width = `${Math.min(100, pct)}%`;
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Hero visibility: dark/light nav ---------- */
  if (hero && 'IntersectionObserver' in window) {
    const heroIO = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        // Hero가 50% 이상 보일 때 어두운 모드, 벗어나면 밝은 모드
        nav.classList.toggle('is-hero', e.intersectionRatio >= 0.5);
      });
    }, { threshold: [0, 0.5, 1] });
    heroIO.observe(hero);
  }

  /* ---------- Burger ---------- */
  const burger = document.getElementById('burger');
  burger?.addEventListener('click', () => nav.classList.toggle('is-open'));
  document.querySelectorAll('.nav__menu a').forEach(a =>
    a.addEventListener('click', () => nav.classList.remove('is-open'))
  );

  /* ---------- Hero slider ---------- */
  const slider = document.getElementById('hero-slider');
  if (slider) {
    const slides = [...slider.querySelectorAll('.hero__slide')];
    const dots   = [...document.querySelectorAll('#hero-dots button')];
    const prev   = document.getElementById('hero-prev');
    const next   = document.getElementById('hero-next');
    let idx = 0;
    let timer;

    const go = (n) => {
      idx = (n + slides.length) % slides.length;
      slides.forEach((s, i) => {
        s.classList.toggle('is-active', i === idx);
        const media = s.querySelector('.hero__media img');
        if (media) {
          // restart ken burns by re-applying animation
          media.style.animation = 'none';
          media.offsetHeight; // reflow
          media.style.animation = '';
        }
      });
      dots.forEach((d, i) => d.classList.toggle('is-active', i === idx));
      restart();
    };
    const restart = () => {
      clearInterval(timer);
      timer = setInterval(() => go(idx + 1), 7000);
    };
    prev?.addEventListener('click', () => go(idx - 1));
    next?.addEventListener('click', () => go(idx + 1));
    dots.forEach(d => d.addEventListener('click', () => go(parseInt(d.dataset.go, 10))));

    // pause on hover
    slider.addEventListener('mouseenter', () => clearInterval(timer));
    slider.addEventListener('mouseleave', restart);

    // keyboard
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') go(idx + 1);
      if (e.key === 'ArrowLeft')  go(idx - 1);
    });

    restart();
  }

  /* ---------- IntersectionObserver: fade-in ---------- */
  const fadeEls = document.querySelectorAll('[data-fade]');
  const fadeIO = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('is-in');
        fadeIO.unobserve(e.target);
      }
    });
  }, { threshold: 0.18, rootMargin: '0px 0px -40px 0px' });
  fadeEls.forEach(el => fadeIO.observe(el));

  /* ---------- Stat counter ---------- */
  const counters = document.querySelectorAll('[data-count]');
  const countIO = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseInt(el.dataset.count, 10);
      const dur = 1600;
      const t0 = performance.now();
      const step = (t) => {
        const k = Math.min(1, (t - t0) / dur);
        const eased = 1 - Math.pow(1 - k, 3);
        el.textContent = Math.round(target * eased).toLocaleString();
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      countIO.unobserve(el);
    });
  }, { threshold: 0.6 });
  counters.forEach(c => countIO.observe(c));

  /* ---------- Smooth anchor scroll ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  /* ---------- Reveal on load for hero ---------- */
  window.addEventListener('load', () => {
    document.querySelectorAll('.hero__slide.is-active [data-fade]').forEach(el => {
      el.classList.add('is-in');
    });
  });

  /* ---------- Network: draw-in on view ---------- */
  const netWrap = document.querySelector('.network__map-wrap');
  if (netWrap && 'IntersectionObserver' in window) {
    netWrap.querySelectorAll('.network__line').forEach(p => {
      const len = p.getTotalLength();
      p.style.strokeDasharray = `${len}`;
      p.style.strokeDashoffset = `${len}`;
      p.style.transition = 'stroke-dashoffset 1.6s var(--ease-out, cubic-bezier(0.16,1,0.3,1))';
      p.style.animation = 'none';
    });
    // Use opacity-only fade-in to avoid clobbering SVG `transform="translate(...)"`
    netWrap.querySelectorAll('.network__node').forEach(n => {
      n.style.opacity = '0';
      n.style.transition = 'opacity .8s var(--ease-out, ease)';
    });
    const netIO = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const lines = e.target.querySelectorAll('.network__line');
        lines.forEach((l, i) => {
          setTimeout(() => {
            l.style.strokeDashoffset = '0';
            // resume CSS dashflow animation after draw-in
            l.style.strokeDasharray = '6 6';
            l.style.strokeDashoffset = '0';
            l.style.animation = '';
          }, 200 + i * 140);
        });
        const nodes = e.target.querySelectorAll('.network__node');
        nodes.forEach((n, i) => {
          setTimeout(() => { n.style.opacity = '1'; }, 800 + i * 120);
        });
        netIO.unobserve(e.target);
      });
    }, { threshold: 0.25 });
    netIO.observe(netWrap);
  }
})();
