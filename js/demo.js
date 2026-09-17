/* demo.js — home verification demo state machine */

(function () {
  function initDemo() {
    const panel = document.querySelector('.demo-panel');
    if (!panel || panel.dataset.demoReady === 'true') return;

    panel.dataset.demoReady = 'true';

    const header = panel.querySelector('.demo-header span');
    const pills = Array.from(panel.querySelectorAll('.signal-pill'));
    const steps = Array.from(panel.querySelectorAll('.flow-step'));
    const result = panel.querySelector('.demo-result__label') || panel.querySelector('.demo-result strong');
    const resultText = panel.querySelector('.demo-result__message') || panel.querySelector('.demo-result > span');
    const resultDot = panel.querySelector('.demo-result .signal-dot');

    /*
      A self-playing verification sequence. Each state advances the pipeline:
      it lights one more status pill, promotes the next flow step to "active",
      updates the header, and reveals the decision. The panel animates on its
      own (no hover required) and loops.
    */
    const states = [
      {
        header: 'Capturing identity details',
        pillsActive: 1,
        step: 0,
        label: 'Reading document',
        message: 'Document detected. Checking authenticity and layout.',
        tone: 'scan'
      },
      {
        header: 'Running verification checks',
        pillsActive: 2,
        step: 1,
        label: 'Matching face',
        message: 'Liveness confirmed and facial match passed.',
        tone: 'check'
      },
      {
        header: 'Decision ready',
        pillsActive: 3,
        step: 2,
        label: 'Identity verified',
        message: 'Matched to a valid Ghana national ID in 2.1s.',
        tone: 'verified'
      }
    ];

    let index = 0;

    const applyState = (stateIndex) => {
      const state = states[stateIndex % states.length];

      // Per-step active + colour: pills light up progressively.
      pills.forEach((pill, pillIndex) => {
        const isActive = pillIndex < state.pillsActive;
        pill.classList.toggle('is-active', isActive && pillIndex === state.pillsActive - 1);
        pill.classList.toggle('success', isActive);
      });

      // Flow steps: completed, current (active), upcoming.
      steps.forEach((step, stepIndex) => {
        step.classList.toggle('done', stepIndex < state.step);
        step.classList.toggle('active', stepIndex === state.step);
      });

      if (header) header.textContent = state.header;
      panel.dataset.tone = state.tone;

      if (result) result.textContent = state.label;
      if (resultText) resultText.textContent = state.message;

      // The decision dot only reads "live/verified" on the final state.
      if (resultDot) resultDot.classList.toggle('is-verified', state.tone === 'verified');
    };

    applyState(index);

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      // Land on the final resolved state and stop.
      applyState(states.length - 1);
      return;
    }

    let timer = null;
    const advance = () => {
      index = (index + 1) % states.length;
      applyState(index);
    };
    const start = () => {
      if (timer) return;
      timer = window.setInterval(advance, 2200);
    };
    const stop = () => {
      if (!timer) return;
      window.clearInterval(timer);
      timer = null;
    };

    start();

    // Pause while off-screen so the cycle always starts fresh when seen.
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => (entry.isIntersecting ? start() : stop()));
      }, { threshold: 0.3 });
      io.observe(panel);
    }
  }

  window.initDemo = initDemo;
})();
