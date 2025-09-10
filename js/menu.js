function toggleSidebar() {
  document.getElementById("sidebar").classList.toggle("active");
  document.getElementById("overlay").classList.toggle("active");
}

async function loadTab(file, title) {
  try {
    const res = await axios.get(`tabs/${file}`);
    document.getElementById("content").innerHTML = res.data;
    document.getElementById("appHeader").innerText = title;
  } catch (err) {
    console.error("Error cargando tab:", err);
    document.getElementById("content").innerHTML = "<p>Error cargando contenido</p>";
  }

  // Cerrar sidebar si está abierto
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("overlay");
  if(sidebar.classList.contains("active")){
    sidebar.classList.remove("active");
    overlay.classList.remove("active");
  }

  // Ejecutar scripts dentro del tab cargado
  const scripts = document.getElementById("content").querySelectorAll("script");
  scripts.forEach(oldScript => {
    const newScript = document.createElement("script");
    newScript.textContent = oldScript.textContent;
    document.body.appendChild(newScript).parentNode.removeChild(newScript);
  });
}

// Cargar tab inicial
window.onload = () => loadTab('inicio.html', 'Inicio');
