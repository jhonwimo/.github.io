

const API_URL = "http://192.168.1.45:31383/api/WsHome"; 
    let results = {};
    let editar = false;
    let nuevo = true;

   

    function formatFecha(fecha) {
      if (!fecha || fecha.trim() === "") return "1900-01-01";
      return fecha;
    }

    function onSubmit(event) {
      event.preventDefault();
      const data = {
        idInquilino: document.getElementById("idInquilino").value,
        idCasa: document.getElementById("idCasa").value,
        idSensor: document.getElementById("apartamento").value,
        nombres: document.getElementById("nombres").value,
        fechaNotificacion: document.getElementById("fecNotificacion").value + "T00:00:00",
        telefono: document.getElementById("telefonoInquilino").value,
        fechaCarga: formatFecha(document.getElementById("fecCarga").value) + "T00:00:00",
        fecPagoArriendo: formatFecha(document.getElementById("fecPagoArriendo").value),
        fechaCorteArrendo: document.getElementById("fechaCorteArrendo").value + "T00:00:00",
        diasMora: document.getElementById("diasMora").value,
        diaPago: document.getElementById("diaPago").value
      };

      const request = editar
        ? axios.put(`${API_URL}/inquilinos`, data)
        : axios.post(`${API_URL}/inquilinos`, data);

      request.then(() => alert("✅ Datos guardados con éxito"))
             .catch(err => alert("❌ Error al guardar: " + err));
    }

    function handleEnableFields() {
     document.querySelectorAll("#inquilinoForm input").forEach(el => {
  const excepciones = ["fecCarga", "fecPagoArriendo", "fecNotificacion"];
  if (!excepciones.includes(el.id)) {
    el.disabled = false;
  }
});
    }

   async function handleSearch(isEditar) {
  const usuarioValue = document.getElementById("usuario").value;
  let urlMetodo = "/sensores/sensoresByUsuario";

  try {
    const payload = { usuario: { usuario: usuarioValue } };
    const response = await axios.post(`${API_URL}${urlMetodo}`, payload, { headers: { "Content-Type": "application/json" } });
    results = response.data;

   

    // ---- Llenar select de barrios ----
    const barrioSelect = document.getElementById("barrio");
    barrioSelect.innerHTML = "<option value=''>Selecciona Barrio</option>"; // Limpiar select

    // Verificar si hay datos
    let barrios = [];
    if (results.listaCasas && results.listaCasas.length > 0) {
	 editarInquilino();
      // Extraer barrios únicos
      const seen = new Set();
      barrios = results.listaCasas
        .map(c => c.barrio)
        .filter(b => b && !seen.has(b.idBarrio) && seen.add(b.idBarrio));
    }

    // Llenar select si hay barrios
    barrios.forEach(b => {
      const option = document.createElement("option");
      option.value = b.idBarrio;
      option.textContent = b.nombre;
      barrioSelect.appendChild(option);
    });

  } catch (error) {
    console.error("Error en búsqueda:", error);
  }
}


    function editarInquilino() {
      //handleEnableFields();
      editar = true;
      nuevo = false;
     // handleSearch(true);
    }

   function buscarBarrio(idBarrio) {
	   buscarPorApartamento();
  const casasFiltradas = results.listaCasas?.filter(s => s.barrio.idBarrio == idBarrio) || [];
  const casaSelect = document.getElementById("idCasa");
  casaSelect.innerHTML = "<option value=''>Dirección</option>";

  const combinacionesUnicas = new Set();

  casasFiltradas.forEach(c => {
    const key = `${c.idCasa}|${c.direccion}`; // combinación única
    if (!combinacionesUnicas.has(key)) {
      combinacionesUnicas.add(key);
      const option = document.createElement("option");
      option.value = c.idCasa;
      option.textContent = c.direccion;
      casaSelect.appendChild(option);
    }
  });
}


    function buscarPorCasa(idCasa) {
     
        const aptos = results.listaSensores?.filter(s => s.idCasa == idCasa) || [];
        const aptoSelect = document.getElementById("apartamento");
        aptoSelect.innerHTML = "<option value=''>Apartamento</option>";
        aptos.forEach(a => {
          const option = document.createElement("option");
          option.value = a.idSensor;
          option.textContent = a.apartamento;
          aptoSelect.appendChild(option);
        });
      
    }

    function buscarPorApartamento(idSensor) {
    
        const sensorData = results.listaSensores.find(s => s.idSensor == idSensor);
        if (sensorData?.inquilino) {
          const i = sensorData.inquilino;
          document.getElementById("nombres").value = i.nombres || "";
          document.getElementById("telefonoInquilino").value = i.telefono || "";
          document.getElementById("fecNotificacion").value = i.fechaNotificacion?.substring(0, 10) || "";
          document.getElementById("fecCarga").value = i.fechaCarga?.substring(0, 10) || "";
          document.getElementById("fecPagoArriendo").value = i.fechaPagoArrendo?.substring(0, 10) || "";
          document.getElementById("fechaCorteArrendo").value = i.fechaCorteArrendo?.substring(0, 10) || "";
          document.getElementById("idInquilino").value = i.idInquilino || "";
          document.getElementById("diasMora").value = i.rangoDiasMora || "";
          document.getElementById("diaPago").value = i.diaPagoCadaMes || "";
        
      }
	  handleEnableFields();
    }
	



