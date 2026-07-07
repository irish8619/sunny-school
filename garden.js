/* ============================================================
   Sunny School — STICKER GARDEN
   A world that only ever GROWS. Every finished activity plants
   one permanent sticker (flower / tree / critter) in Iris's
   garden. No guilt, no loss — a gap just means it didn't grow
   that day; nothing is ever removed. Offline SVG/emoji + CSS.
   Globals from app.js: S, save, show, el, narrate, backRow?, goHome, confetti.
   ============================================================ */

const GARDEN_STICKERS = ["🌻","🌷","🌼","🌹","🌺","🌸","🌱","🌿","🍀","🌳","🌲","🍄","🐛","🦋","🐝","🐞","🐢","🐰","🦆","🐸","🍎","🍓","⭐","🌈"];

/* stable pseudo-random 0..1 from an integer seed (no Math.random so positions never shift) */
function gRand(seed){ const x=Math.sin(seed*127.1+31.7)*43758.5453; return x-Math.floor(x); }

/* plant one sticker for a finished activity; returns the emoji planted */
function plantSticker(){
  if(!S.garden) S.garden=[];
  const i=S.garden.length;
  const e=GARDEN_STICKERS[Math.floor(gRand(i*3+1)*GARDEN_STICKERS.length)];
  const x=6+gRand(i*7+2)*86;                 // 6%..92% across
  const y=54+gRand(i*11+5)*38;               // 54%..92% down (on the grass)
  S.garden.push({e, x:Math.round(x), y:Math.round(y)});
  save();
  return e;
}

function gardenCount(){ return (S.garden||[]).length; }
function gardenLast(){ const g=S.garden||[]; return g.length?g[g.length-1].e:"🌱"; }

function openGarden(){
  const root=document.getElementById("garden"); root.innerHTML="";
  root.appendChild(backRow(goHome, "‹ Home"));
  const name=(S.name||"My")+"'s Garden";
  const t=el("div"); t.style.cssText="text-align:center;font-size:24px;font-weight:bold;margin:6px 0 2px"; t.textContent="🌱 "+name;
  const c=el("div"); c.style.cssText="text-align:center;font-size:16px;opacity:.7;margin-bottom:10px";
  c.textContent = gardenCount()? ("You grew "+gardenCount()+" things! Tap them to say hello.") : "Finish an activity to plant your first flower!";
  root.appendChild(t); root.appendChild(c);

  const field=el("div");
  field.style.cssText="position:relative;flex:1;min-height:420px;border-radius:28px;overflow:hidden;box-shadow:0 10px 30px rgba(90,60,160,.18);background:linear-gradient(#c3ecff 0%,#e8f8ff 50%,#b6e88f 50%,#96d86e 100%)";
  // sun + a couple clouds
  const deco=el("div"); deco.style.cssText="position:absolute;inset:0;pointer-events:none";
  deco.innerHTML='<div style="position:absolute;left:16px;top:12px;font-size:54px">☀️</div>'+
                 '<div style="position:absolute;left:58%;top:12%;font-size:40px;opacity:.9">☁️</div>'+
                 '<div style="position:absolute;left:20%;top:24%;font-size:32px;opacity:.9">☁️</div>';
  field.appendChild(deco);
  (S.garden||[]).forEach(s=>{
    const d=el("div"); d.textContent=s.e;
    d.style.cssText="position:absolute;left:"+s.x+"%;top:"+s.y+"%;transform:translate(-50%,-50%);font-size:38px;cursor:pointer;filter:drop-shadow(0 3px 3px rgba(60,40,90,.2))";
    d.onclick=()=>{ d.animate([{transform:'translate(-50%,-50%) scale(1)'},{transform:'translate(-50%,-50%) scale(1.5) rotate(12deg)'},{transform:'translate(-50%,-50%) scale(1)'}],{duration:400});
      if(typeof Voice!=="undefined") Voice.good(); };
    field.appendChild(d);
  });
  if(!gardenCount()){ const empty=el("div"); empty.textContent="🌱"; empty.style.cssText="position:absolute;left:50%;top:72%;transform:translate(-50%,-50%);font-size:60px;opacity:.5"; field.appendChild(empty); }
  root.appendChild(field);
  root.appendChild(el("div")).style.height="14px";
  narrate(gardenCount()? (name+". You grew "+gardenCount()+" things!") : "Your garden. Play to grow your first flower!");
  show("garden");
}
