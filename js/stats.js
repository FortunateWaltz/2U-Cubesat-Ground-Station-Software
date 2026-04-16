// =========================================
//  EARTHWATCH CUBESAT — STATS PANEL MODULE
// =========================================

let activeChart = null;

async function renderStats(forestId) {
  const forest = FOREST_DATA[forestId];
  if (!forest) return;

  const s = forest.stats;
  const pct = ((s.fireDamageHa / s.totalAreaHa) * 100).toFixed(1);

  if (activeChart) { activeChart.destroy(); activeChart = null; }

  const container = document.getElementById('stats-content');

  let temp = '--°C';
  let humidity = '--%';
  try {
     const res = await fetch(`https://api.weatherapi.com/v1/current.json?key=5d1a90ce40fa495698a115220262903&q=${forest.coords.lat},${forest.coords.lng}`);
     const wData = await res.json();
     if(wData.current) {
         temp = wData.current.temp_c + '°C';
         humidity = '%' + wData.current.humidity;
     }
  } catch(e) { console.warn("Hava durumu çekilemedi", e); }

  container.innerHTML = `

    <!-- Header -->
    <div class="sc-header">
      <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:4px;">
        <div class="sc-region-name">${forest.name}</div>
        ${getRiskBadge(s.riskLevel)}
      </div>
      <div class="sc-region-sub">${forest.region} &middot; ${s.lastUpdated}</div>
      <div style="display:flex; gap:12px; margin-top:10px; padding:6px 12px; background:var(--bg-1); border-radius:4px; border:1px solid rgba(255,255,255,0.05); font-size:0.75rem;">
         <div style="display:flex; align-items:center; gap:5px;">
            <span style="color:var(--text-3);">Sıcaklık:</span> <span style="font-weight:700; color:#ff9800;">${temp}</span>
         </div>
         <div style="display:flex; align-items:center; gap:5px;">
            <span style="color:var(--text-3);">Nem:</span> <span style="font-weight:700; color:#00e5ff;">${humidity}</span>
         </div>
      </div>
      <div style="font-size:0.6rem; color:#475569; font-family:'Space Mono',monospace; margin-top:8px;">
        ${s.totalAreaHa.toLocaleString('tr')} ha &nbsp;&middot;&nbsp; Yangın: ${s.fireDamageHa.toLocaleString('tr')} ha (${pct}%)
      </div>
    </div>

    <!-- TAHRIBAT ANALIZ BARI -->
    ${forest.sensors && forest.sensors.currentDestruction !== undefined ? `
    <div style="display:flex; gap:10px; margin-top:14px; margin-bottom:14px;">
      <div style="flex:1; background:${forest.sensors.currentDestruction > 0 ? 'rgba(239, 68, 68, 0.15)' : 'rgba(34, 197, 94, 0.15)'}; border:1px solid ${forest.sensors.currentDestruction > 0 ? '#ef4444' : '#22c55e'}; border-radius:8px; padding:10px; text-align:center;">
        <div style="font-size:0.6rem; color:#94a3b8; margin-bottom:4px; text-transform:uppercase; letter-spacing:1px;">Günlük Tahribat Skoru</div>
        <div id="dyn-current-dest" style="font-size:1.8rem; font-weight:900; font-family:'Space Mono', monospace; color:${forest.sensors.currentDestruction > 0 ? '#ef4444' : '#22c55e'};">
          ${forest.sensors.currentDestruction}
        </div>
        <div id="dyn-current-msg" style="font-size:0.55rem; color:${forest.sensors.currentDestruction > 0 ? '#ef4444' : '#22c55e'}; font-weight:600; margin-top:2px;">
          ${forest.sensors.currentDestruction > 0 ? '⚠️ DİKKAT: BİTKİ ÖRTÜSÜ AZALIŞI' : '✅ TAHRIBAT YOK (GÜVENLİ)'}
        </div>
      </div>
      
      <div style="flex:1; background:${forest.sensors.totalDestruction > 0 ? 'rgba(234, 179, 8, 0.15)' : 'rgba(34, 197, 94, 0.15)'}; border:1px solid ${forest.sensors.totalDestruction > 0 ? '#eab308' : '#22c55e'}; border-radius:8px; padding:10px; text-align:center;">
        <div style="font-size:0.6rem; color:#94a3b8; margin-bottom:4px; text-transform:uppercase; letter-spacing:1px;">Toplam Kümülatif Kayıp</div>
        <div id="dyn-total-dest" style="font-size:1.8rem; font-weight:900; font-family:'Space Mono', monospace; color:${forest.sensors.totalDestruction > 0 ? '#eab308' : '#22c55e'};">
          ${forest.sensors.totalDestruction}
        </div>
        <div id="dyn-total-msg" style="font-size:0.55rem; color:${forest.sensors.totalDestruction > 0 ? '#eab308' : '#22c55e'}; font-weight:600; margin-top:2px;">
          ${forest.sensors.totalDestruction > 0 ? 'ZAMANSAL TOPLAM KAYIP' : 'KAYIP TESPİT EDİLMEDİ'}
        </div>
      </div>
    </div>
    ` : ''}

    <!-- 4 big stats -->
    <div class="sc-big-grid">
      <div class="sc-big-card affected">
        <div class="sc-big-val" id="anim-affected">0</div>
        <div class="sc-big-lbl">Etkilenen<br>Hayvan Türü</div>
      </div>
      <div class="sc-big-card endangered">
        <div class="sc-big-val" id="anim-endangered">0</div>
        <div class="sc-big-lbl">Nesli Tehlikede<br>Olan Tür</div>
      </div>
      <div class="sc-big-card ndvi">
        <div class="sc-big-val" id="dyn-ndvi-val">${s.ndvi}</div>
        <div class="sc-big-lbl">NDVI<br>Değeri</div>
      </div>
      <div class="sc-big-card fire-area">
        <div class="sc-big-val">${formatHa(s.fireDamageHa)}</div>
        <div class="sc-big-lbl">Yangın Tahribatı<br>(Hektar)</div>
      </div>
    </div>

    <!-- 8x8 Sensor Matrices (LST / NDVI) -->
    ${forest.sensors ? `
    <div class="sc-section-title" style="margin-top:14px; display:flex; justify-content:space-between; align-items:flex-end;">
      <span>Uydu Sensör Matrisi (8x8)</span>
      <span id="dyn-matrix-time" style="font-size:0.55rem; color:#64748b;">${forest.sensors.timestamp || 'Gerçek Zamanlı'}</span>
    </div>
    <div style="display:flex; gap:10px; margin-bottom:4px; margin-top:4px;">
      <!-- LST -->
      <div style="flex:1; background:#1c2436; padding:8px; border-radius:6px; border:1px solid rgba(255,255,255,0.07);">
        <div style="font-size:0.55rem; color:#94a3b8; text-align:center; margin-bottom:6px;">Yüzey Sıc. (LST)</div>
        <div id="dyn-lst-matrix" style="display:grid; grid-template-columns:repeat(8, 1fr); gap:1px; background:rgba(0,0,0,0.5); border:1px solid rgba(255,255,255,0.05); aspect-ratio:1;">
           ${renderThermalMatrix(forest.sensors.thermalMatrix)}
        </div>
        <div id="dyn-lst-avg" style="font-size:0.55rem; text-align:center; margin-top:4px; font-weight:700; color:#ef4444;">Avg: ${forest.sensors.lstAvg}°C</div>
      </div>
      <!-- NDVI -->
      <div style="flex:1; background:#1c2436; padding:8px; border-radius:6px; border:1px solid rgba(255,255,255,0.07);">
         <div style="font-size:0.55rem; color:#94a3b8; text-align:center; margin-bottom:6px;">Bitki Örtüsü (NDVI)</div>
         <div id="dyn-ndvi-matrix" style="display:grid; grid-template-columns:repeat(8, 1fr); gap:1px; background:rgba(0,0,0,0.5); border:1px solid rgba(255,255,255,0.05); aspect-ratio:1;">
           ${renderNDVIMatrix(forest.sensors.ndviMatrix)}
         </div>
         <div id="dyn-ndvi-avg" style="font-size:0.55rem; text-align:center; margin-top:4px; font-weight:700; color:#22c55e;">Avg: ${(forest.sensors.ndviAvg/100).toFixed(2)}</div>
      </div>
    </div>
    ` : ''}

    <!-- Drought index -->
    <div class="sc-section-title">Kuraklık Endeksi</div>
    <div style="background:#1c2436; border-radius:6px; padding:10px; margin-bottom:4px; border:1px solid rgba(255,255,255,0.07);">
      <div style="display:flex; justify-content:space-between; margin-bottom:7px; font-size:0.7rem;">
        <span style="color:#94a3b8;">Su Stresi Seviyesi</span>
        <span style="font-family:'Space Mono',monospace; color:${getDroughtColor(s.droughtIndex)}; font-weight:700;">${s.droughtIndex}/100</span>
      </div>
      <div style="background:rgba(255,255,255,0.05); border-radius:3px; height:6px; overflow:hidden;">
        <div id="drought-bar" style="height:100%; width:0%; border-radius:3px; background:${getDroughtGradient(s.droughtIndex)}; transition:width 1s ease;"></div>
      </div>
      <div style="display:flex; justify-content:space-between; font-size:0.56rem; color:#475569; margin-top:4px;">
        <span>Normal</span><span>Orta</span><span>Ağır</span><span>Kritik</span>
      </div>
    </div>

    <!-- Healthy forest bar -->
    <div style="display:flex; align-items:center; gap:10px; background:#1c2436; border:1px solid rgba(255,255,255,0.07); border-radius:6px; padding:10px; margin-bottom:4px; margin-top:6px;">
      <div style="flex:1;">
        <div style="font-size:0.65rem; color:#94a3b8; margin-bottom:4px;">Sağlıklı Orman Oranı</div>
        <div style="background:rgba(255,255,255,0.05); border-radius:3px; height:6px; overflow:hidden;">
          <div style="height:100%; width:${(100 - Number(s.firePct) * 2).toFixed(0)}%; background:#22c55e; border-radius:3px; transition:width 1s ease;"></div>
        </div>
      </div>
      <div style="text-align:center; min-width:46px;">
        <div style="font-size:1rem; font-weight:800; font-family:'Space Mono',monospace; color:#22c55e;">${(100 - s.firePct * 2).toFixed(0)}%</div>
        <div style="font-size:0.56rem; color:#475569;">Sağlıklı</div>
      </div>
    </div>

    <!-- Species list -->
    <div class="sc-section-title" style="margin-top:14px;">Tehlike Altındaki Türler</div>
    <div class="species-list" id="species-list">
      ${forest.animals.map((a, i) => `
        <div class="species-item" style="animation-delay:${i * 0.05}s">
          <div class="sp-info">
            <div class="sp-name">${a.name}</div>
            <div class="sp-sci">${a.sci}</div>
          </div>
          <span class="sp-badge ${a.status}">${a.statusLabel}</span>
        </div>
      `).join('')}
    </div>

    <!-- Chart -->
    <div class="sc-section-title" style="margin-top:14px;">Aylık Yangın Vakası (2025)</div>
    <div class="sc-chart-wrap">
      <canvas id="fire-chart" class="sc-chart-canvas" height="150"></canvas>
    </div>

  `;

  animateCounter('anim-affected', s.affectedSpecies, 1200);
  animateCounter('anim-endangered', s.endangeredSpecies, 1200);
  setTimeout(() => {
    const bar = document.getElementById('drought-bar');
    if (bar) bar.style.width = s.droughtIndex + '%';
  }, 100);
  drawFireChart(forest.chartData);
}

function animateCounter(id, target, duration) {
  const el = document.getElementById(id);
  if (!el) return;
  const start = Date.now();
  const tick = () => {
    const elapsed = Date.now() - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(tick);
  };
  tick();
}

function drawFireChart(chartData) {
  const ctx = document.getElementById('fire-chart');
  if (!ctx) return;
  if (activeChart) activeChart.destroy();

  activeChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: chartData.labels,
      datasets: [{
        label: 'Yangın Vakası',
        data: chartData.fire,
        backgroundColor: chartData.fire.map(v =>
          v > 80 ? 'rgba(239,68,68,0.65)' :
          v > 40 ? 'rgba(249,115,22,0.6)' :
          v > 15 ? 'rgba(234,179,8,0.55)' :
                   'rgba(59,130,246,0.45)'
        ),
        borderColor: chartData.fire.map(v =>
          v > 80 ? '#ef4444' : v > 40 ? '#f97316' : v > 15 ? '#eab308' : '#3b82f6'
        ),
        borderWidth: 1,
        borderRadius: 3,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#1c2436',
          titleColor: '#e2e8f0',
          bodyColor: '#94a3b8',
          borderColor: 'rgba(255,255,255,0.1)',
          borderWidth: 1,
          padding: 8,
          callbacks: { label: ctx => `${ctx.parsed.y} yangın vakası` }
        },
      },
      scales: {
        x: {
          grid: { color: 'rgba(255,255,255,0.04)', drawBorder: false },
          ticks: { color: '#475569', font: { size: 9, family: "'Space Mono', monospace" } },
        },
        y: {
          grid: { color: 'rgba(255,255,255,0.04)', drawBorder: false },
          ticks: { color: '#475569', font: { size: 9 } },
          beginAtZero: true,
        },
      },
      animation: { duration: 700, easing: 'easeOutQuart' },
    },
  });
}

// --- Helpers ---
function getRiskBadge(level) {
  const map = {
    critical: ['Kritik',      '#f87171', 'rgba(239,68,68,0.12)',  'rgba(239,68,68,0.25)'],
    high:     ['Yüksek Risk', '#fb923c', 'rgba(249,115,22,0.12)', 'rgba(249,115,22,0.25)'],
    medium:   ['Orta Risk',   '#facc15', 'rgba(234,179,8,0.12)',  'rgba(234,179,8,0.25)'],
    low:      ['Düşük Risk',  '#4ade80', 'rgba(34,197,94,0.12)',  'rgba(34,197,94,0.25)'],
  };
  const [label, color, bg, border] = map[level] || map.medium;
  return `<span style="font-size:0.6rem; font-weight:700; padding:2px 8px; border-radius:3px; background:${bg}; color:${color}; border:1px solid ${border}; letter-spacing:0.05em; text-transform:uppercase;">${label}</span>`;
}

function getDroughtColor(v) {
  if (v >= 70) return '#f87171';
  if (v >= 50) return '#fb923c';
  if (v >= 30) return '#facc15';
  return '#4ade80';
}

function getDroughtGradient(v) {
  if (v >= 70) return 'linear-gradient(90deg, #eab308, #f97316, #ef4444)';
  if (v >= 50) return 'linear-gradient(90deg, #eab308, #f97316)';
  if (v >= 30) return 'linear-gradient(90deg, #22c55e, #eab308)';
  return '#22c55e';
}

function formatHa(ha) {
  if (ha >= 1000) return (ha / 1000).toFixed(1) + 'K';
  return ha.toString();
}

// 8x8 Sensor Matrix Render Helpers
function renderThermalMatrix(matrix) {
  if (!matrix || matrix.length !== 64) return '';
  return matrix.map(val => {
    let color;
    if (val < 25) {
      color = 'rgba(34, 197, 94, 0.8)'; // Green (Normal)
    } else if (val < 50) {
      color = 'rgba(234, 179, 8, 0.8)'; // Yellow (Warm)
    } else if (val < 80) {
      color = 'rgba(249, 115, 22, 0.8)'; // Orange (Hot)
    } else {
      color = 'rgba(239, 68, 68, 0.9)'; // Red (Fire)
    }
    return `<div style="background:${color};" title="${val}°C"></div>`;
  }).join('');
}

function renderNDVIMatrix(matrix) {
  if (!matrix || matrix.length !== 64) return '';
  return matrix.map(val => {
    let color;
    // Values ~100-119 are healthy. Values < 50 are burned/bare.
    if (val > 90) {
      color = 'rgba(34, 197, 94, 0.8)'; // Green (High Vegetation)
    } else if (val > 50) {
      color = 'rgba(234, 179, 8, 0.8)'; // Yellow (Drought/Stressed)
    } else if (val > 20) {
      color = 'rgba(249, 115, 22, 0.8)'; // Orange (Very Stressed)
    } else {
      color = 'rgb(100, 40, 0)'; // Dark brown/red (No vegetation / Burned)
    }
    return `<div style="background:${color};" title="${val}"></div>`;
  }).join('');
}
