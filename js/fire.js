// =========================================
//  FIRE SPREAD MODULE (MODULE 3)
// =========================================

let fireLmap = null;
let fireSelectedForest = null;
let firePolygon = null;
let fireMarker = null;

const WEATHER_API_KEY = '5d1a90ce40fa495698a115220262903';

function initFireMap() {
  const mapEl = document.getElementById('fire-gmap');
  if (!mapEl) return;

  if (fireLmap) {
    // Already initialized, just resize
    setTimeout(() => fireLmap.invalidateSize(true), 80);
    return;
  }

  // Initialize fire spread map
  fireLmap = L.map('fire-gmap', {
    zoomControl: true,
    attributionControl: false
  }).setView([39.0, 35.0], 6);

  // Satellite layer default
  L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 18,
  }).addTo(fireLmap);
}

async function selectFireForest(forestId) {
  if (fireSelectedForest === forestId) return;
  fireSelectedForest = forestId;

  // UI Selection
  document.querySelectorAll('#fire-forest-panel .forest-card').forEach(card => {
    card.classList.remove('selected');
    card.setAttribute('aria-selected', 'false');
  });
  const card = document.getElementById('ffc-' + forestId);
  if (card) {
    card.classList.add('selected');
    card.setAttribute('aria-selected', 'true');
  }

  const forest = FOREST_DATA[forestId];
  if (!forest) return;

  // Clear previous fire layers if map ready
  if (fireLmap) {
    if (fireMarker) fireLmap.removeLayer(fireMarker);
    if (firePolygon) fireLmap.removeLayer(firePolygon);
  }

  // Show placeholder while loading
  document.getElementById('fire-stats-placeholder').style.display = 'none';
  const content = document.getElementById('fire-stats-content');
  content.classList.remove('hidden');
  content.innerHTML = `<div style="text-align:center; padding: 40px; color:#00e5ff;">Meteorolojik veriler alınıyor...<br/><br/><div class="loading-bar" style="margin-top: 10px;"><div class="loading-fill"></div></div></div>`;

  try {
    const res = await fetch(`https://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${forest.coords.lat},${forest.coords.lng}&lang=tr`);
    const data = await res.json();

    if (data.current) {
      renderFireStats(forest, data);
      drawFireSpread(forest, data);
    } else {
      content.innerHTML = `<div style="color:#ff1744; padding:20px;">Hava durumu verisi alınamadı: ${data.error ? data.error.message : 'Bilinmeyen hata'}</div>`;
    }
  } catch (err) {
    content.innerHTML = `<div style="color:#ff1744; padding:20px;">API Bağlantı Hatası: ${err.message}</div>`;
  }
}

function renderFireStats(forest, data) {
  const content = document.getElementById('fire-stats-content');
  
  const temp = data.current.temp_c;
  const humidity = data.current.humidity;
  const windSpeed = data.current.wind_kph; // already in km/h
  const windDeg = data.current.wind_degree || 0;
  const desc = data.current.condition.text.toUpperCase();

  // calculate risk based on rule of thumb
  let riskScore = 0;
  if (temp > 30) riskScore += 2;
  else if (temp > 25) riskScore += 1;
  
  if (humidity < 30) riskScore += 2;
  else if (humidity < 50) riskScore += 1;

  if (windSpeed > 20) riskScore += 2;
  else if (windSpeed > 10) riskScore += 1;

  let riskText, riskColor;
  if (riskScore >= 5) { riskText = 'KRİTİK YANGIN RİSKİ'; riskColor = '#ff1744'; }
  else if (riskScore >= 3) { riskText = 'YÜKSEK RİSK'; riskColor = '#ff6d00'; }
  else { riskText = 'ORTA RİSK'; riskColor = '#00e676'; }

  // Wind direction
  const directions = ['Kuzey', 'Kuzeydoğu', 'Doğu', 'Güneydoğu', 'Güney', 'Güneybatı', 'Batı', 'Kuzeybatı'];
  const dirIndex = Math.round(windDeg / 45) % 8;
  const windDirText = directions[dirIndex];

  let html = `
    <div style="padding-bottom: 20px; border-bottom: 1px solid rgba(255,255,255,0.1); margin-bottom:20px;">
      <h3 style="color:#fff; font-size:1.4rem; margin-bottom:4px;">${forest.name}</h3>
      <div style="color:#8fafc8; font-size:0.9rem;">${desc} - Hava Verisi: WeatherAPI</div>
      <div style="display:inline-block; margin-top:12px; padding:6px 12px; background:rgba(0,0,0,0.3); border:1px solid ${riskColor}; color:${riskColor}; border-radius:4px; font-weight:bold; font-size:0.85rem;">
        ${riskText}
      </div>
    </div>

    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:16px; margin-bottom: 24px;">
      <div style="background:rgba(255,255,255,0.03); padding:16px; border-radius:8px;">
        <div style="color:#8fafc8; font-size:0.8rem; margin-bottom:8px;">SICAKLIK</div>
        <div style="font-size:1.8rem; color:#ff9800; font-weight:600;">${temp.toFixed(1)}°C</div>
      </div>
      <div style="background:rgba(255,255,255,0.03); padding:16px; border-radius:8px;">
        <div style="color:#8fafc8; font-size:0.8rem; margin-bottom:8px;">NEM</div>
        <div style="font-size:1.8rem; color:#00e5ff; font-weight:600;">%${humidity}</div>
      </div>
      <div style="background:rgba(255,255,255,0.03); padding:16px; border-radius:8px; grid-column: span 2;">
        <div style="color:#8fafc8; font-size:0.8rem; margin-bottom:8px;">RÜZGAR HIZI VE YÖNÜ</div>
        <div style="display:flex; align-items:center; gap:12px;">
          <div style="font-size:1.8rem; color:#fff; font-weight:600;">${windSpeed.toFixed(1)} <span style="font-size:1rem; color:#8fafc8;">km/s</span></div>
          <div style="color:#fff; font-size:1.1rem;">- ${windDirText} (${windDeg}°)</div>
          <div style="margin-left:auto; transform:rotate(${windDeg}deg); font-size:1.5rem; color:#ff6d00;">↓</div>
        </div>
      </div>
    </div>

    <div style="padding:16px; background:rgba(255,23,68,0.1); border-left:3px solid #ff1744; border-radius:4px;">
      <h4 style="color:#ff1744; margin:0 0 8px 0; font-size:0.95rem;">2 Saatlik Yayılım Tahmini</h4>
      <p style="color:#e0e0e0; font-size:0.9rem; margin:0; line-height:1.5;">
        Mevcut rüzgar(${windDirText} yönünden) sebebiyle, olası bir yangın 
        <strong>${(windDeg + 180) % 360}°</strong> yönüne doğru yaklaşık 
        <strong>${Math.max(1, (windSpeed * 0.15)).toFixed(1)} km</strong> ilerleyebilir. Haritadaki kırmızı bölge tahmini yayılım alanını temsil eder.
      </p>
    </div>
  `;
  content.innerHTML = html;
}

function drawFireSpread(forest, data) {
  const centerLat = forest.coords.lat;
  const centerLng = forest.coords.lng;
  const windSpeed = data.current.wind_kph;
  const windDeg = data.current.wind_degree || 0;

  // Init map if needed (modal may have just been opened)
  if (!fireLmap) initFireMap();
  if (fireLmap) fireLmap.setView([centerLat, centerLng], 11);

  // Add marker at center
  const fireIcon = L.divIcon({
    html: '<div style="font-size:24px; animation: pulse 1s infinite alternate; filter: drop-shadow(0 0 10px rgba(255,60,0,0.8));">🔥</div>',
    className: '',
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });

  fireMarker = L.marker([centerLat, centerLng], { icon: fireIcon }).addTo(fireLmap);

  // Use LayerGroup for concentric polygons
  firePolygon = L.layerGroup().addTo(fireLmap);

  // Maximum spread distance
  const distanceKm = Math.max(1.5, windSpeed * 0.2); 
  const spreadDir = (windDeg + 180) % 360; // Wind blows TO
  const spreadRad = spreadDir * (Math.PI / 180);
  
  // Angle of cone
  const coneAngle = 35; // degrees total width
  const angleRad = (coneAngle / 2) * (Math.PI / 180);

  // Earth radius
  const R = 6371; 
  const pt1 = [centerLat, centerLng];
  let maxBounds = null;
  const steps = 4;

  for (let i = steps; i >= 1; i--) {
    let dKm = distanceKm * (i / steps);
    let op = 0.8 - ((i - 1) * 0.18); // 0.8, 0.62, 0.44, 0.26

    let lat2 = Math.asin(Math.sin(centerLat * Math.PI/180) * Math.cos(dKm/R) + 
                Math.cos(centerLat * Math.PI/180) * Math.sin(dKm/R) * Math.cos(spreadRad - angleRad)) * 180/Math.PI;
    let lng2 = centerLng + Math.atan2(Math.sin(spreadRad - angleRad) * Math.sin(dKm/R) * Math.cos(centerLat * Math.PI/180), 
                 Math.cos(dKm/R) - Math.sin(centerLat * Math.PI/180) * Math.sin(lat2 * Math.PI/180)) * 180/Math.PI;

    let lat3 = Math.asin(Math.sin(centerLat * Math.PI/180) * Math.cos(dKm/R) + 
                Math.cos(centerLat * Math.PI/180) * Math.sin(dKm/R) * Math.cos(spreadRad + angleRad)) * 180/Math.PI;
    let lng3 = centerLng + Math.atan2(Math.sin(spreadRad + angleRad) * Math.sin(dKm/R) * Math.cos(centerLat * Math.PI/180), 
                 Math.cos(dKm/R) - Math.sin(centerLat * Math.PI/180) * Math.sin(lat3 * Math.PI/180)) * 180/Math.PI;

    let lat4 = Math.asin(Math.sin(centerLat * Math.PI/180) * Math.cos((dKm + dKm*0.1)/R) + 
                Math.cos(centerLat * Math.PI/180) * Math.sin((dKm + dKm*0.1)/R) * Math.cos(spreadRad)) * 180/Math.PI;
    let lng4 = centerLng + Math.atan2(Math.sin(spreadRad) * Math.sin((dKm + dKm*0.1)/R) * Math.cos(centerLat * Math.PI/180), 
                 Math.cos((dKm + dKm*0.1)/R) - Math.sin(centerLat * Math.PI/180) * Math.sin(lat4 * Math.PI/180)) * 180/Math.PI;

    let poly = L.polygon([pt1, [lat2, lng2], [lat4, lng4], [lat3, lng3]], {
      color: i === steps ? '#ff1744' : 'transparent',
      fillColor: '#ff1744',
      fillOpacity: op,
      weight: i === steps ? 2 : 0,
      dashArray: i === steps ? '5, 5' : ''
    });

    firePolygon.addLayer(poly);
    if (i === steps) maxBounds = poly.getBounds();
  }

  // Fit bounds to polygon
  setTimeout(() => {
    if (maxBounds) fireLmap.fitBounds(maxBounds, { padding: [50, 50], maxZoom: 13 });
  }, 100);
}
