
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
  // Ocultar todas las tabs
  document.querySelectorAll('.tab').forEach(el=>el.classList.remove('active'));
  // Mostrar la tab seleccionada
  document.getElementById(tabId).classList.add('active');
  // Cambiar título
  if(titulo) document.getElementById('appHeader').innerText = titulo;
  // Cerrar sidebar si se indicó
  if(cerrarSidebar) toggleSidebar();
   // 🚨 Limpiar inputs si es la tab de carga
  if(tabId === 'carga'){
    vaciarCamposCarga();
  }
   // 👇 aplicar cambio de viewport
  setViewport(tabId);
}

function setViewport(tabId){
  const normal = document.getElementById("viewportNormal");
  const factura = document.getElementById("viewportFactura");

  if(tabId === "Factura"){
    normal.setAttribute("disabled", true);
    factura.removeAttribute("disabled");
  } else {
    factura.setAttribute("disabled", true);
    normal.removeAttribute("disabled");
  }
}

if('serviceWorker' in navigator){
  navigator.serviceWorker.register('/service-worker.js')
    .then(()=>console.log('SW registrado'))
    .catch(console.error);
}

function mostrar(id,titulo){
  document.getElementById('inicio').style.display='none';
  document.getElementById(id).style.display='block';
  const h2 = document.createElement("h2"); h2.textContent = titulo;
  document.getElementById("titulo").appendChild(h2);
}

function previsualizarImagen(event){
  const archivo = event.target.files[0];
  const img = document.getElementById("previewImg");
  if(archivo){
    const reader = new FileReader();
    reader.onload = function(e){
      img.src = e.target.result;
      img.style.display="block";
    };
    reader.readAsDataURL(archivo);
    procesarImagenOCR();
  } else {
    img.src=""; img.style.display="none";
  }
}

async function procesarImagenOCR(){
  const archivo = document.getElementById("imagen").files[0];
  const resultadoOCRDiv = document.getElementById("resultadoOCR");
  if(!archivo){ alert("Selecciona una imagen."); return; }
  resultadoOCRDiv.style.display="block"; resultadoOCRDiv.textContent="Verificar datos despues de carga Procesando ...";
  const reader = new FileReader();
  reader.onload = async function(event){
    try{
      const { data: { text } } = await Tesseract.recognize(event.target.result,"spa",{logger:m=>console.log(m)});
      resultadoOCRDiv.style.display="none";
      document.getElementById("datosExtraidos").style.display="block";
      const datos = extraerDatos(text);
      document.getElementById("valor").value = datos.valor || "";
      document.getElementById("fecha").value = datos.fecha ? datos.fecha.join("; ") : "";
      document.getElementById("referencia").value = datos.referencia || "";
      validarCampos();
    } catch(err){
      resultadoOCRDiv.textContent="Error OCR: "+err.message;
    }
  };
  reader.readAsDataURL(archivo);
}

function extraerDatos(texto){
  const fechas = extraerFechas(texto);
  const valores = extraerValores(texto);
  const referencia = extraerReferenciaComprobante(texto);
  return { fecha: fechas.length>0?fechas:null, valor: valores.length>0?valores[0]:null, referencia };
}

function extraerFechas(texto){
 // const regexFechaHora = /\b((?:0?[1-9]|[12][0-9]|3[01])(?:\s+DE)?\s+(?:Ene|Enero|Feb|Febrero|Mar|Marzo|Abr|Abril|May|Mayo|Jun|Junio|Jul|Julio|Ago|Agosto|Sep|Septiembre|Oct|Octubre|Nov|Noviembre|Dic|Diciembre)(?:\s+DE)?\s+\d{4}|(?:0?[1-9]|[12][0-9]|3[01])[\/\-.](?:0?[1-9]|1[0-2])[\/\-.](?:\d{2}|\d{4})|(?:\d{4})[\/\-.](?:0?[1-9]|1[0-2])[\/\-.](?:0?[1-9]|[12][0-9]|3[01]))(?:\s*[-–]?\s*(?:[01]?\d|2[0-3]):[0-5]\d(?:\:[0-5]\d)?(?:\s?(?:AM|PM|am|pm))?)?\b/gi;
 const regexFechaHora=/\b((?:0?[1-9]|[12][0-9]|3[01])(?:\s+de)?\s+(?:ene|enero|feb|febrero|mar|marzo|abr|abril|may|mayo|jun|junio|jul|julio|ago|agosto|sep|sept|septiembre|oct|octubre|nov|noviembre|dic|diciembre|jan|january|feb|february|mar|march|apr|april|may|jun|june|jul|july|aug|august|sep|september|oct|october|nov|november|dec|december)(?:\s+de)?\s+\d{2,4}(?:\s+a\s+las\s+(?:[01]?\d|2[0-3]):[0-5]\d(?:\s*(?:a\.?\s*m\.?|p\.?\s*m\.?))?)?|(?:0?[1-9]|[12][0-9]|3[01])[\/\-.](?:0?[1-9]|1[0-2])[\/\-.](?:\d{2}|\d{4})|(?:\d{4})[\/\-.](?:0?[1-9]|1[0-2])[\/\-.](?:0?[1-9]|[12][0-9]|3[01])|(?:jan|january|feb|february|mar|march|apr|april|may|jun|june|jul|july|aug|august|sep|sept|september|oct|october|nov|november|dec|december|ene|enero|feb|febrero|mar|marzo|abr|abril|may|mayo|jun|junio|jul|julio|ago|agosto|sep|septiembre|oct|octubre|nov|noviembre|dic|diciembre)[\s\-/.](?:0?[1-9]|[12][0-9]|3[01])[\s\-/.]\d{2,4}|\d{4}[\s\-/.](?:jan|january|feb|february|mar|march|apr|april|may|jun|june|jul|july|aug|august|sep|sept|september|oct|october|nov|november|dec|december|ene|enero|feb|febrero|mar|marzo|abr|abril|may|mayo|jun|junio|jul|julio|ago|agosto|sep|septiembre|oct|octubre|nov|noviembre|dic|diciembre)[\s\-/.](?:0?[1-9]|[12][0-9]|3[01]))\b/gi;
  return texto.split(/\r?\n/).filter(linea=>regexFechaHora.test(linea)).map(l=>l.trim());
}

function extraerValores(texto){
  const regex = /(?:\$|COP)?\s*\d{1,3}(?:([.,])\d{3})+(?:[.,]\d{2})?|\d+[.,]\d{2}/g;
  const valores = []; let match;
  while((match=regex.exec(texto))!==null) valores.push(match[0].trim());
  return valores;
}

function extraerReferenciaComprobante(texto){
  const regex = /\b(?:comprobante|referencia|ref(?:\.|:)?|n[úu]mero|nro(?:\.|:)?)(?:\s*No\.?\s*|\s+No\.?\s*|\s*:\s*|\s+)?([A-Z0-9\-]{6,})\b/gi;
  const match = regex.exec(texto); return match?match[1]:"";
}

async function enviarDatosAWhatsApp(){
  const boton=document.getElementById("enviarWhatsapp");
  boton.disabled=true; boton.textContent="Enviando...";
  const NGROK_URL="https://api.wshome.shop";
  const accion=document.querySelector('h2').textContent+' wshome';
  const usuario=document.getElementById("usuario").value;
  const contrato=document.getElementById("contrato").value;
  const valor=document.getElementById("valor").value;
  const fecha=document.getElementById("fecha").value;
  const referencia=document.getElementById("referencia").value;
  if(!valor||!fecha||!referencia||!contrato||!usuario){ alert("Todos los datos deben estar presentes."); return; }
  const payload={accion,usuario,contrato,valor,fecha,referencia};
  try{
    const response=await fetch(`${NGROK_URL}/comprobantes`,{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify(payload)
    });
   const data = await response.json();
    if (data.status=="ko" ) {
    // ❌ Error desde el backend (validación fallida o fallo en RabbitMQ)
     mesajeError("Error en la solicitud",data.mensaje || 'Ocurrió un error inesperado');
}else {
    mesajeExito("Se envió tu Solicitud",'Pronto llegara la respuesta de su solicitud al celular');
    }
    boton.disabled=false; boton.textContent="Enviar";
  } catch(err){
    boton.disabled=false;
	boton.textContent="Enviar"; 
	 Swal.fire({icon:'error', title:'Servicio presenta problemas', text:'Error al enviar', confirmButtonText:'Cerrar', timer:5000});
	console.error(err);
  }
}

function validarCampos(){
  const valor=document.getElementById("valor").value.trim();
  const fecha=document.getElementById("fecha").value.trim();
  const referencia=document.getElementById("referencia").value.trim();
  document.getElementById("enviarWhatsapp").disabled=!(valor || fecha || referencia);
}
window.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const dataBase64 = params.get("data");
  if(dataBase64){
    try{
      const decoded = atob(dataBase64);
      const datos = new URLSearchParams(decoded);
	  const usuario = datos.get("usuario");
      document.getElementById("contrato").value = datos.get("contrato");
      document.getElementById("usuario").value = datos.get("usuario");
    } catch(e){ console.error("Error al decodificar."); }
  }
  
  
   if (!document.getElementById("usuario").value || document.getElementById("usuario").value === "") {
        // 🚨 Redirigir si usuario no existe o está vacío
        window.location.href = "index.html"; // <-- aquí cambias por tu página
        return;
      }

  
});

function mesajeError(titulo,mensaje){
  Swal.fire({
    icon: 'error',
    title: titulo,
    text: mensaje ,
    confirmButtonText: 'Cerrar',
    timer: 10000
  });
}

function mesajeExito(titulo,mensaje){
  Swal.fire({
    icon: 'success',
    title: titulo,
    text: mensaje,
    confirmButtonText: 'Aceptar',
    timer: 10000
  });
}


function vaciarCamposCarga(){
  const campos = ['valor','fecha','referencia'];
  campos.forEach(id=>{
    const el = document.getElementById(id);
    if(el){
      el.value = '';
    }
  });

  // Ocultar la sección de datos extraídos
  const datosDiv = document.getElementById("datosExtraidos");
  if(datosDiv) datosDiv.style.display = 'none';
  }
