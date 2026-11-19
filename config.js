/* ==========================================================
   config.js
   Configuración: nombre de la barbería y URL del logo.
   Se guarda en el navegador y se aplica en el encabezado, el
   menú y la portada (los elementos con clase .js-logo y
   .js-nombre).
   ========================================================== */

/* Pone la imagen del logo; si no hay URL o falla, muestra las iniciales */
function pintarLogo(el, url, texto){
  el.textContent = "";
  el.classList.remove("logo--con-imagen");
  if(!url){ el.textContent = texto; return; }

  const img = new Image();
  img.className = "logo__img";
  img.alt = "Logo";
  img.onerror = () => { el.textContent = texto; el.classList.remove("logo--con-imagen"); };
  img.src = url;
  el.appendChild(img);
  el.classList.add("logo--con-imagen");
}

/* Aplica el nombre y el logo guardados en toda la página */
function aplicarConfig(){
  const ini = iniciales(config.nombre);
  
  // Usamos config.logo_url con guion bajo
  document.querySelectorAll(".js-logo").forEach(el => pintarLogo(el, config.logo_url, ini));
  
  document.querySelectorAll(".js-nombre").forEach(el => { el.textContent = config.nombre; });
  document.title = config.nombre + " · Citas";
}

/* Muestra lo guardado dentro del formulario de configuración */
function cargarFormularioConfig(){
  $("cfgNombre").value = config.nombre;
  $("cfgLogo").value = config.logo_url || ""; // CORREGIDO: Usar logo_url
  previsualizarLogo();
  mostrarMensaje($("cfgMsg"), "", "");
}

/* Vista previa en vivo mientras se escribe la URL */
function previsualizarLogo(){
  const url = $("cfgLogo").value.trim();
  const nombre = $("cfgNombre").value.trim() || "Barbería Pro";
  pintarLogo($("cfgPrevia"), url, iniciales(nombre));
  $("cfgPreviaNombre").textContent = nombre;
}

function iniciarConfig(){
  $("cfgNombre").addEventListener("input", previsualizarLogo);
  $("cfgLogo").addEventListener("input", previsualizarLogo);

  $("formConfig").addEventListener("submit", e => {
    e.preventDefault();
    if(!esAdmin()){ alert("Solo el administrador puede cambiar la configuración."); return; }
    config.nombre = $("cfgNombre").value.trim() || "Barbería Pro";
    config.logo_url = $("cfgLogo").value.trim(); // CORREGIDO: Usar logo_url
    
    guardarConfig().then(() => {
      aplicarConfig();
      mostrarMensaje($("cfgMsg"), "Cambios guardados.", "ok");
    });
  });

  $("cfgQuitar").addEventListener("click", () => {
    if(!esAdmin()) return;
    $("cfgLogo").value = ""; 
    config.logo_url = ""; // CORREGIDO: Usar logo_url
    
    guardarConfig().then(() => {
      aplicarConfig(); previsualizarLogo();
      mostrarMensaje($("cfgMsg"), "Logo eliminado. Se muestran las iniciales.", "ok");
    });
  });

  $("btnBorrarCitas").addEventListener("click", () => {
    if(!esAdmin()){ alert("Solo el administrador puede borrar citas."); return; }
    if(citas.length && confirm("¿Borrar TODAS las citas? Esta acción no se puede deshacer.")){
      borrarTodasCitas().then(() => {
        refrescarTodo();
        mostrarMensaje($("cfgMsg"), "Todas las citas fueron borradas.", "ok");
      });
    }
  });
}