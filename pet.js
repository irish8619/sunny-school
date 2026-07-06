/* ============================================================
   Sunny School — BUDDY (virtual pet reward) + CLOSET/SHOP
   She earns 🍎 treats by finishing activities, then feeds,
   plays, dresses up, and plays mini-games with her buddy.
   GOLDEN RULE: the buddy can NEVER get sick, starve, or die.
   Gaps are forgiven — it only ever gets happier. Zero guilt.
   Globals from app.js: S, save, show, el, ding, confetti,
   todayStr, daysBetween, goHome. Games in pet-games.js.
   ============================================================ */

const PET_ANIMALS = ["🐱","🐶","🐰","🦊","🐻","🐥","🐉","🦄","🐧","🐼"];

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
const SCENE_BG = { rainbow:"linear-gradient(160deg,#ffd1e8,#d1e8ff,#d9ffe0)", night:"linear-gradient(160deg,#3a2a5d,#5a4a8d)",
  garden:"linear-gradient(160deg,#eafbe0,#d6f5c8)", beach:"linear-gradient(160deg,#fff4c2,#bfeaff)", space:"linear-gradient(160deg,#2a2340,#453a6b)" };

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
    S.pet.lastVisit=todayStr(); save(); petMsg=away?"I missed you so much! 💛":""; renderPet(); }
  show("pet");
}
function petFromCelebrate(){ hideOverlays(); openPet(); }

/* ---- hatch ---- */
function renderHatch(){
  const root=document.getElementById("pet"); root.innerHTML="";
  root.appendChild(backRow(goHome,"‹ Home"));
  root.appendChild(titleEl("🥚 Meet your new buddy!")); root.appendChild(subEl("Pick the friend you want to hatch:"));
  let chosen=null, nameVal="";
  const board=el("div"); board.style.cssText="display:grid;grid-template-columns:repeat(3,1fr);gap:12px";
  PET_ANIMALS.forEach(a=>{ const b=el("button","pcard"); b.innerHTML=`<div style="font-size:52px">${a}</div>`;
    b.onclick=()=>{ chosen=a; [...board.children].forEach(c=>c.style.outline=""); b.style.outline="4px solid #6a4cff"; ding(); hb.disabled=false; hb.style.opacity=1; };
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
  const card=el("div"); card.style.cssText="border-radius:32px;padding:20px;margin-top:8px;text-align:center;box-shadow:0 10px 30px rgba(90,60,160,.18);flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;background:"+(p.wear.scene&&SCENE_BG[p.wear.scene]||"#fff");
  const bub=el("div"); bub.style.cssText="background:rgba(255,255,255,.85);border-radius:18px;padding:10px 16px;font-size:16px;margin-bottom:6px;min-height:22px"; bub.textContent=petMsg||happyLine(); card.appendChild(bub);
  // creature with worn cosmetics
  const wrap=el("div"); wrap.style.cssText="position:relative;cursor:pointer;margin:6px 0"; wrap.onclick=playPet;
  if(p.wear.hat){ const h=el("div"); h.textContent=ITEM(p.wear.hat).e; h.style.cssText="position:absolute;top:-8px;left:50%;transform:translateX(-50%);font-size:38px"; wrap.appendChild(h); }
  const c=el("div"); c.textContent=p.type; c.style.cssText="font-size:"+petSize()+"px;animation:bob 2.6s ease-in-out infinite;line-height:1"; wrap.appendChild(c);
  if(p.wear.item){ const it=el("div"); it.textContent=ITEM(p.wear.item).e; it.style.cssText="position:absolute;bottom:-4px;right:-6px;font-size:34px"; wrap.appendChild(it); }
  card.appendChild(wrap);
  const nm=el("div"); nm.style.cssText="font-size:24px;font-weight:bold"; nm.textContent=p.name;
  const lv=el("div"); lv.style.cssText="font-size:14px;opacity:.6;margin-bottom:6px"; lv.textContent="Level "+petLevel();
  const hearts=el("div"); hearts.style.cssText="font-size:26px;letter-spacing:2px"; hearts.textContent="❤️".repeat(petHearts())+"🤍".repeat(5-petHearts());
  card.appendChild(nm); card.appendChild(lv); card.appendChild(hearts); root.appendChild(card);
  const tl=el("div"); tl.style.cssText="text-align:center;font-size:18px;margin:12px 0 6px"; tl.innerHTML="You have <b>🍎 "+p.treats+"</b> treats"; root.appendChild(tl);
  const feed=el("button","bigbtn green"); feed.textContent="🍎 Feed "+p.name; if(p.treats<1){ feed.disabled=true; feed.style.opacity=.5; } feed.onclick=feedPet; root.appendChild(feed);
  const row=el("div"); row.style.cssText="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:12px";
  const closet=el("button","bigbtn pink"); closet.style.margin=0; closet.style.fontSize="20px"; closet.textContent="👕 Closet"; closet.onclick=renderShop;
  const games=el("button","bigbtn"); games.style.margin=0; games.style.fontSize="20px"; games.textContent="🎮 Games"; games.onclick=()=>openGames();
  row.appendChild(closet); row.appendChild(games); root.appendChild(row);
  const play=el("button","bigbtn"); play.style.cssText="margin-top:12px;background:#ffc233;box-shadow:0 6px 0 #d99e12;font-size:20px;padding:16px"; play.textContent="🎾 Pet & cuddle (free!)"; play.onclick=playPet; root.appendChild(play);
  if(p.treats<1){ const hint=el("div"); hint.style.cssText="text-align:center;font-size:14px;opacity:.6;margin-top:12px"; hint.textContent="Do a learning activity to earn more treats! 🌟"; root.appendChild(hint); }
}

function happyLine(){ const h=S.pet.happy; return h>=90?"I feel great! 💛":h>=70?"This is fun!":h>=55?"I'm so glad you're here.":"Yay, you came back!"; }
function feedPet(){ if(S.pet.treats<1) return; const b=petLevel(); S.pet.treats--; S.pet.fed++; S.pet.happy=Math.min(100,S.pet.happy+15); ding();
  if(petLevel()>b){ petCheckUnlocks(); confetti(30); petMsg="🎉 I grew to Level "+petLevel()+"!"; } else petMsg="Yum yum! 🍎 Thank you!"; save(); renderPet(); }
function playPet(){ S.pet.happy=Math.min(100,S.pet.happy+8); ding(); save(); petMsg=["Wheee! 🎉","Hehe that tickles!","Again! Again!","I love you! 💛","So much fun!"][Math.floor(Math.random()*5)]; confetti(8); renderPet(); }

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
  show("petshop");
}
function shopCard(i){
  const p=S.pet, owned=p.owned.includes(i.id), worn=p.wear[i.slot]===i.id;
  const locked = i.free && !owned && petLevel()<i.free;
  const b=el("button","pcard"); b.style.padding="14px 8px";
  let tag = worn?"Wearing ✓" : owned?"Tap to wear" : locked?("Level "+i.free) : i.free?("Free at Lv"+i.free):("🍎 "+i.price);
  b.innerHTML=`<div style="font-size:40px">${i.e}</div><div style="font-size:13px;font-weight:bold">${i.name}</div><div style="font-size:12px;opacity:.7;margin-top:2px">${tag}</div>`;
  if(worn) b.style.outline="4px solid #2fbf71";
  if(locked){ b.style.opacity=.45; b.onclick=()=>{ petMsg=""; ding(); }; return b; }
  b.onclick=()=>{
    if(owned){ p.wear[i.slot]= worn?null:i.id; ding(); save(); renderShop(); }
    else if(!i.free && p.treats>=i.price){ p.treats-=i.price; p.owned.push(i.id); p.wear[i.slot]=i.id; confetti(20); ding(); save(); renderShop(); }
    else if(!i.free){ b.animate([{transform:'translateX(-6px)'},{transform:'translateX(6px)'},{transform:'translateX(0)'}],{duration:300}); }
  };
  return b;
}

/* shared helpers */
function backRow(fn,label){ const r=el("div","backrow"); const b=el("button","back"); b.textContent=label; b.onclick=fn; r.appendChild(b); return r; }
function titleEl(t){ const h=el("div"); h.style.cssText="text-align:center;font-size:23px;font-weight:bold;margin:8px 0 2px"; h.textContent=t; return h; }
function subEl(t){ const s=el("div"); s.style.cssText="text-align:center;font-size:15px;opacity:.65;margin-bottom:14px"; s.textContent=t; return s; }
