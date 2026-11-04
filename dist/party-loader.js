const PARTY_QUOTES = [
  'The only thing getting lit before you is this screen.',
  'A little light. A little ice. Excellent company.',
  'We’ve already made pour decisions.',
  'Good company. Great outfits. Questionable dance moves.',
  'Saving the brightest entrance for you.',
  'Your outfit deserves a proper entrance. So does this gorilla.'
];

let loaderSequence = 0;

/**
 * Native-scene entry gate. Readiness belongs to the scene, never a timer.
 * API: setProgress(0..1, label?), setReady(), setError(message), close().
 * Audio is unlocked synchronously by the visitor's entry click.
 */
class PartyLoader extends HTMLElement {
  constructor() {
    super();
    this.ready = false;
    this.closed = false;
    this.closing = false;
    this.quoteIndex = Math.floor(Math.random()*PARTY_QUOTES.length);
    this.progress = 0;
    this.inertStates = new Map();
    this.scrollStyles = [];
  }

  connectedCallback() {
    if (this.mounted || this.closed) return;
    this.mounted = true;
    this.abort = new AbortController();
    const id = `party-loader-${++loaderSequence}`;
    this.innerHTML = `<div class="party-loader-shell" role="dialog" aria-modal="true" aria-labelledby="${id}-title" aria-describedby="${id}-description" tabindex="-1">
      <header class="party-loader-header"><span class="party-loader-brand">AICANFEEL</span><span class="party-loader-edition">DIWALI PARTY</span></header>
      <div class="party-loader-main">
        <div class="party-loader-copy"><h1 id="${id}-title">LIGHTING UP<br>THE NIGHT.</h1><p id="${id}-description" class="party-loader-description">A good night deserves a proper entrance.</p></div>
        <div class="party-loader-light" aria-hidden="true">
          <div class="party-loader-orbit party-loader-orbit-one"><i></i></div>
          <div class="party-loader-orbit party-loader-orbit-two"><i></i></div>
          <div class="party-loader-orbit party-loader-orbit-three"></div>
          <div class="party-loader-aura"></div>
          <svg class="party-loader-diya" viewBox="0 0 180 180"><path class="party-loader-flame" d="M91 28C103 47 118 59 110 76C103 92 81 94 74 79C67 65 82 52 91 28Z"/><path class="party-loader-bowl" d="M36 105H144C137 135 117 150 90 150S43 135 36 105Z"/><path class="party-loader-wick" d="M84 105L95 90"/><path class="party-loader-rim" d="M29 105H151"/></svg>
          <span class="party-loader-spark party-loader-spark-one"></span><span class="party-loader-spark party-loader-spark-two"></span>
        </div>
      </div>
      <footer class="party-loader-bottom">
        <div class="party-loader-quote-wrap" aria-hidden="true"><p class="party-loader-quote">${PARTY_QUOTES[this.quoteIndex]}</p><span class="party-loader-quote-count">${String(this.quoteIndex+1).padStart(2,'0')} / 06</span></div>
        <div class="party-loader-controls">
          <div class="party-loader-progress-copy"><p class="party-loader-status" role="status" aria-live="polite" aria-atomic="true">Preparing the original 3D scene.</p><span class="party-loader-state" aria-hidden="true">PLEASE HOLD THE SPARK</span></div>
          <div class="party-loader-progress is-indeterminate" role="progressbar" aria-label="3D scene loading" aria-valuemin="0" aria-valuemax="100" aria-valuetext="Preparing the original 3D scene"><span></span></div>
          <div class="party-loader-actions" hidden><button class="party-loader-enter" type="button" disabled><span>Enter the party</span><small>with sound</small><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg></button><button class="party-loader-quiet" type="button" disabled>Enter quietly</button></div>
          <div class="party-loader-recovery" hidden><button class="party-loader-retry" type="button">Try loading again <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 10a7 7 0 1 0 0 5M19 4v6h-6"/></svg></button><a class="party-loader-fallback" href="#invitation">See the invitation</a></div>
        </div>
      </footer>
    </div>`;
    this.shell = this.querySelector('.party-loader-shell');
    this.status = this.querySelector('.party-loader-status');
    this.bar = this.querySelector('.party-loader-progress');
    this.barFill = this.bar.firstElementChild;
    this.heading = this.querySelector('h1');
    this.actions = this.querySelector('.party-loader-actions');
    this.recovery = this.querySelector('.party-loader-recovery');
    this.setAttribute('data-state', 'loading');
    this.lockPage();

    const listen = (element, type, callback, options = {}) => element.addEventListener(type, callback, {...options, signal:this.abort.signal});
    listen(this.querySelector('.party-loader-enter'), 'click', () => this.enter(true));
    listen(this.querySelector('.party-loader-quiet'), 'click', () => this.enter(false));
    listen(this.querySelector('.party-loader-retry'), 'click', () => location.reload());
    listen(this.querySelector('.party-loader-fallback'), 'click', event => {
      event.preventDefault();
      if (this.getAttribute('data-state') !== 'error') return;
      window.DIWALI_AUDIO?.mute?.();
      this.close({sound:false, target:'#invitation'});
    });
    listen(document, 'keydown', event => this.trapFocus(event), {capture:true});
    listen(document, 'focusin', event => {
      if (!this.closed && !this.closing && !this.contains(event.target)) this.shell.focus({preventScroll:true});
    });
    listen(window, 'pagehide', () => { this.cleanup(); this.unlockPage(); }, {once:true});
    this.quoteTimer = window.setInterval(() => this.rotateQuote(), 6200);
    queueMicrotask(() => { if (!this.closed && this.isConnected) this.shell.focus({preventScroll:true}); });
  }

  disconnectedCallback() {
    this.cleanup();
    this.unlockPage();
    this.mounted = false;
  }

  lockPage() {
    this.previousFocus = document.activeElement;
    for (const element of document.querySelectorAll('.diwali-story,.diwali-header,.diwali-toolbar,.diwali-menu,.diwali-footer,.diwali-skip')) {
      if (element === this || element.contains(this)) continue;
      this.inertStates.set(element, element.inert);
      element.inert = true;
    }
    for (const element of [document.documentElement, document.body]) {
      // Read every longhand before mutating the shorthand, so restoring the
      // document cannot accidentally retain our temporary hidden overflow.
      for (const property of ['overflow', 'overflow-x', 'overflow-y']) {
        this.scrollStyles.push({element,property,value:element.style.getPropertyValue(property),priority:element.style.getPropertyPriority(property)});
      }
      element.style.setProperty('overflow','hidden','important');
    }
  }

  unlockPage() {
    for (const [element, inert] of this.inertStates) element.inert = inert;
    this.inertStates.clear();
    for (const {element,property} of this.scrollStyles) element.style.removeProperty(property);
    for (const {element,property,value,priority} of this.scrollStyles) {
      if (value) element.style.setProperty(property,value,priority);
    }
    this.scrollStyles = [];
  }

  trapFocus(event) {
    if (this.closed || event.key !== 'Tab') return;
    const available = [...this.querySelectorAll('button:not(:disabled),a[href]')].filter(element => !element.closest('[hidden]'));
    if (!available.length) { event.preventDefault(); this.shell.focus({preventScroll:true}); return; }
    const current = available.indexOf(document.activeElement);
    if (event.shiftKey && current <= 0) { event.preventDefault(); available.at(-1).focus(); }
    else if (!event.shiftKey && (current < 0 || current === available.length-1)) { event.preventDefault(); available[0].focus(); }
  }

  rotateQuote() {
    if (this.closed || this.closing) return;
    const quote = this.querySelector('.party-loader-quote');
    quote.classList.add('is-changing');
    this.quoteSwapTimer = window.setTimeout(() => {
      this.quoteIndex = (this.quoteIndex+1)%PARTY_QUOTES.length;
      quote.textContent = PARTY_QUOTES[this.quoteIndex];
      this.querySelector('.party-loader-quote-count').textContent = `${String(this.quoteIndex+1).padStart(2,'0')} / 06`;
      quote.classList.remove('is-changing');
    }, matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 180);
  }

  setProgress(value, label) {
    if (this.closed || this.closing || this.ready || !this.bar || this.getAttribute('data-state')==='error') return;
    if (Number.isFinite(value)) {
      this.progress = Math.max(0,Math.min(1,value));
      this.bar.classList.remove('is-indeterminate');
      this.barFill.style.transform = `scaleX(${this.progress})`;
      this.bar.setAttribute('aria-valuenow',String(Math.round(this.progress*100)));
    }
    if (typeof label === 'string' && label.trim() && this.getAttribute('data-state') !== 'error') {
      const text = label.trim();
      if (this.status.textContent !== text) this.status.textContent = text;
      this.bar.setAttribute('aria-valuetext',text);
    }
  }

  setReady() {
    if (this.closed || this.closing || this.ready || !this.bar) return;
    this.ready = true;
    this.progress = 1;
    this.setAttribute('data-state','ready');
    this.bar.classList.remove('is-indeterminate');
    this.barFill.style.transform = 'scaleX(1)';
    this.bar.setAttribute('aria-valuenow','100');
    this.bar.setAttribute('aria-valuetext','3D scene ready');
    this.heading.innerHTML = 'THE NIGHT<br>IS YOURS.';
    this.status.textContent = 'The night is ready. Choose how to enter.';
    this.querySelector('.party-loader-state').textContent = 'ALL SET';
    this.recovery.hidden = true;
    this.actions.hidden = false;
    this.actions.querySelectorAll('button').forEach(button => { button.disabled = false; });
  }

  setError(message = 'The 3D scene could not finish loading.') {
    if (this.closed || this.closing || !this.status) return;
    this.ready = false;
    this.setAttribute('data-state','error');
    this.heading.innerHTML = 'A LITTLE<br>HOLD UP.';
    this.status.textContent = String(message || 'The 3D scene could not finish loading.');
    this.bar.classList.remove('is-indeterminate');
    this.bar.setAttribute('aria-valuetext','3D scene unavailable');
    this.bar.removeAttribute('aria-valuenow');
    this.querySelector('.party-loader-state').textContent = 'YOUR INVITATION IS STILL HERE';
    this.actions.hidden = true;
    this.actions.querySelectorAll('button').forEach(button => { button.disabled = true; });
    this.recovery.hidden = false;
  }

  enter(sound) {
    if (!this.ready || this.closed || this.closing) return;
    // This call must stay inside the click gesture, before any promise or exit.
    if (sound) {
      try {
        const started = window.DIWALI_AUDIO?.start?.();
        if (started?.catch) started.catch(() => {});
      } catch { /* Entry remains available if audio is unsupported. */ }
    } else window.DIWALI_AUDIO?.mute?.();
    this.close({sound});
  }

  close({sound = false, target = null} = {}) {
    if (this.closed) return Promise.resolve();
    if (this.closing) return this.closePromise;
    this.closing = true;
    this.setAttribute('data-state','leaving');
    window.clearInterval(this.quoteTimer);
    window.clearTimeout(this.quoteSwapTimer);
    this.querySelectorAll('button').forEach(button => { button.disabled = true; });
    this.closePromise = new Promise(resolve => {
      const finish = () => {
        this.closed = true;
        this.hidden = true;
        this.inert = true;
        this.setAttribute('aria-hidden','true');
        this.unlockPage();
        this.cleanup();
        const destination = target ? document.querySelector(target) : null;
        if (destination) {
          destination.scrollIntoView({behavior:'instant',block:'start'});
          const focusTarget = destination.querySelector('input,button,a[href]');
          focusTarget?.focus({preventScroll:true});
        } else {
          const previous = this.previousFocus;
          const focusTarget = previous && previous !== document.body && previous.isConnected && !previous.closest('[inert]') ? previous : document.querySelector('.diwali-header .diwali-brand');
          focusTarget?.focus({preventScroll:true});
        }
        document.dispatchEvent(new CustomEvent('diwali-enter',{detail:{sound:Boolean(sound)},bubbles:true}));
        resolve();
      };
      this.exitTimer = window.setTimeout(finish, matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 660);
    });
    return this.closePromise;
  }

  cleanup() {
    this.abort?.abort();
    window.clearInterval(this.quoteTimer);
    window.clearTimeout(this.quoteSwapTimer);
    window.clearTimeout(this.exitTimer);
  }
}

if (!customElements.get('party-loader')) customElements.define('party-loader',PartyLoader);
export {PartyLoader};
