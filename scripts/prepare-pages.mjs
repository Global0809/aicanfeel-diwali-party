import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const project=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const output=path.join(project,'..','pages-preview','aicanfeel-diwali-party');
const prefix='/aicanfeel-diwali-party/';
const assetDirectory='assets-final';
const appRevision='night4';
const expectedOutput=path.resolve(project,'..','pages-preview','aicanfeel-diwali-party');
if(output!==expectedOutput||!output.startsWith(path.resolve(project,'..')+path.sep))throw new Error('Pages output leaves the task workspace');
fs.rmSync(output,{recursive:true,force:true});
fs.mkdirSync(output,{recursive:true});
const rewritten=[];
function copyTree(from,to){
 fs.mkdirSync(to,{recursive:true});
 for(const item of fs.readdirSync(from,{withFileTypes:true})){
  const source=path.join(from,item.name);
  const finalModule=from===path.join(project,'dist')&&/^(?:diwali|invite-card|party-loader|party-audio)\.(?:js|css)$/.test(item.name);
  const target=path.join(to,finalModule?item.name.replace(/\.(js|css)$/,'.'+appRevision+'.$1'):item.name);
  if(item.isDirectory()){copyTree(source,item.name==='assets'&&from===path.join(project,'dist')?path.join(to,assetDirectory):target);continue;}
  let data=fs.readFileSync(source);
  if(/\.(?:html|css|js|json|svg)$/.test(item.name)){
   let text=data.toString('utf8');
   text=text.replace(/(["'`(])\/(assets|glxp|vendors|vendor|content|textures|mobile-textures)\//g,(_,mark,dir)=>mark+prefix+(dir==='assets'?assetDirectory:dir)+'/');
   text=text.replace(/(["'`])\/(favicon\.svg|diwali\.css|invite-card\.css|diwali\.js|invite-card\.js|content\.js|party-loader\.css|party-loader\.js|party-audio\.js)(["'`])/g,(_,mark,file,end)=>mark+prefix+file+end);
   if(item.name==='index.html')text=text.replace('<head>','<head><base href="'+prefix+'">').replace(/(\/(?:diwali|invite-card|party-loader|party-audio))\.(js|css)(["'])/g,'$1.'+appRevision+'.$2$3');
   if(item.name==='party-audio.js')text=text.replace('./assets/','./'+assetDirectory+'/');
   if(/index\.diwali-red-v1\.js$|index\.d8ad0078\.js$/.test(item.name)){
    const anchor='history:uU(),scrollBehavior';
    if(!text.includes(anchor))throw new Error('Missing native router base anchor');
    text=text.replace(anchor,'history:uU("'+prefix+'"),scrollBehavior');
   }
   data=Buffer.from(text);rewritten.push(path.relative(output,target));
  }
  fs.writeFileSync(target,data);
 }
}
copyTree(path.join(project,'dist'),output);
// A fresh, readable share path gives messaging crawlers their own preview URL.
// The native router's catch-all still renders the same 3D invitation here.
const publicURL='https://global0809.github.io'+prefix;
const shareURL=publicURL+'invite/';
const rootHTML=fs.readFileSync(path.join(output,'index.html'),'utf8');
const canonical='rel="canonical" href="'+publicURL+'"';
const graphURL='property="og:url" content="'+publicURL+'"';
if(!rootHTML.includes(canonical)||!rootHTML.includes(graphURL))throw new Error('Missing share metadata anchors');
const shareHTML=rootHTML.replace(canonical,'rel="canonical" href="'+shareURL+'"').replace(graphURL,'property="og:url" content="'+shareURL+'"');
fs.mkdirSync(path.join(output,'invite'),{recursive:true});
fs.writeFileSync(path.join(output,'invite','index.html'),shareHTML);
fs.writeFileSync(path.join(output,'.nojekyll'),'');
console.log(JSON.stringify({output,prefix,shareURL,rewritten:rewritten.length}));
