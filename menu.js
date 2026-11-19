/* ==========================================================
   menu.js
   El menú de hamburguesa y el cambio entre vistas
   (Agendar, Citas programadas, Clientes, Configuración).
   ========================================================== */

function abrirMenu(){
  $("menu").classList.add("menu--abierto");
  $("fondoMenu").hidden = false;
  $("btnMenu").setAttribute("aria-expanded","true");
  $("btnMenu").setAttribute("aria-label","Cerrar menú");
  document.body.classList.add("sin-scroll");
  const primero = $("menu").querySelector(".menu__enlace");
  if(primero) primero.focus();
}

function cerrarMenu(){
  const estabaAbierto = $("menu").classList.contains("menu--abierto");
  $("menu").classList.remove("menu--abierto");
  $("fondoMenu").hidden = true;
  $("btnMenu").setAttribute("aria-expanded","false");
  $("btnMenu").setAttribute("aria-label","Abrir menú");
  document.body.classList.remove("sin-scroll");
  if(estabaAbierto) $("btnMenu").focus();
}

/* Muestra una vista y oculta las demás */
function mostrarVista(nombre){
  const vistas = Array.from(document.querySelectorAll(".vista"));
  if(!vistas.some(v => v.dataset.vista === nombre)) nombre = "agendar";

  vistas.forEach(v => { v.hidden = v.dataset.vista !== nombre; });
  document.querySelectorAll(".menu__enlace").forEach(a => {
    const activo = a.dataset.vista === nombre;
    a.classList.toggle("menu__enlace--activo", activo);
    if(activo) a.setAttribute("aria-current","page"); else a.removeAttribute("aria-current");
  });

  if(nombre === "citas") renderCitasProgramadas();
  if(nombre === "clientes") renderClientes();
  if(nombre === "config") cargarFormularioConfig();
  if(nombre === "mis-citas") {
    const caja = $("listaMisCitas");
    if(caja && !caja.dataset.buscado) {
      caja.innerHTML = '<div class="vacio">Escribe tu documento o teléfono y pulsa Buscar.</div>';
    }
  }

  cerrarMenu();
  window.scrollTo({top:0});
}

function iniciarMenu(){
  $("btnMenu").addEventListener("click", () => {
    $("menu").classList.contains("menu--abierto") ? cerrarMenu() : abrirMenu();
  });
  $("fondoMenu").addEventListener("click", cerrarMenu);
  $("cerrarMenu").addEventListener("click", cerrarMenu);
  document.addEventListener("keydown", e => { if(e.key === "Escape") cerrarMenu(); });

  document.querySelectorAll(".menu__enlace").forEach(a => {
    a.addEventListener("click", () => mostrarVista(a.dataset.vista));
  });

  /* Botón "Nueva cita" del encabezado y botón + de la agenda */
  const irANuevaCita = () => {
    mostrarVista("agendar");
    $("reservar").scrollIntoView({behavior:"smooth"});
    setTimeout(() => $("nombres").focus({preventScroll:true}), 400);
  };
  $("btnNueva").addEventListener("click", irANuevaCita);
  $("btnNuevaAgenda").addEventListener("click", irANuevaCita);
}
