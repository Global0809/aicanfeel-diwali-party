const $=selector=>document.querySelector(selector);
const root=document.documentElement;
const motion=matchMedia('(prefers-reduced-motion: reduce)');
const abort=new AbortController();
const cleanup=[];
let motionContext;
function sharedHash(){if(location.hash.startsWith('#invitation?'))$('#invitation').scrollIntoView({behavior:'instant'});}
window.addEventListener('hashchange',sharedHash,{signal:abort.signal});
document.fonts.ready.then(sharedHash);
if(window.gsap&&window.ScrollTrigger){
 const {gsap,ScrollTrigger}=window;gsap.registerPlugin(ScrollTrigger);
 motionContext=gsap.matchMedia();
 motionContext.add('(prefers-reduced-motion: no-preference)',()=>{
  const camera={p:0};
  const timeline=gsap.timeline({defaults:{ease:'none'},onUpdate(){if(window.DIWALI_CAMERA)window.DIWALI_CAMERA.progress=camera.p;root.style.setProperty('--story-progress',camera.p);},scrollTrigger:{trigger:'.diwali-story',start:'top top',end:()=>Math.max(1,$('#invitation').offsetTop-innerHeight*.5),scrub:.65,invalidateOnRefresh:true}});
  timeline.to(camera,{p:1,duration:1},0);
  timeline.to(root,{'--stage-hue':'-5deg','--stage-brightness':.92,duration:.45},0).to(root,{'--stage-hue':'3deg','--stage-brightness':1,duration:.55},.45);
  for(const at of [.29,.65])timeline.to(root,{'--glass-opacity':.18,duration:.07,ease:'sine.inOut'},at).to(root,{'--glass-opacity':0,duration:.09,ease:'sine.inOut'},at+.07);
  gsap.from('.hero-copy .type-line',{y:14,clipPath:'inset(0 0 17% 0)',opacity:.65,stagger:.1,duration:1.1,ease:'expo.out',clearProps:'all'});
  document.querySelectorAll('.diwali-panel:not(.diwali-hero) .diwali-copy').forEach(copy=>{
   gsap.from(copy.querySelectorAll('.type-line'),{y:22,stagger:.08,duration:.85,ease:'expo.out',scrollTrigger:{trigger:copy,start:'top 85%',once:true},clearProps:'all'});
  });
 });
 motionContext.add('(prefers-reduced-motion: reduce)',()=>{if(window.DIWALI_CAMERA)window.DIWALI_CAMERA.progress=.72;root.style.setProperty('--stage-hue','0deg');root.style.setProperty('--stage-brightness','1');root.style.setProperty('--glass-opacity','0');});
 cleanup.push(()=>motionContext.revert());
 document.fonts.ready.then(()=>ScrollTrigger.refresh());
 document.addEventListener('diwali-celebrate',()=>{document.body.classList.add('celebrated');requestAnimationFrame(()=>ScrollTrigger.refresh());},{signal:abort.signal});
}
motion.addEventListener('change',()=>{window.AICANFEEL_REDUCED_MOTION=motion.matches;},{signal:abort.signal});
let fxVisible=true;
const cardObserver=new IntersectionObserver(([entry])=>{document.body.classList.toggle('invitation-visible',entry.isIntersecting);fxVisible=!entry.isIntersecting;syncEmbers();},{rootMargin:'0px 0px -15% 0px',threshold:0});
cardObserver.observe($('#invitation'));cleanup.push(()=>cardObserver.disconnect());

// Small, bounded ember trails complement the native stage; the reveal owns fireworks.
const canvas=$('.night-embers'),ctx=canvas.getContext('2d',{alpha:true});
let width=0,height=0,embers=[],emberFrame=0,last=0;
function resizeEmbers(){width=innerWidth;height=innerHeight;const scale=Math.min(devicePixelRatio,1.25);canvas.width=Math.round(width*scale);canvas.height=Math.round(height*scale);canvas.style.width=width+'px';canvas.style.height=height+'px';ctx.setTransform(scale,0,0,scale,0,0);embers=Array.from({length:width<650?14:34},(_,i)=>({x:Math.random()*width,y:Math.random()*height,speed:6+Math.random()*14,size:i%7===0?1.6:.65,phase:Math.random()*6.28}));}
function emberTick(t){emberFrame=0;if(!fxVisible||document.hidden||motion.matches)return;if(t-last>32){const dt=Math.min((t-last)/1000,.1);last=t;ctx.clearRect(0,0,width,height);for(const e of embers){e.y-=e.speed*dt;if(e.y<0)e.y=height;const x=e.x+Math.sin(t*.0002+e.phase)*13;ctx.globalAlpha=.22+.2*Math.sin(t*.001+e.phase);ctx.fillStyle='#ffdc9e';ctx.fillRect(x,e.y,e.size,e.size);if(e.size>1){ctx.globalAlpha=.11;ctx.fillRect(x,e.y,1,7);}}ctx.globalAlpha=1;}emberFrame=requestAnimationFrame(emberTick);}
function syncEmbers(){if(!ctx)return;if(fxVisible&&!document.hidden&&!motion.matches){if(!emberFrame)emberFrame=requestAnimationFrame(emberTick);}else{cancelAnimationFrame(emberFrame);emberFrame=0;ctx.clearRect(0,0,width,height);}}
resizeEmbers();syncEmbers();
window.addEventListener('resize',resizeEmbers,{signal:abort.signal});document.addEventListener('visibilitychange',syncEmbers,{signal:abort.signal});motion.addEventListener('change',syncEmbers,{signal:abort.signal});cleanup.push(()=>cancelAnimationFrame(emberFrame));
let sceneTimer=setInterval(()=>{const scene=window.AICANFEEL_ORIGINAL_SCENE;if(!scene?.active||scene.skinedMeshes?.length!==13||scene.drawcalls<3)return;scene.post.config.NoiseOpacity.value=window.DIWALI_CAMERA.mobile?.42:.65;document.body.classList.add('scene-ready');clearInterval(sceneTimer);clearTimeout(failureTimer);},100);
const failureTimer=setTimeout(()=>{if(document.body.classList.contains('scene-ready'))return;$('.scene-loading').textContent='The party is ready below. The gorilla is making an entrance.';},20000);
cleanup.push(()=>{clearInterval(sceneTimer);clearTimeout(failureTimer);});
window.addEventListener('pagehide',()=>{abort.abort();cleanup.forEach(fn=>fn());},{once:true});
