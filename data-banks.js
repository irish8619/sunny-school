/* ============================================================
   Sunny School — WORD & PROBLEM BANKS (offline, on-device)
   All decodable content is grouped by phonics stage so the
   reading generators can pull big, non-repeating sets.
   ============================================================ */

/* CVC words that have a clean emoji — used for "match the picture" */
const CVC_PIC = [
  {w:"cat",pic:"🐱",others:["🐶","🐟"]}, {w:"dog",pic:"🐶",others:["🐷","🐝"]},
  {w:"pig",pic:"🐷",others:["🐄","🐸"]}, {w:"sun",pic:"☀️",others:["🌙","⭐"]},
  {w:"bug",pic:"🐛",others:["🐝","🦋"]}, {w:"hat",pic:"🎩",others:["👟","🧦"]},
  {w:"cup",pic:"🥤",others:["🍎","🥕"]}, {w:"bus",pic:"🚌",others:["🚗","🚲"]},
  {w:"fox",pic:"🦊",others:["🐰","🐭"]}, {w:"bed",pic:"🛏️",others:["🚪","🪑"]},
  {w:"pot",pic:"🍲",others:["🍳","🥣"]}, {w:"van",pic:"🚐",others:["🚕","🚚"]},
  {w:"fan",pic:"🪭",others:["💡","🔑"]}, {w:"box",pic:"📦",others:["🎁","👜"]},
  {w:"hen",pic:"🐔",others:["🦆","🦉"]}, {w:"log",pic:"🪵",others:["🌳","🍂"]},
  {w:"web",pic:"🕸️",others:["🕷️","🐛"]}, {w:"key",pic:"🔑",others:["🔒","🚪"]},
  {w:"pen",pic:"🖊️",others:["✏️","📕"]}, {w:"jam",pic:"🍓",others:["🍯","🧈"]},
];

/* Big decodable word lists by phonics stage (no picture needed) */
const CVC = ("cat hat bat mat sat rat cap map tap nap lap gap pig wig dig fig big rig "+
  "pin win bin fin sit hit fit bit lit kit dog log fog jog cog hot pot dot got not cot "+
  "sun run fun bun gun nut cut hut but bug rug mug hug tug jug cup pup cop mop top hop "+
  "red bed led fed wed hen pen ten men den net jet wet vet get pet let bag tag wag rag "+
  "ham jam ram yam bad sad mad had lad dad pan man ran can fan tan").split(" ");

const DIGRAPHS = ("ship shop shed shell fish dish wish cash rash chat chin chip chop chest rich "+
  "much such this that then them with bath path math moth thin whip when").split(" ");
const BLENDS = ("stop step spin spot slip slid slam clap clip club flag flat flap plan plus "+
  "frog from grab grin drum drop crab crib trap trip twin swim snap stem sled").split(" ");
const SILENTE = ("cake lake make bake take name game gate late gave cave wave "+
  "bike like time nine kite ride hide bite five dive bone home nose rope note "+
  "cute tube mule cube").split(" ");
const VOWELTEAM = ("rain wait pain tail sail nail seed feet meet keep deep tree green "+
  "bean read team beach boat coat road soap goat play day way say may hay").split(" ");
const ENDINGS = ("jumps jumped jumping plays played playing helps helped helping "+
  "walks walked walking rests rested resting looks looked looking").split(" ");

/* High-frequency "sight" words (Dolch pre-primer / primer) */
const SIGHT = ("the a I to and you it is in was said for he she we me be my they "+
  "of have are with all look see go come here like little do does what where "+
  "who this that his her").split(" ");

/* Rhyme families: [base, rhyme, rhyme, non-rhyme] */
const RHYMES = [
  ["cat","hat","bat","dog"], ["pig","wig","dig","sun"], ["bug","rug","hug","cup"],
  ["top","hop","mop","fan"], ["red","bed","fed","car"], ["sun","run","bun","hat"],
  ["cake","lake","rake","fish"], ["bee","tree","see","dog"], ["star","car","far","pig"],
  ["night","light","bright","cup"], ["ball","tall","fall","bug"], ["snow","glow","grow","cat"],
];

/* Decodable sentences for fluency practice (read together) */
const SENTENCES = [
  "The cat sat on a mat.", "A big dog can run.", "I see a red hen.",
  "The sun is hot.", "Sam has a pet fox.", "We can go up the hill.",
  "The pig is in the mud.", "A bug is on the rug.", "Dad has a big van.",
  "The fish is in the net.", "Can you hop to me?", "Mom and I bake a cake.",
  "The frog is on a log.", "It is fun to play.", "The ship is on the sea.",
];

/* Story prompts for comprehension (told/read aloud, then chat) */
const STORIES = [
  {t:"🐢🐰 The Tortoise & the Hare", q:"Who won the race? Why did the slow tortoise win?"},
  {t:"🐷🐺 The Three Little Pigs", q:"Which house was the strongest? What was it made of?"},
  {t:"🐻 Goldilocks & the Three Bears", q:"Whose porridge did she like? Who came home at the end?"},
  {t:"🐜🦗 The Ant & the Grasshopper", q:"Who worked hard all summer? What happened in winter?"},
];

/* Math word-problem templates ({a},{b} filled with random numbers) */
const WORDPROBS = [
  {s:"You have {a} 🍎 and get {b} more. How many now?", op:"+"},
  {s:"There are {a} 🐦 birds. {b} fly away. How many are left?", op:"-"},
  {s:"{a} 🚗 cars are parked. {b} more drive up. How many now?", op:"+"},
  {s:"You had {a} 🍪 cookies and ate {b}. How many are left?", op:"-"},
  {s:"{a} 🐟 fish swim by, then {b} more come. How many fish?", op:"+"},
  {s:"There are {a} 🎈 balloons. {b} pop! How many are left?", op:"-"},
  {s:"You pick {a} 🌸 flowers, then {b} more. How many flowers?", op:"+"},
  {s:"{a} 🐸 frogs sit on a log. {b} hop away. How many stay?", op:"-"},
];
