/* ============================================================
   Sunny School — ENGINE
   Depends on content.js (TRACKS, ORDER, STANDARDS, CVC, SIGHT,
   STANDARD_SUBJECTS).
   ============================================================ */

/* ---------- tiny helpers ---------- */
const R = (a,b)=>Math.floor(Math.random()*(b-a+1))+a;   // inclusive
const pick = a => a[Math.floor(Math.random()*a.length)];
function shuffle(a){ a=a.slice(); for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; }
function choicesAround(answer, spread){          // 3 unique non-negative options incl. answer
  const set=new Set([answer]);
  let guard=0;
  while(set.size<3 && guard++<50){ const d=R(1,spread)*(Math.random()<.5?-1:1); const v=answer+d; if(v>=0) set.add(v); }
  while(set.size<3) set.add(answer+set.size);   // fallback
  return shuffle([...set]);
}

/* ---------- state ---------- */
let S = load();
function load(){ try{ return migrate(JSON.parse(localStorage.getItem("sunny"))||fresh()); }catch(e){ return fresh(); } }
function emptyProgress(){ const p={}; Object.keys(TRACKS).forEach(k=>p[k]=0); return p; }
function freshPet(){ return { has:false, type:"", name:"", treats:0, fed:0, happy:100, lastVisit:"", owned:[], wear:{hat:null,item:null,scene:null} }; }
function fresh(){ return { name:"", streak:0, days:0, acts:0, last:"", progress:emptyProgress(), covered:[], bench:{}, pet:freshPet(), garden:[], seenWelcome:false, stats:{opens:0,hearTaps:0} }; }
function migrate(s){ if(!s.bench) s.bench={}; if(!s.pet) s.pet=freshPet(); if(!s.garden) s.garden=[];
  if(!s.pet.owned) s.pet.owned=[]; if(!s.pet.wear) s.pet.wear={hat:null,item:null,scene:null};
  if(!s.stats) s.stats={opens:0,hearTaps:0};
  if(s.seenWelcome===undefined) s.seenWelcome = (s.days>0 || s.acts>0);   // existing users skip the intro
  const base=emptyProgress(); s.progress=Object.assign(base, s.progress||{}); return s; }
function save(){ localStorage.setItem("sunny", JSON.stringify(S)); }
function todayStr(){ const d=new Date(); return d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate(); }
function daysBetween(a,b){ return Math.round((new Date(b)-new Date(a))/86400000); }

/* ---------- voice helpers ---------- */
let lastSpeech="";
function narrate(text){ lastSpeech=text||""; if(typeof Voice!=="undefined") Voice.say(lastSpeech); }
function sayAgain(){ if(typeof Voice!=="undefined") Voice.say(lastSpeech||""); }
function hearAgain(){ if(S.stats){ S.stats.hearTaps++; save(); } sayAgain(); }   // the 🔊 button (a self-serve signal)
function toggleSound(){ if(typeof Voice==="undefined") return; const m=Voice.toggleMute();
  const b=document.getElementById("soundBtn"); if(b) b.textContent=m?"🔇":"🔊"; if(!m) narrate("Sound on!"); }

/* ---------- home ---------- */
function renderHome(){
  document.getElementById("streakNum").textContent=S.days;   // sunny days — only ever grows, never resets
  const nm=S.name||"friend", backToday=S.last===todayStr();
  const greet=(S.last&&!backToday?"Welcome back, ":"Hi ")+nm+"!";
  document.getElementById("greet").textContent=greet+" 🦊";
  document.getElementById("subgreet").textContent=backToday?"You already played today — more if you want! 🌟":"Want to play?";
  const sb=document.getElementById("soundBtn"); if(sb && typeof Voice!=="undefined") sb.textContent=Voice.isMuted()?"🔇":"🔊";
  narrate(greet+" What do you want to do?");
  const bb=document.getElementById("buddyBtn");
  const pemoji = (typeof CREATURES!=="undefined" && CREATURES[S.pet.type]) ? CREATURES[S.pet.type].emoji : S.pet.type;
  if(bb) bb.innerHTML = S.pet.has ? (pemoji+" "+(S.pet.name||"My Buddy")+(S.pet.treats?' <span style="opacity:.85">🍎'+S.pet.treats+'</span>':'')) : "🥚 Meet your buddy!";
  const mas=document.querySelector(".mascot");
  if(mas && typeof makeCreature==="function"){ mas.style.fontSize="0"; mas.innerHTML=makeCreature(S.pet.has?S.pet.type:"fox", 150); }
  const gb=document.getElementById("gardenBtn");
  if(gb && typeof gardenCount==="function"){ const n=gardenCount(); gb.innerHTML = n? ("🌱 My Garden — "+n+" grown!") : "🌱 Start my garden"; }
}

/* ---------- choose board ---------- */
let current=null;
function nextItem(k){ return {track:k, ...TRACKS[k].items[ S.progress[k]%TRACKS[k].items.length ]}; }
function startPlay(){ renderBoard(); show("choose");
  const titles=ORDER.map(k=>TRACKS[k].items[S.progress[k]%TRACKS[k].items.length].t);
  narrate("Pick one. "+titles.join(", ")+", or something else."); }
function renderBoard(){
  const board=document.getElementById("board"); board.innerHTML="";
  ORDER.forEach(k=>{
    const it=nextItem(k);
    const b=document.createElement("button"); b.className="pcard";
    b.innerHTML=`<div class="pe">${it.e}</div><div class="pt">${it.t}</div><div class="pk" style="color:${TRACKS[k].color}">${TRACKS[k].name}</div>`;
    b.onclick=()=>openActivity(it);
    board.appendChild(b);
  });
  document.getElementById("allDoneBtn").textContent=S.last===todayStr()?"All done for today 💤":"Maybe later 💤";
}
function justOne(){ openActivity(nextItem("move")); }

/* ---------- activity ---------- */
function openActivity(it){
  current=it;
  const col=TRACKS[it.track].color;
  document.getElementById("card").innerHTML=`
    <button class="hearbtn" onclick="hearAgain()" aria-label="Hear it again">🔊</button>
    <div class="subj" style="color:${col}">${TRACKS[it.track].name}</div>
    <div class="emoji">${it.e}</div>
    <div class="title">${it.t}</div>
    <div class="grown">${it.g}</div>
    <div class="interactive" id="inter"></div>
    <button class="donebtn" onclick="finishActivity()">We did it! ✓</button>
    <button class="stopbtn" onclick="endForToday()">All done for now 💤</button>`;
  // voice the FULL instruction for non-gen activities (say/tap/trace/count); gen items get their spoken prompt from prompt2/sentence/story
  narrate(it.act==="gen" ? it.t : (it.t+". "+it.g));
  buildInteractive(it);
  show("activity");
}

function buildInteractive(it){
  const box=document.getElementById("inter");
  if(it.act==="trace"){ return buildTrace(it, box); }
  if(it.act==="gen"){ return buildGen(it, box); }
  if(it.act==="tap"){
    const wrap=el("div","tiles");
    it.tiles.forEach(tx=>{ const b=el("button","tile"); b.textContent=tx; b.onclick=()=>{ b.classList.add("good"); ding(); }; wrap.appendChild(b); });
    box.appendChild(wrap); return;
  }
  if(it.act==="tapcount"){
    let n=0; const label=el("div"); label.style.fontSize="44px"; label.textContent="0";
    const wrap=el("div","tiles"); wrap.style.marginTop="14px";
    for(let i=0;i<it.n;i++){ const b=el("button","tile"); b.textContent=it.emoji;
      b.onclick=()=>{ if(!b.dataset.c){ b.dataset.c=1; b.classList.add("good"); label.textContent=++n; sayNum(n); } }; wrap.appendChild(b); }
    box.appendChild(label); box.appendChild(wrap); return;
  }
  if(it.act==="count"){
    let n=0; const big=el("div"); big.style.fontSize="66px"; big.textContent="0";
    const b=el("button","tile"); b.style.width="auto"; b.style.padding="0 24px"; b.style.fontSize="22px"; b.textContent="Tap to count";
    b.onclick=()=>{ if(n<it.n){ big.textContent=++n;
      if(n===it.n){ big.textContent=n+" 🎉"; if(typeof Voice!=="undefined"){ Voice.say(String(n)); Voice.fanfare(); } }   // final: speak + fanfare, no chime overlap
      else sayNum(n); } };
    box.appendChild(big); box.appendChild(b); return;
  }
  // say / fallback
  const p=el("div"); p.style.cssText="font-size:19px;opacity:.6"; p.textContent="Play together, then tap below 👇"; box.appendChild(p);
}
function el(tag,cls){ const e=document.createElement(tag); if(cls) e.className=cls; return e; }
let _numTimer=null;
function sayNum(n){ if(typeof Voice!=="undefined"){ Voice.good();   // chime instantly on every tap
  clearTimeout(_numTimer); _numTimer=setTimeout(function(){ Voice.say(String(n)); }, 260); }   // speak the number once tapping settles (no mid-word cut-off)
  else ding(); }
function buzz(p){ try{ if(navigator.vibrate) navigator.vibrate(p); }catch(e){} }   // gentle haptic where supported

/* ---------- generated problems (endlessly replayable) ---------- */
function buildGen(it, box){
  const g=it.gen;
  // ---- reading gens ----
  if(g==="blend"){
    const c=pick(CVC_PIC);
    prompt2(box,"Sound it out, then say it fast!");
    const wrap=el("div","tiles");
    c.w.split("").forEach(ch=>{ const b=el("button","tile"); b.textContent=ch; b.onclick=()=>{ b.classList.add("good"); ding(); }; wrap.appendChild(b); });
    box.appendChild(wrap);
    const rev=el("div"); rev.style.cssText="font-size:60px;margin-top:14px;opacity:.25"; rev.textContent=c.pic;
    const btn=el("button","tile"); btn.style.cssText="width:auto;padding:0 20px;font-size:20px;margin-top:12px"; btn.textContent="What is it? 🔎";
    btn.onclick=()=>{ rev.style.opacity="1"; rev.textContent=c.pic+" "+c.w; ding(); };
    box.appendChild(btn); box.appendChild(rev); return;
  }
  if(g==="cvcmatch"){
    const c=pick(CVC_PIC);
    prompt2(box,"Read it: "+bigword(c.w));
    const tiles=shuffle([c.pic,...c.others]).map(p=>({label:p, correct:p===c.pic}));
    chooseTiles(box, tiles, "big"); return;
  }
  if(g==="buildword"){
    const w=pick(CVC);
    prompt2(box,"Build the word: "+bigword(w));
    const slots=el("div"); slots.style.cssText="font-size:40px;letter-spacing:8px;margin:6px 0 12px"; slots.textContent="_ ".repeat(w.length).trim();
    box.appendChild(slots);
    let built=""; const wrap=el("div","tiles");
    shuffle(w.split("")).forEach(ch=>{ const b=el("button","tile"); b.textContent=ch;
      b.onclick=()=>{ if(b.dataset.u) return; b.dataset.u=1; b.classList.add("good"); built+=ch; slots.textContent=built.split("").join(" "); ding(); }; wrap.appendChild(b); });
    box.appendChild(wrap); return;
  }
  if(g==="sight"){
    const w=pick(SIGHT);
    prompt2(box,"Find this word: "+bigword(w));
    const others=shuffle(SIGHT.filter(x=>x!==w)).slice(0,2);
    chooseTiles(box, shuffle([w,...others]).map(x=>({label:x, correct:x===w}))); return;
  }
  if(g==="rhyme"){
    const fams=[["cat","hat","bat","dog"],["pig","wig","dig","sun"],["bug","rug","hug","cup"],["top","hop","mop","fan"]];
    const f=pick(fams), base=f[0], ans=pick(f.slice(1,3)), non=f[3];
    prompt2(box,"What rhymes with "+bigword(base)+"?");
    chooseTiles(box, shuffle([ans,non,base==="cat"?"sun":"mud"]).map(x=>({label:x, correct:x===ans}))); return;
  }
  if(g==="firstlast"){
    const c=pick(CVC_PIC), which=Math.random()<.5?0:c.w.length-1;
    prompt2(box, c.pic+" — what sound is at the "+(which===0?"START":"END")+" of "+bigword(c.w)+"?");
    const ans=c.w[which], others=shuffle("bcdfgmprstn".split("").filter(x=>x!==ans)).slice(0,2);
    chooseTiles(box, shuffle([ans,...others]).map(x=>({label:x, correct:x===ans}))); return;
  }
  // ---- counting gens (no wrong answer) ----
  if(g==="count120"){
    const start=R(90,109); countTap(box, start, +1, 12, "Count UP from "+start+"!"); return;
  }
  if(g==="countback"){
    const start=R(10,20); countTap(box, start, -1, Math.min(start,12), "Count BACK from "+start+"… blast off! 🚀"); return;
  }
  if(g==="skip"){
    const by=pick([2,5,10]), start=by, seq=[start,start*2,start*3];
    prompt2(box,"Skip by "+by+"s:  "+seq.join(", ")+", ?");
    const ans=start*4; chooseTiles(box, choicesAround(ans,by*2>3?by:3).map(v=>({label:v, correct:v===ans}))); return;
  }
  // ---- arithmetic gens ----
  if(g==="add10"){ const a=R(1,7), b=R(1,10-a); askEq(box, a+" + "+b, a+b, 3); return; }
  if(g==="add20"){ const a=R(5,12), b=R(3,20-a); askEq(box, a+" + "+b, a+b, 3); return; }
  if(g==="sub"){ const a=R(6,20), b=R(1,a-1); askEq(box, a+" − "+b, a-b, 3); return; }
  if(g==="make10"){ const a=R(1,9); askEq(box, a+" + ? = 10", 10-a, 3); return; }
  if(g==="onemore"){ const n=R(10,98), up=Math.random()<.5; askEq(box, (up?"1 more than ":"1 less than ")+n, up?n+1:n-1, 2); return; }
  if(g==="tenmore"){ const n=R(10,80), up=Math.random()<.5; askEq(box, (up?"10 more than ":"10 less than ")+n, up?n+10:n-10, 12); return; }
  if(g==="missing"){ const a=R(2,9), c=a+R(1,9); askEq(box, a+" + ? = "+c, c-a, 3); return; }
  if(g==="truefalse"){
    const a=R(2,10), b=R(1,9), real=a+b, shown=Math.random()<.5?real:real+pick([-2,-1,1,2]);
    prompt2(box, a+" + "+b+" = "+shown+" ?");
    chooseTiles(box, [{label:"👍 True", correct:shown===real},{label:"👎 False", correct:shown!==real}], "big"); return;
  }
  if(g==="tensones"){ const n=R(21,89); prompt2(box, bigword(n)+" — how many TENS?"); const t=Math.floor(n/10); chooseTiles(box, choicesAround(t,2).map(v=>({label:v, correct:v===t}))); return; }
  if(g==="compare"){ let a=R(10,99), b=R(10,99); while(b===a) b=R(10,99); prompt2(box,"🐊 Tap the BIGGER number!"); chooseTiles(box, shuffle([a,b]).map(v=>({label:v, correct:v===Math.max(a,b)}))); return; }
  if(g==="clock"){ const h=R(1,12); prompt2(box,"🕐 The clock shows "+h+":00. Tap the "+h+"!"); chooseTiles(box, choicesAround(h,3).filter(v=>v>=1&&v<=12).slice(0,3).map(v=>({label:v, correct:v===h}))); return; }
  if(g==="doubles"){ const a=R(2,10); askEq(box, a+" + "+a, a+a, 3); return; }
  if(g==="add2d1d"){ const a=R(11,79), b=R(2,9); askEq(box, a+" + "+b, a+b, 3); return; }
  if(g==="wordprob"){
    const tpl=pick(WORDPROBS); let a,b;
    if(tpl.op==="+"){ a=R(2,12); b=R(2,10); } else { a=R(6,15); b=R(1,a-1); }
    const ans=tpl.op==="+"?a+b:a-b;
    prompt2(box, tpl.s.replace("{a}",a).replace("{b}",b));
    chooseTiles(box, choicesAround(ans,3).map(v=>({label:v, correct:v===ans}))); return;
  }
  // ---- reading gens from big banks ----
  if(g==="readword"){
    const bank=BANKS[it.bank]||CVC, w=pick(bank);
    prompt2(box,"Sound it out, then read it!");
    const wrap=el("div","tiles");
    w.split("").forEach(ch=>{ const b=el("button","tile"); b.textContent=ch; b.onclick=()=>{ b.classList.add("good"); ding(); }; wrap.appendChild(b); });
    box.appendChild(wrap);
    const big=el("div"); big.style.cssText="font-size:44px;margin-top:16px;color:#6a4cff;font-weight:bold"; big.textContent=w; box.appendChild(big); return;
  }
  if(g==="sentence"){
    const s=pick(SENTENCES);
    const p=el("div"); p.style.cssText="font-size:29px;font-weight:bold;line-height:1.45;color:#6a4cff"; p.textContent=s; box.appendChild(p);
    const note=el("div"); note.style.cssText="font-size:15px;opacity:.55;margin-top:14px"; note.textContent="Point at each word as you read it together 👆"; box.appendChild(note);
    narrate(s); return;
  }
  if(g==="story"){
    const st=pick(STORIES);
    const t=el("div"); t.style.cssText="font-size:26px;font-weight:bold"; t.textContent=st.t;
    const q=el("div"); q.style.cssText="font-size:18px;line-height:1.4;margin-top:14px;background:#fff7e0;padding:15px;border-radius:16px"; q.textContent=st.q;
    box.appendChild(t); box.appendChild(q); narrate(st.t+". "+st.q); return;
  }
  // fallback
  prompt2(box,"Play together, then tap below 👇");
}

/* ---------- finger-trace canvas (writing without the pencil) ---------- */
function buildTrace(it, box){
  let glyphs;
  if(it.mode==="numbers") glyphs="0123456789".split("");
  else if(it.mode==="name") glyphs=((S.name||"Star").toUpperCase()).split("").filter(c=>c.trim());
  else if(it.mode==="lines") glyphs=["|","—","O","C","U","V","S","Z","/","\\"];
  else { glyphs=[]; for(let i=65;i<=90;i++){ glyphs.push(String.fromCharCode(i)); glyphs.push(String.fromCharCode(i+32)); } }
  let idx=Math.floor(Math.random()*glyphs.length);

  const label=el("div"); label.style.cssText="font-size:20px;opacity:.6;margin-bottom:8px";
  const canvas=el("canvas"); canvas.width=300; canvas.height=260;
  canvas.style.cssText="width:300px;max-width:82vw;height:260px;background:#fff;border-radius:24px;box-shadow:0 6px 18px rgba(90,60,160,.15);touch-action:none";
  const ctx=canvas.getContext("2d");
  ctx.lineWidth=14; ctx.lineCap="round"; ctx.lineJoin="round";
  const colors=["#6a4cff","#ff5c8a","#2fbf71","#ff9f1a","#3aa0ff"];
  function drawGuide(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle="#e7e2f5"; ctx.textAlign="center"; ctx.textBaseline="middle";
    ctx.font="bold 210px 'Comic Sans MS',sans-serif";
    ctx.fillText(glyphs[idx], canvas.width/2, canvas.height/2+8);
    label.textContent="Trace it with your finger:  "+glyphs[idx];
  }
  drawGuide();
  let drawing=false;
  function pos(e){ const r=canvas.getBoundingClientRect(); return {x:(e.clientX-r.left)*canvas.width/r.width, y:(e.clientY-r.top)*canvas.height/r.height}; }
  canvas.addEventListener("pointerdown",e=>{ e.preventDefault(); drawing=true; ctx.strokeStyle=colors[Math.floor(Math.random()*colors.length)]; const p=pos(e); ctx.beginPath(); ctx.moveTo(p.x,p.y); });
  canvas.addEventListener("pointermove",e=>{ if(!drawing) return; e.preventDefault(); const p=pos(e); ctx.lineTo(p.x,p.y); ctx.stroke(); });
  const stop=()=>{ if(drawing){ drawing=false; ding(); } };
  canvas.addEventListener("pointerup",stop); canvas.addEventListener("pointerleave",stop);

  const ctrl=el("div","tiles"); ctrl.style.marginTop="12px";
  const clr=el("button","tile"); clr.style.cssText="width:auto;padding:0 18px;font-size:18px;background:#bbb"; clr.textContent="↺ Clear"; clr.onclick=drawGuide;
  const nxt=el("button","tile"); nxt.style.cssText="width:auto;padding:0 18px;font-size:18px"; nxt.textContent="Next ▶"; nxt.onclick=()=>{ idx=(idx+1)%glyphs.length; drawGuide(); };
  ctrl.appendChild(clr); ctrl.appendChild(nxt);
  box.appendChild(label); box.appendChild(canvas); box.appendChild(ctrl);
}

function prompt2(box, html){ const p=el("div"); p.style.cssText="font-size:24px;font-weight:bold;margin-bottom:14px"; p.innerHTML=html; box.appendChild(p); narrate(html); }
function bigword(w){ return '<span style="color:#6a4cff">'+w+'</span>'; }
function askEq(box, text, answer, spread){ prompt2(box, bigword(text.replace('?','?'))+" ="+" ?"); if(text.includes("=")){ box.lastChild.innerHTML=bigword(text); } chooseTiles(box, choicesAround(answer,spread).map(v=>({label:v, correct:v===answer}))); }

function chooseTiles(box, tiles, size){
  const wrap=el("div","tiles");
  tiles.forEach(t=>{
    const b=el("button","tile"); if(size==="big") b.style.minWidth="120px";
    b.textContent=t.label;
    b.onclick=()=>{
      if(b.dataset.done) return;
      if(t.correct){ b.classList.add("good"); b.dataset.done=1; buzz(16);
        if(typeof Voice!=="undefined"){ Voice.say(String(t.label)); Voice.good(); } else ding(); }
      else { b.classList.add("nudge"); setTimeout(()=>b.classList.remove("nudge"),400);
        if(typeof Voice!=="undefined"){ Voice.nudge(); Voice.say("Good try! Try another."); } }
    };
    wrap.appendChild(b);
  });
  box.appendChild(wrap);
  const hint=el("div"); hint.style.cssText="font-size:14px;opacity:.5;margin-top:12px"; hint.textContent="Any answer is okay — try again, or just tap ✓ below."; box.appendChild(hint);
}

function countTap(box, start, dir, steps, label){
  prompt2(box, label);
  let n=start, done=0;
  const big=el("div"); big.style.cssText="font-size:72px;font-weight:bold"; big.textContent=start;
  const b=el("button","tile"); b.style.cssText="width:auto;padding:0 26px;font-size:22px"; b.textContent=dir>0?"Next ▲":"Next ▼";
  b.onclick=()=>{ if(done<steps){ n+=dir; done++; big.textContent=(dir<0&&n<=0)?"0 🚀":n; ding(); } };
  box.appendChild(big); box.appendChild(b);
}

function backToChoose(){ hideOverlays(); renderBoard(); show("choose"); }

/* ---------- completion ---------- */
function finishActivity(){
  const it=current;
  S.progress[it.track]++; S.acts++;
  S.pet.treats += 2;   // earn treats to care for the buddy (the reward loop)
  if(it.bench) it.bench.forEach(code=>{ S.bench[code]=(S.bench[code]||0)+1; });
  if(!S.covered.includes(it.t)){ S.covered.push(it.t); if(S.covered.length>60) S.covered.shift(); }
  const t=todayStr();
  if(S.last!==t){ S.days++; S.last=t; }   // sunny days only grow — a gap is never punished
  const planted = (typeof plantSticker==="function") ? plantSticker() : "🌱";   // grow the garden
  save();
  const em=["⭐","🌟","🎈","💛","✨","🏆"], tx=["Nice!","You did it!","Woohoo!","So fun!","Yes!","Superstar!"];
  const line=tx[S.acts%tx.length];
  const me=document.getElementById("miniEmoji");
  if(S.pet.has && typeof makeCreature==="function"){ me.innerHTML=makeCreature(S.pet.type,120); const cr=me.querySelector(".creature"); if(cr) cr.classList.add("happy"); }
  else me.textContent=em[S.acts%em.length];
  document.getElementById("miniTxt").textContent=line;
  document.getElementById("miniTreat").innerHTML="🍎 +2 treats · you grew a "+planted+"!";
  save();
  document.getElementById("miniCelebrate").classList.remove("hidden");
  if(typeof Voice!=="undefined") Voice.fanfare();
  buzz([18,40,18]);
  narrate(line+" You earned two treats, and grew a new plant in your garden!");
  confetti(18);
}
function endForToday(){
  hideOverlays();
  if(S.last===todayStr()){
    const line=["You played today! 🌟","Great job today! 🎈","Proud of you! 💛"][S.days%3];
    document.getElementById("partyTxt").textContent=line;
    document.getElementById("celebrate").classList.remove("hidden");
    if(typeof Voice!=="undefined") Voice.fanfare(); narrate(line);
    confetti(40);
  } else goHome();
}

/* ---------- parent ---------- */
function showParent(){
  document.getElementById("pDays").textContent=S.days;
  document.getElementById("pActs").textContent=S.acts;
  document.getElementById("pLast").textContent=S.last||"—";
  const ph=document.getElementById("pHear"); if(ph&&S.stats) ph.textContent=S.stats.hearTaps;
  const po=document.getElementById("pOpens"); if(po&&S.stats) po.textContent=S.stats.opens;
  document.getElementById("nameInput").value=S.name;
  const cl=document.getElementById("coveredList"); cl.innerHTML="";
  if(!S.covered.length) cl.innerHTML='<span class="cv">Nothing yet — tap Let\'s Play! 🌱</span>';
  S.covered.slice(-24).reverse().forEach(c=>{ const x=el("div","cv"); x.textContent=c; cl.appendChild(x); });
  populateVoices();
  show("parent");
}
function populateVoices(){
  const sel=document.getElementById("voiceSelect"); if(!sel || typeof Voice==="undefined") return;
  const list=Voice.voices(), cur=Voice.current(); sel.innerHTML="";
  if(!list.length){ const o=document.createElement("option"); o.textContent="(loading voices…)"; sel.appendChild(o); return; }
  list.forEach(v=>{ const o=document.createElement("option"); o.value=v.name; o.textContent=v.name+(v.local?"":" (online)"); if(v.name===cur) o.selected=true; sel.appendChild(o); });
}
function pickVoice(name){ if(typeof Voice!=="undefined"){ Voice.setVoice(name); Voice.sample(name); } }
function tryVoice(){ const sel=document.getElementById("voiceSelect"); if(sel && typeof Voice!=="undefined") Voice.sample(sel.value); }
function saveName(v){ S.name=v.trim(); save(); }
function resetProgress(){ if(confirm("Start over? This clears all progress.")){ S=fresh(); save(); goHome(); } }

/* ---------- Florida standards meter ---------- */
function statusOf(reps){ return reps>=3?["strong","🟢"]:reps>=1?["practicing","🟡"]:["notyet","⚪"]; }
function showStandards(){
  const root=document.getElementById("stdBody"); root.innerHTML="";
  let total=0, touched=0, strong=0;
  Object.keys(STANDARDS).forEach(subj=>{
    const sub=STANDARDS[subj];
    const h=el("div"); h.className="stdSubj"; h.textContent=subj;
    const wrap=el("div","panel"); wrap.style.marginTop="8px";
    const hh=el("h2"); hh.textContent=({Math:"🔢 ",Reading:"📖 ",Writing:"✏️ "}[subj]||"⭐ ")+"Florida Grade 1 — "+subj; wrap.appendChild(hh);
    Object.keys(sub).forEach(strand=>{
      const st=el("div","strand"); st.textContent=strand; wrap.appendChild(st);
      Object.keys(sub[strand]).forEach(code=>{
        total++; const reps=S.bench[code]||0; const [cls,dot]=statusOf(reps);
        if(reps>0) touched++; if(reps>=3) strong++;
        const row=el("div","bench "+cls);
        row.innerHTML=`<span class="bdot">${dot}</span><span class="btxt"><b>${code}</b> — ${sub[strand][code]}</span>`;
        wrap.appendChild(row);
      });
    });
    root.appendChild(wrap);
  });
  document.getElementById("stdSummary").innerHTML=
    `You've touched <b>${touched}</b> of ${total} grade-1 goals · <b>${strong}</b> practiced strong 🟢<br>
     <span style="opacity:.7;font-size:14px">Grey = a future adventure, not a fail. Green means you've truly practiced it. This is your minimum map — going past it is bonus.</span>`;
  show("standards");
}

/* ---------- first-run welcome (warm, voiced, never forced) ---------- */
function showWelcome(){
  const w=document.getElementById("welcome");
  w.innerHTML=`<div style="text-align:center;max-width:420px;width:100%">
    <div id="welcomeFox" style="cursor:pointer">${typeof makeCreature==="function"?makeCreature("fox",180):"🦊"}</div>
    <div id="welcomeBub" style="background:#fff;border-radius:22px;padding:14px 20px;font-size:21px;font-weight:bold;margin:12px auto;box-shadow:0 6px 16px rgba(90,60,140,.15)">Tap Sunny to say hi! 👆</div>
    <button id="welcomeGo" class="bigbtn green" style="max-width:300px;display:none" onclick="finishWelcome()">Let's go! 🌟</button>
  </div>`;
  w.classList.remove("hidden");
  const fox=document.getElementById("welcomeFox");
  fox.onclick=()=>{
    const c=fox.querySelector(".creature"); if(c){ c.classList.add("happy"); setTimeout(()=>c.classList.remove("happy"),600); }
    if(typeof Voice!=="undefined") Voice.good();
    narrate("Hi! I'm Sunny the fox! Let's learn and play together!");
    document.getElementById("welcomeBub").textContent="Hi! I'm Sunny! 🦊";
    document.getElementById("welcomeGo").style.display="block";
  };
}
function finishWelcome(){ S.seenWelcome=true; save(); document.getElementById("welcome").classList.add("hidden"); goHome(); }

/* ---------- rescue ---------- */
function showRescue(){ show("rescue"); }
function wiggleRescue(){ openActivity(nextItem("move")); }

/* ---------- nav + fx ---------- */
function hideOverlays(){ document.getElementById("miniCelebrate").classList.add("hidden"); document.getElementById("celebrate").classList.add("hidden"); }
function show(id){ if(typeof stopGame==="function") stopGame(); ["home","choose","activity","parent","rescue","standards","pet","petshop","petgame","garden"].forEach(x=>{ const e=document.getElementById(x); if(e) e.classList.add("hidden"); }); hideOverlays();
  document.getElementById(id).classList.remove("hidden"); window.scrollTo(0,0);
  document.body.classList.toggle("calm", id==="activity"||id==="petgame"); }   // hush the background during a task
function goHome(){ renderHome(); show("home"); }
function ding(){ if(typeof Voice!=="undefined"){ Voice.good(); return; }
  try{ const a=new (window.AudioContext||window.webkitAudioContext)(); const o=a.createOscillator(), g=a.createGain();
  o.connect(g); g.connect(a.destination); o.frequency.value=880; o.type="sine"; g.gain.setValueAtTime(.15,a.currentTime);
  g.gain.exponentialRampToValueAtTime(.001,a.currentTime+.3); o.start(); o.stop(a.currentTime+.3);}catch(e){} }
function confetti(n){ const em=["🎉","⭐","🌟","💛","🎈","✨"];
  for(let i=0;i<n;i++){ const c=el("div","confetti"); c.textContent=em[i%em.length];
    c.style.left=Math.random()*100+"vw"; c.style.animationDuration=(1.5+Math.random()*2)+"s"; c.style.animationDelay=(Math.random()*.5)+"s";
    document.body.appendChild(c); setTimeout(()=>c.remove(),4000); } }

/* ---------- boot ---------- */
// Personalize from the link (?name=Iris) on first open, then it's saved on-device.
(function(){ try{ const p=new URLSearchParams(location.search).get("name"); if(p && !S.name){ S.name=p.trim().slice(0,20); save(); } }catch(e){} })();
if(S.stats){ S.stats.opens++; save(); }                       // private, parent-only signal
if(!S.seenWelcome){ renderHome(); if(document.readyState==="complete") showWelcome(); else window.addEventListener("load", showWelcome); }
else goHome();
if("serviceWorker" in navigator){ navigator.serviceWorker.register("sw.js").catch(()=>{}); }
