// =========================================
//  EARTHWATCH CUBESAT — ORMAN VERİ SETİ
// =========================================

const FOREST_DATA = {

  kastamonu: {
    id: 'kastamonu',
    name: 'Kastamonu Ormanları',
    region: 'Karadeniz Bölgesi',
    emoji: '🏔️',

    // Google Maps
    coords: { lat: 41.3887, lng: 33.7827 },
    zoom: 10,

    // Summary stats
    stats: {
      affectedSpecies:   312,
      endangeredSpecies: 48,
      ndvi:              '0.71',
      fireDamageHa:      18400,
      totalAreaHa:       562000,
      firePct:           3.3,
      droughtIndex:      42,
      lastUpdated:       'Mart 2026',
      riskLevel:         'high',
    },

    // Affected animal species
    animals: [
      { icon:'🦌', name:'Kızıl Geyik',        sci:'Cervus elaphus',       status:'vu',  statusLabel:'Hassas' },
      { icon:'🦅', name:'Kara Akbaba',         sci:'Aegypius monachus',    status:'en',  statusLabel:'Tehlikede' },
      { icon:'🐺', name:'Kurt',                sci:'Canis lupus',          status:'vu',  statusLabel:'Hassas' },
      { icon:'🦦', name:'Su Samuru',           sci:'Lutra lutra',          status:'en',  statusLabel:'Tehlikede' },
      { icon:'🦉', name:'Büyük Orman Baykuşu', sci:'Strix uralensis',      status:'nt',  statusLabel:'Endişe Verici' },
      { icon:'🐿️', name:'Yaban Domuzu',        sci:'Sus scrofa',           status:'nt',  statusLabel:'Endişe Verici' },
      { icon:'🦊', name:'Tilki',               sci:'Vulpes vulpes',        status:'nt',  statusLabel:'Endişe Verici' },
      { icon:'🦋', name:'Girit Endemik Kelebek', sci:'Parnassius apollo',  status:'cr',  statusLabel:'Kritik Tehlike' },
    ],

    // Chart data (monthly fire incidents)
    chartData: {
      labels: ['Oca','Şub','Mar','Nis','May','Haz','Tem','Ağu','Eyl','Eki','Kas','Ara'],
      fire:   [2, 1, 3, 2, 5, 18, 42, 56, 28, 8, 3, 1],
      ndvi:   [0.65, 0.62, 0.66, 0.70, 0.74, 0.73, 0.69, 0.63, 0.67, 0.71, 0.70, 0.68],
    },
  },

  antalya: {
    id: 'antalya',
    name: 'Antalya Ormanları',
    region: 'Akdeniz Bölgesi',
    emoji: '🌊',

    coords: { lat: 36.8969, lng: 30.7133 },
    zoom: 10,

    stats: {
      affectedSpecies:   578,
      endangeredSpecies: 112,
      ndvi:              '0.43',
      fireDamageHa:      96000,
      totalAreaHa:       1200000,
      firePct:           8.0,
      droughtIndex:      71,
      lastUpdated:       'Mart 2026',
      riskLevel:         'critical',
    },

    animals: [
      { icon:'🐆', name:'Vaşak',              sci:'Lynx lynx',              status:'cr',  statusLabel:'Kritik Tehlike' },
      { icon:'🦅', name:'Şahin',              sci:'Falco peregrinus',        status:'en',  statusLabel:'Tehlikede' },
      { icon:'🐢', name:'Akdeniz Kaplumbağası', sci:'Testudo graeca',        status:'cr',  statusLabel:'Kritik Tehlike' },
      { icon:'🦎', name:'Kertenkeleler',       sci:'Lacerta sp.',            status:'en',  statusLabel:'Tehlikede' },
      { icon:'🐍', name:'Endemik Yılan',       sci:'Montivipera xanthina',   status:'cr',  statusLabel:'Kritik Tehlike' },
      { icon:'🦇', name:'Türk Yarasa',         sci:'Rhinolophus blasii',      status:'en',  statusLabel:'Tehlikede' },
      { icon:'🦅', name:'Büyük Kartal',        sci:'Aquila chrysaetos',       status:'vu',  statusLabel:'Hassas' },
      { icon:'🦌', name:'Karaca',              sci:'Capreolus capreolus',     status:'vu',  statusLabel:'Hassas' },
    ],

    chartData: {
      labels: ['Oca','Şub','Mar','Nis','May','Haz','Tem','Ağu','Eyl','Eki','Kas','Ara'],
      fire:   [5, 3, 8, 12, 24, 67, 142, 198, 89, 23, 7, 2],
      ndvi:   [0.52, 0.50, 0.53, 0.57, 0.55, 0.47, 0.38, 0.35, 0.40, 0.45, 0.48, 0.51],
    },
  },

  mugla: {
    id: 'mugla',
    name: 'Muğla Ormanları',
    region: 'Ege Bölgesi',
    emoji: '🌴',

    coords: { lat: 37.2154, lng: 28.3636 },
    zoom: 10,

    stats: {
      affectedSpecies:   423,
      endangeredSpecies: 87,
      ndvi:              '0.38',
      fireDamageHa:      74500,
      totalAreaHa:       870000,
      firePct:           8.6,
      droughtIndex:      76,
      lastUpdated:       'Mart 2026',
      riskLevel:         'critical',
    },

    animals: [
      { icon:'🐺', name:'Kurt',               sci:'Canis lupus',            status:'vu',  statusLabel:'Hassas' },
      { icon:'🦋', name:'Akdeniz Kelebeği',   sci:'Papilio alexanor',       status:'en',  statusLabel:'Tehlikede' },
      { icon:'🐢', name:'Deniz Kaplumbağası', sci:'Caretta caretta',         status:'cr',  statusLabel:'Kritik Tehlike' },
      { icon:'🐆', name:'Vaşak',              sci:'Lynx lynx',               status:'cr',  statusLabel:'Kritik Tehlike' },
      { icon:'🦅', name:'Mavi Şahin',         sci:'Elanus caeruleus',        status:'en',  statusLabel:'Tehlikede' },
      { icon:'🦎', name:'Yeşil Kertenkele',   sci:'Lacerta viridis',         status:'vu',  statusLabel:'Hassas' },
      { icon:'🐓', name:'Kınalı Keklik',      sci:'Alectoris chukar',        status:'nt',  statusLabel:'Endişe Verici' },
      { icon:'🦌', name:'Karaca',             sci:'Capreolus capreolus',     status:'vu',  statusLabel:'Hassas' },
    ],

    chartData: {
      labels: ['Oca','Şub','Mar','Nis','May','Haz','Tem','Ağu','Eyl','Eki','Kas','Ara'],
      fire:   [4, 2, 6, 10, 22, 58, 124, 168, 72, 18, 5, 1],
      ndvi:   [0.48, 0.46, 0.49, 0.53, 0.51, 0.43, 0.35, 0.31, 0.37, 0.42, 0.45, 0.47],
    },
  },

  bolu: {
    id: 'bolu',
    name: 'Bolu Ormanları',
    region: 'Batı Karadeniz',
    emoji: '🌲',

    coords: { lat: 40.7340, lng: 31.6077 },
    zoom: 10,

    stats: {
      affectedSpecies:   189,
      endangeredSpecies: 31,
      ndvi:              '0.82',
      fireDamageHa:      5200,
      totalAreaHa:       430000,
      firePct:           1.2,
      droughtIndex:      22,
      lastUpdated:       'Mart 2026',
      riskLevel:         'medium',
    },

    animals: [
      { icon:'🐻', name:'Boz Ayı',            sci:'Ursus arctos',           status:'vu',  statusLabel:'Hassas' },
      { icon:'🦌', name:'Kızıl Geyik',        sci:'Cervus elaphus',         status:'nt',  statusLabel:'Endişe Verici' },
      { icon:'🦉', name:'Uzun Kulaklı Baykuş', sci:'Asio otus',             status:'nt',  statusLabel:'Endişe Verici' },
      { icon:'🐗', name:'Yaban Domuzu',        sci:'Sus scrofa',             status:'nt',  statusLabel:'Endişe Verici' },
      { icon:'🦊', name:'Tilki',               sci:'Vulpes vulpes',          status:'nt',  statusLabel:'Endişe Verici' },
      { icon:'🦅', name:'Kaya Kartalı',        sci:'Aquila chrysaetos',      status:'vu',  statusLabel:'Hassas' },
      { icon:'🦦', name:'Su Samuru',           sci:'Lutra lutra',            status:'en',  statusLabel:'Tehlikede' },
      { icon:'🐿️', name:'Sincap',              sci:'Sciurus vulgaris',       status:'nt',  statusLabel:'Endişe Verici' },
    ],

    chartData: {
      labels: ['Oca','Şub','Mar','Nis','May','Haz','Tem','Ağu','Eyl','Eki','Kas','Ara'],
      fire:   [1, 0, 1, 2, 3, 8, 18, 22, 10, 4, 1, 0],
      ndvi:   [0.78, 0.75, 0.79, 0.83, 0.87, 0.86, 0.84, 0.80, 0.83, 0.84, 0.82, 0.80],
    },
  },

  canakkale: {
    id: 'canakkale',
    name: 'Çanakkale Ormanları',
    region: 'Marmara Bölgesi',
    emoji: '🏛️',

    coords: { lat: 40.1553, lng: 26.4142 },
    zoom: 10,

    stats: {
      affectedSpecies:   241,
      endangeredSpecies: 44,
      ndvi:              '0.56',
      fireDamageHa:      12800,
      totalAreaHa:       290000,
      firePct:           4.4,
      droughtIndex:      54,
      lastUpdated:       'Mart 2026',
      riskLevel:         'medium',
    },

    animals: [
      { icon:'🦅', name:'Şahin',              sci:'Falco peregrinus',        status:'en',  statusLabel:'Tehlikede' },
      { icon:'🐢', name:'Hermann Kaplumbağası', sci:'Testudo hermanni',      status:'vu',  statusLabel:'Hassas' },
      { icon:'🦌', name:'Karaca',              sci:'Capreolus capreolus',    status:'nt',  statusLabel:'Endişe Verici' },
      { icon:'🦊', name:'Tilki',               sci:'Vulpes vulpes',          status:'nt',  statusLabel:'Endişe Verici' },
      { icon:'🐺', name:'Kurt',                sci:'Canis lupus',            status:'vu',  statusLabel:'Hassas' },
      { icon:'🦉', name:'Peçeli Baykuş',       sci:'Tyto alba',              status:'nt',  statusLabel:'Endişe Verici' },
      { icon:'🐍', name:'Yılan Kartalı',       sci:'Circaetus gallicus',     status:'en',  statusLabel:'Tehlikede' },
      { icon:'🐝', name:'Yabani Arı Türleri',  sci:'Apis mellifera carnica', status:'vu',  statusLabel:'Hassas' },
    ],

    chartData: {
      labels: ['Oca','Şub','Mar','Nis','May','Haz','Tem','Ağu','Eyl','Eki','Kas','Ara'],
      fire:   [2, 1, 3, 5, 10, 28, 58, 72, 34, 10, 3, 1],
      ndvi:   [0.60, 0.58, 0.61, 0.65, 0.67, 0.62, 0.55, 0.50, 0.54, 0.58, 0.60, 0.60],
    },
  },

};

// Firebase üzerinden 8x8 NDVI ve Sıcaklık Matrislerinin, LST-NDVI verilerinin Çekilmesi
async function fetchFirebaseData() {
  try {
    const res = await fetch('https://asfl-94711-default-rtdb.europe-west1.firebasedatabase.app/forests.json', {
      cache: 'no-store'
    });
    if (!res.ok) return false;
    
    const dbData = await res.json();
    
    // Her bir objeyi gez ve FOREST_DATA içerisine gerçek zamanlı veriyi aktar
    Object.keys(FOREST_DATA).forEach(localKey => {
      // Firebase'deki JSON key'lerini ayarla (Çanakkale, Muğla vb. uyumluluğu için)
      let fbKey = localKey.charAt(0).toUpperCase() + localKey.slice(1);
      if (localKey === 'canakkale') fbKey = 'Çanakkale';
      if (localKey === 'mugla') fbKey = 'Muğla';
      
      const regionData = dbData[fbKey];
      if (regionData && regionData.latest) {
        const d = regionData.latest;
        
        let currentDestruction = 0;
        let totalDestruction = 0;

        // Geçmiş (history) okumaları ile tahribat analizi hesaplaması
        if (regionData.history) {
          // Firebase key'leri varsayılan olarak kronolojik sıradadır (-Oot... gibi)
          const hKeys = Object.keys(regionData.history).sort();
          
          if (hKeys.length >= 2) {
            const firstSnapshot = regionData.history[hKeys[0]];
            const prevSnapshot = regionData.history[hKeys[hKeys.length - 2]]; // Bir önceki fotoğraf
            const latestSnapshot = regionData.history[hKeys[hKeys.length - 1]]; // En güncel fotoğraf

            // Düşüş varsa tahribat vardır (Skor artar). Yoksa 0'dır (İyi durum).
            currentDestruction = Math.max(0, prevSnapshot.ndvi_avg - latestSnapshot.ndvi_avg);
            totalDestruction = Math.max(0, firstSnapshot.ndvi_avg - latestSnapshot.ndvi_avg);
          }
        }

        // Sensör verilerini ve yepyeni analiz skorlarını sakla
        FOREST_DATA[localKey].sensors = {
          healthFlag: d.health_flag,
          lstAvg: d.lst_avg,
          ndviAvg: d.ndvi_avg,
          ndviMatrix: d.ndvi_matrix_8x8,
          thermalMatrix: d.thermal_matrix_8x8,
          timestamp: d.timestamp,
          scenario: d.scenario_label,
          currentDestruction: currentDestruction.toFixed(2),
          totalDestruction: totalDestruction.toFixed(2)
        };

        // Panelde gösterimi hızlı güncellemek için
        FOREST_DATA[localKey].stats.ndvi = (d.ndvi_avg / 100).toFixed(2); 
        
        if (d.health_flag === 'FIRE' || currentDestruction > 5) {
          FOREST_DATA[localKey].stats.riskLevel = 'critical';
        } else if (currentDestruction > 0) {
          FOREST_DATA[localKey].stats.riskLevel = 'high';
        } else {
          FOREST_DATA[localKey].stats.riskLevel = 'low';
        }
      }
    });
    
    return true;
  } catch (err) {
    console.error('Firebase verisi çekilemedi:', err);
    return false;
  }
}
