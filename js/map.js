// =========================================
//  EARTHWATCH CUBESAT — LEAFLET MAP MODULE v5
// =========================================

let lmap = null;
let currentCircle = null;
let mapType = 'satellite';

// Forest marker colors
const RISK_COLORS = {
  critical: { fill: '#ff1744', stroke: '#ff5252', glow: 'rgba(255,23,68,0.3)' },
  high:     { fill: '#ff6d00', stroke: '#ff9100', glow: 'rgba(255,109,0,0.3)' },
  medium:   { fill: '#ffd740', stroke: '#ffea00', glow: 'rgba(255,215,64,0.3)' },
  low:      { fill: '#00e676', stroke: '#69f0ae', glow: 'rgba(0,230,118,0.3)' },
};

// Tile layer URLs
const TILE_LAYERS = {
  satellite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri'
  },
  terrain: {
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: 'OpenTopoMap'
  },
  roadmap: {
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
  }
};

let currentTileLayer = null;
const ALL_FOREST_MARKERS = [];

function initGoogleMap() {
  // Map is inside the modal div (#gmap) — initialize once
  if (lmap) return;

  lmap = L.map('gmap', {
    center: [39.0, 32.5],
    zoom: 6,
    zoomControl: true,
    attributionControl: true,
  });

  currentTileLayer = L.tileLayer(TILE_LAYERS.satellite.url, {
    attribution: TILE_LAYERS.satellite.attribution,
    maxZoom: 18,
  }).addTo(lmap);

  // Place all forest markers
  Object.values(FOREST_DATA).forEach(forest => {
    placeForestOverviewMarker(forest);
  });

  // Resize on window change
  window.addEventListener('resize', () => {
    if (lmap) lmap.invalidateSize(true);
  });
}

function placeForestOverviewMarker(forest) {
  const colors = RISK_COLORS[forest.stats.riskLevel] || RISK_COLORS.medium;

  const circleMarker = L.circleMarker([forest.coords.lat, forest.coords.lng], {
    radius: 14,
    fillColor: colors.fill,
    fillOpacity: 0.9,
    color: colors.stroke,
    weight: 2,
    className: 'forest-leaflet-marker',
  }).addTo(lmap);

  const popupContent = buildPopupHTML(forest);
  circleMarker.bindPopup(popupContent, {
    className: 'leaflet-dark-popup',
    maxWidth: 260,
  });

  circleMarker.on('click', () => {
    circleMarker.openPopup();
    selectForest(forest.id);
  });

  circleMarker.on('mouseover', () => {
    circleMarker.setStyle({ radius: 18, fillOpacity: 1, color: '#ffffff', weight: 2.5 });
    circleMarker.openPopup();
  });

  circleMarker.on('mouseout', () => {
    circleMarker.setStyle({ radius: 14, fillOpacity: 0.9, color: colors.stroke, weight: 2 });
    if (window.selectedForest !== forest.id) circleMarker.closePopup();
  });

  ALL_FOREST_MARKERS.push({ marker: circleMarker, forestId: forest.id });
}

function buildPopupHTML(forest) {
  return `
    <div style="font-family:'Outfit',sans-serif; background:#161c2a; color:#e2e8f0; border-radius:6px; padding:12px; min-width:190px;">
      <div style="font-size:0.88rem; font-weight:700; margin-bottom:2px;">${forest.name}</div>
      <div style="color:#475569; font-size:0.65rem; margin-bottom:10px;">${forest.region}</div>
      <div style="display:flex; flex-direction:column; gap:5px;">
        <div style="display:flex; justify-content:space-between; font-size:0.73rem;">
          <span style="color:#94a3b8;">Etkilenen Tür</span>
          <span style="color:#fb923c; font-family:'Space Mono',monospace;">${forest.stats.affectedSpecies}</span>
        </div>
        <div style="display:flex; justify-content:space-between; font-size:0.73rem;">
          <span style="color:#94a3b8;">Tehlike Altında</span>
          <span style="color:#f87171; font-family:'Space Mono',monospace;">${forest.stats.endangeredSpecies}</span>
        </div>
        <div style="display:flex; justify-content:space-between; font-size:0.73rem;">
          <span style="color:#94a3b8;">NDVI</span>
          <span style="color:#4ade80; font-family:'Space Mono',monospace;">${forest.stats.ndvi}</span>
        </div>
        <div style="display:flex; justify-content:space-between; font-size:0.73rem;">
          <span style="color:#94a3b8;">Yangın Zararı</span>
          <span style="color:#facc15; font-family:'Space Mono',monospace;">${forest.stats.fireDamageHa.toLocaleString('tr')} ha</span>
        </div>
      </div>
    </div>
  `;
}

// Focus map on selected forest
function focusMapOnForest(forestId) {
  if (!lmap) return;
  const forest = FOREST_DATA[forestId];
  if (!forest) return;

  if (currentCircle) { lmap.removeLayer(currentCircle); currentCircle = null; }

  lmap.flyTo([forest.coords.lat, forest.coords.lng], forest.zoom + 1, { animate: true, duration: 1.2 });

  const colors = RISK_COLORS[forest.stats.riskLevel] || RISK_COLORS.medium;
  const radiusM = Math.sqrt(forest.stats.totalAreaHa * 10000 / Math.PI) * 0.6;
  currentCircle = L.circle([forest.coords.lat, forest.coords.lng], {
    radius: radiusM,
    color: colors.stroke,
    weight: 2,
    opacity: 0.7,
    fillColor: colors.fill,
    fillOpacity: 0.12,
  }).addTo(lmap);

  const found = ALL_FOREST_MARKERS.find(m => m.forestId === forestId);
  if (found) {
    setTimeout(() => { found.marker.openPopup(); }, 600);
  }

  setMapType('satellite');
}

function resetMapView() {
  if (!lmap) return;
  if (currentCircle) { lmap.removeLayer(currentCircle); currentCircle = null; }
  lmap.flyTo([39.0, 32.5], 6, { animate: true, duration: 1.0 });
  const labelEl = document.getElementById('modal-label-text');
  if (labelEl) labelEl.textContent = 'Türkiye Orman Haritası';
}

function setMapType(type) {
  if (!lmap) return;
  mapType = type;
  const layer = TILE_LAYERS[type] || TILE_LAYERS.satellite;

  if (currentTileLayer) { lmap.removeLayer(currentTileLayer); }
  currentTileLayer = L.tileLayer(layer.url, {
    attribution: layer.attribution,
    maxZoom: 18,
  }).addTo(lmap);

  currentTileLayer.bringToBack();
  updateLayerButtons(type);
}

function updateLayerButtons(type) {
  document.querySelectorAll('.layer-btn').forEach(btn => btn.classList.remove('active'));
  const id = { satellite: 'mlb-satellite', terrain: 'mlb-terrain', roadmap: 'mlb-roadmap' }[type];
  if (id) document.getElementById(id)?.classList.add('active');
}
