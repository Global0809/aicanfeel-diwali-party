import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const project=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const output=path.join(project,'..','pages-preview','aicanfeel-diwali-party');
const prefix='/aicanfeel-diwali-party/';
fs.mkdirSync(output,{recursive:true});
const rewritten=[];
function copyTree(from,to){
 fs.mkdirSync(to,{recursive:true});
 for(const item of fs.readdirSync(from,{withFileTypes:true})){
  const source=path.join(from,item.name),target=path.join(to,item.name);
  if(item.isDirectory()){copyTree(source,target);continue;}
  let data=fs.readFileSync(source);
  if(/\.(?:html|css|js|json|svg)$/.test(item.name)){
   let text=data.toString('utf8');
   text=text.replace(/(["'`(])\/(assets|glxp|vendors|vendor|content|textures|mobile-textures)\//g,(_,mark,dir)=>mark+prefix+dir+'/');
   text=text.replace(/(["'`])\/(favicon\.svg|diwali\.css|invite-card\.css|diwali\.js|invite-card\.js|content\.js)(["'`])/g,(_,mark,file,end)=>mark+prefix+file+end);
   if(item.name==='index.html')text=text.replace('<head>','<head><base href="'+prefix+'">');
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
fs.writeFileSync(path.join(output,'.nojekyll'),'');
console.log(JSON.stringify({output,prefix,rewritten:rewritten.length}));
