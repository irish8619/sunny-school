/* ============================================================
   Sunny School — CREATURE ART
   Full-body vector animals, drawn inline (offline, scalable).
   Parts carry classes (pa-body/pa-eye/pa-ear-l/pa-ear-r/pa-tail)
   that the CSS animates: breathing, blinking, ear twitch, tail
   wag, and a happy hop. makeCreature(type,size) -> <svg> string.
   ============================================================ */

const CREATURES = {
  cat:    {emoji:"🐱", body:"#f6a04d", belly:"#fff1de", ear:"pointy", tail:"curl",  nose:"#ff9bb3", whiskers:true},
  dog:    {emoji:"🐶", body:"#caa06a", belly:"#f3e6cf", ear:"floppy", earColor:"#9c7647", tail:"curl", nose:"#4a3222"},
  rabbit: {emoji:"🐰", body:"#eceef4", belly:"#ffffff", ear:"long",   earInner:"#ffc2d6", tail:"puff", nose:"#ff9bb3"},
  fox:    {emoji:"🦊", body:"#f07f3c", belly:"#ffffff", ear:"pointy", earTip:"#3a2a2a", tail:"bushy", tailTip:"#ffffff", nose:"#3a2a2a", cheeks:"#ffffff"},
  bear:   {emoji:"🐻", body:"#b07a4e", belly:"#d8b48a", ear:"round",  earColor:"#8f603a", tail:"none", nose:"#3a2a2a"},
  chick:  {emoji:"🐥", body:"#ffd23f", belly:"#ffe58a", ear:"none",   tail:"none",  extra:"chick", nose:null, foot:"#ff9f1a"},
  dragon: {emoji:"🐲", body:"#6bbf59", belly:"#d6f0c8", ear:"none",   tail:"spade", extra:"dragon", nose:"#3a2a2a"},
  unicorn:{emoji:"🦄", body:"#ffffff", belly:"#ffffff", ear:"pointy", earColor:"#f4d9ff", tail:"puff", extra:"unicorn", nose:"#ff9bb3"},
  penguin:{emoji:"🐧", body:"#3a3f52", belly:"#ffffff", ear:"none",   tail:"none",  extra:"penguin", nose:null, foot:"#ff9f1a", arm:"#2c3040", bellyR:34},
  panda:  {emoji:"🐼", body:"#ffffff", belly:"#ffffff", ear:"round",  earColor:"#2b2b2b", tail:"none", extra:"panda", nose:"#2b2b2b", arm:"#2b2b2b", foot:"#2b2b2b"},
};
const CREATURE_KEYS = ["cat","dog","rabbit","fox","bear","chick","dragon","unicorn","penguin","panda"];
const EMOJI_TO_KEY = Object.fromEntries(CREATURE_KEYS.map(k=>[CREATURES[k].emoji,k]));

function makeCreature(type, size){
  size = size || 160;
  const a = CREATURES[type] || (EMOJI_TO_KEY[type] && CREATURES[EMOJI_TO_KEY[type]]) || CREATURES.cat;
  return `<svg class="creature" viewBox="-12 -22 144 168" width="${size}" style="height:auto;overflow:visible">
    <ellipse cx="60" cy="128" rx="40" ry="7" fill="rgba(90,60,140,.14)"/>
    <g class="pa-all">
      ${tailSVG(a)}
      ${feetSVG(a)}
      <ellipse class="pa-body" cx="60" cy="72" rx="46" ry="46" fill="${a.body}"/>
      <ellipse cx="60" cy="86" rx="${a.bellyR||30}" ry="27" fill="${a.belly}"/>
      ${armsSVG(a)}
      ${earsSVG(a)}
      ${extrasSVG(a)}
      ${faceSVG(a)}
    </g>
  </svg>`;
}

function earsSVG(a){
  const c=a.earColor||a.body;
  switch(a.ear){
    case "pointy":
      return `<path class="pa-ear-l" d="M32,34 L22,2 L54,24 Z" fill="${c}"/>
              <path class="pa-ear-r" d="M88,34 L98,2 L66,24 Z" fill="${c}"/>`+
             (a.earTip?`<path d="M27,14 L22,2 L35,11 Z" fill="${a.earTip}"/><path d="M93,14 L98,2 L85,11 Z" fill="${a.earTip}"/>`:
              `<path d="M34,30 L28,12 L48,24 Z" fill="${a.earInner||'#ff9bb3'}" opacity=".5"/><path d="M86,30 L92,12 L72,24 Z" fill="${a.earInner||'#ff9bb3'}" opacity=".5"/>`);
    case "floppy":
      return `<ellipse class="pa-ear-l" cx="24" cy="50" rx="13" ry="24" fill="${c}"/>
              <ellipse class="pa-ear-r" cx="96" cy="50" rx="13" ry="24" fill="${c}"/>`;
    case "long":
      return `<g class="pa-ear-l"><rect x="32" y="-14" width="16" height="50" rx="8" fill="${a.body}"/><rect x="36" y="-8" width="8" height="38" rx="4" fill="${a.earInner||'#ffc2d6'}"/></g>
              <g class="pa-ear-r"><rect x="72" y="-14" width="16" height="50" rx="8" fill="${a.body}"/><rect x="76" y="-8" width="8" height="38" rx="4" fill="${a.earInner||'#ffc2d6'}"/></g>`;
    case "round":
      return `<circle class="pa-ear-l" cx="28" cy="28" r="15" fill="${c}"/>
              <circle class="pa-ear-r" cx="92" cy="28" r="15" fill="${c}"/>`;
    default: return "";
  }
}

function tailSVG(a){
  switch(a.tail){
    case "curl":  return `<path class="pa-tail" d="M102,84 q30,-4 22,-32 q6,20 -12,26 q-6,4 -10,10 Z" fill="${a.body}"/>`;
    case "bushy": return `<path class="pa-tail" d="M96,74 q36,-2 34,40 q-16,-2 -22,-14 q-8,-14 -12,-26 Z" fill="${a.body}"/>
                          <path class="pa-tail" d="M118,104 q10,6 12,10 q-14,-2 -18,-8 Z" fill="${a.tailTip||'#fff'}"/>`;
    case "puff":  return `<circle class="pa-tail" cx="104" cy="96" r="13" fill="#ffffff"/>`;
    case "spade": return `<path class="pa-tail" d="M100,88 q28,4 34,30 l-9,-3 l3,10 l-12,-8 q-10,-16 -16,-29 Z" fill="${a.body}"/>`;
    default: return "";
  }
}

function feetSVG(a){
  const f=a.foot||a.body;
  return `<ellipse cx="44" cy="116" rx="13" ry="9" fill="${f}"/><ellipse cx="76" cy="116" rx="13" ry="9" fill="${f}"/>`;
}
function armsSVG(a){
  const c=a.arm||a.body;
  return `<ellipse cx="17" cy="80" rx="9" ry="15" fill="${c}" transform="rotate(-16 17 80)"/>
          <ellipse cx="103" cy="80" rx="9" ry="15" fill="${c}" transform="rotate(16 103 80)"/>`;
}

function faceSVG(a){
  let eyeCx=[46,74], eyeCy=64, s="";
  if(a.extra==="panda") s+=`<ellipse cx="45" cy="64" rx="11" ry="14" fill="#2b2b2b" transform="rotate(-18 45 64)"/><ellipse cx="75" cy="64" rx="11" ry="14" fill="#2b2b2b" transform="rotate(18 75 64)"/>`;
  if(a.cheeks) s+=`<ellipse cx="30" cy="70" rx="14" ry="12" fill="${a.cheeks}"/><ellipse cx="90" cy="70" rx="14" ry="12" fill="${a.cheeks}"/>`;
  // eyes (blink) + shine
  eyeCx.forEach(cx=>{ s+=`<g class="pa-eye"><ellipse cx="${cx}" cy="${eyeCy}" rx="6.5" ry="9" fill="#332a3a"/><circle cx="${cx+2}" cy="${eyeCy-3}" r="2.2" fill="#fff"/></g>`; });
  // rosy cheeks
  s+=`<circle cx="34" cy="80" r="7" fill="#ff9bb3" opacity=".55"/><circle cx="86" cy="80" r="7" fill="#ff9bb3" opacity=".55"/>`;
  // nose / muzzle
  if(a.extra==="chick"||a.extra==="penguin"){ s+=`<path d="M53,72 L60,84 L67,72 Z" fill="#ff9f1a"/>`; }
  else if(a.nose){ s+=`<ellipse cx="60" cy="74" rx="5" ry="3.5" fill="${a.nose}"/><path d="M55,80 q5,5 10,0" stroke="#5a4a55" stroke-width="2.2" fill="none" stroke-linecap="round"/>`; }
  if(a.whiskers) s+=`<g stroke="#d9b48a" stroke-width="1.6" stroke-linecap="round"><line x1="20" y1="72" x2="40" y2="74"/><line x1="20" y1="80" x2="40" y2="80"/><line x1="100" y1="72" x2="80" y2="74"/><line x1="100" y1="80" x2="80" y2="80"/></g>`;
  return s;
}

function extrasSVG(a){
  switch(a.extra){
    case "unicorn":
      return `<path d="M60,-16 L52,26 L68,26 Z" fill="#ffe08a" stroke="#ffb84d" stroke-width="1.5"/>
              <path d="M56,4 L64,4 M55,12 L65,12 M54,20 L66,20" stroke="#ffb84d" stroke-width="1.5"/>
              <path d="M40,26 q-14,10 -10,28 q10,-8 14,-18 Z" fill="#ff9bd6"/>
              <path d="M46,22 q-8,12 -4,26 q8,-10 10,-20 Z" fill="#9bd0ff"/>`;
    case "dragon":
      return `<path d="M60,26 L54,10 L60,16 L66,10 Z" fill="#4f9e42"/>
              <path d="M60,30 l-6,-12 l6,4 l6,-4 z" fill="#3f8a36" opacity="0"/>
              <g fill="#3f8a36"><path d="M60,28 l-5,-9 l5,3 l5,-3 z"/></g>
              <path d="M22,66 q-16,-2 -20,10 q14,2 20,-2 Z" class="pa-tail" fill="#8fd47f"/>
              <g fill="#f4d35e"><path d="M50,30 l4,-8 l4,8 z"/><path d="M60,28 l4,-8 l4,8 z"/></g>`;
    case "penguin":
      return `<ellipse cx="16" cy="78" rx="8" ry="18" fill="${a.body}" transform="rotate(-12 16 78)"/>
              <ellipse cx="104" cy="78" rx="8" ry="18" fill="${a.body}" transform="rotate(12 104 78)"/>`;
    case "chick":
      return `<path class="pa-ear-l" d="M14,80 q-10,-2 -12,8 q10,2 14,-2 Z" fill="${a.body}"/>
              <path class="pa-ear-r" d="M106,80 q10,-2 12,8 q-10,2 -14,-2 Z" fill="${a.body}"/>
              <path d="M56,26 q4,-8 8,0" fill="none" stroke="#f4b400" stroke-width="3" stroke-linecap="round"/>`;
    default: return "";
  }
}
