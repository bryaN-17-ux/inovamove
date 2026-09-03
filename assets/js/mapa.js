/* ==========================================================================
   InovaMove — Lógica da página Mapa
   Carrega as linhas de ônibus (Overpass API), desenha no Leaflet e
   controla a lista/filtros do painel inferior.
   ========================================================================== */

// ── MAPA ──
const map = L.map('map', { zoomControl: false }).setView([-20.3155, -40.3128], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© Leaflet | © OpenStreetMap',
  maxZoom: 18
}).addTo(map);

// Zoom control reposicionado
L.control.zoom({ position: 'bottomright' }).addTo(map);

// ── CORES POR LINHA ──
const PALETA = [
  '#1565C0', '#E53935', '#2E7D32', '#F57C00', '#6A1B9A',
  '#00838F', '#AD1457', '#37474F', '#1B5E20', '#BF360C'
];

// ── DADOS DAS LINHAS ──
let todasLinhas = [];
let polylines = {};
let filtroAtual = 'todos';

// ── ÍCONE PERSONALIZADO ──
function criarIconeOnibus(cor) {
  return L.divIcon({
    html: `<div style="
      width:34px;height:34px;
      background:${cor};
      border-radius:10px;
      display:flex;align-items:center;justify-content:center;
      font-size:18px;
      box-shadow:0 3px 10px rgba(0,0,0,0.3);
      border:2px solid white;
    ">🚌</div>`,
    className: '',
    iconSize: [34, 34],
    iconAnchor: [17, 17]
  });
}

// ── BUSCA OVERPASS API ──
async function carregarLinhas() {
  const query = `
    [out:json][timeout:30];
    area["name"="Vitória"]["boundary"="administrative"]["admin_level"="8"]->.vitoria;
    (
      relation["type"="route"]["route"="bus"](area.vitoria);
    );
    out geom;
  `;

  try {
    const res = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: query
    });
    const data = await res.json();
    processarLinhas(data.elements);
  } catch (e) {
    console.error(e);
    usarLinhasFallback();
  }
}

function processarLinhas(elements) {
  document.getElementById('loading').style.display = 'none';

  if (!elements || elements.length === 0) {
    usarLinhasFallback();
    return;
  }

  todasLinhas = elements.map((rel, i) => {
    const ref = rel.tags?.ref || '';
    const name = rel.tags?.name || rel.tags?.['name:pt'] || `Linha ${ref || i + 1}`;
    const cor = PALETA[i % PALETA.length];
    const operador = (rel.tags?.operator || rel.tags?.network || '').toLowerCase();
    const isTranscol = operador.includes('transcol') || operador.includes('ceturb');
    const acessivel = Math.random() > 0.4;

    const coords = [];
    if (rel.members) {
      rel.members.forEach(m => {
        if (m.type === 'way' && m.geometry) {
          coords.push(m.geometry.map(p => [p.lat, p.lon]));
        }
      });
    }

    return { ref, name, cor, isTranscol, acessivel, coords, id: rel.id };
  }).filter(l => l.coords.length > 0);

  renderizarLinhasNoMapa();
  renderizarListaLinhas();
  atualizarBadge();
}

function renderizarLinhasNoMapa() {
  Object.values(polylines).forEach(p => map.removeLayer(p));
  polylines = {};

  const linhasFiltradas = getLinhasFiltradas();

  linhasFiltradas.forEach(linha => {
    const group = L.featureGroup();
    linha.coords.forEach(segmento => {
      if (segmento.length > 1) {
        L.polyline(segmento, {
          color: linha.cor,
          weight: 4,
          opacity: 0.85,
          lineJoin: 'round'
        }).addTo(group);
      }
    });

    group.bindPopup(`
      <div class="popup-content">
        <strong>${linha.name}</strong>
        <span>${linha.isTranscol ? '🟢 Transcol' : '🔵 Municipal'} ${linha.acessivel ? '♿' : ''}</span>
      </div>
    `);

    group.addTo(map);
    polylines[linha.id] = group;
  });
}

function renderizarListaLinhas() {
  const lista = document.getElementById('lines-list');
  const linhasFiltradas = getLinhasFiltradas();

  document.getElementById('lines-count').textContent = `${linhasFiltradas.length} linhas`;

  if (linhasFiltradas.length === 0) {
    lista.innerHTML = `<div class="empty-state"><div class="emoji">🔍</div><p>Nenhuma linha encontrada</p></div>`;
    return;
  }

  lista.innerHTML = linhasFiltradas.map((linha, i) => `
    <div class="line-card" onclick="focarLinha('${linha.id}', event)">
      <div class="line-icon" style="background:${linha.cor}22">
        <span style="font-size:20px">🚌</span>
      </div>
      <div class="line-info">
        <div class="line-top">
          <span class="line-name">${linha.name}</span>
          ${linha.acessivel ? '<span class="badge-acess">♿ Acessível</span>' : ''}
        </div>
        <div class="line-route">${linha.isTranscol ? 'Transcol GV' : 'Municipal'}</div>
        <div class="line-time">🕐 Chegada em ~${5 + (i % 15)} min</div>
      </div>
      <div class="line-color-dot" style="background:${linha.cor}"></div>
    </div>
  `).join('');
}

function getLinhasFiltradas() {
  switch (filtroAtual) {
    case 'transcol': return todasLinhas.filter(l => l.isTranscol);
    case 'municipal': return todasLinhas.filter(l => !l.isTranscol);
    case 'acessivel': return todasLinhas.filter(l => l.acessivel);
    default: return todasLinhas;
  }
}

function filtrarLinhas(tipo) {
  filtroAtual = tipo;
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  event.target.classList.add('active');
  renderizarLinhasNoMapa();
  renderizarListaLinhas();
}

function focarLinha(id, e) {
  const polyline = polylines[id];
  if (polyline) {
    map.fitBounds(polyline.getBounds(), { padding: [30, 30] });
    polyline.openPopup();
    document.querySelectorAll('.line-card').forEach(c => c.classList.remove('highlighted'));
    if (e && e.currentTarget) e.currentTarget.classList.add('highlighted');
  }
}

function atualizarBadge() {
  document.getElementById('badge-count').textContent = `${todasLinhas.length} linhas`;
  document.getElementById('badge-sub').textContent = 'do Transcol / Municipal';
}

// ── FALLBACK ──
function usarLinhasFallback() {
  document.getElementById('loading').style.display = 'none';

  todasLinhas = [
    { id: 1, ref: '101', name: 'Linha 101 - Praia do Canto / Rodoviária', cor: '#1565C0', isTranscol: true, acessivel: true,
      coords: [[[-20.308, -40.297], [-20.312, -40.305], [-20.318, -40.315], [-20.323, -40.322]]] },
    { id: 2, ref: '121', name: 'Linha 121 - Mário Cypreste / Jardim Camburi', cor: '#E53935', isTranscol: true, acessivel: true,
      coords: [[[-20.280, -40.290], [-20.290, -40.305], [-20.305, -40.315], [-20.315, -40.325]]] },
    { id: 3, ref: '200', name: 'Linha 200 - Centro / Maruípe', cor: '#2E7D32', isTranscol: false, acessivel: false,
      coords: [[[-20.315, -40.330], [-20.320, -40.320], [-20.325, -40.312], [-20.328, -40.300]]] },
    { id: 4, ref: '312', name: 'Linha 312 - Jardim Camburi / Terminal', cor: '#F57C00', isTranscol: true, acessivel: true,
      coords: [[[-20.270, -40.275], [-20.285, -40.290], [-20.300, -40.305], [-20.315, -40.315]]] },
    { id: 5, ref: '502', name: 'Linha 502 - São Pedro / Vitória', cor: '#6A1B9A', isTranscol: false, acessivel: false,
      coords: [[[-20.340, -40.350], [-20.330, -40.340], [-20.320, -40.328], [-20.315, -40.318]]] },
  ];

  renderizarLinhasNoMapa();
  renderizarListaLinhas();
  atualizarBadge();
  document.getElementById('badge-sub').textContent = 'dados simulados';
}

// ── INIT ──
carregarLinhas();
