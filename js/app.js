// =========================================
//  EARTHWATCH CUBESAT — MAIN APP MODULE v5
// =========================================

let selectedForest = null;
window.selectedForest = null;

// ============ INIT ============
document.addEventListener('DOMContentLoaded', async () => {
  startClock();
  initGoogleMap();

  // Firebase üzerinden 8x8 matrisleri ve anlık sensör verilerini çek
  if (typeof fetchFirebaseData === 'function') {
    await fetchFirebaseData();
    initFirebasePolling();
  }

  // Flora+Fauna modülü başlangıç
  if (typeof selectFloraRegion === 'function') {
    selectFloraRegion('kastamonu');
  }

  // Drought modülü
  if (typeof initDroughtAlertLog === 'function') {
    initDroughtAlertLog();
  }

  simulateLoading();

  // ESC closes modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeMapModal();
    }
  });

  // Click outside modal inner closes it
  document.getElementById('map-modal').addEventListener('click', (e) => {
    if (e.target === document.getElementById('map-modal')) {
      closeMapModal();
    }
  });
});

// ============ MAP MODAL ============
let activeMapContext = null; // 'bio' | 'fire' | 'drought'

function openMapModal(context) {
  activeMapContext = context;
  const modal = document.getElementById('map-modal');
  modal.classList.add('open');

  // Hide all map divs first
  document.getElementById('gmap').style.display = 'none';
  document.getElementById('fire-gmap').style.display = 'none';
  document.getElementById('drought-gmap').style.display = 'none';
  document.getElementById('modal-legend').style.display = 'none';
  document.getElementById('modal-layer-controls').style.display = 'none';

  if (context === 'bio') {
    document.getElementById('gmap').style.display = 'block';
    document.getElementById('modal-legend').style.display = 'block';
    document.getElementById('modal-layer-controls').style.display = 'flex';
    const labelText = selectedForest ? `${FOREST_DATA[selectedForest].emoji} ${FOREST_DATA[selectedForest].name}` : 'Türkiye Orman Haritası';
    document.getElementById('modal-label-text').textContent = labelText;
    setTimeout(() => {
      if (typeof lmap !== 'undefined' && lmap) lmap.invalidateSize(true);
      if (selectedForest) focusMapOnForest(selectedForest);
    }, 80);
  } else if (context === 'fire') {
    document.getElementById('fire-gmap').style.display = 'block';
    const label = fireSelectedForest ? `🔥 ${FOREST_DATA[fireSelectedForest].name} — Yangın Yayılımı` : 'Yangın Yayılım Simülasyonu';
    document.getElementById('modal-label-text').textContent = label;
    setTimeout(() => {
      if (typeof initFireMap === 'function') initFireMap();
      if (typeof fireLmap !== 'undefined' && fireLmap) {
        fireLmap.invalidateSize(true);
        // Redraw fire spread if already selected
        if (fireSelectedForest && typeof selectFireForest === 'function') {
          selectFireForest(fireSelectedForest);
        }
      }
    }, 80);
  } else if (context === 'drought') {
    document.getElementById('drought-gmap').style.display = 'block';
    document.getElementById('modal-label-text').textContent = 'NDVI Kuraklık Risk Haritası';
    setTimeout(() => {
      if (typeof initDroughtMap === 'function') initDroughtMap();
    }, 80);
  }
}

function closeMapModal() {
  const modal = document.getElementById('map-modal');
  modal.classList.remove('open');
  activeMapContext = null;
  // Pause maps by hiding
  document.getElementById('gmap').style.display = 'none';
  document.getElementById('fire-gmap').style.display = 'none';
  document.getElementById('drought-gmap').style.display = 'none';
}

function initFirebasePolling() {
  const statusEl = document.createElement('div');
  statusEl.id = 'fb-sync-status';
  statusEl.style.cssText = 'position:fixed; bottom:20px; left:20px; background:rgba(15,23,42,0.9); border:1px solid rgba(255,255,255,0.1); color:#94a3b8; padding:6px 12px; border-radius:6px; font-family:"Space Mono", monospace; font-size:11px; z-index:9999; display:flex; gap:8px; align-items:center; box-shadow:0 4px 12px rgba(0,0,0,0.5); backdrop-filter:blur(4px);';
  statusEl.innerHTML = `<span style="width:8px;height:8px;background:#22c55e;border-radius:50%;box-shadow:0 0 8px #22c55e;"></span> <span>Veri Akışı: <b>Aktif</b></span>`;
  document.body.appendChild(statusEl);

  setInterval(async () => {
    statusEl.innerHTML = `<span style="width:8px;height:8px;background:#facc15;border-radius:50%;box-shadow:0 0 8px #facc15;"></span> <span>Sorgulanıyor...</span>`;

    const success = await fetchFirebaseData();

    if (success) {
      statusEl.innerHTML = `<span style="width:8px;height:8px;background:#22c55e;border-radius:50%;box-shadow:0 0 8px #22c55e;"></span> <span>Senkronize Edildi</span>`;

      if (window.selectedForest && FOREST_DATA[window.selectedForest]) {
        const forest = FOREST_DATA[window.selectedForest];

        const ndviVal = document.getElementById('dyn-ndvi-val');
        if (ndviVal) ndviVal.textContent = forest.stats.ndvi;

        const lstMatrix = document.getElementById('dyn-lst-matrix');
        if (lstMatrix && typeof renderThermalMatrix === 'function') {
          lstMatrix.innerHTML = renderThermalMatrix(forest.sensors.thermalMatrix);
        }

        const ndviMatrix = document.getElementById('dyn-ndvi-matrix');
        if (ndviMatrix && typeof renderNDVIMatrix === 'function') {
          ndviMatrix.innerHTML = renderNDVIMatrix(forest.sensors.ndviMatrix);
        }

        const lstAvg = document.getElementById('dyn-lst-avg');
        if (lstAvg) lstAvg.textContent = `Avg: ${forest.sensors.lstAvg}°C`;

        const ndviAvg = document.getElementById('dyn-ndvi-avg');
        if (ndviAvg) ndviAvg.innerHTML = `Avg: ${(forest.sensors.ndviAvg / 100).toFixed(2)}`;

        const matrixTime = document.getElementById('dyn-matrix-time');
        if (matrixTime) matrixTime.textContent = forest.sensors.timestamp;

        if (forest.sensors.currentDestruction !== undefined) {
          const cd = parseFloat(forest.sensors.currentDestruction);
          const td = parseFloat(forest.sensors.totalDestruction);

          const curDestEl = document.getElementById('dyn-current-dest');
          if (curDestEl) {
            curDestEl.textContent = cd;
            curDestEl.style.color = cd > 0 ? '#ef4444' : '#22c55e';
            curDestEl.parentElement.style.background = cd > 0 ? 'rgba(239, 68, 68, 0.15)' : 'rgba(34, 197, 94, 0.15)';
            curDestEl.parentElement.style.borderColor = cd > 0 ? '#ef4444' : '#22c55e';
          }
          const curMsgEl = document.getElementById('dyn-current-msg');
          if (curMsgEl) {
            curMsgEl.textContent = cd > 0 ? '⚠️ DİKKAT: BİTKİ ÖRTÜSÜ AZALIŞI' : '✅ TAHRIBAT YOK (GÜVENLİ)';
            curMsgEl.style.color = cd > 0 ? '#ef4444' : '#22c55e';
          }

          const totDestEl = document.getElementById('dyn-total-dest');
          if (totDestEl) {
            totDestEl.textContent = td;
            totDestEl.style.color = td > 0 ? '#eab308' : '#22c55e';
            totDestEl.parentElement.style.background = td > 0 ? 'rgba(234, 179, 8, 0.15)' : 'rgba(34, 197, 94, 0.15)';
            totDestEl.parentElement.style.borderColor = td > 0 ? '#eab308' : '#22c55e';
          }
          const totMsgEl = document.getElementById('dyn-total-msg');
          if (totMsgEl) {
            totMsgEl.textContent = td > 0 ? 'ZAMANSAL TOPLAM KAYIP' : 'KAYIP TESPİT EDİLMEDİ';
            totMsgEl.style.color = td > 0 ? '#eab308' : '#22c55e';
          }
        }
      }

      setTimeout(() => {
        statusEl.innerHTML = `<span style="width:8px;height:8px;background:#22c55e;border-radius:50%;box-shadow:0 0 8px #22c55e;"></span> <span>Bekleniyor...</span>`;
      }, 1000);
    } else {
      statusEl.innerHTML = `<span style="width:8px;height:8px;background:#ef4444;border-radius:50%;box-shadow:0 0 8px #ef4444;"></span> <span>Bağlantı Koptu</span>`;
    }
  }, 3000);
}

function simulateLoading() {
  setTimeout(() => {
    const screen = document.getElementById('loading-screen');
    if (screen) screen.classList.add('hidden');
  }, 2200);
}

// ============ MODULE SWITCHER ============
function switchModule(name) {
  document.querySelectorAll('.module').forEach(m => {
    m.classList.remove('active');
    m.classList.add('hidden');
  });
  const target = document.getElementById('module-' + name);
  if (target) {
    target.classList.remove('hidden');
    target.classList.add('active');
  }

  document.querySelectorAll('.module-btn').forEach(btn => {
    btn.classList.remove('active');
    btn.setAttribute('aria-pressed', 'false');
  });
  const activeBtn = document.getElementById('btn-' + name);
  if (activeBtn) {
    activeBtn.classList.add('active');
    activeBtn.setAttribute('aria-pressed', 'true');
  }

  // Close map modal when switching modules
  closeMapModal();
}

// ============ FOREST SELECTION ============
function selectForest(forestId) {
  if (selectedForest === forestId) return;
  selectedForest = forestId;
  window.selectedForest = forestId;

  document.querySelectorAll('.forest-card').forEach(card => {
    card.classList.remove('selected');
    card.setAttribute('aria-selected', 'false');
  });
  const card = document.getElementById('fc-' + forestId);
  if (card) {
    card.classList.add('selected');
    card.setAttribute('aria-selected', 'true');
    card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  // Show stats
  showStats(forestId);

  // If map modal is open, focus on forest
  if (activeMapContext === 'bio') {
    focusMapOnForest(forestId);
    const forest = FOREST_DATA[forestId];
    document.getElementById('modal-label-text').textContent = `${forest.emoji} ${forest.name}`;
  }
}

function showStats(forestId) {
  const placeholder = document.getElementById('stats-placeholder');
  const content = document.getElementById('stats-content');

  if (placeholder) placeholder.style.display = 'none';

  if (content) {
    content.classList.remove('hidden');
    renderStats(forestId);
  }
}

// ============ CLOCK ============
function startClock() {
  const el = document.getElementById('live-time');
  const update = () => {
    const now = new Date();
    const h = String(now.getUTCHours()).padStart(2, '0');
    const m = String(now.getUTCMinutes()).padStart(2, '0');
    const s = String(now.getUTCSeconds()).padStart(2, '0');
    if (el) el.textContent = `${h}:${m}:${s} UTC`;
  };
  update();
  setInterval(update, 1000);
}

// ============ KEYBOARD NAV ============
document.addEventListener('keydown', (e) => {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

  const keys = { '1': 'fauna', '2': 'flora', '3': 'fire', '4': 'drought' };
  if (keys[e.key]) { switchModule(keys[e.key]); return; }

  const forests = ['kastamonu', 'antalya', 'mugla', 'bolu', 'canakkale'];
  if (!selectedForest && (e.key === 'ArrowDown' || e.key === 'ArrowRight')) {
    selectForest(forests[0]);
    return;
  }
  if (selectedForest) {
    const idx = forests.indexOf(selectedForest);
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      selectForest(forests[(idx + 1) % forests.length]);
    }
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      selectForest(forests[(idx - 1 + forests.length) % forests.length]);
    }
  }
});
