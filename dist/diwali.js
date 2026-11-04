const $ = selector => document.querySelector(selector);
const root = document.documentElement;
const motion = matchMedia('(prefers-reduced-motion: reduce)');
const abort = new AbortController();
const menu = $('#diwali-menu');
const menuButton = $('.diwali-menu-toggle');
const cleanup = [];
function setMenu(open, returnFocus = false) {
  document.body.classList.toggle('diwali-menu-open', open);
  menu.inert = !open;
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  if (open) menu.querySelector('a').focus();
  else if (returnFocus) menuButton.focus();
}
menuButton.addEventListener('click', () => setMenu(menu.inert), {signal:abort.signal});
menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false), {signal:abort.signal}));
document.addEventListener('keydown', event => {
  if(menu.inert)return;
  if(event.key==='Escape')setMenu(false,true);
  if(event.key==='Tab') {
    const links=[menuButton,...menu.querySelectorAll('a')];
    const next=(links.indexOf(document.activeElement)+(event.shiftKey?-1:1)+links.length)%links.length;
    event.preventDefault();links[next].focus();
  }
}, {signal:abort.signal});
// Names stay in the URL fragment. A reload can open the matching personal card.
function sharedLink() {
  if(location.hash.startsWith('#invitation?'))$('#invitation').scrollIntoView({behavior:'instant'});
}
window.addEventListener('hashchange',sharedLink,{signal:abort.signal});
document.fonts.ready.then(sharedLink);

if(window.gsap && window.ScrollTrigger) {
  const {gsap,ScrollTrigger}=window;
  gsap.registerPlugin(ScrollTrigger);
  const mm=gsap.matchMedia();
  mm.add('(prefers-reduced-motion: no-preference)', () => {
    const camera={progress:.99};
    const timeline=gsap.timeline({
      defaults:{ease:'none'},
      onUpdate:()=>{window.DIWALI_PROGRESS=camera.progress;},
      scrollTrigger:{trigger:'.diwali-story',start:'top top',end:()=>$('#invitation').offsetTop,scrub:1.25,invalidateOnRefresh:true}
    });
    timeline.to(camera,{progress:.99,duration:.28},0)
      .to(camera,{progress:.46,duration:.72,ease:'sine.inOut'},.28)
      .to(camera,{progress:.99,duration:1,ease:'sine.inOut'},1)
      .to(camera,{progress:.99,duration:1},2);
    timeline.to(root,{'--stage-hue':'-7deg','--stage-brightness':.78,'--stage-saturation':.92,duration:1},0)
      .to(root,{'--stage-hue':'6deg','--stage-brightness':.88,'--stage-saturation':1.06,duration:1},1)
      .to(root,{'--stage-hue':'-3deg','--stage-brightness':.68,'--stage-saturation':.95,duration:1},2);
    // A short refractive veil at the joins, clear at each settled scene.
    for(const at of [.55,1.55,2.55]) {
      timeline.to(root,{'--glass-opacity':.23,duration:.2,ease:'sine.inOut'},at)
        .to(root,{'--glass-opacity':0,duration:.25,ease:'sine.inOut'},at+.2);
    }
    gsap.from('.hero-copy',{y:16,opacity:.65,duration:1.1,ease:'expo.out',clearProps:'transform,opacity'});
    return ()=>{window.DIWALI_PROGRESS=.99;};
  });
  mm.add('(prefers-reduced-motion: reduce)',()=>{
    window.DIWALI_PROGRESS=.99;
    root.style.setProperty('--stage-hue','0deg');root.style.setProperty('--stage-brightness','1');root.style.setProperty('--stage-saturation','1');root.style.setProperty('--glass-opacity','0');
  });
  cleanup.push(()=>mm.revert());
  document.fonts.ready.then(()=>ScrollTrigger.refresh());
}
motion.addEventListener('change',()=>{window.AICANFEEL_REDUCED_MOTION=motion.matches;},{signal:abort.signal});
const cardObserver=new IntersectionObserver(([entry])=>document.body.classList.toggle('invitation-visible',entry.isIntersecting),{threshold:0,rootMargin:'0px 0px -20% 0px'});
cardObserver.observe($('#invitation'));cleanup.push(()=>cardObserver.disconnect());

// Wait for the native asset loader, then show the camera at the hero's position.
let sceneTimer=setInterval(()=>{
  const scene=window.AICANFEEL_ORIGINAL_SCENE;
  if(!scene?.active || !scene.skinedMeshes?.length || scene.drawcalls < 45)return;
  scene.setProgress(window.DIWALI_PROGRESS);
  if(Math.abs(scene.progress-window.DIWALI_PROGRESS)>.015)return;
  clearInterval(sceneTimer);clearTimeout(failureTimer);document.body.classList.add('scene-ready');
},150);
const failureTimer=setTimeout(()=>{
  if(document.body.classList.contains('scene-ready'))return;
  $('.scene-loading').textContent='The 3D scene is taking longer to load. Your invitation is ready below.';
},25000);
cleanup.push(()=>{clearInterval(sceneTimer);clearTimeout(failureTimer);});
window.addEventListener('pagehide',()=>{abort.abort();cleanup.forEach(fn=>fn());},{once:true});
