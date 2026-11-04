const ARROW = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12m-5-5 5 5 5-5M5 17v4h14v-4"/></svg>';
const normalizeName = value => Array.from(String(value || '').normalize('NFC').replace(/[\u0000-\u001f\u007f-\u009f]/g, '').replace(/\s+/g, ' ').trim()).slice(0, 48).join('');
const messages = ['A LITTLE LIGHT. A LOT OF LOVE.', 'THE NIGHT IS BRIGHTER WITH YOU.', 'GOOD PEOPLE. ONE BRIGHT NIGHT.', 'BRING YOURSELF. BRING THE SPARK.'];
const hash = text => Array.from(text).reduce((value, char) => Math.imul(value ^ char.codePointAt(0), 16777619) >>> 0, 2166136261);

class DiwaliInvite extends HTMLElement {
  static observedAttributes = ['host', 'venue'];
  connectedCallback() {
    if (this.initialized) return;
    this.initialized = true;
    this.abort = new AbortController();
    this.innerHTML = `<div class="diwali-invite-layout">
      <div class="diwali-invite-editor">
        <h2>This night.<br>Your invite.</h2>
        <p>A little light. A lot of good company.<br>Make this invitation yours.</p>
        <form class="diwali-invite-form"><label class="diwali-name-label" for="diwali-guest">Your name</label><div class="diwali-name-field"><input id="diwali-guest" name="guest" autocomplete="given-name" maxlength="96" placeholder="Enter your name" aria-describedby="diwali-invite-status"></div>
          <div class="diwali-invite-actions"><button class="diwali-invite-button diwali-download" type="submit">Save invitation ${ARROW}</button><button type="button" class="diwali-invite-textbutton diwali-copy">Copy personal link</button></div>
        </form>
        <p id="diwali-invite-status" class="diwali-invite-status" role="status" aria-live="polite"></p>
        <input class="diwali-link-fallback" readonly aria-label="Your personal invitation link">
        <div class="diwali-invite-tools"><button type="button" class="diwali-invite-textbutton diwali-calendar">Add to calendar</button><a class="diwali-invite-textbutton diwali-directions" target="_blank" rel="noopener">Get directions</a></div>
      </div>
      <div class="diwali-invite-card-wrap"><article class="diwali-invite-card" aria-label="Your personal Diwali invitation">
        <div class="diwali-card-top"><span>Diwali nights ’26</span><span class="diwali-card-code">YOUR INVITATION</span></div>
        <div class="diwali-card-main"><div class="diwali-card-light" aria-hidden="true"></div><h3>You’re<br>invited.</h3><p class="diwali-card-message">A LITTLE LIGHT. A LOT OF LOVE.</p><p class="diwali-card-for">Especially for</p><strong class="diwali-card-name">you</strong></div>
        <div class="diwali-card-facts"><div><span>Friday, 2026</span><strong>06 NOV</strong></div><div><span>India standard time</span><strong>7:30 PM</strong></div></div>
        <div class="diwali-card-venue"><p>Hosted by <strong class="diwali-card-host">aicanfeel</strong></p><address>DU-131, PitamPura, New Delhi</address></div>
        <div class="diwali-card-footer"><span>GOOD PEOPLE. GREAT ENERGY.</span><span>ONE BRIGHT NIGHT.</span></div>
      </article></div>
    </div>`;
    this.input = this.querySelector('input[name="guest"]');
    this.statusElement = this.querySelector('.diwali-invite-status');
    this.applyFacts();
    const listen = (selector, type, callback) => this.querySelector(selector).addEventListener(type, callback, { signal: this.abort.signal });
    listen('input[name="guest"]', 'input', () => { this.updateName(); this.setStatus(''); this.input.removeAttribute('aria-invalid'); });
    listen('form', 'submit', event => { event.preventDefault(); this.download(); });
    listen('.diwali-copy', 'click', () => this.copyLink());
    listen('.diwali-calendar', 'click', () => this.calendar());
    window.addEventListener('hashchange', () => this.restoreName(), { signal: this.abort.signal });
    this.restoreName();
  }
  disconnectedCallback() { this.abort?.abort(); this.initialized = false; }
  attributeChangedCallback() { if (this.initialized) this.applyFacts(); }
  get hostName() { return this.getAttribute('host') || 'aicanfeel'; }
  get venueName() { return this.getAttribute('venue') || 'DU-131, PitamPura, New Delhi'; }
  applyFacts() {
    this.querySelector('.diwali-card-host').textContent = this.hostName;
    this.querySelector('address').textContent = this.venueName;
    this.querySelector('.diwali-directions').href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(this.venueName)}`;
  }
  setStatus(message) { this.statusElement.textContent = message; }
  updateName() {
    const name = normalizeName(this.input.value);
    const seed = hash(name);
    this.querySelector('.diwali-card-name').textContent = name || 'you';
    this.querySelector('.diwali-card-message').textContent = name ? messages[seed % messages.length] : messages[0];
    this.querySelector('.diwali-card-code').textContent = name ? `DN-${seed.toString(36).toUpperCase().padStart(7,'0')}` : 'YOUR INVITATION';
    return name;
  }
  requireName() {
    const name = this.updateName();
    if (!name) { this.input.setAttribute('aria-invalid','true'); this.input.focus(); this.setStatus('Enter your name to make your personal invitation.'); return null; }
    this.input.value = name;
    return name;
  }
  personalLink(name) {
    const url = new URL(location.href);
    url.hash = `invitation?guest=${encodeURIComponent(name)}`;
    return url.href;
  }
  restoreName() {
    const fragment = location.hash.slice(1);
    if (!fragment.startsWith('invitation?')) return;
    try {
      const name = normalizeName(new URLSearchParams(fragment.split('?').slice(1).join('?')).get('guest'));
      if (name) { this.input.value = name; this.updateName(); this.setStatus(`An invitation especially for ${name}.`); }
    } catch { this.setStatus('Enter your name to make a fresh invitation.'); }
  }
  async copyLink() {
    const name = this.requireName();
    if (!name) return;
    const link = this.personalLink(name);
    try { await navigator.clipboard.writeText(link); this.setStatus('Personal link copied. Share a little light.'); }
    catch { const fallback = this.querySelector('.diwali-link-fallback'); fallback.value = link; fallback.setAttribute('data-visible',''); fallback.focus(); fallback.select(); this.setStatus('Your link is selected. Copy it to share your invitation.'); }
  }
  saveBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = filename;
    document.body.append(anchor); anchor.click(); anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  }
  calendar() {
    const escapeICS = value => String(value).replace(/\\/g,'\\\\').replace(/\r?\n/g,'\\n').replace(/,/g,'\\,').replace(/;/g,'\\;');
    const content = ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//AICANFEEL//Diwali Nights//EN','CALSCALE:GREGORIAN','BEGIN:VEVENT','UID:diwali-nights-20261106@aicanfeel.invite',`DTSTAMP:${new Date().toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'')}`,'DTSTART:20261106T140000Z',`SUMMARY:${escapeICS(`Diwali Nights by ${this.hostName}`)}`,`LOCATION:${escapeICS(this.venueName)}`,'DESCRIPTION:Diwali party. 6 November 2026 at 7:30 PM India time.','END:VEVENT','END:VCALENDAR'].join('\r\n');
    this.saveBlob(new Blob([content], { type:'text/calendar;charset=utf-8' }), 'Diwali-Nights-6-November.ics');
    this.setStatus('Calendar invitation saved for 6 November, 7:30 PM India time.');
  }
  async download() {
    const name = this.requireName();
    if (!name) return;
    const button = this.querySelector('.diwali-download'); button.disabled = true;
    this.setStatus('Making your invitation…');
    try {
      await document.fonts.ready;
      const canvas = document.createElement('canvas'); canvas.width = 1200; canvas.height = 1530;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas unavailable');
      const white = '#fff7ef', gold = '#f4c989';
      const bg = ctx.createLinearGradient(0,0,1200,1530); bg.addColorStop(0,'#a63d3b'); bg.addColorStop(.38,'#761a24'); bg.addColorStop(1,'#310b14');
      ctx.fillStyle = bg; ctx.fillRect(0,0,1200,1530);
      const highlight = ctx.createLinearGradient(0,0,1200,1000); highlight.addColorStop(0,'rgba(255,236,216,.16)'); highlight.addColorStop(.42,'rgba(255,236,216,0)'); highlight.addColorStop(1,'rgba(255,236,216,.035)'); ctx.fillStyle = highlight; ctx.fillRect(0,0,1200,1530);
      ctx.strokeStyle = 'rgba(255,225,200,.44)'; ctx.lineWidth = 2; ctx.strokeRect(30,30,1140,1470);
      const line = y => { ctx.strokeStyle = 'rgba(255,225,200,.3)';ctx.beginPath();ctx.moveTo(82,y);ctx.lineTo(1118,y);ctx.stroke(); };
      const fitted = (text, x, y, width, size, family, weight = 400) => {ctx.font = `${weight} ${size}px ${family}`;while(ctx.measureText(text).width > width && size > 8)ctx.font = `${weight} ${--size}px ${family}`;ctx.fillText(text,x,y);};
      ctx.fillStyle = white; fitted('DIWALI NIGHTS ’26',82,113,720,26,'"Druk Text Wide",sans-serif',700);
      const code = `DN-${hash(name).toString(36).toUpperCase().padStart(7,'0')}`;
      ctx.fillStyle = gold; ctx.font = '400 24px "Neue Plak Extended",sans-serif'; ctx.textAlign = 'right';ctx.fillText(code,1118,113);ctx.textAlign = 'left'; line(163);
      ctx.save();ctx.translate(994,500);ctx.rotate(-.43);ctx.strokeStyle='rgba(244,201,137,.32)';
      for(let i=0;i<3;i++){ctx.beginPath();ctx.ellipse(0,0,255-i*34,137-i*19,0,0,Math.PI*2);ctx.stroke();}ctx.restore();
      ctx.fillStyle = white; fitted('YOU’RE',82,457,1036,142,'"Integral CF",sans-serif',800);fitted('INVITED.',82,607,1036,142,'"Integral CF",sans-serif',800);
      ctx.fillStyle = gold;fitted(messages[hash(name)%messages.length],82,698,1036,23,'"Druk Text Wide",sans-serif',700);
      ctx.fillStyle = '#eac6c3';ctx.font = '400 26px "Neue Plak Extended",sans-serif';ctx.fillText('Especially for',82,808);
      ctx.fillStyle = white;fitted(name,82,904,1036,70,'"Neue Plak Extended","Nirmala UI","Segoe UI",sans-serif',600);
      line(1010);ctx.fillStyle = gold;ctx.font = '700 20px "Druk Text Wide",sans-serif';ctx.fillText('FRIDAY, 2026',82,1066);ctx.fillText('INDIA STANDARD TIME',636,1066);
      ctx.fillStyle = white;fitted('06 NOV',82,1151,480,62,'"Integral CF",sans-serif',800);fitted('7:30 PM',636,1151,482,62,'"Integral CF",sans-serif',800);line(1207);
      ctx.fillStyle = '#eac6c3';fitted(`Hosted by ${this.hostName}`,82,1271,1036,29,'"Neue Plak Extended",sans-serif');
      ctx.fillStyle = white;fitted(this.venueName,82,1332,1036,28,'"Neue Plak Extended",sans-serif');
      ctx.fillStyle = gold;fitted('GOOD PEOPLE. GREAT ENERGY.',82,1447,650,18,'"Druk Text Wide",sans-serif',700);ctx.textAlign='right';ctx.font='700 18px "Druk Text Wide",sans-serif';ctx.fillText('ONE BRIGHT NIGHT.',1118,1447);
      const blob = await new Promise(resolve => canvas.toBlob(resolve,'image/png'));
      if (!blob) throw new Error('Could not export');
      this.saveBlob(blob, `Diwali-Invite-${name.replace(/[^\p{L}\p{N}]+/gu,'-').slice(0,48)}.png`);
      this.setStatus(`Your invitation for ${name} is saved.`);
    } catch (error) { this.setStatus('Could not save the image. Please try again.');console.error('Invitation export:',error); }
    finally { button.disabled = false; }
  }
}

customElements.define('diwali-invite',DiwaliInvite);
export { DiwaliInvite, normalizeName };
