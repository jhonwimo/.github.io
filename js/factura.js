function actualizar() {
    let carga = parseFloat(document.getElementById('inputCarga').value);
    let consumo = parseFloat(document.getElementById('inputConsumo').value);

    let saldo = carga - consumo;
    if (saldo < 0) saldo = 0;

    // Actualizar tabla
    document.getElementById('consumo').textContent = consumo.toFixed(2);
    document.getElementById('carga').textContent = carga.toFixed(2);
    document.getElementById('saldoConsumo').textContent = consumo.toFixed(2);
    document.getElementById('saldoEnergia').textContent = saldo.toFixed(2);

    // Calcular porcentaje batería
    let porcentaje = (saldo / carga) * 100;
    if (isNaN(porcentaje)) porcentaje = 0;

    let battery = document.getElementById('batteryLevel');
    battery.style.width = porcentaje + "%";

    if (porcentaje > 60) {
      battery.style.background = "limegreen";
    } else if (porcentaje > 30) {
      battery.style.background = "gold";
    } else {
      battery.style.background = "red";
    }
  }
  
 function cargaDataFactura() {
  const params = new URLSearchParams(window.location.search);
  const dataBase64 = params.get("data");

  if (dataBase64) {
    try {
      const decoded = atob(dataBase64);
      const datos = new URLSearchParams(decoded);

      document.getElementById("contrato").value = datos.get("contrato");

      // JSON que viene dentro de los parámetros
      const dataFacturaStr = datos.get("DataFactura");
      let jsonData = null;
      if (dataFacturaStr) {
        try {
          jsonData = JSON.parse(dataFacturaStr);
        } catch (err) {
          console.error("JSON mal formado:", err);
        }
      }

      // Tablas de valores
      //document.getElementById("contratoTexto").textContent   = datos.get("contrato")        || "N/A";
      document.getElementById("consumoTotalOld").textContent = jsonData.consumoTotalOld || "0";
      document.getElementById("carga").textContent           = jsonData.carga         || "0";
      document.getElementById("consumoTotalNew").textContent = jsonData.consumoTotalNew || "0";
      document.getElementById("saldoEnergia").textContent    = jsonData.saldo           || "0";

    } catch(e) { 
      console.log("Error al decodificar:", e); 
    }
  }
}
