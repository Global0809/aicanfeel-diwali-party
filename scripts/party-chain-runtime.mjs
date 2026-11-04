/**
 * Add an accessory to the incumbent red-gorilla renderer without changing the
 * gorilla's geometry, fur shader, materials, animation, lights, or camera path.
 *
 * The chain uses ordinary native Zb GPU-skinned meshes. Their copied 41-bone
 * hierarchy receives the same native Hapes_0003 and Dance tracks as the body.
 * No extra animation player, render loop, canvas, or browser library is used.
 */
export function applyPartyChainRuntime(reference, manifest) {
  if (!manifest?.desktop?.assetBase || !manifest?.mobile?.assetBase || !manifest?.materials)
    throw Error('Missing authored chain manifest');
  for (const variant of ['desktop', 'mobile']) {
    const entry=manifest[variant];
    if (!/^glxp\/models\/[A-Za-z0-9_-]+$/.test(entry.assetBase) || !Number.isInteger(entry.meshCount) || entry.meshCount<1 || entry.meshCount>3)
      throw Error('Invalid native chain asset descriptor: '+variant);
  }
  if (!Object.keys(manifest.materials).every(name=>name.startsWith('Party_Chain_')))
    throw Error('Chain material names must have their isolated accessory prefix');
  const complete={...manifest,lighting:{
    keyRadiance:[2.8,2.45,1.95],diffuseEnvironment:.65,specularEnvironment:1.2,
    environment:'env_studio',diffuse:'env_diffuse_grey',...manifest.lighting,
  }};
  let source=reference;
  const patch=(before,after,count=1)=>{
    const actual=source.split(before).length-1;
    if(actual!==count)throw Error('Chain integration anchor mismatch ('+actual+'): '+before.slice(0,100));
    source=source.split(before).join(after);
  };

  // Declare only the new material names before any mesh is constructed.
  patch('async load(){let e=[];',
    'async load(){let e=[];Object.assign(fr.materials,window.AICANFEEL_PARTY_CHAIN.materials);');

  const originalRed='n="glxp/models/Hapes_0003_Rigged",e.push(new mc(n+".json",n+".bin").then(r=>{let a=[];for(let o=0;o<r.length;o++){const l=r[o];l.type=="Null"&&a.push(l)}for(let o=0;o<11;o++){let l;o==0?l=new e0(this,[].concat(r[o*2+0],r[o*2+1],a),"skin","testPng","mixamorig_Hips",2,this.hapes.hape_2.root):l=new Zb(this,[].concat(r[o*2+0],r[o*2+1],a),"skin","testPng","mixamorig_Hips",2,this.hapes.hape_2.root),this.skinedMeshes.push(l),this.hapes.hape_2.meshes.push(l)}}))';
  // Copy the original eleven constructors verbatim, then add the new meshes.
  // One combined promise prevents an accessory racing the body into slot zero
  // and makes the original loader wait for both resources before onLoaded().
  const originalBody=originalRed.slice(originalRed.indexOf('.then(r=>{')+10,-3);
  const chainCreation=String.raw`
    const chainDescriptor=window.innerWidth<768?window.AICANFEEL_PARTY_CHAIN.mobile:window.AICANFEEL_PARTY_CHAIN.desktop;
    const chainNodes=chain.filter(item=>item.type==="Null");
    if(chainNodes.length!==41)throw Error("Accessory skeleton does not match the original gorilla");
    const chainCount=chain.filter(item=>item.type==="triangle").length;
    if(chainCount!==chainDescriptor.meshCount)throw Error("Accessory material count differs from manifest");
    this.partyChainMeshes=[];
    for(let index=0;index<chainCount;index++){
      const skin=chain[index*2],geometry=chain[index*2+1];
      if(!skin.joints||geometry.type!=="triangle"||!geometry.name.startsWith("Party_Chain_"))throw Error("Invalid accessory mesh pair");
      const accessory=new Zb(this,[skin,geometry].concat(chainNodes),"skin","testPng","mixamorig_Hips",2,this.hapes.hape_2.root);
      this.skinedMeshes.push(accessory);
      this.hapes.hape_2.meshes.push(accessory);
      this.partyChainMeshes.push(accessory);
    }
    this.partyChainAsset=chainDescriptor.assetBase;
  `;
  const combined='n="glxp/models/Hapes_0003_Rigged",e.push(Promise.all([new mc(n+".json",n+".bin"),(()=>{const accessory=window.innerWidth<768?window.AICANFEEL_PARTY_CHAIN.mobile:window.AICANFEEL_PARTY_CHAIN.desktop;return new mc(accessory.assetBase+".json",accessory.assetBase+".bin")})()]).then(([r,chain])=>{'+originalBody+chainCreation+'}))';
  patch(originalRed,combined);

  const start=source.indexOf('class Zb{'),end=source.indexOf('class e0{',start);
  if(start<0||end<start)throw Error('Native PBR skinned class missing');
  let standard=source.slice(start,end);
  const inStandard=(before,after,count=1)=>{
    const actual=standard.split(before).length-1;
    if(actual!==count)throw Error('Chain PBR anchor mismatch ('+actual+'): '+before.slice(0,100));
    standard=standard.split(before).join(after);
  };

  // The original environment and pink key remain untouched for every original
  // mesh. Jewellery receives an already-loaded neutral studio reflection and a
  // restrained warm key, so the conductive gold reads as gold in the red set.
  inStandard('this.environement=this.globalConfig.Environement.value',
    'this.environement=this.name.startsWith("Party_Chain_")?window.AICANFEEL_PARTY_CHAIN.lighting.environment:this.globalConfig.Environement.value',2);
  inStandard('this.diffuseEnvironement=this.globalConfig.EnvironementDiffuse.value',
    'this.diffuseEnvironement=this.name.startsWith("Party_Chain_")?window.AICANFEEL_PARTY_CHAIN.lighting.diffuse:this.globalConfig.EnvironementDiffuse.value',2);
  inStandard('const n=this.globalConfig.Debug.value;',String.raw`
    if(this.name.startsWith("Party_Chain_")){
      const lighting=window.AICANFEEL_PARTY_CHAIN.lighting;
      this.localState.uniforms.uLightColor.value=lighting.keyRadiance;
      this.localState.uniforms.uScaleIBLAmbient.value=[this.config.IBL.value*lighting.diffuseEnvironment,this.config.IBL.value*lighting.specularEnvironment,0,0];
    }
    const n=this.globalConfig.Debug.value;`);
  inStandard('cullFace:!1,uniforms:this.localState.uniforms',
    'cullFace:this.name.startsWith("Party_Chain_")?this.gl.BACK:!1,uniforms:this.localState.uniforms');

  // A chain has no normal map. Read the actual smooth geometric normal rather
  // than deriving a tangent from potentially constant UVs on a gold face.
  // This replacement is applied after the incumbent compiler expands WebGL1/2.
  const shaderCreation='this.shader=new Bi(Kn["skined-standard"],1,this.defines);';
  inStandard(shaderCreation,shaderCreation+String.raw`
    if(this.name.startsWith("Party_Chain_")){
      const normalFallback="vec3 n = normalize(tbn[2].xyz);";
      if(!this.shader.frag.includes(normalFallback))throw Error("Accessory normal shader anchor missing");
      this.shader.frag=this.shader.frag.replace(normalFallback,"vec3 n = normalize(vNormal);");
    }
  `);
  source=source.slice(0,start)+standard+source.slice(end);
  return 'window.AICANFEEL_PARTY_CHAIN='+JSON.stringify(complete)+';\n'+source;
}

