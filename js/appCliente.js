
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
