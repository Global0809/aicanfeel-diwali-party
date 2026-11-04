import fs from 'node:fs';
import {applyMobileTexturesRuntime} from './mobile-textures-runtime.mjs';
import path from 'node:path';
import { applyCameraRuntime } from './camera-runtime.mjs';
import { applyPartyChainRuntime } from './party-chain-runtime.mjs';
import { prepareCompressedNativeAssets, applyCompressedAssetsRuntime } from './compressed-assets-runtime.mjs';

const original = path.resolve('vendor/reference-runtime.js');
let source = fs.readFileSync(original,'utf8');

function replace(before,after,expected=1) {
  const count = source.split(before).length - 1;
  if (count !== expected) throw new Error(`Patch expected ${expected} occurrences but found ${count}: ${before.slice(0,80)}`);
  source = source.split(before).join(after);
}
replace('value:eV()||ZU()', 'value:"red"');
// One scroll progress value controls the complete close-up to wide orbit.
replace('this.scroll=window.pageYOffset/(this.scrollHeight-this.pageHeight)', 'this.scroll=window.DIWALI_CAMERA?.progress??0');
replace('const TC=["red","black","white"]','const TC=["red"]');
replace('this.scene.on("error",()=>{this.loader.$patch(t=>{t.status="error"})})','this.scene.on("error",()=>{this.loader.$patch(t=>{t.status="error"}),window.DIWALI_MODEL_ERROR=true,window.dispatchEvent(new CustomEvent("diwali-model-error"))})');
// Native route audio stays disabled so the explicit entry/sound controls can
// lazily start the original ambient track through party-audio.js. Hidden
// trailer/Konami media remain excluded; model/file loader promises are intact.
replace('sound:!0,loader:', 'sound:!1,loader:', 3);
replace('trailer720(){var t;return(t=this.data.navigation)==null?void 0:t.trailer.trailer720}', 'trailer720(){return null}');
replace('trailer1080(){var t;return(t=this.data.navigation)==null?void 0:t.trailer.trailer1080}', 'trailer1080(){return null}');
replace('this.isKonami=!1,new HW(()=>{this.onKonami()})', 'this.isKonami=!1');
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
// UV_Grid is an unused authoring/debug texture: native skinned materials and
// the floor store that old constructor argument but never sample it.
replace('const a=fr.main[r].url;e.push(', 'const a=fr.main[r].url;if(r==="test"||r==="testPng"||a.includes("/textures/Hape_0001/")||a.includes("/textures/Hape_0002/"))continue;e.push(');
source = applyCameraRuntime(source);
const chainManifest=JSON.parse(fs.readFileSync('vendor/accessories/party-chain-manifest.json', 'utf8'));
source = applyPartyChainRuntime(source, chainManifest);
const compressedNativeAssets=prepareCompressedNativeAssets(process.cwd(),chainManifest);
source = applyCompressedAssetsRuntime(source,compressedNativeAssets);
// Model data, materials, native fur shading and the red studio are retained.
// The original camera spline and mobile budgets are isolated in camera-runtime.mjs.
source=applyMobileTexturesRuntime(source,JSON.parse(fs.readFileSync('dist/mobile-textures/manifest.json','utf8')));
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

