(() => {
  'use strict';

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  
  const initAvatars = () => {
    $$('[data-initials]').forEach(el => {
      el.textContent = el.dataset.initials;
    });
  };

  
  const initReveal = () => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('is-visible'), i * 40);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    $$('.reveal').forEach(el => observer.observe(el));
  };

  
  const animateCounter = (el) => {
    const target = parseInt(el.dataset.target || el.closest('[data-counter]')?.dataset.counter || '0', 10);
    const duration = 1500;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target;
    };

    requestAnimationFrame(step);
  };

  const initCounters = () => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const counter = $('.counter', entry.target) || entry.target;
          if (!counter.dataset.animated) {
            counter.dataset.animated = 'true';
            animateCounter(counter);
          }
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    $$('[data-counter]').forEach(el => observer.observe(el));
  };

  /* ============ FILTER ============ */
  const initFilter = () => {
    const filterBar = $('[data-filter]');
    if (!filterBar) return;

    filterBar.addEventListener('click', (e) => {
      const btn = e.target.closest('.filter__btn');
      if (!btn) return;

      const filter = btn.dataset.filter;
      $$('.filter__btn', filterBar).forEach(b => b.classList.toggle('is-active', b === btn));

      $$('[data-albums] [data-era]').forEach(card => {
        const show = filter === 'all' || card.dataset.era === filter;
        card.style.display = show ? '' : 'none';
      });
    });
  };

  /* ============ CURSOR GLOW ============ */
  const initCursorGlow = () => {
    const glow = $('#cursorGlow');
    if (!glow || window.matchMedia('(max-width: 900px)').matches) return;

    let mouseX = 0, mouseY = 0;
    let glowX = 0, glowY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    const update = () => {
      glowX += (mouseX - glowX) * 0.12;
      glowY += (mouseY - glowY) * 0.12;
      glow.style.left = `${glowX}px`;
      glow.style.top = `${glowY}px`;
      requestAnimationFrame(update);
    };
    update();
  };

  /* ============ LIGHTBOX ============ */
  const lightbox = {
    el: null,
    img: null,
    title: null,
    desc: null,
    current: null,
    total: null,
    items: [],
    index: 0,

    init() {
      this.el = $('#lightbox');
      this.img = $('.lightbox__img', this.el);
      this.title = $('.lightbox__title', this.el);
      this.desc = $('.lightbox__desc', this.el);
      this.current = $('.lightbox__current', this.el);
      this.total = $('.lightbox__total', this.el);

      this.bindCards();
      this.bindControls();
      this.bindKeyboard();
    },

    bindCards() {
      $$('.card[data-gallery]').forEach((card, i) => {
        card.dataset.galleryIndex = i;
        card.addEventListener('click', (e) => {
          if (e.target.closest('.card__expand') || true) {
            this.open(parseInt(card.dataset.galleryIndex, 10));
          }
        });
      });
      this.items = $$('[data-gallery]');
      this.total.textContent = this.items.length;
    },

    bindControls() {
      $('.lightbox__close').addEventListener('click', () => this.close());
      $('.lightbox__backdrop').addEventListener('click', () => this.close());
      $('.lightbox__nav--prev').addEventListener('click', () => this.prev());
      $('.lightbox__nav--next').addEventListener('click', () => this.next());
    },

    bindKeyboard() {
      document.addEventListener('keydown', (e) => {
        if (!this.el.classList.contains('is-open')) return;
        if (e.key === 'Escape') this.close();
        if (e.key === 'ArrowLeft') this.prev();
        if (e.key === 'ArrowRight') this.next();
      });
    },

    open(index) {
      this.index = index;
      this.render();
      this.el.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    },

    close() {
      this.el.classList.remove('is-open');
      this.img.classList.remove('is-loaded');
      document.body.style.overflow = '';
    },

    prev() {
      this.index = (this.index - 1 + this.items.length) % this.items.length;
      this.render();
    },

    next() {
      this.index = (this.index + 1) % this.items.length;
      this.render();
    },

    render() {
      const item = this.items[this.index];
      const src = item.dataset.image;
      const title = item.dataset.title || '';
      const caption = item.dataset.caption || '';

      this.img.classList.remove('is-loaded');

      const temp = new Image();
      temp.onload = () => {
        this.img.src = src;
        requestAnimationFrame(() => this.img.classList.add('is-loaded'));
      };
      temp.src = src;

      this.title.textContent = title;
      this.desc.textContent = caption;
      this.current.textContent = this.index + 1;
    }
  };


  const init = () => {
    initAvatars();
    initReveal();
    initCounters();
    initFilter();
    initCursorGlow();
    lightbox.init();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
