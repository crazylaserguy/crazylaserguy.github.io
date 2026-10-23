/* Taustamusiikki: oletuksena pois, valinta muistetaan. Pelivideon toiston ajaksi musiikki vaimennetaan. */
(function(){
  var en = document.documentElement.lang === 'en';
  var KEY = 'clg-music';
  var a = new Audio('/assets/audio/syvyys.mp3');
  a.loop = true; a.volume = 0.45; a.preload = 'none';
  var btn = document.createElement('button');
  btn.className = 'music-btn'; btn.type = 'button';
  document.body.appendChild(btn);
  var on = false, pausedByClip = false;
  function get(){ try { return localStorage.getItem(KEY) === 'on'; } catch(e){ return false; } }
  function set(v){ try { localStorage.setItem(KEY, v ? 'on' : 'off'); } catch(e){} }
  function ui(){
    btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    btn.title = en ? 'Music: DeepGuy main theme' : 'Musiikki: DeepGuy-päävalikon teema';
    btn.innerHTML = '<span class="ico">' + '♪' + '</span><span class="txt">' +
      (on ? (en ? 'Music on' : 'Musiikki päällä') : (en ? 'Music off' : 'Musiikki pois')) + '</span>';
  }
  function start(){ on = true; ui(); var p = a.play(); if (p && p.catch) p.catch(function(){ on = false; ui(); }); }
  function stop(){ on = false; ui(); a.pause(); }
  btn.addEventListener('click', function(){ if (on) { stop(); set(false); } else { start(); set(true); } });
  ui();
  if (get()) {
    var p = a.play();
    if (p && p.then) p.then(function(){ on = true; ui(); }).catch(function(){
      var first = function(e){ if (e.target === btn) return; document.removeEventListener('pointerdown', first, true); if (get()) start(); };
      document.addEventListener('pointerdown', first, true);
    });
  }
  document.querySelectorAll('video').forEach(function(v){
    v.addEventListener('play', function(){ if (!v.muted && on) { pausedByClip = true; a.pause(); } });
    v.addEventListener('volumechange', function(){ if (!v.paused && !v.muted && on) { pausedByClip = true; a.pause(); } });
    function back(){ if (pausedByClip && on) { var busy = Array.prototype.some.call(document.querySelectorAll('video'), function(x){ return !x.paused && !x.muted; }); if (!busy) { pausedByClip = false; a.play().catch(function(){}); } } }
    v.addEventListener('pause', back); v.addEventListener('ended', back);
  });
})();
