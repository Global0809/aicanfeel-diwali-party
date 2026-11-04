/**
 * Select pre-sized red JPEG maps only for the phone camera. The native loader
 * normally inserts a lodTarget directory and a JPEG/KTX suffix; mobile variants
 * are final URLs, so only those requests omit its size/compression rewriting.
 * Sampling, flipY, repeat, filtering, texture names and material bindings stay
 * native. Desktop requests retain their original URLs and options.
 */
export function applyMobileTexturesRuntime(source, manifest) {
  if (!manifest?.entries || typeof manifest.entries !== 'object') throw new Error('Missing mobile texture manifest entries');
  const urls = {};
  for (const [original, entry] of Object.entries(manifest.entries)) {
    if (!/^\/(?:textures\/Hape_0003\/|glxp\/environment\/)/.test(original)) throw new Error('Unexpected original mobile texture URL: ' + original);
    if (!entry || typeof entry.url !== 'string' || !entry.url.startsWith('/mobile-textures/')) throw new Error('Unexpected generated mobile texture URL: ' + entry?.url);
    urls[original] = entry.url;
  }
  if (!Object.keys(urls).length) throw new Error('Empty mobile texture manifest');
  const declaration = 'const a=fr.main[r].url';
  const loader = 'this.textureLoader.load(a,r,fr.main[r].options)';
  if (source.split(declaration).length - 1 !== 1) throw new Error('Expected exactly one retained native texture asset loop');
  if (source.split(loader).length - 1 !== 1) throw new Error('Expected exactly one retained native texture load call');
  const selected = 'const __diwaliPhoneTexture=window.DIWALI_CAMERA?.mobile?__diwaliMobileTextureURLs[fr.main[r].url]:null,a=__diwaliPhoneTexture||fr.main[r].url';
  const mobileLoader = 'this.textureLoader.load(a,r,__diwaliPhoneTexture?fr.main[r].options.filter(option=>option!=="compressed"&&!option.startsWith("lodTarget=")):fr.main[r].options)';
  const patched = source.replace(declaration, selected).replace(loader, mobileLoader);
  return `const __diwaliMobileTextureURLs=${JSON.stringify(urls)};\n` + patched;
}
