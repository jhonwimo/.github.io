let API_URL = "https://api.wshome.shop/api/WsHome"; 
//API_URL = "http://192.168.1.45:8585/api/WsHome"; 
//API_URL = "http://localhost:8189/api/WsHome"; 
    let results = {};
    let editar = false;
    let nuevo = true;
	
	
function toggleSidebar(){
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');
  if(sidebar.style.left === '0px'){
    sidebar.style.left = '-250px';
    overlay.style.display='none';
  } else {
    sidebar.style.left = '0px';
    overlay.style.display='block';
  }
}

function mostrarTab(tabId, cerrarSidebar=false, titulo=null){
  document.querySelectorAll('.tab').forEach(el=>el.classList.remove('active'));
  document.getElementById(tabId).classList.add('active');
  if(titulo) document.getElementById('appHeader').innerText = titulo;
  if(cerrarSidebar) toggleSidebar();
  if(tabId === 'gestionInquilino'){ initGestionInqulino(); }
  if(tabId === 'Mapa'){ initMap(); }
  
}


   function initGestionInqulino() {
   const params = new URLSearchParams(window.location.search);
  const dataBase64 = params.get("data");
  if(dataBase64){
    try{
      const decoded = atob(dataBase64);
      const datos = new URLSearchParams(decoded);
	   document.getElementById("usuario").value = datos.get("usuario");
	   handleSearch(true);
	 } catch(e){ console.error("Error al decodificar."); }
  }
 
 }
 
 
  function formatFecha(fecha) {
      if (!fecha || fecha.trim() === "") return "1900-01-01";
      return fecha;
    }
	


async function enviarServer() {
  const boton = document.getElementById("enviarCliente");
  boton.disabled = true;
  boton.textContent = "Enviando...";

  // Capturar idInquilino y convertirlo a número o null
  let idInquilinoVal = document.getElementById("idInquilino").value?.trim();
  idInquilinoVal = idInquilinoVal ? parseInt(idInquilinoVal) : null;

  // Construir payload
  const data = {
    idInquilino: idInquilinoVal,
	idContrato: document.getElementById("idContrato").value || null,
	contratoSensor: document.getElementById("contratoSensor").value || null,
    idCasa: document.getElementById("idCasa").value || null,
    idSensor: document.getElementById("apartamento").value || null,
    nombre: document.getElementById("nombres").value || null,
    telefono: document.getElementById("telefonoInquilino").value || null,
    fechaNotificacion: document.getElementById("fecNotificacion").value
      ? document.getElementById("fecNotificacion").value + "T00:00:00"
      : null,
    fechaCarga: document.getElementById("fecCarga").value
      ? document.getElementById("fecCarga").value + "T00:00:00"
      : null,
    fecPagoArriendo: document.getElementById("fecPagoArriendo").value || null,
    fechaCorteArrendo: document.getElementById("fechaCorteArrendo").value
      ? document.getElementById("fechaCorteArrendo").value 
      : null,
    diasMoraPermitido: parseInt(document.getElementById("diasMora").value) || 0,
    diasPago: parseInt(document.getElementById("diaPago").value) || 0
  };

  try {
    if (idInquilinoVal) {
      // Update existente
      await axios.put(`${API_URL}/inquilinos`, data);
    } else {
      // Crear nuevo
      await axios.post(`${API_URL}/inquilinos`, data);
    }

    mensajeExito("Se envió tu Solicitud", "Datos Guardados");
  } catch (err) {
    console.log("Error al enviar datos:", err);
    mensajeError("Error en Solicitud", "Error al procesar petición");
  } finally {
    boton.disabled = false;
    boton.textContent = "Guardar";
  }
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
    console.log("Error en búsqueda:", error);
  }
}


    function editarInquilino() {
      //handleEnableFields();
      editar = true;
      nuevo = false;
     // handleSearch(true);
    }

   function buscarBarrio(idBarrio) {
	   //buscarPorApartamento();
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
        const sensor = results.listaSensores?.filter(s => s.idSensor == idSensor) || [];
		document.getElementById("idContrato").value = sensor.contrato.id || "";
        const sensorData = results.listaInquilinos.find(s => s.idSensor == idSensor);
        if (sensorData) {
          const i = sensorData;
		  
		  document.getElementById("contratoSensor").value = i.contratoSensor || "";
          document.getElementById("nombres").value = i.nombre || "";
          document.getElementById("telefonoInquilino").value = i.telefono || "";
          document.getElementById("fecNotificacion").value = i.fechaNotificacion?.substring(0, 10) || "";
          document.getElementById("fecCarga").value = i.fechaCarga?.substring(0, 10) || "";
          document.getElementById("fecPagoArriendo").value = i.fecPagoArriendo?.substring(0, 10) || "";
          document.getElementById("fechaCorteArrendo").value = i.fechaCorteArrendo?.substring(0, 10) || "";
          document.getElementById("idInquilino").value = i.id || "";
          document.getElementById("diasMora").value = i.diasMoraPermitido || "";
          document.getElementById("diaPago").value = i.diasPago || "";
        
      }
	  handleEnableFields();
    }
	

function mensajeError(titulo,mensaje){
  Swal.fire({
    icon: 'error',
    title: titulo,
    text: mensaje ,
    confirmButtonText: 'Cerrar',
    timer: 10000
  });
}

function mensajeExito(titulo,mensaje){
  Swal.fire({
    icon: 'success',
    title: titulo,
    text: mensaje,
    confirmButtonText: 'Aceptar',
    timer: 10000
  });
}
