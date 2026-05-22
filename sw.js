// ══════════════════════════════════════════
// RADAR CTRL — Service Worker
// Versione cache: cambia questo numero per
// forzare un aggiornamento su tutti i device
// ══════════════════════════════════════════
const CACHE = 'radar-v1';

const FILES = [
  '/radar_control.html',
  '/bot_aria.html',
  '/game_snake.html',
  '/game_shooter.html',
  '/game_memory.html',
  '/game_tetris.html',
  '/game_pong.html',
  '/game_breakout.html',
  '/game_flappy.html',
  '/game_dino.html',
  '/game_whack.html',
  '/game_2048.html',
  '/game_balloon.html',
  '/manifest.json'
];

// ── Installazione: metti tutto in cache ──
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(FILES))
  );
  self.skipWaiting(); // attiva subito senza aspettare reload
});

// ── Attivazione: cancella vecchie cache ──
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// ── Richieste: Cache-first, poi rete ──
// → App funziona OFFLINE dopo primo caricamento
// → Quando online aggiorna la cache in background
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => {
      const net = fetch(e.request).then(res => {
        if(res && res.status === 200 && e.request.method === 'GET') {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return res;
      }).catch(() => null);
      // Serve subito dalla cache, aggiorna in background
      return cached || net;
    })
  );
});
