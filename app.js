/* ==========================================================
   app.js
   Punto de entrada. Se ejecuta de último: dibuja la pantalla
   por primera vez y conecta los eventos de cada módulo.
   ========================================================== */

/* Datos rápidos de la portada */
function renderEstadisticas(){
  const ahora = new Date();
  const hoy = iso(ahora);
  const minAhora = ahora.getHours()*60 + ahora.getMinutes();

  $("datoHoy").textContent = citas.filter(c => c.fecha === hoy).length;

  const proxima = citas
    .filter(c => c.fecha > hoy || (c.fecha === hoy && toMin(c.hora) >= minAhora))
    .sort((a,b) => (a.fecha+a.hora).localeCompare(b.fecha+b.hora))[0];
  $("datoProxima").textContent = proxima
    ? (proxima.fecha === hoy ? "Hoy" : fechaCorta(proxima.fecha))+" · "+proxima.hora
    : "Sin citas";

  $("datoBarberos").textContent = BARBEROS.length;
}

/* Vuelve a dibujar todo lo que depende de la lista de citas */
function refrescarTodo(){
  renderHoras(); renderResumen(); renderAgendaSemana(); renderEstadisticas();
  if(!$("vista-citas").hidden) renderCitasProgramadas();
  if(!$("vista-clientes").hidden) renderClientes();
  actualizarUIRoles();
}

async function iniciar(){
  /* Cargar datos desde Supabase (o localStorage de respaldo) */
  citas  = await cargarCitas();
  config = await cargarConfig();

  $("fecha").value = st.fecha;
  $("fecha").min = iso(new Date());
  $("nacimiento").max = iso(new Date());
  $("fechaHoy").textContent = fechaLarga(iso(new Date()));

  aplicarConfig();
  renderProfesionales(); renderFiltros(); renderCatalogo();
  refrescarFormulario(); renderAgendaSemana(); renderEstadisticas();

  iniciarMenu(); iniciarCatalogo(); iniciarFormulario();
  iniciarAgenda(); iniciarVistas(); iniciarConfig(); iniciarAuth();

  /* Aviso si no hay Supabase configurado */
  if(!sb){
    console.warn("Supabase no configurado. Edita supabase-config.js con tu URL y anon key.");
  }

  mostrarVista("agendar");
}

iniciar();
