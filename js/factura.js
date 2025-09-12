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

      const consumoTotalOld = datos.get("consumoTotalOld");
      const carga           = datos.get("carga");
      const consumoTotalNew = datos.get("consumoTotalNew");
      const saldo           = datos.get("saldo");
	  
	  

      // Texto en el bloque de contrato
      document.getElementById("contratoTexto").textContent   = datos.get("contrato")   || "N/A";
      document.getElementById("nombreTexto").textContent     = datos.get("usuario")    || "N/A";
      document.getElementById("direccionTexto").textContent  = datos.get("direccion")  || "N/A";
      document.getElementById("apartamentoTexto").textContent= datos.get("apartamento")|| "N/A";

      // Tablas de valores
      document.getElementById("consumo").textContent      = datos.get("consumoTotalOld") || "0";
      document.getElementById("carga").textContent        = datos.get("carga")           || "0";
      document.getElementById("saldoConsumo").textContent = datos.get("consumoTotalNew") || "0";
      document.getElementById("saldoEnergia").textContent = datos.get("saldo")           || "0";
	  
	  // Obtener fecha y hora actual
  const ahora = new Date();
  
  // Formato YYYY-MM-DD HH:mm
  const fechaFormateada = ahora.getFullYear() + "-" +
    String(ahora.getMonth() + 1).padStart(2, "0") + "-" +
    String(ahora.getDate()).padStart(2, "0") + " " +
    String(ahora.getHours()).padStart(2, "0") + ":" +
    String(ahora.getMinutes()).padStart(2, "0");

  // Setear en el <span>
  document.getElementById("fecha").textContent = fechaFormateada;

    } catch (e) {
      console.error("Error al decodificar:", e);
    }
  }
});

  
  


  
