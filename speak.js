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
  let voice=null, chosenName=localStorage.getItem("sunny_voice")||"", muted=(localStorage.getItem("sunny_mute")==="1"), ac=null, unlocked=false, noteIdx=0;
  const RATE=0.96, PITCH=1.04;   // gentle + natural, not chipmunky

  function pool(){ if(!synth) return []; const vs=synth.getVoices(); const en=vs.filter(v=>(v.lang||"").toLowerCase().startsWith("en")); return en.length?en:vs; }
  function score(v){ let s=0; const n=(v.name||"").toLowerCase(), l=(v.lang||"").toLowerCase();
    if(/(natural|neural|enhanced|premium)/.test(n)) s+=6;                                  // best modern voices
    if(/(samantha|ava|allison|susan|zoe|karen|moira|tessa|serena|fiona|siri|aria|jenny|sonia|libby|nova|nancy|female)/.test(n)) s+=4;
    if(/google/.test(n)) s+=2;
    if(/(david|mark|zira|espeak|compact|eloquence)/.test(n)) s-=4;                          // known-robotic
    if(v.localService) s+=1;
    if(l==="en-us"||l==="en-gb"||l==="en-au") s+=1;
    return s; }
  function loadVoices(){ const p=pool(); if(!p.length) return;
    if(chosenName){ const m=p.find(v=>v.name===chosenName); if(m){ voice=m; return; } }
    voice = p.slice().sort((a,b)=>score(b)-score(a))[0] || p[0]; }
  if(synth){ loadVoices(); try{ synth.onvoiceschanged=loadVoices; }catch(e){} }

  // strip html + emoji, make math symbols speakable
  function clean(t){
    return String(t||"")
      .replace(/<[^>]*>/g," ")
      .replace(/\s*\+\s*/g," plus ")
      .replace(/(\d)\s*[-‒–−]\s*(\d)/g,"$1 minus $2")   // dash is "minus" ONLY between numbers
      .replace(/\s*[-‒–—−]\s*/g," ")               // any other dash (e.g. " — " separators) → a pause
      .replace(/\s*=\s*/g," equals ")
      .replace(/[?？!¡]/g,"")
      .replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{2190}-\u{21FF}\u{FE0F}\u{20E3}\u{1F1E6}-\u{1F1FF}]/gu,"")
      .replace(/\s+/g," ").trim();
  }

  let master=null;
  function ctx(){ if(!ac){ try{ ac=new (window.AudioContext||window.webkitAudioContext)(); master=ac.createGain(); master.gain.value=muted?0:1; master.connect(ac.destination); }catch(e){} } return ac; }
  function unlock(){
    if(unlocked) return; unlocked=true;
    const a=ctx(); if(a && a.state==="suspended") a.resume().catch(()=>{});
    try{ if(synth){ const u=new SpeechSynthesisUtterance(" "); u.volume=0; synth.speak(u); } }catch(e){}
    try{ if(typeof sayAgain==="function") setTimeout(sayAgain,90); }catch(e){}   // replay the greeting that autoplay blocked
  }

  function say(text, opts){
    if(muted || !synth) return;
    const t=clean(text); if(!t) return;
    try{
      synth.cancel();
      const u=new SpeechSynthesisUtterance(t);
      if(voice) u.voice=voice;
      u.rate=(opts&&opts.rate)||RATE; u.pitch=(opts&&opts.pitch)||PITCH; u.volume=1;
      synth.speak(u);
    }catch(e){}
  }

  function tone(freq, dur, vol, when){
    const a=ctx(); if(!a) return;
    const o=a.createOscillator(), g=a.createGain(); o.connect(g); g.connect(master||a.destination);
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

  function toggleMute(){ muted=!muted; localStorage.setItem("sunny_mute", muted?"1":"0");
    if(muted && synth){ try{ synth.cancel(); }catch(e){} }
    if(ac && master){ try{ master.gain.cancelScheduledValues(ac.currentTime); master.gain.setValueAtTime(muted?0:1, ac.currentTime); }catch(e){} }   // silence in-flight SFX too
    return muted; }
  function isMuted(){ return muted; }

  // parent voice picker
  function listVoices(){ return pool().map(v=>({name:v.name, lang:v.lang, local:!!v.localService})); }
  function setVoice(name){ chosenName=name||""; localStorage.setItem("sunny_voice", chosenName); loadVoices(); }
  function currentVoice(){ return voice?voice.name:""; }
  function sample(name){ if(!synth) return; const p=pool(); const v=(name&&p.find(x=>x.name===name))||voice;
    try{ synth.cancel(); const u=new SpeechSynthesisUtterance("Hi! I'm your learning buddy. Let's have fun together!"); if(v) u.voice=v; u.rate=RATE; u.pitch=PITCH; u.volume=1; synth.speak(u); }catch(e){} }

  return { say, good, resetGood, nudge, tap, fanfare, unlock, toggleMute, isMuted, voices:listVoices, setVoice, current:currentVoice, sample };
})();

// unlock audio on the very first user gesture (browser autoplay policies)
(function(){ const u=()=>{ Voice.unlock(); window.removeEventListener("pointerdown",u); window.removeEventListener("keydown",u); };
  window.addEventListener("pointerdown",u); window.addEventListener("keydown",u); })();
