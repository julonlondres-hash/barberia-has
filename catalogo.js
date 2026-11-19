/* ==========================================================
   catalogo.js
   Dibuja los barberos, los filtros y las tarjetas de cada
   corte (foto + tipo de pelo + precio). También guarda cuál
   servicio eligió el cliente.
   ========================================================== */

function renderProfesionales(){
  $("profesionales").innerHTML = BARBEROS.map(b => `
    <button type="button" class="profesional" data-id="${b.id}" aria-pressed="${st.barbero===b.id}">
      <span class="profesional__avatar" style="background:${b.color}">${b.nombre[0]}</span>${b.nombre}
    </button>`).join("");
}

function renderFiltros(){
  $("chipsGrupo").innerHTML = GRUPOS.map(g =>
    `<button type="button" class="filtro" data-grupo="${g}" aria-pressed="${filtro.grupo===g}">${g}</button>`).join("");
  $("filtroPelo").innerHTML = TIPOS_PELO.map(t =>
    `<option value="${t}" ${filtro.pelo===t?"selected":""}>${t==="Todos" ? "Todos los tipos de pelo" : "Pelo "+t.toLowerCase()}</option>`).join("");
}

/* Aplica los tres filtros: grupo, tipo de pelo y texto de búsqueda */
function serviciosFiltrados(){
  const q = normalizar(filtro.texto);
  return SERVICIOS.filter(s =>
    (filtro.grupo === "Todos" || s.grupo === filtro.grupo) &&
    (filtro.pelo  === "Todos" || s.pelo  === filtro.pelo) &&
    (!q || normalizar(s.nombre+" "+s.desc+" "+s.grupo+" "+(s.pelo||"")).includes(q))
  );
}

function htmlTarjeta(s){
  const foto = s.img
    ? `<img class="tarjeta-corte__foto" src="${s.img}" alt="Corte ${esc(s.nombre)}" loading="lazy">`
    : `<div class="tarjeta-corte__foto tarjeta-corte__foto--vacia" aria-hidden="true">✂</div>`;
  return `
    <article class="tarjeta-corte">
      ${s.etiqueta ? `<span class="tarjeta-corte__etiqueta">${esc(s.etiqueta)}</span>` : ""}
      ${foto}
      <div class="tarjeta-corte__cuerpo">
        <h3 class="tarjeta-corte__nombre">${esc(s.nombre)}</h3>
        <div class="tarjeta-corte__pastillas">
          <span class="pastilla">${s.grupo}</span>
          ${s.pelo ? `<span class="pastilla pastilla--pelo">Pelo ${s.pelo.toLowerCase()}</span>` : ""}
        </div>
        <p class="tarjeta-corte__detalle">${s.min} min</p>
        <p class="tarjeta-corte__precio">${money(s.precio)}${s.antes ? `<s>Normal: ${money(s.antes)}</s>` : ""}</p>
        <p class="tarjeta-corte__descripcion">${esc(s.desc)}</p>
        <button type="button" class="tarjeta-corte__boton" data-id="${s.id}" aria-pressed="false">+ Agregar servicio</button>
      </div>
    </article>`;
}

function renderCatalogo(){
  const lista = serviciosFiltrados();
  $("catalogo").innerHTML = lista.length
    ? lista.map(htmlTarjeta).join("")
    : `<p class="catalogo__vacio">No hay cortes con esos filtros. Prueba con otra búsqueda.</p>`;
  marcarSeleccion();
}

/* Resalta la tarjeta elegida y muestra la barra de abajo */
function marcarSeleccion(){
  document.querySelectorAll(".tarjeta-corte").forEach(t => {
    const b = t.querySelector(".tarjeta-corte__boton");
    const elegido = b.dataset.id === st.servicio;
    t.classList.toggle("tarjeta-corte--elegida", elegido);
    b.setAttribute("aria-pressed", elegido);
    b.textContent = elegido ? "✓ Agregado" : "+ Agregar servicio";
  });
  const s = st.servicio && svc(st.servicio);
  $("barraSeleccion").hidden = !s;
  if(s){
    $("selNombre").textContent = s.nombre;
    $("selDetalle").textContent = s.min+" min · "+money(s.precio)+" · con "+bar(st.barbero).nombre;
  }
}

/* Elegir (o quitar) un servicio */
function elegirServicio(id){
  st.servicio = (st.servicio === id) ? null : id;
  st.hora = null;
  refrescarFormulario();
}

function iniciarCatalogo(){
  $("profesionales").addEventListener("click", e => {
    const b = e.target.closest(".profesional"); if(!b) return;
    st.barbero = b.dataset.id; st.hora = null;
    renderProfesionales(); refrescarFormulario();
  });
  $("chipsGrupo").addEventListener("click", e => {
    const b = e.target.closest(".filtro"); if(!b) return;
    filtro.grupo = b.dataset.grupo; renderFiltros(); renderCatalogo();
  });
  $("filtroPelo").addEventListener("change", e => { filtro.pelo = e.target.value; renderCatalogo(); });
  $("buscar").addEventListener("input", e => { filtro.texto = e.target.value; renderCatalogo(); });
  $("catalogo").addEventListener("click", e => {
    const b = e.target.closest(".tarjeta-corte__boton"); if(!b) return;
    elegirServicio(b.dataset.id);
  });
  $("btnContinuar").addEventListener("click", () => $("reservar").scrollIntoView({behavior:"smooth"}));

  /* La barra de abajo se esconde cuando ya estás viendo el formulario */
  if("IntersectionObserver" in window){
    new IntersectionObserver(entradas => {
      $("barraSeleccion").classList.toggle("barra-seleccion--oculta", entradas[0].isIntersecting);
    }).observe($("formCita"));
  }
}
