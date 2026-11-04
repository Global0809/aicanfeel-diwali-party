/**
 * Focused patches to the retained OGL renderer. No model, bone, material, fur
 * shader or camera/light-spline data is replaced. The original reference
 * camera and target splines run once from progress zero to one, driven by
 * scroll. Their measured orbit is 379.4368 degrees around the gorilla.
 */
export function applyCameraRuntime(input) {
  let source = input;
  const replace = (before, after, expected = 1) => {
    const count = source.split(before).length - 1;
    if (count !== expected) throw new Error(`Camera patch expected ${expected}, found ${count}: ${before.slice(0, 100)}`);
    source = source.split(before).join(after);
  };

  // Keep runCameraProgress completely unchanged: original camera, look-at,
  // light, scale and pointer parallax. Scroll visits its 0..1 sequence once.
  replace('preRender(){this.orbitWalk.update(),EE(X2', 'preRender(){if(window.DIWALI_CAMERA&&window.DIWALI_CAMERA.enabled!==false){this.hapeWalkProgress=0;this.runCameraProgress();return;}this.orbitWalk.update(),EE(X2');
  replace('setProgress(e){this.progressTarget=e}', 'setProgress(e){this.progressTarget=Math.min(1,Math.max(0,Number.isFinite(e)?e:0))}');
  replace('e*=this.config.scroll_damping.value,this.timescale=', 'e*=window.AICANFEEL_REDUCED_MOTION?1:window.DIWALI_CAMERA&&window.DIWALI_CAMERA.enabled!==false?1-Math.exp(-Math.min(this.dt,100)/135):this.config.scroll_damping.value,this.timescale=');

  // Entering no longer runs a second camera/exposure tween independently of
  // scroll. This also makes the very first settled frame correctly exposed.
  const entryStart = source.indexOf('initEnterChoregraphy(){');
  const entryEnd = source.indexOf('enterHapeWalk(){', entryStart);
  if (entryStart < 0 || entryEnd < 0) throw new Error('Missing native entry choreography span');
  source = source.slice(0, entryStart) + 'initEnterChoregraphy(){this.cameraManager.offset.set(0,0,0);this.cameraManager.offsetLook.set(0,0,0);this.post.config.Exposure.value=.1}enterScene(){this.initEnterChoregraphy()}' + source.slice(entryEnd);
  replace('setFooterOffset(e){this.cameraManager.offset.y=-e/175,this.cameraManager.offsetLook.y=-e/175}', 'setFooterOffset(e){if(window.DIWALI_CAMERA&&window.DIWALI_CAMERA.enabled!==false)return;this.cameraManager.offset.y=-e/175,this.cameraManager.offsetLook.y=-e/175}');

  // Never let the hidden reference debug panel reset the first frame to white.
  replace('this.sceneConfig={Hape:{value:"white"', 'this.sceneConfig={Hape:{value:"red"');

  // Red is the only authored theme; rendering other passes during the old
  // 41-frame warm-up did no useful visual work. Three red frames are enough
  // for the native promise to resolve after the assets are already loaded.
  replace('(this.compositing.needsUpdate("hape_1")||this.forceAllDraw)&&this.drawPass("hape_1"),(this.compositing.needsUpdate("hape_2")||this.forceAllDraw)&&this.drawPass("hape_2"),(this.compositing.needsUpdate("hape_3")||this.forceAllDraw)&&this.drawPass("hape_3")', 'this.drawPass("hape_2")');
  replace('this.forceAllDraw&&this.drawcalls>40', 'this.forceAllDraw&&this.drawcalls>2');
  replace('this.bloomPass=new eJ(this,this.post),this.post.onLoaded()', 'this.bloomPass=new eJ(this,this.post),this.bloomPass.setBloomSetting("hape_2"),this.post.onLoaded()');
  replace('this._emitter.emit("progress",Math.round(s/e.length*100))', 'this._emitter.emit("progress",Math.round(s/e.length*100)),window.dispatchEvent(new CustomEvent("diwali-model-progress",{detail:{progress:s/e.length,percent:Math.round(s/e.length*100),stage:"assets"}}))');
  replace('this.debugManager.onLoaded(),ot.onLoaded(),ot.pane.refresh()}', 'this.debugManager.onLoaded(),ot.onLoaded(),ot.pane.refresh(),window.dispatchEvent(new CustomEvent("diwali-model-progress",{detail:{progress:1,percent:100,stage:"loaded",meshes:this.skinedMeshes.length}}))}');

  // Keep all shader inputs valid, but shrink render targets for unused themes.
  // The selected red target, ground reflection and model are unchanged.
  replace('class t0{constructor(e,{}={}){this.gl=e.gl,this.scene=e,this.rt=new wp(this.scene,1,"rgb",null,!0)', 'class t0{constructor(e,{scale:n=1}={}){this.gl=e.gl,this.scene=e,this.rt=new wp(this.scene,n,"rgb",null,!0)');
  replace('class n0{constructor(e,{}={}){this.gl=e.gl,this.scene=e,this.rt=new wp(this.scene,.25,"rgb",null,!0)', 'class n0{constructor(e,{scale:n=.25}={}){this.gl=e.gl,this.scene=e,this.rt=new wp(this.scene,n,"rgb",null,!0)');
  replace('hape_1:{meshes:[],rt:new t0(this),floorRt:new n0(this),', 'hape_1:{meshes:[],rt:new t0(this,{scale:.01}),floorRt:new n0(this,{scale:.01}),');
  replace('hape_3:{meshes:[],rt:new t0(this),floorRt:new n0(this),', 'hape_3:{meshes:[],rt:new t0(this,{scale:.01}),floorRt:new n0(this,{scale:.01}),');

  // Mobile retains the base skin and two evenly spaced outer fur shells. The
  // desktop keeps all four shells. All use the reference's exact fur shader.
  replace('let n=4;for(let i=0;i<n;i++)this[`program${i+1}`]', 'let n=window.DIWALI_CAMERA.mobile?2:4;for(let i=0;i<n;i++)this[`program${i+1}`]');
  replace('this.program.uniforms.uPass.value=i+1})', 'this.program.uniforms.uPass.value=(i+1)*4/n})');
  // Use an even number of bloom passes so the original output target remains
  // correct. Mobile uses four passes at a slightly smaller resolution.
  replace('this.rtScale=.3,this.power=0', 'this.rtScale=window.DIWALI_CAMERA.mobile?.24:.3,this.power=0');
  replace('this.blurPass=[[15,0],[0,15],[7,-1],[-1,7],[3,1],[1,3]]', 'this.blurPass=window.DIWALI_CAMERA.mobile?[[15,0],[0,15],[3,1],[1,3]]:[[15,0],[0,15],[7,-1],[-1,7],[3,1],[1,3]]');

  // This guard runs before GL clear/draw, retaining the last valid frame when
  // the card completely covers it or the document is hidden. It also samples
  // actual rendered-frame intervals for a conservative mobile DPR fallback.
  replace('render(){let e=this.gl;e.clearColor(this.clearColor[0]', 'render(){if(window.DIWALI_CAMERA&&!window.DIWALI_CAMERA.shouldRender(this.getScene("main")))return;let e=this.gl;e.clearColor(this.clearColor[0]');
  return bootstrap + '\n' + source;
}

const bootstrap = `
/* Diwali camera/performance adapter; the retained OGL runtime follows below. */
(()=>{
  const api=window.DIWALI_CAMERA=Object.assign({progress:0,enabled:true,paused:false,adaptive:true},window.DIWALI_CAMERA||{});
  const motion=matchMedia('(prefers-reduced-motion: reduce)');
  const mobile=innerWidth<768||matchMedia('(pointer: coarse)').matches;
  const phoneDprFloor=Math.min(1.15,Math.max(devicePixelRatio||1,1));
  api.mobile=mobile;
  api.quality=mobile?'high-detail-mobile-v2':'reference-desktop';
  api.metrics={profile:mobile?'mobile':'desktop',furShells:mobile?2:4,bloomPasses:mobile?4:6,dpr:Math.max(1,Math.min(devicePixelRatio||1,1.5)),dprFloor:mobile?phoneDprFloor:1,frameMs:0,fps:0,renderedFrames:0,skippedFrames:0,qualityChanges:0};
  const clamp=value=>Math.min(1,Math.max(0,Number.isFinite(value)?value:0));
  api.path='HAPE Camera_Splines_002';
  api.referenceOrbitDegrees=379.43683643365455;
  api.pose=(progress=api.progress)=>{
    const scene=window.AICANFEEL_ORIGINAL_SCENE,manager=scene?.cameraManager;
    if(!manager?.catmulls?.camera||!manager.catmulls.lookat)return null;
    const p=clamp(progress),camera=manager.catmulls.camera.getPointLinearMotion(p),look=manager.catmulls.lookat.getPointLinearMotion(p*1.3);
    const position=[camera[0]*scene.root.scale[0],camera[1]*scene.root.scale[1],camera[2]*scene.root.scale[2]];
    const target=[look[0]*scene.root.scale[0],look[1]*scene.root.scale[1],look[2]*scene.root.scale[2]];
    return {position,target,distance:Math.hypot(...position.map((value,index)=>value-target[index])),angle:Math.atan2(position[0]-target[0],position[2]-target[2]),progress:p};
  };
  let last=0,average=0,samples=0,lastQualityChange=0,changePending=false,cardEnd=Infinity,lastPose=-1,lastSize='';
  const abort=new AbortController();
  const measure=()=>{const card=document.getElementById('invitation');cardEnd=card?card.offsetTop+8:Infinity;};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',measure,{once:true,signal:abort.signal});else measure();
  window.addEventListener('resize',measure,{signal:abort.signal,passive:true});
  document.fonts?.ready.then(measure);
  const observer=typeof ResizeObserver==='function'?new ResizeObserver(measure):null;
  if(observer&&document.querySelector('.diwali-story'))observer.observe(document.querySelector('.diwali-story'));
  api.shouldRender=scene=>{
    const metrics=api.metrics;
    if(document.hidden||api.paused||scrollY>=cardEnd){last=0;metrics.skippedFrames++;return false;}
    if(!scene?.active)return true;
    const p=clamp(api.progress),size=innerWidth+'x'+innerHeight;
    if(motion.matches&&scene.drawcalls>2&&Math.abs(scene.progress-p)<.001&&Math.abs(lastPose-p)<.0001&&size===lastSize){metrics.skippedFrames++;return false;}
    lastPose=p;lastSize=size;
    const now=performance.now(),dt=last?now-last:0;last=now;
    metrics.renderedFrames++;metrics.dpr=scene.dpr;
    if(dt>0&&dt<250&&scene.drawcalls>30){average=average?average*.92+dt*.08:dt;samples++;metrics.frameMs=+average.toFixed(2);metrics.fps=+(1000/average).toFixed(1);}
    if(mobile&&api.adaptive&&samples>60&&average>35&&scene.dpr>phoneDprFloor+.01&&now-lastQualityChange>7000&&!changePending){
      changePending=true;lastQualityChange=now;
      setTimeout(()=>{
        if(document.hidden){changePending=false;return;}
        const next=Math.max(phoneDprFloor,Math.round((scene.dpr-.15)*100)/100);
        scene.dpr=next;scene.manager.dpr=next;
        window.dispatchEvent(new Event('resize'));
        metrics.dpr=next;metrics.qualityChanges++;samples=0;average=0;last=0;changePending=false;
      },0);
    }
    return true;
  };
  window.addEventListener('pagehide',()=>{abort.abort();observer?.disconnect();},{once:true});
})();
`;
