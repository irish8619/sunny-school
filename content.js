/* ============================================================
   Sunny School — CONTENT (tracks + Florida standards map)
   Depends on data-banks.js. Engine + generators in app.js.
   Low-demand: most taps have NO wrong answer; wrong answers
   on quiz-style tiles are gentle (never block, never punish).
   ============================================================ */

/* ---- The Florida "minimum map" we track (verified vs CPALMS) ---- */
const STANDARDS = {
  Math: {
    "Number Sense": {
      "MA.1.NSO.1.1":"Count forward & backward to 120; skip-count by 2s, 5s, 10s",
      "MA.1.NSO.1.2":"Read & write numbers 10–100",
      "MA.1.NSO.1.3":"Break two-digit numbers into tens and ones",
      "MA.1.NSO.1.4":"Order and compare numbers to 100",
      "MA.1.NSO.2.1":"Instantly recall addition facts to 10 (and subtractions)",
      "MA.1.NSO.2.2":"Add & subtract within 20",
      "MA.1.NSO.2.3":"1 more, 1 less, 10 more, 10 less",
      "MA.1.NSO.2.4":"Add a one-digit number to a two-digit number",
      "MA.1.NSO.2.5":"Subtract a one-digit number from a two-digit number",
    },
    "Algebra": {
      "MA.1.AR.1.1":"Add three numbers by making friendly pairs (like making 10)",
      "MA.1.AR.1.2":"Solve add/subtract word problems within 20",
      "MA.1.AR.2.1":"Turn subtraction into a missing-addend problem",
      "MA.1.AR.2.2":"Decide if an equation is true or false (what = means)",
      "MA.1.AR.2.3":"Find the missing number in an equation",
    },
    "Fractions":  { "MA.1.FR.1.1":"Split shapes into halves and fourths" },
    "Measurement":{
      "MA.1.M.1.1":"Measure length to the nearest inch",
      "MA.1.M.1.2":"Compare and order lengths",
      "MA.1.M.2.1":"Tell time to the hour and half-hour",
      "MA.1.M.2.2":"Know pennies, nickels, dimes, quarters & their value",
      "MA.1.M.2.3":"Find the total value of coins",
    },
    "Geometry":{
      "MA.1.GR.1.1":"Sort 2-D & 3-D shapes by their attributes",
      "MA.1.GR.1.2":"Draw a shape from its attributes",
      "MA.1.GR.1.3":"Combine shapes to make new shapes",
      "MA.1.GR.1.4":"Spot shapes in real-world objects",
    },
    "Data":{
      "MA.1.DP.1.1":"Collect data with tally marks or a pictograph",
      "MA.1.DP.1.2":"Read data and compare the totals",
    },
  },
  Reading: {
    "Getting Ready (K on-ramp)":{
      "ELA.K.F.1.1":"How books & print work; name all the letters",
      "ELA.K.F.1.2":"Hear sounds: rhyme, syllables, blend & segment (ears only)",
      "ELA.K.F.1.3":"Letter sounds; read & spell simple CVC words (cat, dog)",
      "ELA.K.F.1.4":"Read common sight words automatically",
    },
    "Grade-1 Reading":{
      "ELA.1.F.1.2":"Blend & segment longer words, blends & digraphs",
      "ELA.1.F.1.3":"Decode digraphs, silent-e, vowel teams, r-controlled, endings",
      "ELA.1.F.1.4":"Read grade-1 text smoothly with expression",
      "ELA.1.R.1.1":"Describe the main parts of a story",
      "ELA.1.R.3.2":"Retell a story to show you understood it",
      "ELA.1.V.1.1":"Use new words when speaking",
    },
  },
  Writing: {
    "Making Marks":{
      "ELA.1.C.1.1":"Print upper- & lowercase letters",
      "ELA.1.C.3.1":"Grade-1 grammar, capitals, punctuation & spelling",
    },
    "Composing (she talks, you may scribe)":{
      "ELA.1.C.1.2":"Tell/write a story with events in order",
      "ELA.1.C.1.3":"Give an opinion with a reason",
      "ELA.1.C.1.4":"Share facts about a topic",
      "ELA.1.C.2.1":"Speak in complete sentences",
    },
  },
  Science: {   /* Florida NGSSS grade-1 — verified via CPALMS */
    "Nature of Science":{
      "SC.1.N.1.1":"Ask questions & explore by trying things out",
      "SC.1.N.1.2":"Use the five senses to look closely & describe",
      "SC.1.N.1.3":"Keep a record of a discovery with pictures/marks",
      "SC.1.N.1.4":"Find things out by testing, not just guessing",
    },
    "Life Science":{
      "SC.1.L.14.1":"Observe living things with your senses",
      "SC.1.L.14.2":"Name plant parts: roots, stem, leaves, flowers",
      "SC.1.L.14.3":"Tell living from nonliving things",
      "SC.1.L.16.1":"Babies look like their parents (but a little different)",
      "SC.1.L.17.1":"Living things need air, water, food & space",
    },
    "Physical Science":{
      "SC.1.P.8.1":"Sort things by what you observe (size, color, sink/float)",
      "SC.1.P.12.1":"Things move in different ways (straight, zigzag, spin)",
      "SC.1.P.13.1":"A push or a pull changes how something moves",
    },
    "Earth & Space":{
      "SC.1.E.5.1":"So many stars — too many to count",
      "SC.1.E.5.2":"Gravity: Earth pulls things down",
      "SC.1.E.5.3":"Magnifiers make tiny things look bigger",
      "SC.1.E.5.4":"The Sun helps us — and we stay safe from it",
      "SC.1.E.6.1":"Earth has water, rocks, soil & living things",
      "SC.1.E.6.2":"We need water & stay safe around it",
      "SC.1.E.6.3":"Some things happen fast, some slow",
    },
  },
  "Social Studies": {   /* Florida NGSSS grade-1 (course 5021030) — verified via CPALMS */
    "American History":{
      "SS.1.A.1.1":"A primary source is a real thing from the past",
      "SS.1.A.1.2":"We can look things up to learn about the past",
      "SS.1.A.2.1":"History is the story of people long ago",
      "SS.1.A.2.2":"Compare life now with life in the past",
      "SS.1.A.2.3":"Holidays help us remember important people & events",
      "SS.1.A.2.4":"People from the past who were brave & honest",
      "SS.1.A.2.5":"Tell a true fact from a made-up story",
      "SS.1.A.3.1":"Put events in order (day, week, month, year)",
      "SS.1.A.3.2":"Make a simple timeline",
    },
    "Geography":{
      "SS.1.G.1.1":"Use maps to find places in Florida",
      "SS.1.G.1.2":"Spot map parts (compass, title, key)",
      "SS.1.G.1.3":"Build a simple map with symbols",
      "SS.1.G.1.4":"Find water & land on a map (oceans, lakes, rivers)",
      "SS.1.G.1.5":"Locate my community, Florida & the oceans",
      "SS.1.G.1.6":"How place & weather shape how people live",
    },
    "Economics":{
      "SS.1.E.1.1":"Money trades for goods & services",
      "SS.1.E.1.2":"Choosing one thing means giving up another",
      "SS.1.E.1.3":"Tell goods (things) from services (helpful actions)",
      "SS.1.E.1.4":"People as buyers, sellers & makers",
      "SS.1.E.1.5":"Saving money to buy something later",
      "SS.1.E.1.6":"We make choices because things are scarce",
    },
    "Civics & Government":{
      "SS.1.C.1.1":"Rules & laws keep us safe",
      "SS.1.C.1.2":"Who makes & keeps the rules",
      "SS.1.C.1.3":"Unkind power (bullying, grabbing) is not okay",
      "SS.1.C.2.1":"Kids have rights & responsibilities",
      "SS.1.C.2.2":"What a responsible citizen does",
      "SS.1.C.2.3":"Ways to make school/community better",
      "SS.1.C.2.4":"Show kindness to people & animals",
      "SS.1.C.3.1":"Solve problems in fair ways",
      "SS.1.C.3.2":"American symbols & leaders (flag, eagle, presidents)",
    },
  },
};

/* ============================================================
   TRACKS.  act: say | tap | tapcount | count | choose | gen | trace
   gen types resolved in app.js.  bench: benchmark codes practiced.
   ============================================================ */
const TRACKS = {
  reading: { name:"Silly Sounds", color:"#ff5c8a", items:[
    {e:"🔡",t:"Sound it out",   g:"Show the word. Say each sound slow — <b>c…a…t</b> — then fast: <b>cat!</b> Tap letters as you go. Pure sound-play.", act:"gen",gen:"blend",  bench:["ELA.K.F.1.2","ELA.K.F.1.3"]},
    {e:"🖼️",t:"Which picture?", g:"Read the word together, sounding it out. She taps the picture it matches!", act:"gen",gen:"cvcmatch", bench:["ELA.K.F.1.3"]},
    {e:"🧱",t:"Build a word",    g:"Say a sound, she finds the letter. Build the little word block by block.", act:"gen",gen:"buildword", bench:["ELA.K.F.1.3"]},
    {e:"⚡",t:"Zap a sight word", g:"These words we just KNOW — no sounding out. Say it silly and tap it fast!", act:"gen",gen:"sight", bench:["ELA.K.F.1.4"]},
    {e:"🎵",t:"Rhyme family",    g:"Say them out loud — which one rhymes? Add your own silly rhyme too (splat! zat!).", act:"gen",gen:"rhyme", bench:["ELA.K.F.1.2"]},
    {e:"🐍",t:"First & last sound",g:"Robot-talk a word slow. What sound is at the START? the END? Tap it.", act:"gen",gen:"firstlast", bench:["ELA.K.F.1.2"]},
    {e:"🤫",t:"Two-letter teams", g:"Letters team up: <b>sh</b>='shhh', <b>ch</b>='ch', <b>th</b>='th'. Sound out the word together!", act:"gen",gen:"readword",bank:"DIGRAPHS", bench:["ELA.1.F.1.3","ELA.1.F.1.2"]},
    {e:"💥",t:"Blend it fast",    g:"Two sounds squished together: <b>st</b>, <b>fl</b>, <b>dr</b>. Sound out the word, then blend!", act:"gen",gen:"readword",bank:"BLENDS", bench:["ELA.1.F.1.2","ELA.1.F.1.3"]},
    {e:"🪄",t:"Magic e",          g:"The silent <b>e</b> makes the vowel say its NAME: <b>cap→cape</b>. Read the magic-e word!", act:"gen",gen:"readword",bank:"SILENTE", bench:["ELA.1.F.1.3"]},
    {e:"🤝",t:"Vowel teams",      g:"Two vowels, one sound: <b>ai</b>='ay', <b>ee</b>='ee', <b>oa</b>='oh'. Read it together!", act:"gen",gen:"readword",bank:"VOWELTEAM", bench:["ELA.1.F.1.3"]},
    {e:"🏁",t:"Word endings",     g:"Endings change words: <b>-s, -ed, -ing</b>. Read the whole word — find the ending!", act:"gen",gen:"readword",bank:"ENDINGS", bench:["ELA.1.F.1.3"]},
    {e:"📜",t:"Read a sentence",  g:"Read this little sentence together, pointing at each word. Smooth and proud!", act:"gen",gen:"sentence", bench:["ELA.1.F.1.4"]},
    {e:"📖",t:"Story chat",       g:"Tell or read this story, then chat about it. No pressure — just talk.", act:"gen",gen:"story", bench:["ELA.1.R.1.1","ELA.1.R.3.2","ELA.1.V.1.1"]},
    {e:"✍️",t:"Name in the sky",  g:"Write the first letter of her name HUGE in the air, then tiny, then wobbly. Bodies help letters stick.", act:"say", bench:["ELA.K.F.1.1"]},
  ]},

  math: { name:"Number Fun", color:"#3aa0ff", items:[
    {e:"🚀",t:"Count to 120",   g:"Pick a number and count UP past 100 toward 120! Tap along.", act:"gen",gen:"count120", bench:["MA.1.NSO.1.1"]},
    {e:"🔻",t:"Blast-off countdown",g:"Count BACKWARD… 3-2-1 BLAST OFF! 🚀 Then try a bigger start.", act:"gen",gen:"countback", bench:["MA.1.NSO.1.1"]},
    {e:"👣",t:"Skip counting",  g:"Count by 10s, 5s, or 2s like giant steps. Stomp each one!", act:"gen",gen:"skip", bench:["MA.1.NSO.1.1"]},
    {e:"⚡",t:"Fast facts",     g:"Quick math! Tap the answer. Tricky? Count on fingers — no rush, no wrong feeling.", act:"gen",gen:"add10", bench:["MA.1.NSO.2.1"]},
    {e:"➕",t:"Add to 20",      g:"Bigger sums! Fingers, blocks, or count on. Tap when you find it.", act:"gen",gen:"add20", bench:["MA.1.NSO.2.2"]},
    {e:"➖",t:"Take away",      g:"Subtraction! Start big and count back. Tap your answer.", act:"gen",gen:"sub", bench:["MA.1.NSO.2.2","MA.1.NSO.2.5"]},
    {e:"👯",t:"Doubles",       g:"Double it! 4 and 4… Doubles are super fast to remember. Tap the total.", act:"gen",gen:"doubles", bench:["MA.1.NSO.2.2"]},
    {e:"🔟",t:"Make 10",       g:"What goes WITH this to make 10? Ten-friends! Tap the partner.", act:"gen",gen:"make10", bench:["MA.1.NSO.2.1","MA.1.AR.1.1"]},
    {e:"📖",t:"Story problem", g:"Read the story out loud together, act it out with toys, then tap the answer.", act:"gen",gen:"wordprob", bench:["MA.1.AR.1.2"]},
    {e:"1️⃣",t:"1 more, 1 less", g:"What's 1 more? 1 less? Hop up or down the number line. Tap it!", act:"gen",gen:"onemore", bench:["MA.1.NSO.2.3"]},
    {e:"🔟",t:"10 more, 10 less",g:"A whole jump of ten! Tap 10 more (or less) than the number.", act:"gen",gen:"tenmore", bench:["MA.1.NSO.2.3"]},
    {e:"🏗️",t:"Two-digit add",  g:"Add a little number to a big one. Count on from the big number! Tap it.", act:"gen",gen:"add2d1d", bench:["MA.1.NSO.2.4"]},
    {e:"❓",t:"Missing number", g:"Something's hiding! What number makes it work? Solve the mystery.", act:"gen",gen:"missing", bench:["MA.1.AR.2.3","MA.1.AR.2.1"]},
    {e:"⚖️",t:"True or false?", g:"Is this math right or silly-wrong? Tap 👍 or 👎. That's what = means.", act:"gen",gen:"truefalse", bench:["MA.1.AR.2.2"]},
    {e:"🏠",t:"Tens and ones", g:"Big numbers = tens + ones. 34 = 3 tens + 4 ones. Tap the tens count.", act:"gen",gen:"tensones", bench:["MA.1.NSO.1.3","MA.1.NSO.1.2"]},
    {e:"🐊",t:"Which is bigger?",g:"The hungry alligator eats the BIGGER number! Tap it.", act:"gen",gen:"compare", bench:["MA.1.NSO.1.4"]},
    {e:"🍕",t:"Halves & fourths",g:"Split it fair! 2 equal halves, or 4 equal fourths. Fair shares!", act:"tap",tiles:["½ halves","¼ fourths"],answer:null, bench:["MA.1.FR.1.1"]},
    {e:"🔷",t:"Shape detective", g:"Tap a shape, then hunt for it in the room — a can is a cylinder, a ball a sphere!", act:"tap",tiles:["🔵","🔺","⬜","🧊"],answer:null, bench:["MA.1.GR.1.1","MA.1.GR.1.4"]},
    {e:"🕐",t:"What time is it?", g:"The short hand points to the hour! Look at a clock. Tap the hour.", act:"gen",gen:"clock", bench:["MA.1.M.2.1"]},
    {e:"🪙",t:"Coin count",      g:"Penny=1, nickel=5, dime=10, quarter=25. Grab real coins! Tap a value.", act:"tap",tiles:["1¢","5¢","10¢","25¢"],answer:null, bench:["MA.1.M.2.2","MA.1.M.2.3"]},
    {e:"📊",t:"Count & compare", g:"Tally what you see — how many red vs blue toys? Tap to count, then compare!", act:"tapcount",emoji:"🔴",n:6, bench:["MA.1.DP.1.1","MA.1.DP.1.2"]},
  ]},

  /* WRITING — framed as doodling/tracing; pencil is optional at first.
     Finger-tracing on the tablet + dictation = writing minus the battle. */
  writing: { name:"Doodle Lab", color:"#a25cff", items:[
    {e:"🖍️",t:"Trace a letter",  g:"Trace the big letter with her FINGER on the screen. No pencil! Say its sound as she traces.", act:"trace",mode:"letters", bench:["ELA.1.C.1.1"]},
    {e:"✨",t:"Trace her name",   g:"Her very own name to trace with a finger. The most important word she'll learn!", act:"trace",mode:"name", bench:["ELA.1.C.1.1"]},
    {e:"🔢",t:"Trace a number",   g:"Trace the number with a finger. Say it out loud as you go.", act:"trace",mode:"numbers", bench:["ELA.1.C.1.1"]},
    {e:"〰️",t:"Squiggle warm-ups",g:"Trace the wiggly lines and loops — this builds the hand muscles for writing, disguised as doodling.", act:"trace",mode:"lines", bench:["ELA.1.C.1.1"]},
    {e:"🌈",t:"Rainbow air-write",g:"Draw a letter BIG in the air with a whole arm, in 3 rainbow colors. Zero pressure, all wiggle.", act:"say", bench:["ELA.1.C.1.1"]},
    {e:"🗣️",t:"You tell, I write", g:"She tells you a story or fact — YOU write it down while she watches. She's composing without holding a pencil! Read it back proudly.", act:"say", bench:["ELA.1.C.1.2","ELA.1.C.2.1","ELA.1.C.1.4"]},
    {e:"🎨",t:"Draw & label",     g:"She draws anything. Then help her add ONE letter or word label. Drawing is pre-writing.", act:"say", bench:["ELA.1.C.1.2","ELA.1.C.1.1"]},
    {e:"🧵",t:"Build a letter",   g:"Make a letter out of playdough, sticks, or string — no writing tool at all. Squishy letters count!", act:"say", bench:["ELA.1.C.1.1"]},
    {e:"⭐",t:"Which is best?",    g:"Ask: would you rather a beach day or a snow day? She picks and says ONE reason why. That's an opinion — real writing, spoken first.", act:"say", bench:["ELA.1.C.1.3","ELA.1.C.2.1"]},
  ]},

  move: { name:"Wiggle Time", color:"#ffc233", items:[
    {e:"🤸",t:"Jumping jacks", g:"Tap to count 5 jumping jacks! Get the wiggles OUT.", act:"count",n:5, bench:[]},
    {e:"🕺",t:"Freeze dance",  g:"Play a song, dance wild — pause — <b>FREEZE!</b> Great for wiggly bodies.", act:"say", bench:[]},
    {e:"🐸",t:"Animal walks",  g:"Hop like a frog, stomp like an elephant, slither like a snake!", act:"say", bench:[]},
    {e:"🧘",t:"Balloon breaths",g:"Breathe in big, blow out slow. Tap to count 3 calm breaths.", act:"count",n:3, bench:[]},
    {e:"🥁",t:"Pot drums",     g:"Pot + spoon. Slow beat, then fast! She copies, then leads.", act:"say", bench:[]},
    {e:"🧩",t:"Tower crash",   g:"Build the tallest tower… then knock it down! Repeat forever.", act:"say", bench:[]},
  ]},

  /* SCIENCE — Florida NGSSS grade-1. All voiced, all no-wrong-answer (tap=explore, every tap teaches). */
  science: { name:"Science", color:"#2fbf71", items:[
    {e:"🔎",t:"Wonder buttons", g:"Tap anything you're curious about! I'll wonder with you — then go try it for real and see what happens!", act:"tap",tiles:["🪨","🍃","🫧","🌑"],answer:null, bench:["SC.1.N.1.1"]},
    {e:"👀",t:"Look closely",   g:"Tap a thing! Now tell me — what color is it? Big or little? Soft or hard? Looking closely is what scientists do!", act:"tap",tiles:["🍎","⚽","🪶"],answer:null, bench:["SC.1.N.1.2"]},
    {e:"🧪",t:"How do you know?",g:"Do we just GUESS, or do we TRY it? Tap the science tools — that's how we really find out!", act:"tap",tiles:["🤔","🔬","🔭"],answer:null, bench:["SC.1.N.1.4"]},
    {e:"🌱",t:"Living or not?",  g:"Tap the LIVING things! Living things grow and eat and drink water. Which ones are alive?", act:"tap",tiles:["🐶","🪨","🌻","🥄"],answer:null, bench:["SC.1.L.14.3"]},
    {e:"🌻",t:"Plant parts",     g:"Tap a plant part! Flower, leaves, stem, and roots — tap each one and I'll name it for you!", act:"tap",tiles:["🌸","🍃","🌱","🫚"],answer:null, bench:["SC.1.L.14.2"]},
    {e:"🐣",t:"Baby & grown-up", g:"Tap a baby animal! Babies look a LOT like their mamas — but each one is special and a little different!", act:"tap",tiles:["🐱","🐈","🐤","🐓"],answer:null, bench:["SC.1.L.16.1"]},
    {e:"💧",t:"What we need",     g:"Tap what every living thing needs! Air, water, food, and space — plants, animals, and YOU need all four!", act:"tap",tiles:["💨","💧","🍎","🏠"],answer:null, bench:["SC.1.L.17.1"]},
    {e:"🖐️",t:"Five-senses walk",g:"Find a plant, a pet, or a bug! Look at it, gently touch it, listen. What do your senses notice? Tell me all about it!", act:"say", bench:["SC.1.L.14.1"]},
    {e:"🧺",t:"Sort it",         g:"Tap to sort! Which ones are BIG? Which are little? Which would sink or float? Let's notice how they're different!", act:"tap",tiles:["🐘","🐭","🎈","🪨"],answer:null, bench:["SC.1.P.8.1"]},
    {e:"🔄",t:"Ways to move",    g:"Tap a way to move! Straight, zigzag, round-and-round, or back-and-forth — you pick, and I'll name it!", act:"tap",tiles:["➡️","〰️","🔄","↔️"],answer:null, bench:["SC.1.P.12.1"]},
    {e:"🤲",t:"Push or pull",    g:"Tap push or pull! A push sends things away, a pull brings them close. That's how we make things move!", act:"tap",tiles:["👉","🤲"],answer:null, bench:["SC.1.P.13.1"]},
    {e:"🍏",t:"Drop it!",        g:"Tap something and drop it! Watch — it falls DOWN. Earth pulls everything down. That's called gravity!", act:"tap",tiles:["🪶","🍎","👟"],answer:null, bench:["SC.1.E.5.2"]},
    {e:"⭐",t:"Count the stars", g:"Tap the stars to light them up! There are SO many stars — too many to count. The whole sky is full of them!", act:"tapcount",emoji:"⭐",n:10, bench:["SC.1.E.5.1"]},
    {e:"🌍",t:"What's on Earth", g:"Tap our Earth! Water, rocks, soil, and living things — tap each one and I'll tell you what it is!", act:"tap",tiles:["💧","🪨","🌱","🌳"],answer:null, bench:["SC.1.E.6.1"]},
    {e:"☀️",t:"Sunny & safe",    g:"Tap the sunny pictures! The sun helps things grow and warms us — AND we stay safe with a hat and sunscreen!", act:"tap",tiles:["🌻","🧢","🧴","😎"],answer:null, bench:["SC.1.E.5.4"]},
  ]},

  /* SOCIAL STUDIES — Florida NGSSS grade-1. All voiced, no-wrong-answer, holiday-friendly. */
  social: { name:"My World", color:"#ff8c42", items:[
    {e:"🛑",t:"Rules keep us safe",g:"Tap a rule! A stop sign, raising your hand, a crosswalk — tap each one and I'll tell you how it keeps us safe!", act:"tap",tiles:["🛑","✋","🚸"],answer:null, bench:["SS.1.C.1.1"]},
    {e:"🤝",t:"Kind or not-kind", g:"Tap the kind things! Sharing and hugging are kind. Let's always choose kindness — it feels good!", act:"tap",tiles:["🤝","🫂","😢"],answer:null, bench:["SS.1.C.1.3"]},
    {e:"🐶",t:"Be gentle & kind", g:"Tap to be gentle! Soft hands with animals and friends. Kindness makes everyone feel safe and happy!", act:"tap",tiles:["🐶","🐱","🌷"],answer:null, bench:["SS.1.C.2.4"]},
    {e:"♻️",t:"Good-citizen garden",g:"Tap a kind act to grow something! Recycle, help a friend, follow a rule — every good thing you do grows your world!", act:"tap",tiles:["♻️","🤗","✅","🧹"],answer:null, bench:["SS.1.C.2.2"]},
    {e:"🧑‍🏫",t:"Who's in charge",  g:"Tap who helps make the rules! Teachers, parents, and police — tap each one and I'll tell you what they do!", act:"tap",tiles:["🧑‍🏫","👪","👮"],answer:null, bench:["SS.1.C.1.2"]},
    {e:"⚖️",t:"Solve it fairly",   g:"Two friends want the same swing! We can talk, take turns, or share. What's a fair way to fix it? Any kind idea is great!", act:"say", bench:["SS.1.C.3.1"]},
    {e:"🇺🇸",t:"Our country's symbols",g:"Tap our country's symbols! The flag, the bald eagle, the Statue of Liberty — tap each one and hear its story!", act:"tap",tiles:["🇺🇸","🦅","🗽"],answer:null, bench:["SS.1.C.3.2"]},
    {e:"🕯️",t:"Now or long ago",   g:"Tap the pictures! Some things are from NOW, some from LONG AGO. Candles or lamps? Horses or cars? I'll tell you which!", act:"tap",tiles:["🕯️","💡","🐎","🚗"],answer:null, bench:["SS.1.A.2.2"]},
    {e:"📜",t:"A story from long ago",g:"Long ago, kids carried water in buckets — there were no faucets! Listen to a little story from the past.", act:"say", bench:["SS.1.A.2.1"]},
    {e:"🎆",t:"Holidays we remember",g:"Tap a holiday! We celebrate to remember special people and days. Tap each one and I'll tell you all about it!", act:"tap",tiles:["🎆","🦃","🎂","🎇"],answer:null, bench:["SS.1.A.2.3"]},
    {e:"🎖️",t:"Meet a hero",       g:"Tap a hero! Brave and kind people who helped others. Tap each one and hear their story!", act:"tap",tiles:["👮","🚒","🎖️"],answer:null, bench:["SS.1.A.2.4"]},
    {e:"🌅",t:"My day in order",    g:"Tap your day in order! First we wake up, then lunch, then bedtime. What comes first? What comes last?", act:"tap",tiles:["🌅","🍽️","🌙"],answer:null, bench:["SS.1.A.3.1"]},
    {e:"🌎",t:"Maps & my place",    g:"Tap from your house, to your town, to the whole big world! See how it gets bigger and bigger and bigger?", act:"tap",tiles:["🏠","🗺️","🌎"],answer:null, bench:["SS.1.G.1.5"]},
    {e:"🌊",t:"Water & land",       g:"Tap the water and the land! Oceans, lakes, rivers, and mountains — tap each one and I'll name it!", act:"tap",tiles:["🌊","🏞️","🏜️","⛰️"],answer:null, bench:["SS.1.G.1.4"]},
    {e:"🪙",t:"Money buys things",  g:"Tap a coin, then something to buy! Money lets us trade for things we want. What will you get?", act:"tap",tiles:["🪙","🍎","🍞","🧸"],answer:null, bench:["SS.1.E.1.1"]},
    {e:"🐷",t:"Fill the piggy bank",g:"Tap coins into your piggy bank! The more you save, the sooner you can buy something special. Saving grows and grows!", act:"tapcount",emoji:"🪙",n:6, bench:["SS.1.E.1.5"]},
    {e:"🍎",t:"Need it or want it", g:"Tap the things we really NEED to live! Food, water, a home. Toys and candy are fun WANTS. Which do we need?", act:"tap",tiles:["🍎","🧸","💧","🍬"],answer:null, bench:["SS.1.E.1.2"]},
    {e:"🍔",t:"A thing or a help",  g:"Tap a THING or a HELP! A hamburger is a thing you can hold. Sweeping and helping sick people are HELPS people do!", act:"tap",tiles:["🍔","🧹","👩‍⚕️","🚗"],answer:null, bench:["SS.1.E.1.3"]},
  ]},
};

/* Tracks on the choose-board: the 3 R's + the two new subjects + a movement brain-break */
const ORDER = ["reading","math","writing","science","social","move"];
const BANKS = { DIGRAPHS, BLENDS, SILENTE, VOWELTEAM, ENDINGS };  // for readword gen
