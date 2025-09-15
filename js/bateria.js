const fills = [
  document.getElementById("fill1"),
  document.getElementById("fill2"),
  document.getElementById("fill3"),
  document.getElementById("fill4"),
  document.getElementById("fill5"),
  document.getElementById("fill6"),
];

let level = 1; // Nivel inicial

/**
 * Función para iniciar animación de batería con límite máximo
 * @param {number} maxLevel - Hasta qué celda llenar antes de reiniciar (1-6)
 */
function startBattery(maxLevel) {
  const interval = setInterval(() => {
    // Resetear celdas
    fills.forEach(f => {
      f.style.height = "0";
      f.className = "fill";
    });

    // Llenar hasta el nivel actual
    fills.forEach((f, i) => {
      if (i < level) {
        if (level <= 2) f.classList.add("red");
        else if (level <= 4) f.classList.add("yellow");
        else f.classList.add("green");
        f.style.height = "100%";
      }
    });

    console.log("Nivel actual:", level);

    // Verificar si llegó al nivel máximo
    if (level === maxLevel) {
      level = 0; // Reiniciar
      console.log("¡Se alcanzó el nivel máximo y se reinicia!");
    }

    level++;
  }, 1000);
}


 window.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const dataBase64 = params.get("data");
  if (dataBase64) {
    try {
      const decoded = atob(dataBase64);
      const datos = new URLSearchParams(decoded);
      const usuario = datos.get("usuario");
      document.getElementById("contrato").value = datos.get("contrato");
      document.getElementById("usuario").value  = datos.get("usuario");
	  
	  const dataFacturaStr = datos.get("DataFactura");
      let jsonData = null;
      if (dataFacturaStr) {
        try {
          jsonData = JSON.parse(dataFacturaStr);
        } catch (err) {
          console.error("JSON mal formado:", err);
        }
      }

      // const consumoTotalOld= datos.get("consumoTotalOld");
      // const carga= datos.get("carga");
      // const consumoTotalNew= datos.get("consumoTotalNew");
      // const saldo= datos.get("saldo");
      startBattery(Number(jsonData.celdaPila));

    } catch (e) {
      console.error("Error al decodificar:", e);
    }
  }
});

  

