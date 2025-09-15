/*
  Medidor de agua con ola animada.
  - Nivel se controla con slider (0..1000 L).
  - El tanque visual está hecho en SVG.
  - La ola se genera como una sinusoide y se mueve horizontalmente.
*/

// CONFIGURACIÓN

const svgWidth = 200;
const svgHeight = 280;
const waterArea = { x:20, y:30, w:160, h:220 }; // caja del tanque (coordenadas en SVG)

  const params = new URLSearchParams(window.location.search);
  const dataBase64 = params.get("data");

  if (dataBase64) {
    try {
      const decoded = atob(dataBase64);
      const datos = new URLSearchParams(decoded);
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

      document.getElementById("saldoAgua").textContent      = jsonData.saldoAgua;
      document.getElementById("CargaAgua").textContent      = jsonData.cargaAgua;

    } catch(e) { 
      console.log("Error al decodificar:", e); 
    }
  }

// lo que queda
let CAPACITY_LITERS = Number(document.getElementById("CargaAgua").innerText);   // capacidad total del tanque (L)
let currentLiters   = Number(document.getElementById("saldoAgua").textContent);// lo que queda
const levelRange = document.getElementById("levelRange");
levelRange.max = document.getElementById("CargaAgua").innerText; // rango maximo = capacidad total del tanque
levelRange.value = document.getElementById("saldoAgua").textContent;  // ejemplo: dejarlo en // lo que queda

// referencias DOM
const range = document.getElementById('levelRange');
const percentText = document.getElementById('percentText');
const litersText = document.getElementById('litersText');
const pctBadge = document.getElementById('pctBadge');
const btnFill = document.getElementById('btnFill');
const btnEmpty = document.getElementById('btnEmpty');

const wave1 = document.getElementById('wave1');
const wave2 = document.getElementById('wave2');
const waveGroup = document.getElementById('waveGroup');

// animación de ola
let waveOffset = 0;
let animId = null;
//let currentLiters = Number(range.value);

// parámetros ola
const wave = {
  amplitude: 8,     // altura de la onda en px
  wavelength: 70,   // longitud de onda (px)
  speed: 0.8        // velocidad (px por frame aprox)
};

// función que genera el path de la onda para un determinado nivel (yOffset)
function generateWavePath(offsetX, yLevel, phaseShift=0, amp=wave.amplitude, wavelength=wave.wavelength){
  // generaremos una onda simple con suficientes puntos
  const points = [];
  const left = waterArea.x;
  const right = waterArea.x + waterArea.w;
  const step = 6; // precisión
  for (let x = left - wavelength; x <= right + wavelength; x += step) {
    const relativeX = x + offsetX + phaseShift;
    const y = yLevel + Math.sin((relativeX) * (2*Math.PI / wavelength)) * amp;
    points.push({x, y});
  }

  // Build path: start from left-bottom, then along wave to right, then close to bottom
  let d = `M ${left} ${waterArea.y + waterArea.h} `; // bottom-left
  // move up to first wave point (ensure we cover leftmost)
  d += `L ${points[0].x} ${points[0].y} `;
  for (let i = 1; i < points.length; i++){
    d += `L ${points[i].x} ${points[i].y} `;
  }
  d += `L ${right} ${waterArea.y + waterArea.h} Z`; // bottom-right and close
  return d;
}

// actualiza visores (texto)
function updateReadouts(liters){
  const pct = Math.max(0, Math.min(100, Math.round((liters / CAPACITY_LITERS) * 100)));
  percentText.textContent = `${pct}%`;
  pctBadge.textContent = `${pct}%`;
  litersText.textContent = `${Math.round(liters)} L`;
}

// actualiza posición vertical del agua en SVG (yLevel en coordenadas SVG)
function getYLevelForLiters(liters){
  // 0 L -> water at bottom; CAPACITY_LITERS -> water at top (y = waterArea.y)
  const ratio = Math.max(0, Math.min(1, liters / CAPACITY_LITERS));
  // invertido porque y crece hacia abajo
  const y = waterArea.y + waterArea.h - (waterArea.h * ratio);
  return y;
}

// animación principal
function animate(){
  waveOffset += wave.speed;
  // calculamos nivel
  const yLevel = getYLevelForLiters(currentLiters);

  // generamos dos ondas con desfase para dar riqueza
  const d1 = generateWavePath(waveOffset, yLevel, 0, wave.amplitude, wave.wavelength);
  const d2 = generateWavePath(-waveOffset*0.6, yLevel+5, 12, wave.amplitude*0.8, wave.wavelength*1.1);

  wave1.setAttribute('d', d1);
  wave2.setAttribute('d', d2);

  // small vertical float animation for badge (cosmetic)
  const pct = Math.round((currentLiters / CAPACITY_LITERS) * 100);
  pctBadge.style.top = `${12 + Math.sin(waveOffset * 0.03) * 4}px`;

  animId = requestAnimationFrame(animate);
}

// iniciar/actualizar nivel
function setLevelLiters(liters, animateSlider=true){
  currentLiters = Math.max(0, Math.min(CAPACITY_LITERS, liters));
  // actualiza slider si no vino de él
  if (!animateSlider) range.value = Math.round(currentLiters);

  // actualizar textos
  updateReadouts(currentLiters);

  // si el mapa (svg) no tiene contenido aún, forzamos una render
  // (wave1/wave2 serán actualizados en el siguiente frame de animate)
}

// listeners
range.addEventListener('input', (e) => {
  setLevelLiters(Number(e.target.value), true);
});

btnFill.addEventListener('click', ()=> {
  setLevelLiters(CAPACITY_LITERS, false);
  range.value = CAPACITY_LITERS;
});
btnEmpty.addEventListener('click', ()=> {
  setLevelLiters(0, false);
  range.value = 0;
});

// inicialización
(function init(){
  // start values
  setLevelLiters(currentLiters, false);

  // start animation loop
  if (!animId) animId = requestAnimationFrame(animate);
})();

// accessibility: pause animation when tab not visible
document.addEventListener('visibilitychange', function () {
  const params = new URLSearchParams(window.location.search);
  const dataBase64 = params.get("data");

  if (dataBase64) {
    try {
      const decoded = atob(dataBase64);
      const datos = new URLSearchParams(decoded);

      document.getElementById("contrato").value = datos.get("contrato") || "";
      document.getElementById("usuario").value  = datos.get("usuario")  || "";

      // 🔹 si quieres permitir cambiar capacidad y litros, declara CAPACITY_LITERS como let
       CAPACITY_LITERS = Number(document.getElementById("CargaAgua").innerText);   // capacidad total del tanque (L)
       currentLiters   = Number(document.getElementById("saldoAgua").textContent);// lo que queda

      // actualizar pantalla con los nuevos datos
      setLevelLiters(currentLiters, false);

    } catch (e) {
      console.error("Error al decodificar.");
    }
  }

  // 🔹 animación ON/OFF cuando cambias de pestaña
  if (document.hidden) {
    if (animId) cancelAnimationFrame(animId);
    animId = null;
  } else {
    if (!animId) animId = requestAnimationFrame(animate);
  }
});


function cargaDataAgua() {
  const params = new URLSearchParams(window.location.search);
  const dataBase64 = params.get("data");

  if (dataBase64) {
    try {
      const decoded = atob(dataBase64);
      const datos = new URLSearchParams(decoded);
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
jsonData=
{
    "consumoTotalOld": "0.03",
    "carga": "1.3",
    "consumoTotalNew": "0.03",
    "cargaAgua": 3000,
    "saldo": "4.9",
    "saldoAgua": 1500
};
      document.getElementById("saldoAgua").textContent      = jsonData.saldoAgua;
      document.getElementById("CargaAgua").textContent      = jsonData.cargaAgua;

    } catch(e) { 
      console.log("Error al decodificar:", e); 
    }
  }
}


