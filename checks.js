/* ============================================================
   Sunny School — OFFLINE SELF-CHECK (dev safety net)
   Warns in the console if anything on the page points off-origin
   (a CDN/font/image/script that would silently break offline use).
   Console-only — never shown to the child. Runs once on load.
   ============================================================ */
(function(){
  try{
    const here = location.origin;
    const bad = [];
    document.querySelectorAll("script[src], link[href], img[src], audio[src], video[src], source[src]").forEach(function(el){
      const u = el.src || el.href; if(!u) return;
      if(/^https?:\/\//i.test(u) && u.indexOf(here) !== 0) bad.push(u);
    });
    if(bad.length) console.warn("⚠️ Sunny School OFFLINE CHECK — off-origin resource(s) would break offline use:", bad);
    else console.log("✓ Sunny School: all resources are same-origin (offline-safe).");
  }catch(e){}
})();
