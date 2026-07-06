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

  /* ---- BUILT, NOT YET ON THE BOARD (flip on later) ---- */
  science: { name:"Science", color:"#2fbf71", items:[
    {e:"🌱",t:"Living or not?",  g:"Living things grow, eat, and need water. Tap the living one — say why!", act:"tap",tiles:["🌻","🪨","🐛","🧸"],answer:null, bench:[]},
    {e:"🌦️",t:"Weather & seasons",g:"What's the weather today? What season are we in? Tap what you see.", act:"tap",tiles:["☀️","🌧️","❄️","🍂"],answer:null, bench:[]},
    {e:"🖐️",t:"Five senses",    g:"See, hear, smell, taste, touch. Pick one thing and use all 5 senses on it!", act:"say", bench:[]},
    {e:"🌻",t:"What plants need",g:"Plants need sun, water, and air to grow. Tap what a plant drinks!", act:"tap",tiles:["💧","🍭","🎈"],answer:null, bench:[]},
    {e:"🔨",t:"Push or pull",    g:"A push moves it away, a pull brings it close. Push a toy, then pull it!", act:"say", bench:[]},
    {e:"🌙",t:"Day & night sky", g:"Sun in the day, moon & stars at night. Tap what's out at bedtime.", act:"tap",tiles:["☀️","🌙"],answer:null, bench:[]},
  ]},
  social: { name:"My World", color:"#ff8c42", items:[
    {e:"📅",t:"Days & calendar", g:"What day is it today? What did we do yesterday? What's tomorrow? Point at a calendar.", act:"say", bench:[]},
    {e:"👩‍🚒",t:"Community helpers",g:"Who helps us? Tap a helper and say how they help!", act:"tap",tiles:["👮","🚒","👩‍⚕️","🧑‍🏫"],answer:null, bench:[]},
    {e:"✋",t:"Needs vs wants",  g:"We NEED food, water, a home. We WANT toys and candy. Tap a real need!", act:"tap",tiles:["🍎","🧸","💧","🍬"],answer:null, bench:[]},
    {e:"🗺️",t:"Maps & where I live",g:"A map shows where things are. Draw a map of her room together!", act:"say", bench:[]},
    {e:"🤝",t:"Rules keep us safe",g:"Why do we have rules? Name one rule at home and why it helps.", act:"say", bench:[]},
  ]},
};

/* Tracks currently on the choose-board (start focused on the 3 R's + regulation) */
const ORDER = ["reading","math","writing","move"];
const BANKS = { DIGRAPHS, BLENDS, SILENTE, VOWELTEAM, ENDINGS };  // for readword gen
