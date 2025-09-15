// Variables globales
let map;      // Mapa Leaflet
let markers;  // Grupo de marcadores

// Iconos personalizados
const iconOnline = L.icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/128/9101/9101314.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

const iconOffline = L.icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/128/2536/2536650.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

// Función para inicializar el mapa
function initMap() {
  if (!map) {
    map = L.map('map').setView([3.4752819, -76.489579], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    markers = L.markerClusterGroup({ maxClusterRadius: 20 });
    map.addLayer(markers);
  }

  cargarSensores();

  // 🔑 Recalcular tamaño del mapa cuando se muestra
  setTimeout(() => {
    map.invalidateSize();
  }, 200);
}

// Función para cargar sensores
async function cargarSensores() {
  const params = new URLSearchParams(window.location.search);
  const dataBase64 = params.get("data");
  let usuario;

  if (dataBase64) {
    try {
      const decoded = atob(dataBase64);
      const datos = new URLSearchParams(decoded);
      usuario = datos.get("usuario");
    } catch (e) {
      console.error("Error al decodificar.");
    }
  }

  markers.clearLayers();

  try {
    const res = await axios.post("https://api.wshome.shop/api/WsHome/sensores/listaSensoresMap", { usuario });
    console.log("Respuesta:", res.data);
    const mapSensores = res.data;

    // Si no vienen sensores, podrías meter un fallback
    if (!mapSensores || mapSensores.length === 0) {
      console.warn("No llegaron sensores, usando fallback...");
      return pintarSensores([
        { "contrato": "C101", "apartamento": "Apto 101", "kwcarga": "134", "latitud": "3.4752819", "logitud": "-76.489579", "online": true },
        { "contrato": "C102", "apartamento": "Apto 102", "kwcarga": "87", "latitud": "3.4752819", "logitud": "-76.489579", "online": false }
      ]);
    }

    pintarSensores(mapSensores);
  } catch (err) {
    console.error("Error:", err);
    alert("Error cargando sensores desde API. Se mostrarán datos de prueba.");
    pintarSensores([
      { "contrato": "C101", "apartamento": "Apto 101", "kwcarga": "134", "latitud": "3.4752819", "logitud": "-76.489579", "online": true },
      { "contrato": "C102", "apartamento": "Apto 102", "kwcarga": "87", "latitud": "3.4752819", "logitud": "-76.489579", "online": false }
    ]);
  }
}

// Función para pintar sensores en el mapa
function pintarSensores(mapSensores) {
  mapSensores.forEach(item => {
    if (item.latitud && item.latitud !== "N/A" && item.logitud !== "N/A") {
      const latitud = parseFloat(item.latitud);
      const longitud = parseFloat(item.logitud);
      const geocode = [latitud, longitud];

      const popUp = item.online
        ? `<b>Contrato:</b> ${item.contrato}<br/><b>Apartamento:</b> ${item.apartamento}<br/><b>Saldo:</b> ${item.kwcarga}`
        : `<b>Contrato:</b> ${item.contrato}<br/><b>Apartamento:</b> ${item.apartamento}<br/><span style="color:red">Fuera de línea</span>`;

      const marker = L.marker(geocode, { icon: item.online ? iconOnline : iconOffline });
      marker.bindPopup(popUp);
      markers.addLayer(marker);
    }
  });

  if (markers.getLayers().length > 0) {
    map.fitBounds(markers.getBounds());
  }
}

// Botón para recargar sensores manualmente
document.getElementById('buscarBtn').onclick = cargarSensores;

// Ejecutar mapa al cargar la página
window.onload = initMap;
