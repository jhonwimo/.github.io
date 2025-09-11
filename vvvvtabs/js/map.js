  var map = L.map('map').setView([3.4752819, -76.489579], 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  var markers = L.markerClusterGroup({ maxClusterRadius: 20 });
  map.addLayer(markers);

  // Iconos personalizados
  var iconOnline = L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/128/9101/9101314.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });

  var iconOffline = L.icon({
     iconUrl: 'https://cdn-icons-png.flaticon.com/128/2536/2536650.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });

  // Función para cargar sensores
  async function cargarSensores() {
    markers.clearLayers();

    const mapSensores = [
      { "contrato": "C101", "apartamento": "Apto 101", "kwcarga": "134", "latitud": "3.4752819", "logitud": "-76.489579", "online": true },
      { "contrato": "C102", "apartamento": "Apto 102", "kwcarga": "87", "latitud": "3.4752819", "logitud": "-76.489579", "online": false },
      { "contrato": "C201", "apartamento": "Apto 201", "kwcarga": "155", "latitud": "3.4768000", "logitud": "-76.490200", "online": true },
      { "contrato": "C202", "apartamento": "Apto 202", "kwcarga": "69", "latitud": "3.4768000", "logitud": "-76.490200", "online": false },
      { "contrato": "C301", "apartamento": "Apto 301", "kwcarga": "121", "latitud": "3.4775000", "logitud": "-76.488700", "online": true },
      { "contrato": "C302", "apartamento": "Apto 302", "kwcarga": "77", "latitud": "3.4775000", "logitud": "-76.488700", "online": false },
      { "contrato": "C401", "apartamento": "Apto 401", "kwcarga": "162", "latitud": "3.4745000", "logitud": "-76.490800", "online": true },
      { "contrato": "C402", "apartamento": "Apto 402", "kwcarga": "91", "latitud": "3.4745000", "logitud": "-76.490800", "online": false }
    ];

    mapSensores.forEach(function(item) {
      if (item.latitud && item.latitud !== "N/A" && item.logitud !== "N/A") {
        const latitud = parseFloat(item.latitud);
        const longitud = parseFloat(item.logitud);
        const geocode = [latitud, longitud];

        const popUp = item.online
          ? `<b>Contrato:</b> ${item.contrato}<br/><b>Apartamento:</b> ${item.apartamento}<br/><b>Saldo:</b> ${item.kwcarga}`
          : `<b>Contrato:</b> ${item.contrato}<br/><b>Apartamento:</b> ${item.apartamento}<br/><span style="color:red">Fuera de línea</span>`;

        var marker = L.marker(geocode, { icon: item.online ? iconOnline : iconOffline });
        marker.bindPopup(popUp);
        markers.addLayer(marker);
      }
    });

    if (markers.getLayers().length > 0) {
      map.fitBounds(markers.getBounds());
    }
  }

  // Ejecutar al hacer click
  document.getElementById('buscarBtn').onclick = cargarSensores;

  // Ejecutar automáticamente al cargar la página
  window.onload = cargarSensores;