/* ==========================================================================
   InovaMove — Service Worker
   Guarda em cache os arquivos do próprio site (HTML, CSS, JS, imagens)
   para abrir mais rápido e funcionar mesmo sem internet nas páginas já
   visitadas. Não faz cache de dados externos (mapa, Overpass API).
   ========================================================================== */

const CACHE_NAME = 'inovamove-v2';

const ARQUIVOS_ESSENCIAIS = [
  'index.html',
  'mapa.html',
  'solicitacao.html',
  'acessibilidade.html',
  'feedback.html',
  'sobre.html',
  'manifest.json',
  'assets/css/variables.css',
  'assets/css/base.css',
  'assets/css/home.css',
  'assets/css/mapa.css',
  'assets/css/solicitacao.css',
  'assets/css/acessibilidade.css',
  'assets/css/feedback.css',
  'assets/css/sobre.css',
  'assets/js/accessibility.js',
  'assets/js/acessibilidade.js',
  'assets/js/mapa.js',
  'assets/js/feedback.js',
  'assets/js/solicitacao.js',
  'assets/img/logo.png',
  'assets/img/icon-192.png',
  'assets/img/icon-512.png'
];

// ── Instala e guarda os arquivos essenciais em cache ──
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ARQUIVOS_ESSENCIAIS))
  );
  self.skipWaiting();
});

// ── Remove caches antigos quando uma nova versão é publicada ──
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((nomes) =>
      Promise.all(nomes.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n)))
    )
  );
  self.clients.claim();
});

// ── Busca sempre na rede primeiro (garante que o app fique atualizado);
//    só usa a cópia salva em cache se estiver sem internet ──
self.addEventListener('fetch', (event) => {
  // Só intercepta pedidos do próprio site, não de APIs externas (mapa, Overpass)
  if (event.request.method !== 'GET' || !event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((resposta) => {
        const copia = resposta.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copia));
        return resposta;
      })
      .catch(() => caches.match(event.request))
  );
});
