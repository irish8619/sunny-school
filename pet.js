/* ============================================================
   Sunny School — BUDDY (virtual pet reward)
   She earns 🍎 treats by finishing activities, then feeds &
   plays with her buddy. GOLDEN RULE: the buddy can NEVER get
   sick, starve, or die. Gaps are forgiven — it only ever gets
   happier and is thrilled to see her. Zero guilt.
   Uses globals from app.js: S, save, show, el, ding, confetti.
   ============================================================ */

const PET_ANIMALS = ["🐱","🐶","🐰","🦊","🐻","🐥","🐉","🦄","🐧","🐼"];
let petMsg = "";   // transient speech-bubble line

function petLevel(){ return Math.floor(S.pet.fed/8) + 1; }              // grows as she feeds it
function petAccessory(){ const l=petLevel(); return l>=15?"🦸":l>=10?"👑":l>=6?"🎩":l>=3?"🎀":""; }
function petSize(){ return 96 + Math.min(petLevel(),12)*7; }            // gets bigger as it grows
function petHearts(){ return Math.max(1, Math.round(S.pet.happy/20)); } // 1..5 filled hearts

/* Gentle "I missed you" on return — happiness never falls below content (3 hearts). */
function petVisitDecay(){
  if(!S.pet.lastVisit) return;
  const days = daysBetween(S.pet.lastVisit, todayStr());
  if(days>0) S.pet.happy = Math.max(55, S.pet.happy - days*6);
}

function openPet(){
  if(!S.pet.has){ renderHatch(); }
  else { petVisitDecay(); const wasAway = S.pet.lastVisit && S.pet.lastVisit!==todayStr();
    S.pet.lastVisit = todayStr(); save();
    petMsg = wasAway ? "I missed you so much! 💛" : "";
    renderPet();
  }
  show("pet");
}
function petFromCelebrate(){ hideOverlays(); openPet(); }

/* ---- hatch / choose a new buddy ---- */
function renderHatch(){
  const root=document.getElementById("pet"); root.innerHTML="";
  root.appendChild(backRow(goHome, "‹ Home"));
  const h=el("div"); h.style.cssText="text-align:center;font-size:24px;font-weight:bold;margin:10px 0 2px"; h.textContent="🥚 Meet your new buddy!";
  const s=el("div"); s.style.cssText="text-align:center;font-size:15px;opacity:.65;margin-bottom:16px"; s.textContent="Pick the friend you want to hatch:";
  root.appendChild(h); root.appendChild(s);

  let chosen=null, nameVal="";
  const board=el("div"); board.style.cssText="display:grid;grid-template-columns:repeat(3,1fr);gap:12px";
  PET_ANIMALS.forEach(a=>{
    const b=el("button","pcard"); b.innerHTML=`<div style="font-size:52px">${a}</div>`;
    b.onclick=()=>{ chosen=a; [...board.children].forEach(c=>c.style.outline=""); b.style.outline="4px solid #6a4cff"; ding(); hatchBtn.disabled=false; hatchBtn.style.opacity=1; };
    board.appendChild(b);
  });
  root.appendChild(board);

  const nameBox=el("input","namebox"); nameBox.placeholder="Name your buddy (optional)"; nameBox.maxLength=14;
  nameBox.style.marginTop="16px"; nameBox.oninput=e=>nameVal=e.target.value;
  root.appendChild(nameBox);

  const hatchBtn=el("button","bigbtn green"); hatchBtn.style.marginTop="14px"; hatchBtn.textContent="Hatch! 🥚✨";
  hatchBtn.disabled=true; hatchBtn.style.opacity=.5;
  hatchBtn.onclick=()=>{ if(!chosen) return;
    S.pet.has=true; S.pet.type=chosen; S.pet.name=(nameVal||"Buddy").trim().slice(0,14);
    S.pet.happy=100; S.pet.lastVisit=todayStr(); save();
    confetti(40); petMsg="Hi! I'm so happy to meet you! 💛"; renderPet(); show("pet");
  };
  root.appendChild(hatchBtn);
}

/* ---- the buddy home ---- */
function renderPet(){
  const p=S.pet, root=document.getElementById("pet"); root.innerHTML="";
  root.appendChild(backRow(goHome, "‹ Home"));

  const card=el("div"); card.style.cssText="background:#fff;border-radius:32px;padding:20px;margin-top:8px;text-align:center;box-shadow:0 10px 30px rgba(90,60,160,.18);flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center";

  // speech bubble
  const bub=el("div"); bub.style.cssText="background:#f0ecff;border-radius:18px;padding:10px 16px;font-size:16px;margin-bottom:6px;min-height:22px";
  bub.textContent = petMsg || happyLine(); card.appendChild(bub);

  // creature (tap to play)
  const wrap=el("div"); wrap.style.cssText="position:relative;cursor:pointer;margin:6px 0";
  const acc=petAccessory(); if(acc){ const a=el("div"); a.textContent=acc; a.style.cssText="position:absolute;top:-6px;left:50%;transform:translateX(-50%);font-size:34px"; wrap.appendChild(a); }
  const c=el("div"); c.textContent=p.type; c.style.cssText="font-size:"+petSize()+"px;animation:bob 2.6s ease-in-out infinite;line-height:1";
  c.onclick=playPet; wrap.appendChild(c); card.appendChild(wrap);

  const nm=el("div"); nm.style.cssText="font-size:24px;font-weight:bold"; nm.textContent=p.name;
  const lv=el("div"); lv.style.cssText="font-size:14px;opacity:.6;margin-bottom:6px"; lv.textContent="Level "+petLevel();
  card.appendChild(nm); card.appendChild(lv);

  // hearts
  const hearts=el("div"); hearts.style.cssText="font-size:26px;letter-spacing:2px";
  hearts.textContent = "❤️".repeat(petHearts()) + "🤍".repeat(5-petHearts()); card.appendChild(hearts);
  root.appendChild(card);

  // treats + buttons
  const treatLine=el("div"); treatLine.style.cssText="text-align:center;font-size:18px;margin:12px 0 6px";
  treatLine.innerHTML = "You have <b>🍎 "+p.treats+"</b> treats";
  root.appendChild(treatLine);

  const feed=el("button","bigbtn green"); feed.textContent="🍎 Feed "+p.name;
  if(p.treats<1){ feed.disabled=true; feed.style.opacity=.5; }
  feed.onclick=feedPet; root.appendChild(feed);

  const play=el("button","bigbtn pink"); play.style.marginTop="12px"; play.textContent="🎾 Play together (free!)"; play.onclick=playPet;
  root.appendChild(play);

  if(p.treats<1){ const hint=el("div"); hint.style.cssText="text-align:center;font-size:14px;opacity:.6;margin-top:12px";
    hint.textContent="Do a learning activity to earn more treats! 🌟"; root.appendChild(hint); }
}

function happyLine(){ const h=S.pet.happy;
  return h>=90?"I feel great! 💛":h>=70?"This is fun!":h>=55?"I'm so glad you're here.":"Yay, you came back!"; }

function feedPet(){
  if(S.pet.treats<1) return;
  const before=petLevel();
  S.pet.treats--; S.pet.fed++; S.pet.happy=Math.min(100,S.pet.happy+15);
  ding(); save();
  petMsg="Yum yum! 🍎 Thank you!";
  if(petLevel()>before){ confetti(30); petMsg="🎉 I grew to Level "+petLevel()+"! "+(petAccessory()?"Look at my new "+petAccessory()+"!":""); }
  renderPet();
}
function playPet(){
  S.pet.happy=Math.min(100,S.pet.happy+8); ding(); save();
  petMsg=["Wheee! 🎉","Hehe that tickles!","Again! Again!","I love you! 💛","So much fun!"][Math.floor(Math.random()*5)];
  confetti(8); renderPet();
}

/* small shared helper */
function backRow(fn, label){ const r=el("div","backrow"); const b=el("button","back"); b.textContent=label; b.onclick=fn; r.appendChild(b); return r; }
