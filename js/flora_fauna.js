// =========================================
//  FLORA + FAUNA MODULE
// =========================================

// Flora data (bitki örtüsü per region)
const FLORA_DATA = {
  kastamonu: {
    biomeType: 'Geniş Yapraklı + İğne Yapraklı Karma Orman',
    ndvi: 0.71,
    ndviChange: -0.04,
    plantSpecies: 1847,
    stressedSpecies: 234,
    endemicRisk: 67,
    plants: [
      { name: 'Uludağ Göknarı', sci: 'Abies nordmanniana', status: 'vu', statusLabel: 'Hassas', icon: '🌲' },
      { name: 'Karadeniz Kayını', sci: 'Fagus orientalis', status: 'nt', statusLabel: 'Endişe Verici', icon: '🌳' },
      { name: 'Doğu Serisi', sci: 'Thuja orientalis', status: 'en', statusLabel: 'Tehlikede', icon: '🌿' },
      { name: 'Med. Orkide', sci: 'Ophrys apifera', status: 'cr', statusLabel: 'Kritik Tehlike', icon: '🌸' },
      { name: 'Kastamonu Lalesi', sci: 'Tulipa kasbeкi', status: 'cr', statusLabel: 'Kritik Tehlike', icon: '🌷' },
      { name: 'Yavansu Meşesi', sci: 'Quercus pontica', status: 'en', statusLabel: 'Tehlikede', icon: '🍂' },
    ]
  },
  antalya: {
    biomeType: 'Akdeniz Makisi + Sedir Ormanları',
    ndvi: 0.43,
    ndviChange: -0.14,
    plantSpecies: 3240,
    stressedSpecies: 890,
    endemicRisk: 156,
    plants: [
      { name: 'Lübnan Sediri', sci: 'Cedrus libani', status: 'en', statusLabel: 'Tehlikede', icon: '🌲' },
      { name: 'Akdeniz Kermes Meşesi', sci: 'Quercus coccifera', status: 'vu', statusLabel: 'Hassas', icon: '🌳' },
      { name: 'Fıstık Çamı', sci: 'Pinus pinea', status: 'vu', statusLabel: 'Hassas', icon: '🌲' },
      { name: 'Toros Sediri', sci: 'Cedrus taurica', status: 'cr', statusLabel: 'Kritik Tehlike', icon: '🌿' },
      { name: 'Antalya Sümbülü', sci: 'Muscari anatolicum', status: 'cr', statusLabel: 'Kritik Tehlike', icon: '💜' },
      { name: 'Akdiken', sci: 'Crataegus monogyna', status: 'nt', statusLabel: 'Endişe Verici', icon: '🍃' },
    ]
  },
  mugla: {
    biomeType: 'Kızılçam + Akdeniz Çalılığı',
    ndvi: 0.38,
    ndviChange: -0.17,
    plantSpecies: 2680,
    stressedSpecies: 720,
    endemicRisk: 134,
    plants: [
      { name: 'Kızılçam', sci: 'Pinus brutia', status: 'vu', statusLabel: 'Hassas', icon: '🌲' },
      { name: 'Sandal Ağacı', sci: 'Arbutus unedo', status: 'nt', statusLabel: 'Endişe Verici', icon: '🌳' },
      { name: 'Zeytin Yabani', sci: 'Olea europaea sylvestris', status: 'vu', statusLabel: 'Hassas', icon: '🫒' },
      { name: 'Muğla Lavantası', sci: 'Lavandula stoechas', status: 'en', statusLabel: 'Tehlikede', icon: '💜' },
      { name: 'Ege Adaçayı', sci: 'Salvia aegyptiaca', status: 'cr', statusLabel: 'Kritik Tehlike', icon: '🌿' },
      { name: 'Bodrum Papatyası', sci: 'Chrysanthemum coronarium', status: 'en', statusLabel: 'Tehlikede', icon: '🌼' },
    ]
  },
  bolu: {
    biomeType: 'Kayın + Göknar — Zengin Biyoçeşitlilik',
    ndvi: 0.82,
    ndviChange: +0.02,
    plantSpecies: 2130,
    stressedSpecies: 145,
    endemicRisk: 38,
    plants: [
      { name: 'Doğu Kayını', sci: 'Fagus sylvatica orientalis', status: 'nt', statusLabel: 'Endişe Verici', icon: '🌳' },
      { name: 'Karaçam', sci: 'Pinus nigra', status: 'nt', statusLabel: 'Endişe Verici', icon: '🌲' },
      { name: 'Bolu Kartopu', sci: 'Viburnum opulus', status: 'nt', statusLabel: 'Endişe Verici', icon: '🌸' },
      { name: 'Ihlamur', sci: 'Tilia tomentosa', status: 'nt', statusLabel: 'Endişe Verici', icon: '🍃' },
      { name: 'Kestane', sci: 'Castanea sativa', status: 'vu', statusLabel: 'Hassas', icon: '🌰' },
      { name: 'Bolu Sümbülü', sci: 'Hyacinthus orientalis', status: 'en', statusLabel: 'Tehlikede', icon: '💙' },
    ]
  },
  canakkale: {
    biomeType: 'Makilik + Kızılçam Ormanlıkları',
    ndvi: 0.56,
    ndviChange: -0.06,
    plantSpecies: 1420,
    stressedSpecies: 310,
    endemicRisk: 54,
    plants: [
      { name: 'Kazdağı Göknarı', sci: 'Abies nordmanniana equi-trojani', status: 'en', statusLabel: 'Tehlikede', icon: '🌲' },
      { name: 'Kazdağı Meşesi', sci: 'Quercus trojana', status: 'vu', statusLabel: 'Hassas', icon: '🌳' },
      { name: 'Laden', sci: 'Cistus salviifolius', status: 'nt', statusLabel: 'Endişe Verici', icon: '🌸' },
      { name: 'Defne', sci: 'Laurus nobilis', status: 'nt', statusLabel: 'Endişe Verici', icon: '🍃' },
      { name: 'Troya Lalesi', sci: 'Tulipa sprengeri', status: 'cr', statusLabel: 'Kritik Tehlike', icon: '🌷' },
      { name: 'Fıstık Çamı', sci: 'Pinus pinea', status: 'vu', statusLabel: 'Hassas', icon: '🌲' },
    ]
  }
};

let activeFloraRegion = 'kastamonu';

function selectFloraRegion(regionId) {
  activeFloraRegion = regionId;

  // Update tabs
  document.querySelectorAll('.ff-tab').forEach(tab => tab.classList.remove('active'));
  const activeTab = document.getElementById('fftab-' + regionId);
  if (activeTab) activeTab.classList.add('active');

  renderFloraFaunaContent(regionId);
}

function renderFloraFaunaContent(regionId) {
  const container = document.getElementById('ff-content-grid');
  if (!container) return;

  const flora = FLORA_DATA[regionId];
  const forest = FOREST_DATA[regionId];
  if (!flora || !forest) return;

  const ndviBg = flora.ndvi > 0.65 ? 'linear-gradient(90deg,#22c55e,#4ade80)' :
                 flora.ndvi > 0.50 ? 'linear-gradient(90deg,#eab308,#facc15)' :
                                     'linear-gradient(90deg,#ef4444,#f97316)';

  const ndviColor = flora.ndvi > 0.65 ? '#4ade80' :
                    flora.ndvi > 0.50 ? '#facc15' : '#f87171';

  const ndviChangeHtml = flora.ndviChange < 0
    ? `<span class="dd-ndvi-change down">▼ ${Math.abs(flora.ndviChange).toFixed(2)} düşüş</span>`
    : `<span class="dd-ndvi-change up">▲ +${flora.ndviChange.toFixed(2)} iyileşme</span>`;

  const riskStatus = forest.stats.riskLevel === 'critical' ? '⚠️ KRİTİK RİSK' :
                     forest.stats.riskLevel === 'high' ? '⚠️ YÜKSEK RİSK' : '✅ İZLENİYOR';

  const riskColor = forest.stats.riskLevel === 'critical' ? '#f87171' :
                    forest.stats.riskLevel === 'high' ? '#fb923c' : '#4ade80';

  // Count total endangered animals
  const endangeredCount = forest.animals.filter(a => a.status === 'cr' || a.status === 'en').length;
  const highRiskCount = forest.animals.filter(a => a.status === 'cr').length;

  container.innerHTML = `
    <!-- FLORA COLUMN -->
    <div class="ff-col">
      <div class="ff-col-header">
        <div class="ff-col-icon flora-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2"><path d="M12 2a10 10 0 1 0 10 10"/><path d="M12 12V2"/><path d="M12 12l6.5-6.5"/></svg>
        </div>
        <div>
          <div class="ff-col-title">Flora / Bitki Örtüsü</div>
          <div class="ff-col-sub">${flora.biomeType}</div>
        </div>
      </div>

      <!-- Mini stats -->
      <div class="ff-mini-stats">
        <div class="ff-mini-card">
          <div class="ff-mini-val" style="color:var(--accent)">${flora.plantSpecies.toLocaleString('tr')}</div>
          <div class="ff-mini-lbl">Bitki Türü</div>
        </div>
        <div class="ff-mini-card">
          <div class="ff-mini-val" style="color:var(--yellow)">${flora.stressedSpecies}</div>
          <div class="ff-mini-lbl">Stres Altında</div>
        </div>
        <div class="ff-mini-card">
          <div class="ff-mini-val" style="color:var(--red)">${flora.endemicRisk}</div>
          <div class="ff-mini-lbl">Endemik Risk</div>
        </div>
      </div>

      <!-- NDVI Bar -->
      <div class="ff-ndvi-bar-wrap">
        <div class="ff-ndvi-label-row">
          <span>NDVI İndeksi</span>
          <span style="font-family:var(--mono); font-weight:700; color:${ndviColor}">${flora.ndvi} &nbsp; ${ndviChangeHtml}</span>
        </div>
        <div class="ff-ndvi-bg">
          <div class="ff-ndvi-fill" id="ff-ndvi-fill-${regionId}" style="width:0%;background:${ndviBg}"></div>
        </div>
        <div style="display:flex; justify-content:space-between; font-size:0.56rem; color:var(--text-3); margin-top:4px;">
          <span>0.0 (Çıplak)</span><span>0.5 (Orta)</span><span>1.0 (Sağlıklı)</span>
        </div>
      </div>

      <!-- Status row -->
      <div style="display:flex; align-items:center; gap:8px; margin-bottom:12px; padding:8px 10px; background:var(--bg-2); border-radius:6px; border:1px solid var(--border); font-size:0.72rem;">
        <span style="color:var(--text-3);">Durum:</span>
        <span style="font-weight:700; color:${riskColor}">${riskStatus}</span>
        <span style="margin-left:auto; color:var(--text-3);">${forest.stats.lastUpdated}</span>
      </div>

      <!-- Plant species -->
      <div style="font-size:0.62rem; font-weight:700; text-transform:uppercase; letter-spacing:0.08em; color:var(--text-3); margin-bottom:8px; display:flex; align-items:center; gap:6px;">
        Risk Altındaki Bitkiler
        <span style="flex:1; height:1px; background:var(--border); display:block;"></span>
      </div>
      <div class="ff-species-grid">
        ${flora.plants.map(p => `
          <div class="ff-species-tile">
            <div class="ff-sp-emoji">${p.icon}</div>
            <div class="ff-sp-info">
              <div class="ff-sp-name">${p.name}</div>
              <div class="ff-sp-sci">${p.sci}</div>
            </div>
            <span class="ff-sp-badge ${p.status}">${p.statusLabel}</span>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- FAUNA COLUMN -->
    <div class="ff-col">
      <div class="ff-col-header">
        <div class="ff-col-icon fauna-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a855f7" stroke-width="2"><path d="M10 17c-5 0-6-4-3-8"/><path d="M14 17c5 0 6-4 3-8"/><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3"/><path d="m4.22 4.22 2.12 2.12M17.66 17.66l2.12 2.12"/><path d="m4.22 19.78 2.12-2.12M17.66 6.34l2.12-2.12"/></svg>
        </div>
        <div>
          <div class="ff-col-title">Fauna / Hayvan Türleri</div>
          <div class="ff-col-sub">${forest.region} — Risk Altındaki Türler</div>
        </div>
      </div>

      <!-- Fauna mini stats -->
      <div class="ff-mini-stats">
        <div class="ff-mini-card">
          <div class="ff-mini-val" style="color:var(--orange)">${forest.stats.affectedSpecies}</div>
          <div class="ff-mini-lbl">Etkilenen</div>
        </div>
        <div class="ff-mini-card">
          <div class="ff-mini-val" style="color:var(--red)">${forest.stats.endangeredSpecies}</div>
          <div class="ff-mini-lbl">Nesli Tehlikede</div>
        </div>
        <div class="ff-mini-card">
          <div class="ff-mini-val" style="color:#a855f7">${highRiskCount}</div>
          <div class="ff-mini-lbl">Kritik Tür</div>
        </div>
      </div>

      <!-- Risk distribution bar -->
      <div class="ff-ndvi-bar-wrap">
        <div class="ff-ndvi-label-row">
          <span>Nesil Tehlike Dağılımı</span>
          <span style="color:#f87171; font-family:var(--mono); font-size:0.68rem; font-weight:700;">${endangeredCount}/${forest.animals.length} tehlike</span>
        </div>
        <div style="display:flex; height:8px; border-radius:4px; overflow:hidden; gap:1px;">
          ${(() => {
            const cr = forest.animals.filter(a => a.status === 'cr').length;
            const en = forest.animals.filter(a => a.status === 'en').length;
            const vu = forest.animals.filter(a => a.status === 'vu').length;
            const nt = forest.animals.filter(a => a.status === 'nt').length;
            const total = forest.animals.length;
            return `
              <div style="width:${cr/total*100}%; background:#ef4444; border-radius:4px 0 0 4px;" title="Kritik: ${cr}"></div>
              <div style="width:${en/total*100}%; background:#f97316;" title="Tehlikede: ${en}"></div>
              <div style="width:${vu/total*100}%; background:#eab308;" title="Hassas: ${vu}"></div>
              <div style="width:${nt/total*100}%; background:#475569; border-radius:0 4px 4px 0;" title="Endişe: ${nt}"></div>
            `;
          })()}
        </div>
        <div style="display:flex; gap:10px; font-size:0.56rem; color:var(--text-3); margin-top:4px;">
          <span style="color:#f87171;">■ Kritik</span>
          <span style="color:#fb923c;">■ Tehlikede</span>
          <span style="color:#facc15;">■ Hassas</span>
          <span style="color:#475569;">■ Endişe</span>
        </div>
      </div>

      <!-- Habitat damage -->
      <div style="display:flex; align-items:center; gap:8px; margin-bottom:12px; padding:8px 10px; background:var(--bg-2); border-radius:6px; border:1px solid var(--border); font-size:0.72rem;">
        <span style="color:var(--text-3);">Habitat Tahribatı:</span>
        <span style="font-weight:700; font-family:var(--mono); color:var(--yellow)">${forest.stats.fireDamageHa.toLocaleString('tr')} ha</span>
        <span style="margin-left:auto; color:var(--text-3); font-size:0.6rem;">${forest.stats.firePct}% hasar</span>
      </div>

      <!-- Animal species -->
      <div style="font-size:0.62rem; font-weight:700; text-transform:uppercase; letter-spacing:0.08em; color:var(--text-3); margin-bottom:8px; display:flex; align-items:center; gap:6px;">
        Risk Altındaki Hayvanlar
        <span style="flex:1; height:1px; background:var(--border); display:block;"></span>
      </div>
      <div class="ff-species-grid">
        ${forest.animals.map(a => `
          <div class="ff-species-tile">
            <div class="ff-sp-emoji">${a.icon}</div>
            <div class="ff-sp-info">
              <div class="ff-sp-name">${a.name}</div>
              <div class="ff-sp-sci">${a.sci}</div>
            </div>
            <span class="ff-sp-badge ${a.status}">${a.statusLabel}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  // Animate NDVI bar
  setTimeout(() => {
    const fill = document.getElementById('ff-ndvi-fill-' + regionId);
    if (fill) fill.style.width = (flora.ndvi * 100) + '%';
  }, 80);
}
