/* ============================================================
   Sunny School — INVISIBLE ADAPTIVITY
   Quietly fits difficulty to Iris. She NEVER sees a level, score,
   or "try again" gate — only the numbers in an already-familiar,
   infinitely-replayable game happen to fit her.
   Design rules (from the adversarial critique):
   • FAIL TOWARD EASIER — down fast on any struggle, up only slowly
     and only after she's past a skill's easy on-ramp. For a
     demand-avoidant kid an over-easy problem is a win; an over-hard
     one is a shutdown.
   • Only tier INVISIBLE ranges (arithmetic sizes, count targets,
     sight-word slice, sentence length) — NEVER the phonics cards she
     explicitly chooses.
   • Always re-enter gentle: the first problem of a skill each time the
     app opens is served one notch easier (cold-start), reset on load.
   • New skills always start easy (gated on a PRIVATE per-skill rep
     count, not the shared standards meter).
   • Nothing shrinks that she can see; no parent report card.
   Uses globals from app.js: S, save.
   ============================================================ */
const adapt = (function(){
  /* which generator families share a difficulty skill. Phonics-decode
     gens (blend/cvcmatch/buildword/rhyme/firstlast/readword) are
     ABSENT on purpose — those are cards she picks, never ease-gated. */
  const SKILL = {
    add10:'math.add', add20:'math.add', doubles:'math.add',
    sub:'math.sub',
    missing:'math.place', onemore:'math.place', tenmore:'math.place', tensones:'math.place', compare:'math.place',
    count120:'math.count', countback:'math.count',
    wordprob:'math.word',
    sight:'read.sight',
    sentence:'read.fluency', story:'read.fluency',
  };
  const coldStart = new Set();          // reset every app-open (module load) → gentle re-entry
  let sig = { skill:null, firstTap:false };

  function skillOf(g){ return SKILL[g] || null; }
  function get(k){ if(!S.skill) S.skill={}; if(!S.skill[k]) S.skill[k]={ ease:0.35, reps:0, hi:0.35 }; return S.skill[k]; }

  /* called once per problem (top of buildGen) — arms the first-tap signal */
  function begin(g){ sig.skill = skillOf(g); sig.firstTap = false; }

  /* difficulty tier 0..tiers-1 for the current problem's skill */
  function tier(tiers){
    const k = sig.skill; if(!k) return 0;
    const s = get(k);
    if(s.reps < 3) return 0;                                           // new skill → always the easy on-ramp (don't spend cold-start here)
    let t = Math.min(tiers-1, Math.max(0, Math.floor(s.ease * tiers)));
    if(!coldStart.has(k)){ coldStart.add(k); t = Math.max(0, t-1); }   // gentle re-entry — spent on the first REAL (post-on-ramp) card of the session
    return t;
  }

  /* the FIRST tile she taps is the only signal; wrong is weighted 3x the right */
  function tap(correct){
    if(!sig.skill || sig.firstTap) return; sig.firstTap = true;
    const s = get(sig.skill);
    if(correct){ if(s.reps >= 3){ s.ease = Math.min(0.95, s.ease + 0.02); s.hi = Math.max(s.hi, s.ease); } }  // UP slow, only past on-ramp
    else { s.ease = Math.max(0.05, s.ease - 0.06); }                                                          // DOWN fast on any struggle
    if(typeof save === "function") save();
  }

  /* she finished the activity — this advances the on-ramp ONLY. Completion is NOT
     evidence the difficulty was right (she finishes by tapping ✓ regardless), so it
     never raises ease. Ease moves ONLY on a real first-tap signal. This keeps the
     no-wrong-answer skills (counting, sentences) from ever ratcheting up with no way
     to come down — they simply hold a fixed, gentle level. */
  function done(g){ const k = skillOf(g); if(!k) return; const s = get(k); s.reps++; if(typeof save === "function") save(); }

  // re-arm the gentle re-entry when she returns after a break (a PWA often RESUMES, not reloads)
  let hiddenAt = 0;
  try{ document.addEventListener("visibilitychange", function(){
    if(document.visibilityState === "hidden") hiddenAt = performance.now();
    else if(document.visibilityState === "visible" && performance.now() - hiddenAt > 120000) coldStart.clear();
  }); }catch(e){}

  return { skillOf, begin, tier, tap, done };
})();
