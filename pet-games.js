/* ============================================================
   Sunny School — BUDDY MINI-GAMES
   Three quick, no-fail games she plays with her buddy.
   Games give happiness + a small treat bonus (learning stays
   the main treat source). Globals from app.js/pet.js:
   S, save, show, el, ding, confetti, renderPet, backRow, titleEl.
   ============================================================ */

let gameTimers = [];
function trackT(id){ gameTimers.push(id); return id; }
function stopGame(){ gameTimers.forEach(id=>{ clearInterval(id); clearTimeout(id); }); gameTimers=[]; }

const GAMES = [
  {id:"catch",  e:"🍎", name:"Snack Catch",  sub:"Tap the treats!"},
  {id:"bubble", e:"🫧", name:"Bubble Pop",   sub:"Pop the bubbles!"},
  {id:"cups",   e:"🥤", name:"Find the Treat", sub:"Which cup?"},
];

function openGames(){
  stopGame();
  const root=document.getElementById("petgame"); root.innerHTML="";
  root.appendChild(backRow(()=>{ renderPet(); show("pet"); }, "‹ Back to "+S.pet.name));
  root.appendChild(titleEl("🎮 Play with "+S.pet.name));
  const board=el("div"); board.style.cssText="display:grid;grid-template-columns:1fr;gap:12px;margin-top:6px";
  GAMES.forEach(g=>{ const b=el("button","pcard"); b.style.cssText="flex-direction:row;gap:14px;justify-content:flex-start;padding:18px 20px";
    b.innerHTML=`<div style="font-size:44px">${g.e}</div><div style="text-align:left"><div style="font-size:20px;font-weight:bold">${g.name}</div><div style="font-size:14px;opacity:.65">${g.sub}</div></div>`;
    b.onclick=()=>startGame(g.id); board.appendChild(b); });
  root.appendChild(board);
  show("petgame");
}

function gameShell(title){
  stopGame();
  const root=document.getElementById("petgame"); root.innerHTML="";
  root.appendChild(backRow(openGames, "‹ Games"));
  const bar=el("div"); bar.style.cssText="display:flex;justify-content:space-between;align-items:center;padding:4px 6px;font-size:20px;font-weight:bold";
  const score=el("div"); score.id="gScore"; score.textContent="⭐ 0";
  const time=el("div"); time.id="gTime"; time.textContent="⏱️ 20";
  bar.appendChild(score); bar.appendChild(time); root.appendChild(bar);
  const t=el("div"); t.style.cssText="text-align:center;font-size:16px;opacity:.7;margin-bottom:2px"; t.textContent=title; root.appendChild(t);
  const area=el("div"); area.id="gArea"; area.className="garea"; root.appendChild(area);
  show("petgame");
  return area;
}
function setScore(n){ document.getElementById("gScore").textContent="⭐ "+n; }
function setTime(n){ const e=document.getElementById("gTime"); if(e) e.textContent="⏱️ "+n; }

function startGame(id){
  if(id==="cups") return startCups();
  startFaller(id);
}

/* ---- Snack Catch / Bubble Pop (shared faller engine) ---- */
function startFaller(id){
  const bubble = id==="bubble";
  const emojis = bubble ? ["🫧","🫧","🔵","🟣"] : ["🍎","🍓","🍌","🥕","🧀","🍇"];
  const area = gameShell(bubble?"Pop as many bubbles as you can!":"Catch treats for your buddy!");
  let score=0, time=20;
  const tick=trackT(setInterval(()=>{ time--; setTime(time); if(time<=0){ stopGame(); endGame(score); } },1000));
  const spawn=trackT(setInterval(()=>{
    const it=el("div","gitem"); it.textContent=emojis[Math.floor(Math.random()*emojis.length)];
    it.style.left=(6+Math.random()*88)+"%";
    const dur=(2.3+Math.random()*1.3).toFixed(2);
    it.style.animation=(bubble?"grise":"gfall")+" "+dur+"s linear forwards";
    it.addEventListener("animationend",()=>it.remove());
    it.addEventListener("pointerdown",e=>{ e.preventDefault(); if(it.dataset.hit) return; it.dataset.hit=1;
      score++; setScore(score); ding(); it.textContent=bubble?"💥":"⭐";
      it.style.animation="none"; it.animate([{transform:'translateX(-50%) scale(1)'},{transform:'translateX(-50%) scale(1.6)',opacity:0}],{duration:250});
      setTimeout(()=>it.remove(),240); });
    area.appendChild(it);
  }, 640));
}

/* ---- Find the Treat (cups / memory) ---- */
function startCups(){
  const area = gameShell("Watch the treat, then find it!");
  area.style.display="flex"; area.style.alignItems="center"; area.style.justifyContent="center";
  let score=0, round=0; const ROUNDS=5;
  function nextRound(){
    round++; if(round>ROUNDS){ stopGame(); endGame(score); return; }
    setTime((ROUNDS-round+1)+" left"); area.innerHTML="";
    const row=el("div"); row.style.cssText="display:flex;gap:22px"; area.appendChild(row);
    const correct=Math.floor(Math.random()*3); const cups=[];
    for(let i=0;i<3;i++){ const w=el("div"); w.style.cssText="position:relative;width:74px;height:96px;text-align:center";
      const treat=el("div"); treat.textContent="🍎"; treat.style.cssText="font-size:34px;position:absolute;bottom:6px;left:50%;transform:translateX(-50%);opacity:"+(i===correct?"1":"0");
      const cup=el("div"); cup.textContent="🥤"; cup.style.cssText="font-size:70px;position:absolute;top:0;left:0;width:100%;transition:transform .4s";
      w.appendChild(treat); w.appendChild(cup); row.appendChild(w); cups.push({cup,correct:i===correct}); }
    // peek: lift correct cup ~1.2s, then cover, then allow guess
    const lift=cups[correct]; lift.cup.style.transform="translateY(-42px)";
    trackT(setTimeout(()=>{ lift.cup.style.transform="translateY(0)";
      trackT(setTimeout(()=>{ cups.forEach(c=>{ c.cup.style.cursor="pointer";
        c.cup.addEventListener("pointerdown",()=>{ if(area.dataset.lock) return; area.dataset.lock=1;
          c.cup.style.transform="translateY(-42px)";
          if(c.correct){ score++; setScore(score); confetti(16); ding(); }
          else { const win=cups.find(x=>x.correct); win.cup.style.transform="translateY(-42px)"; }
          trackT(setTimeout(()=>{ area.dataset.lock=""; nextRound(); },1100)); }); });
      },400));
    },1200));
  }
  setScore(0); nextRound();
}

/* ---- reward + end screen ---- */
function endGame(score){
  const bonus=Math.min(5, Math.floor(score/3));
  S.pet.happy=Math.min(100, S.pet.happy + Math.min(20, score*2));
  S.pet.treats += bonus; save();
  const root=document.getElementById("petgame"); root.innerHTML="";
  const wrap=el("div"); wrap.style.cssText="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;gap:8px";
  const big=el("div"); big.textContent="🎉"; big.style.cssText="font-size:96px;animation:bob 1.6s infinite";
  const t=el("div"); t.style.cssText="font-size:28px;font-weight:bold"; t.textContent="You scored "+score+"!";
  const r=el("div"); r.style.cssText="font-size:20px"; r.innerHTML=bonus?("+🍎 "+bonus+" bonus treats & a happy buddy! 💛"):(S.pet.name+" had so much fun! 💛");
  wrap.appendChild(big); wrap.appendChild(t); wrap.appendChild(r);
  const again=el("button","bigbtn green"); again.style.maxWidth="320px"; again.style.marginTop="10px"; again.textContent="🎮 Play again"; again.onclick=openGames;
  const back=el("button","bigbtn pink"); back.style.maxWidth="320px"; back.textContent="🐾 Back to "+S.pet.name; back.onclick=()=>{ renderPet(); show("pet"); };
  wrap.appendChild(again); wrap.appendChild(back); root.appendChild(wrap);
  confetti(30); show("petgame");
}
