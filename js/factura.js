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

  // Inicializar
  actualizar();