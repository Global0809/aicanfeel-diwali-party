/* The reference's original 19.252-second ambient loop, loaded after consent. */
const ambientURL = new URL('./assets/ambient.162c18a7.mp3', import.meta.url).href;

/**
 * Importing this module installs window.DIWALI_AUDIO without loading audio.
 * Call start()/toggle() directly inside a trusted entry/sound button gesture.
 * mute() selects quiet entry without creating an AudioContext or fetching media.
 */
export function initPartyAudio({storageKey='aicanfeel-diwali-sound',onChange}={}) {
  if (window.DIWALI_AUDIO) return window.DIWALI_AUDIO;
  let preferred=false;
  try { preferred=localStorage.getItem(storageKey)==='on'; } catch {}
  const state={enabled:false,playing:false,loading:false,preferred,blocked:false,error:null,duration:19.25225};
  let context=null,gain=null,source=null,buffer=null,bufferPromise=null,media=null;
  let consent=false,disposed=false,revision=0,offset=0,startedAt=0;
  const abort=new AbortController();
  const emit=()=>{
    const snapshot={...state};
    onChange?.(snapshot);
    window.dispatchEvent(new CustomEvent('diwali-audio-state',{detail:snapshot}));
  };
  const remember=value=>{
    state.preferred=value;
    try { localStorage.setItem(storageKey,value?'on':'off'); } catch {}
  };
  const stopSource=()=>{
    if (!source) return;
    const stopping=source;source=null;
    if (context&&buffer) offset=(offset+Math.max(0,context.currentTime-startedAt))%buffer.duration;
    try { stopping.stop(); } catch {}
    stopping.disconnect();
  };
  const reportError=error=>{
    state.playing=false;state.loading=false;state.blocked=true;
    state.error=error?.name==='NotAllowedError'?'Tap the sound button to start the music.':'The music could not load. Tap sound to try again.';
    emit();return false;
  };
  const loadBuffer=()=>{
    if (buffer) return Promise.resolve(buffer);
    if (!bufferPromise) bufferPromise=fetch(ambientURL,{signal:abort.signal,credentials:'same-origin'})
      .then(response=>{if(!response.ok)throw new Error('Ambient track unavailable');return response.arrayBuffer();})
      .then(bytes=>context.decodeAudioData(bytes))
      .then(decoded=>{buffer=decoded;state.duration=decoded.duration;return decoded;})
      .catch(error=>{bufferPromise=null;throw error;});
    return bufferPromise;
  };
  const api={
    get state(){return {...state};},
    source:ambientURL,
    async start(){
      if (disposed) return false;
      if (navigator.userActivation&&!navigator.userActivation.isActive) {
        state.blocked=true;state.error='Tap the sound button to start the music.';emit();return false;
      }
      const request=++revision;
      consent=true;state.enabled=true;state.loading=true;state.blocked=false;state.error=null;remember(true);emit();
      const AudioContextClass=window.AudioContext||window.webkitAudioContext;
      try {
        if (!AudioContextClass) {
          if (!media) {
            media=new Audio();media.preload='none';media.loop=true;media.volume=.6;media.src=ambientURL;
          }
          // play() is called before the first await, preserving the gesture.
          const playback=media.play();
          if (playback) await playback;
          if (request!==revision||!state.enabled) {media.pause();return false;}
          state.loading=false;state.playing=true;emit();return true;
        }
        if (!context) {
          context=new AudioContextClass();gain=context.createGain();gain.gain.value=0;gain.connect(context.destination);
          context.onstatechange=()=>{
            state.playing=state.enabled&&!!source&&context.state==='running'&&!document.hidden;emit();
          };
        }
        // resume() happens synchronously in the entry/sound click handler.
        const resumed=context.resume();
        const decoded=loadBuffer();
        await resumed;
        await decoded;
        if (request!==revision||!state.enabled||disposed) return false;
        stopSource();
        source=context.createBufferSource();source.buffer=buffer;source.loop=true;source.connect(gain);
        startedAt=context.currentTime;
        gain.gain.cancelScheduledValues(startedAt);gain.gain.setValueAtTime(0,startedAt);gain.gain.linearRampToValueAtTime(.6,startedAt+.65);
        source.start(0,offset%buffer.duration);
        state.loading=false;state.playing=context.state==='running'&&!document.hidden;emit();return true;
      } catch(error) {
        if (request!==revision||disposed) return false;
        return reportError(error);
      }
    },
    mute(){
      ++revision;state.enabled=false;state.playing=false;state.loading=false;state.blocked=false;state.error=null;remember(false);
      if (media) media.pause();
      stopSource();
      if (context?.state==='running') context.suspend().catch(()=>{});
      emit();return false;
    },
    toggle(){return state.enabled&&!state.blocked?api.mute():api.start();},
    dispose(){
      if (disposed) return;
      disposed=true;++revision;abort.abort();stopSource();
      if (media) {media.pause();media.removeAttribute('src');media.load();media=null;}
      if (context) {context.onstatechange=null;context.close().catch(()=>{});}
      state.enabled=false;state.playing=false;state.loading=false;
    },
  };
  document.addEventListener('visibilitychange',()=>{
    if (!consent||!state.enabled||disposed) return;
    if (document.hidden) {
      if (context?.state==='running') context.suspend().catch(()=>{});
      if (media) media.pause();
      state.playing=false;emit();
    } else if (context&&source) {
      context.resume().catch(reportError);
    } else if (media) {
      const playback=media.play();playback?.then(()=>{state.playing=true;emit();}).catch(reportError);
    }
  },{signal:abort.signal});
  window.addEventListener('pagehide',event=>{if(!event.persisted)api.dispose();},{signal:abort.signal});
  window.DIWALI_AUDIO=api;
  return api;
}

initPartyAudio();
