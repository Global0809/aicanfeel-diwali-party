import fs from 'node:fs';
import path from 'node:path';
import { gzipSync, gunzipSync } from 'node:zlib';

/** Precompress only the native binary resources used by the retained red scene. */
export function prepareCompressedNativeAssets(projectRoot, chainManifest) {
  const assetNames = [
    'glxp/models/Hapes_0003_Rigged.bin',
    'glxp/models/Hapes_0003_Rigged_anims.bin',
    'glxp/models/Camera_Splines_002.bin',
    'glxp/models/Website_Elements_Env.bin',
    'glxp/models/Dance_anims.bin',
    `${chainManifest.desktop.assetBase}.bin`,
    `${chainManifest.mobile.assetBase}.bin`,
  ];
  const entries = {};
  for (const asset of new Set(assetNames)) {
    if (!/^glxp\/models\/[A-Za-z0-9_-]+\.bin$/.test(asset)) throw new Error('Unexpected native binary path: ' + asset);
    const rawPath = path.join(projectRoot, 'dist', asset);
    const raw = fs.readFileSync(rawPath);
    const compressed = gzipSync(raw, {level: 9});
    if (!gunzipSync(compressed).equals(raw)) throw new Error('Compressed binary round-trip failed: ' + asset);
    const output = rawPath + '.gz';
    if (!fs.existsSync(output) || !fs.readFileSync(output).equals(compressed)) fs.writeFileSync(output, compressed);
    entries[asset] = {url: asset + '.gz', rawBytes: raw.length, gzipBytes: compressed.length};
  }
  return entries;
}

/**
 * Replace the two native model/animation loadBin methods. Textures, JSON,
 * unrelated requests and the browser's global fetch/XHR remain untouched.
 */
export function applyCompressedAssetsRuntime(input, entries) {
  const original = 'loadBin:function(){return new Promise((e,n)=>{var i=new XMLHttpRequest;i.open("GET",this.bin,!0),i.responseType="arraybuffer",i.onload=function(s){e(i.response)},i.send()})}';
  const count = input.split(original).length - 1;
  if (count !== 2) throw new Error('Expected exactly two native binary loaders; found ' + count);
  const patched = input.split(original).join('loadBin:function(){return __diwaliLoadNativeBin(this.bin)}');
  const runtime = `
const __diwaliBinaryAssets=${JSON.stringify(entries)};
function __diwaliRawNativeBin(url){return new Promise((resolve,reject)=>{
  const fail=message=>{window.DIWALI_MODEL_ERROR=true;window.dispatchEvent(new CustomEvent('diwali-model-error'));reject(new Error(message));};
  const request=new XMLHttpRequest();request.open('GET',url,true);request.responseType='arraybuffer';
  request.onload=()=>{if(request.status>=200&&request.status<300&&request.response instanceof ArrayBuffer)resolve(request.response);else fail('Native binary could not load: '+url);};
  request.onerror=()=>fail('Native binary network error: '+url);request.send();
});}
async function __diwaliLoadNativeBin(url){
  const entry=__diwaliBinaryAssets[url];
  if(!entry||typeof DecompressionStream!=='function')return __diwaliRawNativeBin(url);
  try{
    const response=await fetch(entry.url,{credentials:'same-origin'});
    if(!response.ok)throw new Error('Compressed native asset unavailable');
    const compressed=await response.arrayBuffer(),magic=new Uint8Array(compressed,0,Math.min(2,compressed.byteLength));
    // Some hosts transparently decode Content-Encoding. Accept the resulting
    // native buffer directly; otherwise perform explicit local gzip decoding.
    const binary=magic[0]===31&&magic[1]===139?await new Response(new Blob([compressed]).stream().pipeThrough(new DecompressionStream('gzip'))).arrayBuffer():compressed;
    if(binary.byteLength!==entry.rawBytes)throw new Error('Native binary size mismatch');
    return binary;
  }catch(error){return __diwaliRawNativeBin(url);}
}
`;
  return runtime + '\n' + patched;
}
