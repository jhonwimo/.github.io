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

