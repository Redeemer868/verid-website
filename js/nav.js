(function () {
  function initNav() {
    const nav = document.querySelector('.site-nav');
    if (!nav || nav.dataset.navReady === 'true') return;

    nav.dataset.navReady = 'true';

    const trigger = nav.querySelector('.nav-toggle');
    const panel = nav.querySelector('#mobile-nav');
    const panelLinks = () => {
      if (!panel) return [];
      return Array.from(panel.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])'));
    };

    const setMenuState = (open, restoreFocus = true) => {
      if (!panel || !trigger) return;

      panel.hidden = !open;
      nav.classList.toggle('open', open);
      trigger.setAttribute('aria-expanded', String(open));
      trigger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');

      if (trigger) {
        /*
          Rebuild only the icon node, not the button's innerHTML, so the tap
          target is never destroyed mid-gesture (fixes "hamburger works once").
        */
        const prevIcon = trigger.querySelector('.icon');
        const nextIcon = document.createElement('i');
        nextIcon.className = 'icon';
        nextIcon.setAttribute('data-lucide', open ? 'x' : 'menu');
        nextIcon.setAttribute('aria-hidden', 'true');
        if (prevIcon) {
          prevIcon.replaceWith(nextIcon);
        } else {
          trigger.appendChild(nextIcon);
        }
        if (window.VeridIcons) {
          window.VeridIcons.initIcons();
        } else if (window.lucide) {
          window.lucide.createIcons({ attrs: { 'stroke-width': 1.8 } });
        }
      }

      if (open) {
        const firstFocusable = panelLinks()[0];
        if (firstFocusable) {
          firstFocusable.focus();
        }
      } else if (trigger && restoreFocus) {
        trigger.focus();
      }
    };

    if (trigger && panel) {
      /*
        Toggle on click. The button is the only element receiving pointer
        events (the icon is pointer-events:none), so the tap target is the full
        44x44 button at all times. requestAnimationFrame is not needed here, but
        we read panel.hidden live so the state can never go stale.
      */
      trigger.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        setMenuState(panel.hidden);
      });
    }

    if (panel) {
      panel.addEventListener('click', (event) => {
        const link = event.target.closest('a');
        if (link) {
          // Collapse without pulling focus back to the bar, so the scroll
          // to the chosen section is not interrupted.
          setMenuState(false, false);
        }
      });
    }

    document.addEventListener('keydown', (event) => {
      if (!panel || panel.hidden) return;

      if (event.key === 'Escape') {
        setMenuState(false);
        return;
      }

      if (event.key !== 'Tab') return;

      const focusable = panelLinks();
      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });

    /*
      Outside-tap closes the menu. The trigger is explicitly excluded so a tap
      on the button is never treated as an "outside" click (which previously
      closed the panel in the same gesture that opened it on touch devices).
    */
    document.addEventListener('click', (event) => {
      if (!panel || panel.hidden) return;
      if (trigger && trigger.contains(event.target)) return;
      if (!nav.contains(event.target)) {
        setMenuState(false);
      }
    });

    let ticking = false;
    const onScroll = () => {
      if (!nav) return;
      if (!ticking) {
        window.requestAnimationFrame(() => {
          nav.classList.toggle('scrolled', window.scrollY > 8);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    initNavDialogs(nav);
  }

  /*
    Desktop navigation dialogs.
    Each nav button opens a small panel of real section destinations, anchored
    beneath its own link so it never appears in an unrelated place.
  */
  function initNavDialogs(nav) {
    const buttons = Array.from(nav.querySelectorAll('.nav-link[data-menu]'));
    if (!buttons.length) return;

    const desktop = window.matchMedia('(min-width: 881px)');
    let openButton = null;

    const panelFor = (button) => {
      const id = button.getAttribute('aria-controls');
      return id ? nav.querySelector('#' + CSS.escape(id)) : null;
    };

    const closeDialog = (restoreFocus) => {
      if (!openButton) return;
      const panel = panelFor(openButton);
      if (panel) panel.hidden = true;
      openButton.setAttribute('aria-expanded', 'false');
      openButton.classList.remove('is-open');
      if (restoreFocus) openButton.focus();
      openButton = null;
      nav.classList.remove('dialog-open');
    };

    const positionPanel = (button, panel) => {
      const navRect = nav.getBoundingClientRect();
      const itemRect = button.getBoundingClientRect();
      const gap = 14;

      // Anchor the dialog under its link, then clamp inside the navbar's width
      // so it can never overflow the viewport.
      const leftEdge = itemRect.left - navRect.left;
      const maxLeft = navRect.width - panel.offsetWidth - 18;
      const left = Math.max(18, Math.min(leftEdge, Math.max(18, maxLeft)));

      panel.style.left = left + 'px';
      panel.style.top = (itemRect.bottom - navRect.top + gap) + 'px';
    };

    const openDialog = (button) => {
      if (openButton === button) {
        closeDialog(true);
        return;
      }

      closeDialog(false);

      const panel = panelFor(button);
      if (!panel) return;

      panel.hidden = false;
      button.setAttribute('aria-expanded', 'true');
      button.classList.add('is-open');
      nav.classList.add('dialog-open');
      openButton = button;

      positionPanel(button, panel);
    };

    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        if (!desktop.matches) return;
        openDialog(button);
      });

      // Opening on hover feels premium on pointer devices, closing on leave.
      button.addEventListener('pointerenter', (event) => {
        if (event.pointerType !== 'mouse' || !desktop.matches) return;
        openDialog(button);
      });

      button.addEventListener('pointerleave', (event) => {
        if (event.pointerType !== 'mouse' || !desktop.matches) return;
        const panel = panelFor(button);
        if (!panel) return;
        window.clearTimeout(nav._dialogTimer);
        nav._dialogTimer = window.setTimeout(() => {
          if (!panel.matches(':hover')) closeDialog(false);
        }, 180);
      });
    });

    // Keep a hovered dialog alive while the pointer is inside it.
    nav.querySelectorAll('.nav-dialog').forEach((panel) => {
      panel.addEventListener('pointerleave', () => {
        window.clearTimeout(nav._dialogTimer);
        nav._dialogTimer = window.setTimeout(() => {
          if (openButton && !panelFor(openButton).matches(':hover') && !openButton.matches(':hover')) {
            closeDialog(false);
          }
        }, 180);
      });
    });

    // Selecting a destination scrolls to the real section and closes the dialog.
    nav.querySelectorAll('.nav-dialog__item').forEach((item) => {
      item.addEventListener('click', () => {
        closeDialog(false);
      });
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && openButton) {
        closeDialog(true);
      }
    });

    document.addEventListener('click', (event) => {
      if (openButton && !nav.contains(event.target)) {
        closeDialog(false);
      }
    });

    window.addEventListener('resize', () => {
      if (openButton) closeDialog(false);
    });

    // Leaving the whole navbar closes any lingering dialog.
    nav.addEventListener('pointerleave', (event) => {
      if (event.pointerType !== 'mouse' || !desktop.matches || !openButton) return;
      window.clearTimeout(nav._dialogTimer);
      nav._dialogTimer = window.setTimeout(() => {
        if (!nav.matches(':hover')) closeDialog(false);
      }, 180);
    });
  }

  window.initNav = initNav;
})();
