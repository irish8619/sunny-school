/* ============================================================
   Sunny School — BUDDY (virtual pet reward) + CLOSET/SHOP
   She earns 🍎 treats by finishing activities, then feeds,
   plays, dresses up, and plays mini-games with her buddy.
   GOLDEN RULE: the buddy can NEVER get sick, starve, or die.
   Gaps are forgiven — it only ever gets happier. Zero guilt.
   Globals from app.js: S, save, show, el, ding, confetti,
   todayStr, daysBetween, goHome. Games in pet-games.js.
   ============================================================ */

/* animals are full-body vector creatures — keys from CREATURE_KEYS (pet-art.js) */

/* Cosmetics. slot: hat | item | scene.  free = level auto-unlocked (price 0). */
const SHOP_ITEMS = [
  {id:"bow",     e:"🎀", name:"Bow",        slot:"hat",   free:3},
  {id:"tophat",  e:"🎩", name:"Top Hat",    slot:"hat",   free:6},
  {id:"crown",   e:"👑", name:"Crown",      slot:"hat",   free:10},
  {id:"cap",     e:"🧢", name:"Ball Cap",   slot:"hat",   price:5},
  {id:"party",   e:"🎉", name:"Party Hat",  slot:"hat",   price:8},
  {id:"sunhat",  e:"👒", name:"Sun Hat",    slot:"hat",   price:8},
  {id:"grad",    e:"🎓", name:"Grad Cap",   slot:"hat",   price:12},
  {id:"star",    e:"⭐", name:"Star Pal",   slot:"item",  free:16},
  {id:"flower",  e:"🌷", name:"Flower",     slot:"item",  price:4},
  {id:"balloon", e:"🎈", name:"Balloon",    slot:"item",  price:4},
  {id:"ball",    e:"⚽", name:"Ball",       slot:"item",  price:5},
  {id:"scarf",   e:"🧣", name:"Scarf",      slot:"item",  price:6},
  {id:"glasses", e:"👓", name:"Glasses",    slot:"item",  price:6},
  {id:"sunnies", e:"🕶️", name:"Cool Shades",slot:"item",  price:9},
  {id:"medal",   e:"🏅", name:"Gold Medal", slot:"item",  price:14},
  {id:"rainbow", e:"🌈", name:"Rainbow",    slot:"scene", price:10},
  {id:"night",   e:"🌙", name:"Night Sky",  slot:"scene", price:10},
  {id:"garden",  e:"🌷", name:"Garden",     slot:"scene", price:12},
  {id:"beach",   e:"🏖️", name:"Beach",      slot:"scene", price:15},
  {id:"space",   e:"🚀", name:"Outer Space",slot:"scene", price:20},
];
const ITEM = id => SHOP_ITEMS.find(i=>i.id===id);
/* every buddy lives in a SCENE (default meadow); bought scenes swap it */
const SCENES = {
  none:   {bg:"linear-gradient(#c3ecff 0%,#e8f8ff 52%,#b6e88f 52%,#96d86e 100%)", deco:"meadow"},
  rainbow:{bg:"linear-gradient(#cfefff 0%,#ffe6f5 58%,#b6e88f 58%,#96d86e 100%)", deco:"rainbow"},
  night:  {bg:"linear-gradient(#241f47 0%,#3a2f66 60%,#4a3f76 60%,#2f2758 100%)", deco:"night"},
  garden: {bg:"linear-gradient(#c3ecff 0%,#e8f8ff 50%,#a9de84 50%,#8ace63 100%)", deco:"garden"},
  beach:  {bg:"linear-gradient(#bfe9ff 0%,#e0f4ff 55%,#ffe9b0 55%,#ffde8c 100%)", deco:"beach"},
  space:  {bg:"linear-gradient(#141133 0%,#241f47 60%,#3a2f66 100%)", deco:"space"},
};
function petSceneBg(s){ return (SCENES[s]||SCENES.none).bg; }
function starDeco(x,y,sz){ return `<div style="position:absolute;left:${x}%;top:${y}%;font-size:${sz||20}px;opacity:.9">✨</div>`; }
function petSceneDeco(s){
  const d=(SCENES[s]||SCENES.none).deco;
  const cloud=(x,y,sz)=>`<div style="position:absolute;left:${x};top:${y};font-size:${sz}px;opacity:.92">☁️</div>`;
  if(d==="night"||d==="space")
    return `<div style="position:absolute;right:16px;top:12px;font-size:48px">🌙</div>`+starDeco(16,28,22)+starDeco(72,16,26)+starDeco(86,44,20)+starDeco(40,12,18)+starDeco(58,48,24)+starDeco(28,60,18);
  let out=`<div style="position:absolute;left:14px;top:10px;font-size:56px">☀️</div>`+cloud("58%","12%",44)+cloud("16%","26%",34);
  if(d==="rainbow") out+=`<div style="position:absolute;right:10px;top:44px;font-size:64px">🌈</div>`;
  if(d==="garden"||d==="meadow") out+=`<div style="position:absolute;left:7%;bottom:8px;font-size:30px">🌷</div><div style="position:absolute;left:80%;bottom:6px;font-size:30px">🌼</div><div style="position:absolute;left:32%;bottom:4px;font-size:24px">🌱</div><div style="position:absolute;left:60%;bottom:6px;font-size:22px">🍄</div>`;
  if(d==="beach") out+=`<div style="position:absolute;left:72%;bottom:8px;font-size:30px">🐚</div><div style="position:absolute;left:12%;bottom:6px;font-size:26px">⭐</div><div style="position:absolute;left:44%;bottom:4px;font-size:24px">🏖️</div>`;
  return out;
}

let petMsg = "";

function petLevel(){ return Math.floor(S.pet.fed/8) + 1; }
function petSize(){ return 96 + Math.min(petLevel(),12)*7; }
function petHearts(){ return Math.max(1, Math.round(S.pet.happy/20)); }
function petVisitDecay(){ if(!S.pet.lastVisit) return; const d=daysBetween(S.pet.lastVisit, todayStr()); if(d>0) S.pet.happy=Math.max(55, S.pet.happy - d*6); }

/* grant free milestone items as she levels up; auto-equip first hat */
function petCheckUnlocks(){
  let grew=false;
  SHOP_ITEMS.filter(i=>i.free && petLevel()>=i.free).forEach(i=>{
    if(!S.pet.owned.includes(i.id)){ S.pet.owned.push(i.id); grew=true;
      if(i.slot==="hat" && !S.pet.wear.hat) S.pet.wear.hat=i.id;
      if(i.slot==="item" && !S.pet.wear.item) S.pet.wear.item=i.id; }
  });
  return grew;
}

function openPet(){
  if(!S.pet.has){ renderHatch(); }
  else { petVisitDecay(); const away=S.pet.lastVisit && S.pet.lastVisit!==todayStr();
    S.pet.lastVisit=todayStr(); save(); petMsg=away?"I missed you so much! 💛":""; renderPet(); sayBuddy(petMsg||happyLine()); }
  show("pet");
}
function sayBuddy(m){ if(typeof narrate==="function") narrate((S.pet.name?S.pet.name+" says: ":"")+m); }

/* ---- buddy "aliveness": idle micro-actions, floating hearts, chatter (all positive, no-death) ---- */
const PET_IDLE_LINES = ["I'm so happy! 💛","What should we do?","I love you!","Tee hee!","You're my best friend!","Let's play!","Hi!","This is fun!","🎵 la la la 🎵"];
let petIdleTimer=null, petLastActive=0;
function nowMs(){ return (window.performance&&performance.now)?performance.now():Date.now(); }
function petWake(){ petLastActive=nowMs();
  const svg=document.querySelector("#pet .creature"); if(svg){ svg.classList.remove("sleeping"); const h=svg.parentElement; if(h) h.style.transform=""; }
  const z=document.getElementById("petZzz"); if(z) z.remove(); }
function emitHeart(){
  const c=document.querySelector("#pet .creature"); if(!c) return;
  const r=c.getBoundingClientRect(); const h=el("div");
  h.textContent=["💛","⭐","✨","💕","🌟"][Math.floor(Math.random()*5)];
  h.style.cssText="position:fixed;left:"+(r.left+r.width*(0.3+Math.random()*0.4))+"px;top:"+(r.top+r.height*0.35)+"px;font-size:26px;z-index:40;pointer-events:none";
  document.body.appendChild(h);
  h.animate([{transform:"translateY(0) scale(.6)",opacity:0},{transform:"translateY(-16px) scale(1.1)",opacity:1,offset:.25},{transform:"translateY(-72px) scale(.9)",opacity:0}],{duration:1500,easing:"ease-out"});
  setTimeout(()=>h.remove(),1500);
}
function startPetIdle(){
  petWake();   // interaction (each render) resets the sleep clock
  clearInterval(petIdleTimer);
  petIdleTimer=setInterval(function(){
    const pet=document.getElementById("pet"), svg=document.querySelector("#pet .creature");
    if(!svg || !pet || pet.classList.contains("hidden")){ clearInterval(petIdleTimer); petIdleTimer=null; return; }
    const holder=svg.parentElement, wrap=holder&&holder.parentElement;
    if(nowMs()-petLastActive > 18000){   // sleepy after a while untouched — a tap wakes it happily
      if(!svg.classList.contains("sleeping")){ svg.classList.add("sleeping");
        const b=document.getElementById("petBubble"); if(b) b.textContent="Zzz… 💤";
        if(wrap && !document.getElementById("petZzz")){ const z=el("div"); z.id="petZzz"; z.textContent="💤"; z.style.cssText="position:absolute;top:-4px;right:-8px;font-size:30px;animation:bob 2.6s ease-in-out infinite"; wrap.appendChild(z); }
      }
      return;
    }
    const roll=Math.random();
    if(roll<0.26){ svg.classList.add("happy"); setTimeout(()=>svg.classList.remove("happy"),550); }        // a little hop
    else if(roll<0.54){ emitHeart(); }                                                                     // float a heart
    else if(roll<0.76){ holder.style.transition="transform .9s ease-in-out"; holder.style.transform="translateX("+Math.round(Math.random()*64-32)+"px)"; }  // wander the meadow
    else { const b=document.getElementById("petBubble"); if(b) b.textContent=PET_IDLE_LINES[Math.floor(Math.random()*PET_IDLE_LINES.length)]; }              // chatter
  }, 4200);   // gentle pace (calm budget)
}
function petFromCelebrate(){ hideOverlays(); openPet(); }

/* ---- hatch ---- */
function renderHatch(){
  const root=document.getElementById("pet"); root.innerHTML="";
  root.appendChild(backRow(goHome,"‹ Home"));
  root.appendChild(titleEl("🥚 Meet your new buddy!")); root.appendChild(subEl("Pick the friend you want to hatch:"));
  let chosen=null, nameVal="";
  const board=el("div"); board.style.cssText="display:grid;grid-template-columns:repeat(3,1fr);gap:12px";
  CREATURE_KEYS.forEach(k=>{ const b=el("button","pcard"); b.style.padding="6px"; b.innerHTML=makeCreature(k,88);
    b.onclick=()=>{ chosen=k; [...board.children].forEach(c=>c.style.outline=""); b.style.outline="4px solid #6a4cff"; ding(); hb.disabled=false; hb.style.opacity=1; };
    board.appendChild(b); });
  root.appendChild(board);
  const nameBox=el("input","namebox"); nameBox.placeholder="Name your buddy (optional)"; nameBox.maxLength=14; nameBox.style.marginTop="16px";
  nameBox.oninput=e=>nameVal=e.target.value; root.appendChild(nameBox);
  const hb=el("button","bigbtn green"); hb.style.marginTop="14px"; hb.textContent="Hatch! 🥚✨"; hb.disabled=true; hb.style.opacity=.5;
  hb.onclick=()=>{ if(!chosen) return; S.pet.has=true; S.pet.type=chosen; S.pet.name=(nameVal||"Buddy").trim().slice(0,14);
    S.pet.happy=100; S.pet.lastVisit=todayStr(); save(); confetti(40); petMsg="Hi! I'm so happy to meet you! 💛"; renderPet(); show("pet"); };
  root.appendChild(hb);
}

/* ---- buddy home ---- */
function renderPet(){
  const p=S.pet, root=document.getElementById("pet"); root.innerHTML="";
  root.appendChild(backRow(goHome,"‹ Home"));
  const dark = p.wear.scene==="night"||p.wear.scene==="space";
  const card=el("div"); card.style.cssText="position:relative;overflow:hidden;border-radius:32px;padding:20px;margin-top:8px;min-height:340px;text-align:center;box-shadow:0 10px 30px rgba(90,60,160,.18);flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;background:"+petSceneBg(p.wear.scene);
  const deco=el("div"); deco.style.cssText="position:absolute;inset:0;z-index:0;pointer-events:none;overflow:hidden"; deco.innerHTML=petSceneDeco(p.wear.scene); card.appendChild(deco);
  const content=el("div"); content.style.cssText="position:relative;z-index:1;display:flex;flex-direction:column;align-items:center;width:100%";
  const bubText=petMsg||happyLine();
  const bub=el("div"); bub.id="petBubble"; bub.style.cssText="background:rgba(255,255,255,.9);border-radius:18px;padding:10px 16px;font-size:16px;font-weight:bold;margin-bottom:4px;min-height:22px;box-shadow:0 3px 8px rgba(90,60,140,.12)"; bub.textContent=bubText; content.appendChild(bub);
  /* NOTE: don't narrate here — renderPet runs on every pet/feed tap. The buddy speaks only at meaningful moments via sayBuddy(). */
  // creature with worn cosmetics
  const wrap=el("div"); wrap.style.cssText="position:relative;cursor:pointer;margin:6px 0;filter:drop-shadow(0 8px 8px rgba(60,40,90,.18))"; wrap.onclick=playPet;
  if(p.wear.hat){ const h=el("div"); h.textContent=ITEM(p.wear.hat).e; h.style.cssText="position:absolute;top:-8px;left:50%;transform:translateX(-50%);font-size:38px;z-index:2"; wrap.appendChild(h); }
  const c=el("div"); c.innerHTML=makeCreature(p.type, Math.round(petSize()*1.75)); c.style.cssText="line-height:0"; wrap.appendChild(c);
  if(p.wear.item){ const it=el("div"); it.textContent=ITEM(p.wear.item).e; it.style.cssText="position:absolute;bottom:-4px;right:-6px;font-size:34px;z-index:2"; wrap.appendChild(it); }
  if(p.happy>=90){ [["top:2px;left:2%","0s"],["top:12%;right:2%",".5s"],["bottom:18%;left:16%","1s"]].forEach(s=>{ const sp=el("div"); sp.textContent="✨"; sp.style.cssText="position:absolute;font-size:22px;pointer-events:none;animation:auraTwinkle 2s ease-in-out infinite "+s[1]+";"+s[0]; wrap.appendChild(sp); }); }
  content.appendChild(wrap);
  const nm=el("div"); nm.style.cssText="font-size:26px;font-weight:bold;color:"+(dark?"#fff":"var(--ink)")+";text-shadow:0 2px 4px rgba(255,255,255,.5)"; nm.textContent=p.name;
  const lv=el("div"); lv.style.cssText="font-size:14px;opacity:.75;margin-bottom:6px;color:"+(dark?"#fff":"var(--ink)"); lv.textContent="Level "+petLevel();
  const hearts=el("div"); hearts.style.cssText="font-size:28px;letter-spacing:2px;filter:drop-shadow(0 2px 3px rgba(0,0,0,.15))"; hearts.textContent="❤️".repeat(petHearts())+"🤍".repeat(5-petHearts());
  content.appendChild(nm); content.appendChild(lv); content.appendChild(hearts);
  card.appendChild(content); root.appendChild(card);
  const tl=el("div"); tl.style.cssText="text-align:center;font-size:18px;margin:12px 0 6px"; tl.innerHTML="You have <b>🍎 "+p.treats+"</b> treats"; root.appendChild(tl);
  const feed=el("button","bigbtn green"); feed.textContent="🍎 Feed "+p.name; if(p.treats<1){ feed.disabled=true; feed.style.opacity=.5; } feed.onclick=feedPet; root.appendChild(feed);
  const row=el("div"); row.style.cssText="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:12px";
  const closet=el("button","bigbtn pink"); closet.style.margin=0; closet.style.fontSize="20px"; closet.textContent="👕 Closet"; closet.onclick=renderShop;
  const games=el("button","bigbtn"); games.style.margin=0; games.style.fontSize="20px"; games.textContent="🎮 Games"; games.onclick=()=>openGames();
  row.appendChild(closet); row.appendChild(games); root.appendChild(row);
  const play=el("button","bigbtn"); play.style.cssText="margin-top:12px;background:#ffc233;box-shadow:0 6px 0 #d99e12;font-size:20px;padding:16px"; play.textContent="🎾 Pet & cuddle (free!)"; play.onclick=playPet; root.appendChild(play);
  startPetIdle();   // the buddy does its own cute thing while she watches
  if(p.treats<1){ const hint=el("div"); hint.style.cssText="text-align:center;font-size:14px;opacity:.6;margin-top:12px"; hint.textContent="Do a learning activity to earn more treats! 🌟"; root.appendChild(hint); }
}

function happyLine(){ const h=S.pet.happy; return h>=90?"I feel great! 💛":h>=70?"This is fun!":h>=55?"I'm so glad you're here.":"Yay, you came back!"; }
function feedPet(){ if(S.pet.treats<1) return; const b=petLevel(); S.pet.treats--; S.pet.fed++; S.pet.happy=Math.min(100,S.pet.happy+15); ding();
  if(petLevel()>b){ petCheckUnlocks(); confetti(30); petMsg="🎉 I grew to Level "+petLevel()+"!"; } else petMsg="Yum yum! 🍎 Thank you!"; save(); renderPet(); petHop(); sayBuddy(petMsg); }
function playPet(){ S.pet.happy=Math.min(100,S.pet.happy+8); ding(); save(); petMsg=["Wheee! 🎉","Hehe that tickles!","Again! Again!","I love you! 💛","So much fun!"][Math.floor(Math.random()*5)]; confetti(8); renderPet(); petHop(); for(let i=0;i<5;i++) setTimeout(emitHeart, i*90); }
function petHop(){ const c=document.querySelector("#pet .creature"); if(c){ c.classList.add("happy"); setTimeout(()=>c.classList.remove("happy"),600); } }

/* ---- closet & shop ---- */
function renderShop(){
  const p=S.pet, root=document.getElementById("petshop"); root.innerHTML="";
  root.appendChild(backRow(()=>{ renderPet(); show("pet"); }, "‹ Back to "+p.name));
  root.appendChild(titleEl("👕 "+p.name+"'s Closet & Shop"));
  const tl=el("div"); tl.style.cssText="text-align:center;font-size:18px;margin-bottom:12px"; tl.innerHTML="You have <b>🍎 "+p.treats+"</b> treats · earn more by learning!"; root.appendChild(tl);
  ["hat","item","scene"].forEach(slot=>{
    const head=el("div"); head.style.cssText="font-size:14px;text-transform:uppercase;letter-spacing:.5px;opacity:.55;margin:14px 0 6px";
    head.textContent={hat:"Hats",item:"Fun Stuff",scene:"Scenes"}[slot]; root.appendChild(head);
    const grid=el("div"); grid.style.cssText="display:grid;grid-template-columns:repeat(3,1fr);gap:10px";
    SHOP_ITEMS.filter(i=>i.slot===slot).forEach(i=>grid.appendChild(shopCard(i))); root.appendChild(grid);
  });
  root.appendChild(el("div")).style.height="16px";
  if(typeof narrate==="function") narrate(p.name+"'s closet. Dress up your buddy!");
  show("petshop");
}
function shopCard(i){
  const p=S.pet, owned=p.owned.includes(i.id), worn=p.wear[i.slot]===i.id;
  const locked = i.free && !owned && petLevel()<i.free;
  const b=el("button","pcard"); b.style.padding="14px 8px";
  let tag = worn?"Wearing ✓" : owned?"Tap to wear" : locked?("Level "+i.free) : i.free?("Free at Lv"+i.free):("🍎 "+i.price);
  b.innerHTML=`<div style="font-size:40px">${i.e}</div><div style="font-size:13px;font-weight:bold">${i.name}</div><div style="font-size:12px;opacity:.7;margin-top:2px">${tag}</div>`;
  if(worn) b.style.outline="4px solid #2fbf71";
  const say=t=>{ if(typeof narrate==="function") narrate(t); };
  if(locked){ b.style.opacity=.45; b.onclick=()=>{ say(i.name+". Play more to unlock it!"); if(typeof Voice!=="undefined") Voice.nudge(); }; return b; }
  b.onclick=()=>{
    if(owned){ p.wear[i.slot]= worn?null:i.id; say(worn?"Took off the "+i.name:"Wearing the "+i.name); ding(); save(); renderShop(); }
    else if(!i.free && p.treats>=i.price){ p.treats-=i.price; p.owned.push(i.id); p.wear[i.slot]=i.id; say("You got the "+i.name+"!"); confetti(20); ding(); save(); renderShop(); }
    else if(!i.free){ say(i.name+" costs "+i.price+" treats. Play to earn more!"); if(typeof Voice!=="undefined") Voice.nudge(); b.animate([{transform:'translateX(-6px)'},{transform:'translateX(6px)'},{transform:'translateX(0)'}],{duration:300}); }
  };
  return b;
}

/* shared helpers */
function backRow(fn,label){ const r=el("div","backrow"); const b=el("button","back"); b.textContent=label; b.onclick=fn; r.appendChild(b); return r; }
function titleEl(t){ const h=el("div"); h.style.cssText="text-align:center;font-size:23px;font-weight:bold;margin:8px 0 2px"; h.textContent=t; return h; }
function subEl(t){ const s=el("div"); s.style.cssText="text-align:center;font-size:15px;opacity:.65;margin-bottom:14px"; s.textContent=t; return s; }

/* once every script is loaded, upgrade the home mascot to a living creature */
window.addEventListener("load", function(){ try{ if(!document.getElementById("home").classList.contains("hidden")) renderHome(); }catch(e){} });
