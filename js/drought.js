// =========================================
//  DROUGHT EARLY WARNING MODULE v5
// =========================================

let droughtLmap = null;
let droughtSelectedRegion = null;
let droughtCircles = [];

// NDVI historical monthly data per region
const DROUGHT_DATA = {
  kastamonu: {
    ndvi: 0.71,
    ndviChange: -0.04,
    droughtIndex: 42,
    threshold: 0.55,
    monthlyNdvi: [0.65, 0.62, 0.66, 0.70, 0.74, 0.73, 0.69, 0.63, 0.67, 0.71, 0.70, 0.68],
    status: 'watch',
    statusLabel: 'İzleme Altında',
    waterStress: 'Orta',
    precip: '620 mm/yıl',
    soilMoisture: '58%',
  },
  antalya: {
    ndvi: 0.43,
    ndviChange: -0.14,
    droughtIndex: 71,
    threshold: 0.55,
    monthlyNdvi: [0.52, 0.50, 0.53, 0.57, 0.55, 0.47, 0.38, 0.35, 0.40, 0.45, 0.48, 0.51],
    status: 'warning',
    statusLabel: '⚠️ KURAKLIK UYARISI',
    waterStress: 'Yüksek',
    precip: '340 mm/yıl',
    soilMoisture: '28%',
  },
  mugla: {
    ndvi: 0.38,
    ndviChange: -0.17,
    droughtIndex: 76,
    threshold: 0.55,
    monthlyNdvi: [0.48, 0.46, 0.49, 0.53, 0.51, 0.43, 0.35, 0.31, 0.37, 0.42, 0.45, 0.47],
    status: 'warning',
    statusLabel: '⚠️ KRİTİK KURAKLIK',
    waterStress: 'Çok Yüksek',
    precip: '290 mm/yıl',
    soilMoisture: '18%',
  },
  bolu: {
    ndvi: 0.82,
    ndviChange: +0.02,
    droughtIndex: 22,
    threshold: 0.55,
    monthlyNdvi: [0.78, 0.75, 0.79, 0.83, 0.87, 0.86, 0.84, 0.80, 0.83, 0.84, 0.82, 0.80],
    status: 'safe',
    statusLabel: '✅ Normal',
    waterStress: 'Düşük',
    precip: '860 mm/yıl',
    soilMoisture: '72%',
  },
  canakkale: {
    ndvi: 0.56,
    ndviChange: -0.06,
    droughtIndex: 54,
    threshold: 0.55,
    monthlyNdvi: [0.60, 0.58, 0.61, 0.65, 0.67, 0.62, 0.55, 0.50, 0.54, 0.58, 0.60, 0.60],
    status: 'watch',
    statusLabel: '⚡ Eşik Sınırında',
    waterStress: 'Orta-Yüksek',
    precip: '490 mm/yıl',
    soilMoisture: '41%',
  },
};

const DROUGHT_ALERTS = [
  { region: 'Muğla', time: '02:14 UTC', msg: 'NDVI eşiğin %31 altına düştü. Kuraklık uyarısı aktif.', badge: 'warning', color: '#ef4444' },
  { region: 'Antalya', time: '01:50 UTC', msg: 'Son 3 ay su stresi kritik seviyede seyrediyor.', badge: 'warning', color: '#f97316' },
  { region: 'Çanakkale', time: '00:37 UTC', msg: 'NDVI eşik değerine ulaştı — yakın izleme başladı.', badge: 'watch', color: '#facc15' },
  { region: 'Kastamonu', time: 'Dün 22:11', msg: 'Aylık NDVI karşılaştırmasında -%0.04 düşüş.', badge: 'watch', color: '#facc15' },
  { region: 'Bolu', time: 'Dün 20:00', msg: 'NDVI değerleri sağlıklı aralıkta. Sorun yok.', badge: 'clear', color: '#22c55e' },
];

function initDroughtAlertLog() {
  const log = document.getElementById('drought-alert-log');
  if (!log) return;

  log.innerHTML = DROUGHT_ALERTS.map(a => `
    <div class="dal-item" style="border-left:3px solid ${a.color};">
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <div class="dal-region">${a.region}</div>
        <div class="dal-time">${a.time}</div>
      </div>
      <div class="dal-msg">${a.msg}</div>
      <span class="dal-badge ${a.badge}">${a.badge === 'warning' ? 'UYARI' : a.badge === 'watch' ? 'İZLEME' : 'TEMİZ'}</span>
    </div>
  `).join('');
}

function selectDroughtRegion(regionId) {
  droughtSelectedRegion = regionId;

  // Update region card selection
  document.querySelectorAll('.drought-region-card').forEach(c => c.classList.remove('selected'));
  const card = document.getElementById('drc-' + regionId);
  if (card) card.classList.add('selected');

  // Render detail
  renderDroughtDetail(regionId);
}

function renderDroughtDetail(regionId) {
  const detail = document.getElementById('drought-detail');
  const hint = document.getElementById('drought-hint');
  if (!detail) return;

  const d = DROUGHT_DATA[regionId];
  const forest = FOREST_DATA[regionId];
  if (!d || !forest) return;

  if (hint) hint.style.display = 'none';
  detail.classList.remove('hidden');

  const ndviColor = d.ndvi > 0.65 ? '#4ade80' : d.ndvi > 0.50 ? '#facc15' : '#f87171';
  const ndviPct = Math.round(d.ndvi * 100);
  const thresholdPct = Math.round(d.threshold * 100);

  const statusClass = d.status === 'warning' ? 'alert' : d.status === 'watch' ? 'warning' : 'safe';
  const months = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];

  const maxNdvi = Math.max(...d.monthlyNdvi);
  const minNdvi = Math.min(0.2, ...d.monthlyNdvi);

  const barColor = (v) => {
    if (v < d.threshold) return '#ef4444';
    if (v < 0.65) return '#eab308';
    return '#22c55e';
  };

  detail.innerHTML = `
    <!-- Header -->
    <div class="dd-header">
      <div style="display:flex; align-items:flex-start; justify-content:space-between;">
        <div>
          <div class="dd-region-name">${forest.name}</div>
          <div class="dd-region-sub">${forest.region} · Eşik: NDVI ${d.threshold}</div>
        </div>
        <span style="font-size:0.68rem; font-weight:700; padding:4px 10px; border-radius:4px; background:${d.status === 'warning' ? 'rgba(239,68,68,0.1)' : d.status === 'watch' ? 'rgba(234,179,8,0.1)' : 'rgba(34,197,94,0.1)'}; color:${d.status === 'warning' ? '#f87171' : d.status === 'watch' ? '#facc15' : '#4ade80'}; border:1px solid ${d.status === 'warning' ? 'rgba(239,68,68,0.3)' : d.status === 'watch' ? 'rgba(234,179,8,0.3)' : 'rgba(34,197,94,0.3)'};">${d.statusLabel}</span>
      </div>
    </div>

    <!-- NDVI Big Card -->
    <div class="dd-ndvi-card">
      <div class="dd-card-title">Güncel NDVI Analizi</div>
      <div class="dd-ndvi-big">
        <div class="dd-ndvi-val" style="color:${ndviColor}">${d.ndvi}</div>
        <div class="dd-ndvi-meta">
          <div class="dd-ndvi-label">Bitki Örtüsü İndeksi</div>
          ${d.ndviChange < 0
      ? `<span class="dd-ndvi-change down">▼ ${Math.abs(d.ndviChange).toFixed(2)} aylık düşüş</span>`
      : `<span class="dd-ndvi-change up">▲ +${d.ndviChange.toFixed(2)} aylık artış</span>`
    }
        </div>
      </div>

      <!-- Threshold bar -->
      <div class="dd-threshold-bar">
        <div class="dd-thr-labels">
          <span>0.0</span><span>0.25</span><span>0.50</span><span>0.75</span><span>1.0</span>
        </div>
        <div class="dd-bar-track">
          <div class="dd-bar-fill" id="drought-bar-fill-${regionId}" style="width:0%; background:${d.ndvi < d.threshold ? 'linear-gradient(90deg,#ef4444,#f97316)' : d.ndvi < 0.65 ? 'linear-gradient(90deg,#eab308,#22c55e)' : 'linear-gradient(90deg,#22c55e,#4ade80)'}"></div>
          <div class="dd-bar-threshold" style="left:${thresholdPct}%"></div>
        </div>
      </div>
    </div>

    <!-- Monthly Timeline -->
    <div class="dd-ndvi-card">
      <div class="dd-card-title">12-Aylık NDVI Trendi (2025)</div>
      <div class="dd-timeline" id="drought-timeline-${regionId}">
        ${d.monthlyNdvi.map((v, i) => {
      const hPct = Math.max(4, ((v - minNdvi) / (maxNdvi - minNdvi)) * 100);
      return `<div class="dd-tl-bar" style="height:${hPct}%; background:${barColor(v)}; opacity:${i === d.monthlyNdvi.length - 1 ? '1' : '0.65'};" title="${months[i]}: ${v}"></div>`;
    }).join('')}
      </div>
      <div class="dd-tl-months">
        ${months.map(m => `<div class="dd-tl-m">${m}</div>`).join('')}
      </div>
      <div style="display:flex; gap:10px; font-size:0.58rem; color:var(--text-3); margin-top:8px;">
        <span style="color:#ef4444;">■ Eşik Altı</span>
        <span style="color:#eab308;">■ Orta</span>
        <span style="color:#22c55e;">■ Sağlıklı</span>
        <span style="margin-left:auto;">--- Eşik: ${d.threshold}</span>
      </div>
    </div>

    <!-- Stat grid -->
    <div class="dd-stat-grid">
      <div class="dd-stat-card">
        <div class="dd-stat-val" style="color:${d.droughtIndex > 60 ? '#f87171' : d.droughtIndex > 40 ? '#facc15' : '#4ade80'}">${d.droughtIndex}/100</div>
        <div class="dd-stat-lbl">Kuraklık Endeksi</div>
      </div>
      <div class="dd-stat-card">
        <div class="dd-stat-val" style="color:var(--accent)">${d.precip}</div>
        <div class="dd-stat-lbl">Yıllık Yağış</div>
      </div>
      <div class="dd-stat-card">
        <div class="dd-stat-val" style="color:${parseFloat(d.soilMoisture) < 35 ? '#f87171' : '#4ade80'}">${d.soilMoisture}</div>
        <div class="dd-stat-lbl">Toprak Nemi</div>
      </div>
    </div>

    <!-- Water stress -->
    <div style="padding:12px 14px; background:var(--bg-2); border:1px solid var(--border); border-radius:8px; font-size:0.78rem;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
        <span style="color:var(--text-3);">Su Stresi Seviyesi</span>
        <span style="font-weight:700; color:${d.droughtIndex > 60 ? '#f87171' : d.droughtIndex > 40 ? '#facc15' : '#4ade80'}">${d.waterStress}</span>
      </div>
      <div style="background:rgba(255,255,255,0.05); border-radius:4px; height:8px; overflow:hidden;">
        <div style="height:100%; width:${d.droughtIndex}%; background:${d.droughtIndex > 60 ? 'linear-gradient(90deg,#eab308,#f97316,#ef4444)' : d.droughtIndex > 40 ? 'linear-gradient(90deg,#22c55e,#eab308)' : '#22c55e'}; border-radius:4px; transition:width 1.2s ease;" id="drought-stress-bar-${regionId}"></div>
      </div>
      <div style="display:flex; justify-content:space-between; font-size:0.55rem; color:var(--text-3); margin-top:3px;">
        <span>Normal</span><span>Orta</span><span>Ağır</span><span>Kritik</span>
      </div>
    </div>
  `;

  // Animate after render
  setTimeout(() => {
    const fill = document.getElementById(`drought-bar-fill-${regionId}`);
    if (fill) fill.style.width = ndviBillPct() + '%';
    function ndviBillPct() { return ndviPct; }
  }, 100);
}

// Drought Map
function initDroughtMap() {
  if (droughtLmap) {
    droughtLmap.invalidateSize(true);
    return;
  }

  const mapEl = document.getElementById('drought-gmap');
  if (!mapEl) return;

  droughtLmap = L.map('drought-gmap', {
    zoomControl: true,
    attributionControl: false,
  }).setView([39.0, 32.5], 6);

  // Dark terrain layer
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 18,
  }).addTo(droughtLmap);

  // Place drought markers for each region
  Object.values(FOREST_DATA).forEach(forest => {
    const d = DROUGHT_DATA[forest.id];
    if (!d) return;

    const color = d.ndvi < d.threshold ? '#ef4444' :
      d.ndvi < 0.65 ? '#eab308' : '#22c55e';

    const radius = 40000 + d.droughtIndex * 1000;

    const circle = L.circle([forest.coords.lat, forest.coords.lng], {
      radius: radius,
      color: color,
      weight: 2,
      opacity: 0.85,
      fillColor: color,
      fillOpacity: 0.15,
    }).addTo(droughtLmap);

    const pulse = L.circleMarker([forest.coords.lat, forest.coords.lng], {
      radius: 10,
      fillColor: color,
      fillOpacity: 0.9,
      color: '#fff',
      weight: 2,
    }).addTo(droughtLmap);

    const popupContent = `
      <div style="font-family:'Outfit',sans-serif; background:#161c2a; color:#e2e8f0; border-radius:6px; padding:12px; min-width:190px;">
        <div style="font-size:0.88rem; font-weight:700; margin-bottom:2px;">${forest.name}</div>
        <div style="color:#475569; font-size:0.65rem; margin-bottom:10px;">${forest.region}</div>
        <div style="display:flex; flex-direction:column; gap:5px;">
          <div style="display:flex; justify-content:space-between; font-size:0.73rem;">
            <span style="color:#94a3b8;">NDVI</span>
            <span style="color:${color}; font-family:'Space Mono',monospace; font-weight:700;">${d.ndvi}</span>
          </div>
          <div style="display:flex; justify-content:space-between; font-size:0.73rem;">
            <span style="color:#94a3b8;">Kuraklık Endeksi</span>
            <span style="color:#facc15; font-family:'Space Mono',monospace;">${d.droughtIndex}/100</span>
          </div>
          <div style="display:flex; justify-content:space-between; font-size:0.73rem;">
            <span style="color:#94a3b8;">Durum</span>
            <span style="color:${color}; font-weight:700;">${d.statusLabel}</span>
          </div>
        </div>
      </div>
    `;

    pulse.bindPopup(popupContent, { className: 'leaflet-dark-popup', maxWidth: 240 });

    pulse.on('mouseover', () => pulse.openPopup());
    pulse.on('click', () => {
      closeMapModal();
      selectDroughtRegion(forest.id);
    });

    droughtCircles.push(circle);
  });
}
