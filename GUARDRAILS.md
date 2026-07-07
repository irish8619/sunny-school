# Sunny School — Guardrails

Read this before every change/push. Sunny School is for **Iris** — a young, **pre-reading**, demand-avoidant child with ADHD. These rules are what make it safe and loved. Breaking one is a bug, even if the feature "works."

## The 6 rules

1. **No guilt, ever.** No resetting streaks, no "overdue" piles, no red X, no pet that starves or dies. Counters only ever grow. A gap is invisible; coming back is always a warm welcome, never a penalty.

2. **She chooses — nothing is a demand.** She picks what to do. There are **no wrong answers**: a wrong tap gets a gentle sound + wiggle and a spoken "good try," never a scold. She can stop anytime and one tiny thing still counts as a full day.

3. **Pre-reader first.** She can't read the screen. Every **child-facing** thing must reach her through **audio + icon + colour** — never text alone. (Parent-facing screens — the standards meter, this parent panel — may use text.) Before adding any child-facing string, ask: "how does she get this without reading?"

4. **Fully offline.** Everything ships as inline CSS/JS/SVG or a base64 asset committed to the repo. **No runtime network** — no CDNs, web fonts, remote images, or cloud voices. Voice = on-device SpeechSynthesis only. (The console self-check in `checks.js` warns if something goes off-origin.)

5. **Calm + fast on a cheap tablet.** One thing moves at a time during a task (the background pauses). Honour `prefers-reduced-motion`. Keep rewards short and punctual — no audio spam, no animation pile-ups, no jank.

6. **Low friction for Dad too.** Default-on, zero setup, one tap to start, forgiving by default, and it degrades gracefully if a device lacks a feature.

## Shipping
Static site on GitHub Pages. To ship: `git commit` + `git push` to `master`, then **bump `CACHE` in `sw.js`** (e.g. `sunny-v13` → `sunny-v14`) so devices fetch the update. The service worker is network-first, so an online device gets the new version on next load.
