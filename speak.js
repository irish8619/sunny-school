/* ============================================================
   Sunny School — VOICE & SOUND (offline)
   The app talks so a pre-reader can drive it herself.
   - say(text): on-device SpeechSynthesis, warm slow child voice.
   - SFX (Web Audio): good() climbing chime, nudge(), tap(), fanfare().
   Everything is on-device — no network, works offline.
   Respects a persisted mute. First user gesture unlocks audio.
   ============================================================ */
const Voice = (function(){
  const synth = window.speechSynthesis || null;
  let voice=null, muted=(localStorage.getItem("sunny_mute")==="1"), ac=null, unlocked=false, noteIdx=0;

  function loadVoices(){
    if(!synth) return;
    const vs = synth.getVoices(); if(!vs.length) return;
    const en = vs.filter(v=>(v.lang||"").toLowerCase().startsWith("en"));
    const pool = en.length?en:vs;
    const score = v => { let s=0; const n=(v.name||"").toLowerCase();
      if(/(female|samantha|karen|moira|tessa|zira|susan|fiona|aria|jenny|natural|kid|child|nova|ava)/.test(n)) s+=4;
      if(/google|microsoft/.test(n)) s+=2; return s; };
    voice = pool.slice().sort((a,b)=>score(b)-score(a))[0] || pool[0];
  }
  if(synth){ loadVoices(); try{ synth.onvoiceschanged=loadVoices; }catch(e){} }

  // strip html + emoji, make math symbols speakable
  function clean(t){
    return String(t||"")
      .replace(/<[^>]*>/g," ")
      .replace(/\s*\+\s*/g," plus ")
      .replace(/\s*[−–—-]\s*/g," minus ")
      .replace(/\s*=\s*/g," equals ")
      .replace(/[?？!¡]/g,"")
      .replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{2190}-\u{21FF}\u{FE0F}\u{20E3}\u{1F1E6}-\u{1F1FF}]/gu,"")
      .replace(/\s+/g," ").trim();
  }

  function ctx(){ if(!ac){ try{ ac=new (window.AudioContext||window.webkitAudioContext)(); }catch(e){} } return ac; }
  function unlock(){
    if(unlocked) return; unlocked=true;
    const a=ctx(); if(a && a.state==="suspended") a.resume().catch(()=>{});
    try{ if(synth){ const u=new SpeechSynthesisUtterance(" "); u.volume=0; synth.speak(u); } }catch(e){}
  }

  function say(text, opts){
    if(muted || !synth) return;
    const t=clean(text); if(!t) return;
    try{
      synth.cancel();
      const u=new SpeechSynthesisUtterance(t);
      if(voice) u.voice=voice;
      u.rate=(opts&&opts.rate)||0.92; u.pitch=(opts&&opts.pitch)||1.12; u.volume=1;
      synth.speak(u);
    }catch(e){}
  }

  function tone(freq, dur, vol, when){
    const a=ctx(); if(!a) return;
    const o=a.createOscillator(), g=a.createGain(); o.connect(g); g.connect(a.destination);
    const t0=a.currentTime+(when||0);
    o.type="sine"; o.frequency.setValueAtTime(freq,t0);
    g.gain.setValueAtTime(vol||0.14,t0); g.gain.exponentialRampToValueAtTime(0.0008,t0+dur);
    o.start(t0); o.stop(t0+dur);
  }
  const SCALE=[523.25,587.33,659.25,698.46,783.99,880.0,987.77,1046.5];  // C major ladder
  function good(){ if(muted) return; const f=SCALE[noteIdx%SCALE.length]; noteIdx++; tone(f,0.24,0.16); tone(f*1.5,0.2,0.05,0.02); }
  function resetGood(){ noteIdx=0; }
  function nudge(){ if(muted) return; tone(300,0.15,0.09); }
  function tap(){ if(muted) return; tone(680,0.06,0.05); }
  function fanfare(){ if(muted) return; [523,659,784,1046].forEach((f,i)=>tone(f,0.3,0.15,i*0.11)); }

  function toggleMute(){ muted=!muted; localStorage.setItem("sunny_mute", muted?"1":"0"); if(muted && synth){ try{ synth.cancel(); }catch(e){} } return muted; }
  function isMuted(){ return muted; }

  return { say, good, resetGood, nudge, tap, fanfare, unlock, toggleMute, isMuted };
})();

// unlock audio on the very first user gesture (browser autoplay policies)
(function(){ const u=()=>{ Voice.unlock(); window.removeEventListener("pointerdown",u); window.removeEventListener("keydown",u); };
  window.addEventListener("pointerdown",u); window.addEventListener("keydown",u); })();
