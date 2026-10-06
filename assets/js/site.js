document.addEventListener('DOMContentLoaded', () => {
  // Mobile nav
  const toggle = document.querySelector('[data-nav-toggle]');
  const menu = document.querySelector('[data-mobile-menu]');
  if (toggle && menu) {
    const setMenu = (open) => {
      menu.classList.toggle('hidden', !open);
      menu.classList.toggle('flex', open);
      menu.style.display = open ? 'flex' : 'none';
      toggle.setAttribute('aria-expanded', String(open));
    };
    toggle.addEventListener('click', () => setMenu(menu.classList.contains('hidden')));
    menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));
  }

  // Scroll reveal
  const revealed = document.querySelectorAll('[data-reveal]');
  const show = (el) => el.classList.remove('opacity-0', 'translate-y-[18px]');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        show(entry.target);
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12 });
    revealed.forEach((el) => observer.observe(el));
  } else {
    revealed.forEach(show);
  }

  // What We Do horizontal tabs
  const tabRoot = document.querySelector('[data-tabs]');
  if (tabRoot) {
    const tabs = Array.from(tabRoot.querySelectorAll('[role="tab"]'));
    const panels = Array.from(tabRoot.querySelectorAll('[role="tabpanel"]'));
    const activate = (id) => {
      tabs.forEach((tab) => {
        const on = tab.getAttribute('aria-controls') === id;
        tab.classList.toggle('is-active', on);
        tab.setAttribute('aria-selected', String(on));
        tab.tabIndex = on ? 0 : -1;
      });
      panels.forEach((panel) => {
        const on = panel.id === id;
        panel.classList.toggle('is-active', on);
        panel.removeAttribute('hidden');
        panel.setAttribute('aria-hidden', String(!on));
        if (on) panel.removeAttribute('inert');
        else panel.setAttribute('inert', '');
      });
    };
    // Ensure equal-height stacking works even if markup still has [hidden]
    panels.forEach((panel) => panel.removeAttribute('hidden'));
    activate(tabs.find((t) => t.classList.contains('is-active'))?.getAttribute('aria-controls') || panels[0]?.id);
    tabs.forEach((tab) => {
      tab.addEventListener('click', () => activate(tab.getAttribute('aria-controls')));
      tab.addEventListener('keydown', (e) => {
        const i = tabs.indexOf(tab);
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          const next = tabs[(i + 1) % tabs.length];
          next.focus();
          activate(next.getAttribute('aria-controls'));
        }
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          const prev = tabs[(i - 1 + tabs.length) % tabs.length];
          prev.focus();
          activate(prev.getAttribute('aria-controls'));
        }
      });
    });
  }

  // Work filters
  const filterRoot = document.querySelector('[data-work-filters]');
  if (filterRoot) {
    const buttons = Array.from(filterRoot.querySelectorAll('[data-filter]'));
    const cards = Array.from(document.querySelectorAll('[data-project]'));
    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const key = btn.getAttribute('data-filter');
        buttons.forEach((b) => b.classList.toggle('is-active', b === btn));
        cards.forEach((card) => {
          const showCard = key === 'all' || card.getAttribute('data-vertical') === key;
          card.hidden = !showCard;
        });
      });
    });
  }

  // What We Do voice scroller (one tall card at a time)
  document.querySelectorAll('[data-voice-scroller]').forEach((root) => {
    const track = root.querySelector('[data-voice-track]');
    const slides = Array.from(root.querySelectorAll('.wwd-voice'));
    const prev = root.querySelector('[data-voice-prev]');
    const next = root.querySelector('[data-voice-next]');
    if (!track || slides.length === 0) return;

    let index = 0;
    const sync = () => {
      track.style.transform = `translateX(-${index * 100}%)`;
      if (prev) prev.disabled = index <= 0;
      if (next) next.disabled = index >= slides.length - 1;
    };
    prev?.addEventListener('click', () => {
      index = Math.max(0, index - 1);
      sync();
    });
    next?.addEventListener('click', () => {
      index = Math.min(slides.length - 1, index + 1);
      sync();
    });
    sync();
  });

  // Case study galleries (legacy single-row; still used if present)
  document.querySelectorAll('[data-gallery]').forEach((root) => {
    const track = root.querySelector('[data-gallery-track]');
    const slides = Array.from(root.querySelectorAll('.cs-slide'));
    const prev = root.querySelector('[data-gallery-prev]');
    const next = root.querySelector('[data-gallery-next]');
    if (!track || slides.length === 0) return;

    let index = 0;
    const visible = () => {
      const w = root.querySelector('.cs-gallery-viewport')?.clientWidth || 1;
      const slideW = slides[0].getBoundingClientRect().width || 1;
      const gap = 12;
      return Math.max(1, Math.round((w + gap) / (slideW + gap)));
    };
    const maxIndex = () => Math.max(0, slides.length - visible());
    const sync = () => {
      const slideW = slides[0].getBoundingClientRect().width;
      const gap = 12;
      track.style.transform = `translateX(-${index * (slideW + gap)}px)`;
      if (prev) prev.disabled = index <= 0;
      if (next) next.disabled = index >= maxIndex();
    };
    prev?.addEventListener('click', () => {
      index = Math.max(0, index - 1);
      sync();
    });
    next?.addEventListener('click', () => {
      index = Math.min(maxIndex(), index + 1);
      sync();
    });
    window.addEventListener('resize', () => {
      index = Math.min(index, maxIndex());
      sync();
    });
    requestAnimationFrame(sync);
  });

  // Shared infinite loop rail helper
  const initLoopRail = ({ root, trackSel, itemSel, prevSel, nextSel, gap = 6, stepSize = 1, interval = 3200 }) => {
    const track = root.querySelector(trackSel);
    const prev = root.querySelector(prevSel);
    const next = root.querySelector(nextSel);
    if (!track) return;
    const originals = Array.from(track.querySelectorAll(itemSel));
    if (originals.length === 0) return;
    if (originals.length < 3) return;
    // Only clone once
    if (!track.dataset.looped) {
      originals.forEach((el) => track.appendChild(el.cloneNode(true)));
      track.dataset.looped = '1';
    }
    let index = 0;
    let timer = null;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const step = () => {
      const el = track.children[0];
      return (el?.getBoundingClientRect().width || 80) + gap;
    };
    const len = originals.length;
    const sync = (animate = true) => {
      if (!animate) track.style.transition = 'none';
      track.style.transform = `translateX(-${index * step()}px)`;
      if (!animate) {
        void track.offsetWidth;
        track.style.transition = '';
      }
    };
    const go = (dir) => {
      if (dir < 0 && index === 0) {
        index = len;
        sync(false);
        requestAnimationFrame(() => {
          index = Math.max(0, len - stepSize);
          sync(true);
        });
        return;
      }
      index += dir * stepSize;
      sync(true);
      if (index >= len) {
        const onEnd = () => {
          track.removeEventListener('transitionend', onEnd);
          index = index % len;
          sync(false);
        };
        track.addEventListener('transitionend', onEnd);
      }
    };
    const start = () => {
      if (prefersReduced || timer) return;
      timer = window.setInterval(() => go(1), interval);
    };
    const stop = () => {
      if (!timer) return;
      window.clearInterval(timer);
      timer = null;
    };
    prev?.addEventListener('click', () => { stop(); go(-1); start(); });
    next?.addEventListener('click', () => { stop(); go(1); start(); });
    let touchX = null;
    root.addEventListener('touchstart', (e) => {
      touchX = e.changedTouches[0].clientX;
      stop();
    }, { passive: true });
    root.addEventListener('touchend', (e) => {
      if (touchX == null) return;
      const dx = e.changedTouches[0].clientX - touchX;
      touchX = null;
      if (Math.abs(dx) > 36) go(dx < 0 ? 1 : -1);
      start();
    }, { passive: true });
    root.addEventListener('mouseenter', stop);
    root.addEventListener('mouseleave', start);
    root.addEventListener('focusin', stop);
    root.addEventListener('focusout', start);
    window.addEventListener('resize', () => sync(false));
    requestAnimationFrame(() => { sync(false); start(); });
  };

  // Dual-row looping photo gallery (two stacked rows move together)
  document.querySelectorAll('[data-dual-gallery]').forEach((root) => {
    initLoopRail({
      root,
      trackSel: '[data-dual-track]',
      itemSel: '.cs-dual-col',
      prevSel: '[data-gallery-prev]',
      nextSel: '[data-gallery-next]',
      gap: 6,
      stepSize: 1,
      interval: 3000,
    });
  });

  // Posts / reels loop rails
  document.querySelectorAll('[data-loop-rail]').forEach((root) => {
    const item = root.getAttribute('data-loop-item') || '.cs-post';
    initLoopRail({
      root,
      trackSel: '[data-loop-track]',
      itemSel: item,
      prevSel: '[data-loop-prev]',
      nextSel: '[data-loop-next]',
      gap: 6,
      stepSize: 1,
      interval: Number(root.getAttribute('data-loop-interval') || 2800),
    });
  });

  // Speakers row with arrow controls (steps by ~2 cards, loops + autoplay)
  document.querySelectorAll('[data-speakers]').forEach((root) => {
    initLoopRail({
      root,
      trackSel: '[data-speakers-track]',
      itemSel: '.cs-speaker',
      prevSel: '[data-speakers-prev]',
      nextSel: '[data-speakers-next]',
      gap: 8,
      stepSize: 2,
      interval: 3600,
    });
  });

  // Related case studies: show 3, toggle Show more / Show less
  document.querySelectorAll('[data-related]').forEach((root) => {
    const items = Array.from(root.querySelectorAll('[data-related-item]'));
    const btn = root.querySelector('[data-related-more]');
    if (!items.length || !btn) return;
    const INITIAL = 3;
    let expanded = false;
    const render = () => {
      const shown = expanded ? items.length : Math.min(INITIAL, items.length);
      items.forEach((item, i) => {
        item.hidden = i >= shown;
      });
      if (items.length <= INITIAL) {
        btn.hidden = true;
        return;
      }
      btn.hidden = false;
      btn.textContent = expanded ? 'Show less ←' : 'Show more →';
      btn.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    };
    btn.addEventListener('click', () => {
      expanded = !expanded;
      render();
    });
    render();
  });

  const lightbox = document.querySelector('[data-lightbox]');
  if (lightbox) {
    const img = lightbox.querySelector('[data-lightbox-img]');
    const cap = lightbox.querySelector('[data-lightbox-cap]');
    const close = () => lightbox.close();
    document.querySelectorAll('[data-lightbox-open]').forEach((fig) => {
      fig.addEventListener('click', () => {
        const photo = fig.querySelector('img');
        if (!photo) return;
        img.src = photo.currentSrc || photo.src;
        img.alt = photo.alt || '';
        cap.textContent = fig.querySelector('figcaption')?.textContent || '';
        lightbox.showModal();
      });
    });
    lightbox.querySelector('[data-lightbox-close]')?.addEventListener('click', close);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) close();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.open) close();
    });
  }
});
