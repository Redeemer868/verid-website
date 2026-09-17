/* icons.js - centralized Lucide icon initialization and sizing hooks */

(function () {
  const iconMap = {
    hero: 'shield-check',
    capture: 'scan-face',
    check: 'file-check-2',
    decide: 'badge-check',
    security: 'shield-check',
    banking: 'landmark',
    telecom: 'radio-tower',
    public: 'landmark',
    developer: 'code-2',
    sandbox: 'terminal',
    copy: 'copy',
    demo: 'badge-check',
    arrow: 'arrow-right'
  };

  function initIcons() {
    if (!window.lucide) return;
    window.lucide.createIcons({ attrs: { 'stroke-width': 1.8 } });
  }

  window.VeridIcons = { iconMap, initIcons };
})();
