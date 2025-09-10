function toggleSidebar() {
  document.getElementById("sidebar").classList.toggle("active");
  document.getElementById("overlay").classList.toggle("active");
}

// Cargar tab inicial
window.onload = () => loadTab('inicio.html', 'Inicio');

function loadTab(url, title) {
  const content = document.getElementById("content");

  fetch(`tabs/${url}`)
    .then(res => res.text())
    .then(html => {
      content.innerHTML = html;
      document.getElementById("appHeader").textContent = title;

      // Ejecutar solo scripts con src (externos o locales)
      const scripts = content.querySelectorAll("script[src]");
      scripts.forEach(script => {
        const src = script.src.startsWith("http") ? script.src : `${window.location.origin}/${script.src}`;
        console.log("Cargando script externo:", src);
        const newScript = document.createElement("script");
        newScript.src = src;
        newScript.async = false; // para mantener orden
        document.head.appendChild(newScript); // ⬅️ lo montamos en el head
      });
    });
}


function ejecutarRecursos(container) {
  const scripts = container.querySelectorAll("script");

  scripts.forEach(script => {
    if (script.src) {
      // Script externo o local con src
      const src = script.src.startsWith("http") ? script.src : `${window.location.origin}/${script.src}`;
      console.log("Cargando script externo:", src);

      // Evitar recargar el mismo script
      if (!document.querySelector(`script[src="${src}"]`)) {
        const newScript = document.createElement("script");
        newScript.src = src;
        newScript.async = false;

        // Cuando el script se cargue, ejecutamos init si existe
        newScript.onload = () => {
          if (typeof window.initInquilino === "function") {
            console.log("Ejecutando initInquilino()");
            window.initInquilino();
          }
        };

        document.head.appendChild(newScript); // Cargar en head
      } else {
        // Ya cargado, solo llamar init si existe
        if (typeof window.initInquilino === "function") {
          console.log("Ejecutando initInquilino() (script ya cargado)");
          window.initInquilino();
        }
      }

    } else {
      // Script inline
      console.log("Ejecutando script inline");
      try {
        new Function(script.textContent)();
      } catch (e) {
        console.error("Error al ejecutar script inline:", e);
      }
    }
  });

  // Detectar y cargar CSS si hay
  const links = container.querySelectorAll("link[rel='stylesheet']");
  links.forEach(link => {
    const href = link.href.startsWith("http") ? link.href : `${window.location.origin}/${link.getAttribute('href')}`;
    if (!document.querySelector(`link[href="${href}"]`)) {
      const newLink = document.createElement("link");
      newLink.rel = "stylesheet";
      newLink.href = href;
      document.head.appendChild(newLink);
      console.log("Cargando CSS:", href);
    }
  });
}
