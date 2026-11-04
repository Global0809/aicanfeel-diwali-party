import fs from 'node:fs';
import path from 'node:path';


const original = path.resolve('vendor/reference-runtime.js');
let source = fs.readFileSync(original,'utf8');

function replace(before,after,expected=1) {
  const count = source.split(before).length - 1;
  if (count !== expected) throw new Error(`Patch expected ${expected} occurrences but found ${count}: ${before.slice(0,80)}`);
  source = source.split(before).join(after);
}
replace('value:eV()||ZU()', 'value:"red"');
// The Diwali surface drives the retained camera path from its own scroll narrative.
replace('this.scroll=window.pageYOffset/(this.scrollHeight-this.pageHeight)', 'this.scroll=window.DIWALI_PROGRESS??.99');
replace('const TC=["red","black","white"]','const TC=["red"]');
// Select red for the very first composited frame as well as the saved theme.
replace('this.activeTextures=["hape_1","hape_2"]','this.activeTextures=["hape_2","hape_3"]');
replace('this.activeTextureId=0,this.textures={','this.activeTextureId=1,this.textures={');
replace('this.hapes[e].title.mesh.visible=!0','this.hapes[e].title.mesh.visible=!1');
replace('le(g),le(l,null,{default:Me(()=>[Ie(U("p",ate','Zt("",!0),le(l,null,{default:Me(()=>[Ie(U("p",ate');
replace('document.addEventListener("keydown",t=>{(t.key==" "||t.code=="Space")&&t.preventDefault()});','');
replace('this.dpr=Math.max(Math.min(window.devicePixelRatio,1.5),1)','this.dpr=Math.max(Math.min(window.devicePixelRatio,window.innerWidth<768?1:1.5),1)');
replace('home:null,navigation:null,about:null,press:null,pressPostsPerPage:', 'home:window.AICANFEEL_CONTENT.home,navigation:window.AICANFEEL_CONTENT.navigation,about:window.AICANFEEL_CONTENT.about,press:window.AICANFEEL_CONTENT.press,pressPostsPerPage:');
replace('function pp(t,e={}){const n=t==null?void 0:t.asset._ref;if(!n)return _q;', 'function pp(t,e={}){const n=t==null?void 0:t.asset._ref;if(!n)return _q;const local=window.AICANFEEL_CONTENT_MAP[n];if(local)return{src:local,lazy:local};');
replace('fashion:"High-Fashion Hapes"', 'fashion:"AICANFEEL STUDIO"');
replace('copyright:"\\xA9 2024 \\u2022 HAPE LABS"','copyright:"\\xA9 2026 \\u2022 AICANFEEL"');
replace('text1:"Catching",text2:"a",text3:"bunch",text4:"of",text5:"HAPES"','text1:"Entering",text2:"the",text3:"world",text4:"of",text5:"AICANFEEL"');
replace('title:"Our{br} Partners"','title:"Reference{br} Partners"');
replace('creator:"Styled by {name}"','creator:"Reference by {name}"');
// Retain valid frame delta: native animation arithmetic divides by dt. Freeze
// its clock directly so reduced motion cannot introduce 0 * Infinity / NaNs.
replace('this.time+=li.dt/1e3,this.dt=li.dt','this.time+=window.AICANFEEL_REDUCED_MOTION?0:li.dt/1e3,this.dt=li.dt');
replace('initEnterChoregraphy(){this.cameraManager.offset.x=2','initEnterChoregraphy(){if(window.AICANFEEL_REDUCED_MOTION){this.cameraManager.offset.x=0;this.cameraManager.offset.z=0;this.post.config.Exposure.value=.1;return;}this.cameraManager.offset.x=2');
replace('this.config.Pause.value||(this.animTime+=','(window.AICANFEEL_REDUCED_MOTION||this.config.Pause.value)||(this.animTime+=');
// Read-only scene inspection and explicit QA pause; no pose/lighting changes.
replace('this.bloomPass=new eJ(this,this.post)','window.AICANFEEL_ORIGINAL_SCENE=this,window.AICANFEEL_DEBUG_PAUSE=()=>li.unsubscribe("canvas"),window.AICANFEEL_DEBUG_RESUME=()=>li.subscribe("canvas",mi.render.bind(mi),60),this.bloomPass=new eJ(this,this.post)');
function removeSpan(start,end) {
  const a=source.indexOf(start), b=source.indexOf(end,a);
  if(a<0||b<0)throw new Error('Missing model span: '+start);
  source=source.slice(0,a)+source.slice(b);
}
// Red uses Hapes_0003. Keep scene scaffolding but omit the two unused rigs.
removeSpan('n="glxp/models/Hapes_0002_Rigged",','n="glxp/models/Hapes_0003_Rigged",');
removeSpan('n="glxp/models/Hapes_0001_Rigged",','n="glxp/models/Camera_Splines_002",');
removeSpan('n="glxp/models/Hapes_0002_Rigged_anims",','n="glxp/models/Hapes_0003_Rigged_anims",');
replace('const a=fr.main[r].url;e.push(', 'const a=fr.main[r].url;if(a.includes("/textures/Hape_0001/")||a.includes("/textures/Hape_0002/"))continue;e.push(');
// The reference owns the choreography. Only its title mesh, brand strings,
// local data, red theme and mobile render density are adapted here.
fs.writeFileSync('dist/assets/index.d8ad0078.js',source);
const runtimeName='index.diwali-red-v1.js';
fs.writeFileSync('dist/assets/'+runtimeName,source);
for(const filename of fs.readdirSync('dist/assets').filter(name=>name.endsWith('.js')&&!name.startsWith('index.'))){
  const file='dist/assets/'+filename,previous=fs.readFileSync(file,'utf8');
  const next=previous.replace(/index\.(?:d8ad0078|gorilla-v\d+|gorilla-chain-v\d+)\.js/g,runtimeName);
  if(next!==previous)fs.writeFileSync(file,next);
}
for(const filename of fs.readdirSync('dist/assets').filter(name=>/^index\.gorilla-v\d+\.js$/.test(name)))fs.unlinkSync('dist/assets/'+filename);
console.log('Adapted original runtime: red default, AICANFEEL identity, local content, mobile DPR.');

