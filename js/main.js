document.addEventListener('DOMContentLoaded', () => {
  if (window.VeridIcons) {
    window.VeridIcons.initIcons();
  } else if (window.lucide) {
    window.lucide.createIcons({ attrs: { 'stroke-width': 1.8 } });
  }

  if (window.initNav) {
    window.initNav();
  }

  if (window.initDemo) {
    window.initDemo();
  }

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!reduceMotion && 'IntersectionObserver' in window) {
    const sections = document.querySelectorAll('main > section');

    /*
      Tag each composition's meaningful components so they stagger in together.
      Order follows document position, giving a top-to-bottom entrance. Images
      and cards are tagged "media" for a slightly stronger lift.
    */
    const REVEAL_SELECTOR = [
      '.eyebrow', 'h1', 'h2', 'h3', '.hero-text', '.hero-actions',
      '.intro-copy > p', '.intro-signals', '.panel-copy > p', '.proof-metrics',
      '.intro-copy', '.intro-visual', '.stage-card', '.outcome-item', '.value-card',
      '.industry-card', '.solutions-feature', '.mission-card', '.mission-quote',
      '.story-photo', '.story-copy', '.demo-copy', '.demo-panel', '.result-card',
      '.console-panel', '.dev-card', '.key-card', '.company-visual', '.company-copy',
      '.check-list', '.developer-photo-pair'
    ].join(',');

    sections.forEach((section) => {
      const items = Array.from(section.querySelectorAll(REVEAL_SELECTOR));
      items.forEach((el, i) => {
        if (el.hasAttribute('data-reveal')) return;
        const isMedia = el.matches('.industry-card, .intro-visual, .solutions-feature, .story-photo, .company-visual, .demo-panel, .console-panel, .result-card');
        el.setAttribute('data-reveal', isMedia ? 'media' : 'text');
        el.style.setProperty('--reveal-i', String(Math.min(i, 8)));
      });
    });

    const observer = new IntersectionObserver((entries, revealObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12 });

    sections.forEach((section) => {
      section.classList.add('scroll-reveal');
      observer.observe(section);
    });
  }

  /*
    Section-aware navigation colour.
    Each nav link owns an accent colour. As a section scrolls into view, the
    link pointing at it gets .is-current (keeping its colour lit); the class is
    removed from every other link, so only the on-screen section stays coloured.
  */
  function initNavSectionTracking() {
    const links = Array.from(document.querySelectorAll('.nav-link[data-menu]'));
    if (!links.length || !('IntersectionObserver' in window)) return;

    // Map each link to the section(s) it represents on this page.
    const targets = links
      .map((link) => {
        const menu = link.getAttribute('data-menu');
        const section = document.getElementById(menu);
        return section ? { link, section } : null;
      })
      .filter(Boolean);

    if (!targets.length) return;

    const visible = new Map(); // id -> ratio
    const setCurrent = () => {
      let bestId = null;
      let bestRatio = 0;
      visible.forEach((ratio, id) => {
        if (ratio > bestRatio) { bestRatio = ratio; bestId = id; }
      });
      targets.forEach(({ link, section }) => {
        link.classList.toggle('is-current', section.id === bestId);
      });
    };

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          visible.set(entry.target.id, entry.intersectionRatio);
        } else {
          visible.delete(entry.target.id);
        }
      });
      setCurrent();
    }, { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] });

    targets.forEach(({ section }) => io.observe(section));
  }

  initNavSectionTracking();
});
