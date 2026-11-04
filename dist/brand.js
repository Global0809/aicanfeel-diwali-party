/* Small brand adaptation. The original runtime owns scene and route state. */
(() => {
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  motion.addEventListener('change', event => { window.AICANFEEL_REDUCED_MOTION = event.matches; });
  function applyBrand() {
    document.querySelectorAll('.site-content__intro-logo:not([data-aicanfeel])').forEach(holder => {
      holder.dataset.aicanfeel = 'true';
      const title = document.createElement('h1');
      title.className = 'aicanfeel-wordmark';
      title.textContent = 'AICANFEEL';
      holder.append(title);
      holder.querySelector('svg')?.setAttribute('aria-hidden','true');
    });
    document.querySelectorAll('.sound-toggle__button:not([aria-label])').forEach(el => el.setAttribute('aria-label','Toggle sound'));
    document.querySelectorAll('button').forEach(el => {
      if (el.querySelector('.burger')) el.setAttribute('aria-label',el.closest('.site-menu') ? 'Close menu' : 'Open menu');
      else if (el.querySelector('.svg--hape')) el.setAttribute('aria-label','Explore runway');
      else if (el.querySelector('.svg--roadmap')) el.setAttribute('aria-label','Our Roadmap');
      else if (el.closest('.site-toolbar__exit')) el.setAttribute('aria-label','Exit runway');
    });
    document.querySelectorAll('.logo-sprite').forEach(el => { el.setAttribute('role','img'); el.setAttribute('aria-label','AICANFEEL'); });
  }
  const observer = new MutationObserver(applyBrand);
  observer.observe(document.getElementById('app'),{childList:true,subtree:true});
  applyBrand();
  window.addEventListener('pagehide',() => observer.disconnect(),{once:true});
})();
