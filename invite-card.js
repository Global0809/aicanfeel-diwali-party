const DOWNLOAD_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12m-5-5 5 5 5-5M5 17v4h14v-4"/></svg>';

class DiwaliInvite extends HTMLElement {
  static observedAttributes = ['host', 'venue'];

  connectedCallback() {
    if (this.initialized) return;
    this.initialized = true;
    this.revealed = false;
    this.visible = false;
    this.abort = new AbortController();
    this.motion = matchMedia('(prefers-reduced-motion: reduce)');
    this.finePointer = matchMedia('(hover: hover) and (pointer: fine)');
    this.innerHTML = `
      <div class="diwali-invite-ritual">
        <h2>Consider this<br>your sign.</h2>
        <p>Clear your evening.<br>We’ve saved the best part for you.</p>
        <button type="button" class="diwali-yay-button" aria-controls="diwali-pass-reveal" aria-expanded="false">Yayyyy</button>
      </div>
      <div id="diwali-pass-reveal" class="diwali-invite-reveal" hidden>
        <div class="diwali-pass-stage"><div class="diwali-pass-floating">
          <article class="diwali-party-pass" aria-label="You’re invited to the AICANFEEL Diwali party, 6 November 2026 at 8 PM India time" tabindex="-1">
            <div class="diwali-pass-refraction" aria-hidden="true"></div>
            <div class="diwali-pass-body">
              <div class="diwali-pass-brandline"><span class="diwali-pass-host">aicanfeel</span><span>You’re invited.<br>Obviously.</span></div>
              <h3 class="diwali-pass-title"><span>DIWALI</span><span>PARTY.</span></h3>
              <p class="diwali-pass-wit">Good company.<br>Questionable dance moves.</p>
              <div class="diwali-pass-bottom"><div class="diwali-pass-place"><span>The place to be</span><address>DU-131, PitamPura, New Delhi</address></div><p class="diwali-pass-rsvp">Dress up. Show up.<br>Light it up.</p></div>
            </div>
            <div class="diwali-pass-stub">
              <p class="diwali-pass-stub-label">One night.<br>Very good decisions.</p>
              <time class="diwali-pass-date" datetime="2026-11-06T20:00:00+05:30"><strong>06</strong><span>NOV</span><small>FRIDAY, 2026</small></time>
              <div class="diwali-pass-time"><strong>8 PM</strong><span>India standard time</span></div>
              <p class="diwali-pass-note">Your only assignment:<br>have a good night.</p>
            </div>
          </article>
        </div></div>
        <div class="diwali-pass-tools"><button type="button" class="diwali-save-pass">Save invitation ${DOWNLOAD_ICON}</button><p class="diwali-pass-status" role="status" aria-live="polite"></p></div>
      </div>
      <canvas class="diwali-invite-fireworks" aria-hidden="true" hidden></canvas>`;

    this.button = this.querySelector('.diwali-yay-button');
    this.card = this.querySelector('.diwali-party-pass');
    this.canvas = this.querySelector('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.statusElement = this.querySelector('.diwali-pass-status');
    this.applyFacts();
    const events = { signal: this.abort.signal };
    this.button.addEventListener('click', () => this.reveal(), events);
    this.querySelector('.diwali-save-pass').addEventListener('click', () => this.download(), events);
    this.card.addEventListener('pointermove', event => this.tilt(event), events);
    this.card.addEventListener('pointerleave', () => this.resetTilt(), events);
    window.addEventListener('resize', () => { if (this.fireworksFrame) this.resizeCanvas(); }, events);
    document.addEventListener('visibilitychange', () => {
      this.classList.toggle('is-visible', this.visible && !document.hidden);
      if (document.hidden) this.stopFireworks();
    }, events);
    this.motion.addEventListener('change', () => {
      if (this.motion.matches) { this.stopFireworks(); this.resetTilt(); }
    }, events);
    this.observer = new IntersectionObserver(([entry]) => {
      this.visible = entry.isIntersecting;
      this.classList.toggle('is-visible', this.visible && !document.hidden);
      if (!this.visible) { this.stopFireworks(); this.resetTilt(); }
    }, { threshold: 0 });
    this.observer.observe(this);
  }

  disconnectedCallback() {
    this.abort?.abort();
    this.observer?.disconnect();
    this.stopFireworks();
    clearTimeout(this.revealTimer);
    if (this.tiltFrame) cancelAnimationFrame(this.tiltFrame);
    this.initialized = false;
  }

  attributeChangedCallback() { if (this.initialized) this.applyFacts(); }
  get hostName() { return this.getAttribute('host') || 'AICANFEEL'; }
  get venueName() { return this.getAttribute('venue') || 'DU-131, PitamPura, New Delhi'; }

  applyFacts() {
    this.querySelector('.diwali-pass-host').textContent = this.hostName;
    this.querySelector('address').textContent = this.venueName;
    this.card.setAttribute('aria-label', `You’re invited to the ${this.hostName} Diwali party, 6 November 2026 at 8 PM India time`);
  }

  reveal() {
    if (this.revealed) return;
    this.revealed = true;
    this.button.disabled = true;
    this.button.setAttribute('aria-expanded', 'true');
    this.querySelector('.diwali-invite-ritual').hidden = true;
    this.querySelector('.diwali-invite-reveal').hidden = false;
    this.classList.add('is-revealed');
    this.card.focus({ preventScroll: true });
    if (this.motion.matches) this.classList.add('reveal-finished');
    else {
      this.startFireworks();
      this.revealTimer = setTimeout(() => this.classList.add('reveal-finished'), 1500);
    }
    this.dispatchEvent(new CustomEvent('diwali-celebrate', { bubbles: true, detail: { source: 'invitation', fireworksOwned: true } }));
  }

  tilt(event) {
    if (!this.revealed || this.motion.matches || !this.finePointer.matches || !this.visible) return;
    this.pointer = { x: event.clientX, y: event.clientY };
    if (this.tiltFrame) return;
    this.tiltFrame = requestAnimationFrame(() => {
      this.tiltFrame = 0;
      const rect = this.card.getBoundingClientRect();
      const x = Math.max(-1, Math.min(1, ((this.pointer.x - rect.left) / rect.width - .5) * 2));
      const y = Math.max(-1, Math.min(1, ((this.pointer.y - rect.top) / rect.height - .5) * 2));
      this.card.style.setProperty('--pass-tilt-x', `${-y * 3}deg`);
      this.card.style.setProperty('--pass-tilt-y', `${x * 4}deg`);
    });
  }

  resetTilt() {
    if (this.tiltFrame) cancelAnimationFrame(this.tiltFrame);
    this.tiltFrame = 0;
    this.card?.style.setProperty('--pass-tilt-x', '0deg');
    this.card?.style.setProperty('--pass-tilt-y', '0deg');
  }

  resizeCanvas() {
    const dpr = Math.min(devicePixelRatio || 1, 1.5);
    this.width = innerWidth; this.height = innerHeight;
    this.canvas.width = Math.round(this.width * dpr);
    this.canvas.height = Math.round(this.height * dpr);
    this.ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  startFireworks() {
    if (!this.ctx || this.motion.matches || document.hidden) return;
    this.stopFireworks();
    this.resizeCanvas();
    this.canvas.hidden = false;
    const mobile = this.width < 650;
    this.particleCap = mobile ? 108 : 190;
    this.particles = [];
    this.rockets = [];
    this.launches = [
      { at: 0, x: .15, y: .25, color: '#ffda8c' },
      { at: 250, x: .83, y: .32, color: '#f75b49' },
      { at: 700, x: .48, y: .18, color: '#fff0bc' },
      { at: 1100, x: .71, y: .43, color: '#f4af54' }
    ];
    this.burstStart = performance.now();
    this.lastFrame = this.burstStart;
    const draw = now => {
      if (document.hidden || !this.isConnected) { this.stopFireworks(); return; }
      const elapsed = now - this.burstStart;
      const dt = Math.min((now - this.lastFrame) / 16.667, 2);
      this.lastFrame = now;
      this.ctx.clearRect(0, 0, this.width, this.height);
      for (const launch of this.launches) {
        if (launch.sent || elapsed < launch.at) continue;
        launch.sent = true;
        this.rockets.push({ x: this.width * launch.x, y: this.height * .96, target: this.height * launch.y, color: launch.color, trail: [] });
      }
      for (let i = this.rockets.length - 1; i >= 0; i--) {
        const rocket = this.rockets[i];
        rocket.trail.push({ x: rocket.x, y: rocket.y });
        if (rocket.trail.length > 10) rocket.trail.shift();
        rocket.y -= (this.height * .019 + (rocket.y - rocket.target) * .035) * dt;
        this.ctx.strokeStyle = rocket.color;
        this.ctx.lineWidth = 1.3;
        this.ctx.beginPath();
        rocket.trail.forEach((point, index) => index ? this.ctx.lineTo(point.x, point.y) : this.ctx.moveTo(point.x, point.y));
        this.ctx.globalAlpha = .7; this.ctx.stroke(); this.ctx.globalAlpha = 1;
        if (rocket.y <= rocket.target) { this.explode(rocket, mobile); this.rockets.splice(i, 1); }
      }
      for (let i = this.particles.length - 1; i >= 0; i--) {
        const particle = this.particles[i];
        particle.life -= dt;
        if (particle.life <= 0) { this.particles.splice(i, 1); continue; }
        particle.x += particle.vx * dt; particle.y += particle.vy * dt;
        particle.vx *= Math.pow(.982, dt); particle.vy = particle.vy * Math.pow(.982, dt) + .045 * dt;
        const alpha = Math.min(1, particle.life / 28) * (.65 + .35 * Math.sin(particle.life * .6 + particle.phase));
        this.ctx.globalAlpha = Math.max(0, alpha);
        this.ctx.strokeStyle = particle.color; this.ctx.fillStyle = particle.color;
        if (particle.confetti) {
          this.ctx.save(); this.ctx.translate(particle.x, particle.y); this.ctx.rotate(particle.life * .07 + particle.phase); this.ctx.fillRect(-1.5, -2.7, 3, 5.4); this.ctx.restore();
        } else {
          this.ctx.lineWidth = particle.size;
          this.ctx.beginPath(); this.ctx.moveTo(particle.x, particle.y); this.ctx.lineTo(particle.x - particle.vx * 2, particle.y - particle.vy * 2); this.ctx.stroke();
        }
      }
      this.ctx.globalAlpha = 1;
      if (elapsed > 4400 || (elapsed > 1800 && !this.particles.length && !this.rockets.length)) this.stopFireworks();
      else this.fireworksFrame = requestAnimationFrame(draw);
    };
    this.fireworksFrame = requestAnimationFrame(draw);
  }

  explode(rocket, mobile) {
    const count = Math.min(mobile ? 32 : 56, this.particleCap - this.particles.length);
    for (let i = 0; i < count; i++) {
      const angle = Math.PI * 2 * i / count + Math.random() * .09;
      const speed = (mobile ? 2.3 : 3.4) + Math.random() * (mobile ? 2.3 : 3.3);
      this.particles.push({ x: rocket.x, y: rocket.y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, life: 65 + Math.random() * 38, color: i % 8 === 0 ? '#fff7db' : rocket.color, size: i % 4 === 0 ? 1.5 : .8, confetti: i % 7 === 0, phase: Math.random() * 6.28 });
    }
  }

  stopFireworks() {
    if (this.fireworksFrame) cancelAnimationFrame(this.fireworksFrame);
    this.fireworksFrame = 0;
    this.particles = []; this.rockets = [];
    if (this.canvas) { this.ctx?.clearRect(0, 0, this.width || 0, this.height || 0); this.canvas.hidden = true; }
  }

  saveBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = filename;
    document.body.append(anchor); anchor.click(); anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  }

  async download() {
    if (!this.revealed) return;
    const button = this.querySelector('.diwali-save-pass');
    if (button.disabled) return;
    button.disabled = true; this.statusElement.textContent = 'Making your invitation…';
    try {
      await document.fonts.ready;
      const canvas = document.createElement('canvas'); canvas.width = 1800; canvas.height = 1080;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas unavailable');
      const white = '#fff4e7', gold = '#f7d49b';
      const background = ctx.createLinearGradient(0, 0, 1800, 1080);
      background.addColorStop(0, '#a63f34'); background.addColorStop(.52, '#420e1b'); background.addColorStop(1, '#702328');
      ctx.fillStyle = background; ctx.fillRect(0, 0, 1800, 1080);
      const shine = ctx.createLinearGradient(0, 0, 1500, 1000);
      shine.addColorStop(0, 'rgba(255,235,181,.16)'); shine.addColorStop(.35, 'rgba(255,235,181,0)'); shine.addColorStop(.59, 'rgba(255,235,181,.05)'); shine.addColorStop(.65, 'rgba(255,235,181,.13)'); shine.addColorStop(1, 'rgba(255,235,181,0)');
      ctx.fillStyle = shine; ctx.fillRect(0, 0, 1800, 1080);
      ctx.strokeStyle = gold; ctx.lineWidth = 2; ctx.strokeRect(20, 20, 1760, 1040);
      ctx.strokeStyle = 'rgba(247,212,155,.3)'; ctx.strokeRect(42, 42, 1716, 996);
      ctx.fillStyle = 'rgba(255,225,181,.06)'; ctx.fillRect(1390, 20, 390, 1040);
      ctx.setLineDash([5, 10]); ctx.strokeStyle = 'rgba(247,212,155,.5)'; ctx.beginPath(); ctx.moveTo(1390, 20); ctx.lineTo(1390, 1060); ctx.stroke(); ctx.setLineDash([]);
      const fitted = (text, x, y, width, size, family, weight = 400) => {
        ctx.font = `${weight} ${size}px ${family}`;
        while (ctx.measureText(text).width > width && size > 9) ctx.font = `${weight} ${--size}px ${family}`;
        ctx.fillText(text, x, y);
      };
      ctx.fillStyle = white; fitted(this.hostName.toLowerCase(), 84, 130, 670, 41, '"Neue Plak Extended",sans-serif', 600);
      ctx.fillStyle = gold; fitted('YOU’RE INVITED. OBVIOUSLY.', 840, 126, 470, 15, '"Druk Text Wide",sans-serif', 700);
      ctx.fillStyle = white; fitted('DIWALI', 79, 454, 1240, 211, '"Integral CF",sans-serif', 800);
      ctx.fillStyle = gold; fitted('PARTY.', 79, 660, 1240, 211, '"Integral CF",sans-serif', 800);
      ctx.fillStyle = white; fitted('GOOD COMPANY.', 85, 744, 1180, 22, '"Druk Text Wide",sans-serif', 700); fitted('QUESTIONABLE DANCE MOVES.', 85, 785, 1180, 22, '"Druk Text Wide",sans-serif', 700);
      ctx.fillStyle = gold; fitted('THE PLACE TO BE', 85, 926, 600, 16, '"Druk Text Wide",sans-serif', 700);
      ctx.fillStyle = white; fitted(this.venueName, 85, 982, 1190, 25, '"Neue Plak Extended",sans-serif');
      ctx.fillStyle = gold; fitted('ONE NIGHT.', 1453, 125, 267, 15, '"Druk Text Wide",sans-serif', 700); fitted('VERY GOOD DECISIONS.', 1453, 157, 267, 15, '"Druk Text Wide",sans-serif', 700);
      ctx.fillStyle = white; fitted('06', 1445, 410, 280, 184, '"Integral CF",sans-serif', 800); fitted('NOV', 1453, 482, 260, 47, '"Integral CF",sans-serif', 800);
      ctx.fillStyle = '#eac3b5'; fitted('FRIDAY, 2026', 1453, 530, 266, 18, '"Neue Plak Extended",sans-serif');
      ctx.strokeStyle = 'rgba(247,212,155,.35)'; ctx.beginPath(); ctx.moveTo(1453, 605); ctx.lineTo(1718, 605); ctx.stroke();
      ctx.fillStyle = white; fitted('8 PM', 1453, 722, 270, 73, '"Integral CF",sans-serif', 800);
      ctx.fillStyle = gold; fitted('INDIA STANDARD TIME', 1453, 768, 270, 14, '"Druk Text Wide",sans-serif', 700);
      ctx.fillStyle = '#eac3b5'; fitted('Your only assignment:', 1453, 937, 270, 17, '"Neue Plak Extended",sans-serif'); fitted('have a good night.', 1453, 972, 270, 17, '"Neue Plak Extended",sans-serif');
      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
      if (!blob) throw new Error('Could not export');
      this.saveBlob(blob, 'AICANFEEL-Diwali-Party-6-November-8PM.png');
      this.statusElement.textContent = 'Your invitation is saved. See you at 8.';
    } catch (error) {
      this.statusElement.textContent = 'Could not save the image. Please try again.';
      console.error('Invitation export:', error);
    } finally { button.disabled = false; }
  }
}

if (!customElements.get('diwali-invite')) customElements.define('diwali-invite', DiwaliInvite);
export { DiwaliInvite };
