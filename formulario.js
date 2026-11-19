/* ==========================================================
   formulario.js
   El formulario de la cita: llena las listas, muestra las
   horas libres/ocupadas, valida los datos del cliente y
   registra la cita.
   ========================================================== */

/* Llena los <select> de profesional y servicio */
function renderSelectores(){
  $("selBarbero").innerHTML = BARBEROS.map(b =>
    `<option value="${b.id}" ${st.barbero===b.id?"selected":""}>${b.nombre}</option>`).join("");

  const grupos = GRUPOS.filter(g => g !== "Todos");
  $("selServicio").innerHTML = `<option value="">Seleccionar servicio</option>` +
    grupos.map(g => `<optgroup label="${g}">` +
      SERVICIOS.filter(s => s.grupo === g).map(s =>
        `<option value="${s.id}" ${st.servicio===s.id?"selected":""}>${esc(s.nombre)} · ${s.min} min · ${money(s.precio)}</option>`).join("") +
    `</optgroup>`).join("");
}

/* Dibuja los botones de hora. Las ocupadas salen tachadas y desactivadas */
function renderHoras(){
  const caja = $("horas"), aviso = $("avisoHoras");
  const s = st.servicio && svc(st.servicio);
  caja.innerHTML = "";

  if(!s){ aviso.hidden = false; aviso.textContent = "Elige un servicio para ver los horarios disponibles."; return; }
  if(!st.fecha){ aviso.hidden = false; aviso.textContent = "Elige una fecha."; return; }
  if(parse(st.fecha).getDay() === 0){ aviso.hidden = false; aviso.textContent = "Los domingos la barbería está cerrada."; st.hora = null; return; }

  const horas = horasDelDia(st.fecha, st.barbero, s);
  const libres = horas.filter(h => h.estado === "libre").length;
  aviso.hidden = libres > 0;
  if(!libres) aviso.textContent = "No quedan horarios libres este día con este profesional.";

  caja.innerHTML = horas.map(h => {
    const titulo = h.estado==="ocupada" ? "Horario ocupado" : h.estado==="pasada" ? "Hora pasada" : "Libre";
    return `<button type="button" class="hora" data-h="${h.hora}" ${h.estado!=="libre"?"disabled":""}
      aria-pressed="${st.hora===h.hora}" title="${titulo}">${h.hora}</button>`;
  }).join("");

  const elegida = horas.find(h => h.hora === st.hora);
  if(!elegida || elegida.estado !== "libre") st.hora = null;
}

function renderResumen(){
  const el = $("resumen"), s = st.servicio && svc(st.servicio);
  if(!s || !st.hora){ el.classList.remove("resumen--visible"); return; }
  el.classList.add("resumen--visible");
  el.innerHTML = `<strong>${esc(s.nombre)}</strong> con ${bar(st.barbero).nombre}<br>
    ${fechaLarga(st.fecha)} · ${st.hora} a ${hm(toMin(st.hora)+s.min)} · ${money(s.precio)}`;
}

/* Vuelve a dibujar todo lo que depende de barbero / servicio / fecha */
function refrescarFormulario(){
  renderSelectores(); renderHoras(); renderResumen(); marcarSeleccion();
}

/* --- Validación --- */
function marcarError(nombre, malo){
  const campo = document.querySelector(`[data-f="${nombre}"]`);
  if(campo) campo.classList.toggle("es-invalido", !!malo);
  return !!malo;
}

/* Devuelve el nombre del primer campo con error (o null si todo está bien) */
function validar(){
  const hoy = iso(new Date());
  const correo = $("correo").value.trim();
  const errores = {
    nombres:    $("nombres").value.trim().length < 2,
    apellidos:  $("apellidos").value.trim().length < 2,
    doc:        digitos($("doc").value).length < 5,
    tel:        digitos($("tel").value).length < 7,
    correo:     correo !== "" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo),
    nacimiento: $("nacimiento").value !== "" && $("nacimiento").value > hoy,
    servicio:   !st.servicio,
    fecha:      !st.fecha || st.fecha < hoy,
    hora:       !st.hora,
    acepta:     !$("acepta").checked
  };
  let primero = null;
  for(const k in errores){ if(marcarError(k, errores[k]) && !primero) primero = k; }
  return primero;
}

function limpiarFormulario(){
  ["nombres","apellidos","doc","nacimiento","tel","correo","direccion","notas"].forEach(id => $(id).value = "");
  $("origen").value = ""; $("acepta").checked = false;
  document.querySelectorAll(".es-invalido").forEach(e => e.classList.remove("es-invalido"));
}

/* Guarda la cita nueva */
function registrarCita(){
  const s = svc(st.servicio);
  if(ocupado(st.fecha, st.barbero, toMin(st.hora), s.min)){
    st.hora = null; renderHoras(); renderResumen(); marcarError("hora", true);
    mostrarMensaje($("mensaje"), "Ese horario ya está ocupado. Elige otro.", "error");
    return;
  }
  const cita = {
    id: String(Date.now()),
    nombres: $("nombres").value.trim(), apellidos: $("apellidos").value.trim(),
    tipoDoc: $("tipoDoc").value, doc: digitos($("doc").value),
    nacimiento: $("nacimiento").value, tel: $("tel").value.trim(), correo: $("correo").value.trim(),
    direccion: $("direccion").value.trim(), origen: $("origen").value,
    servicio: st.servicio, barbero: st.barbero, fecha: st.fecha, hora: st.hora,
    pago: document.querySelector('input[name="pago"]:checked').value,
    notas: $("notas").value.trim(), recordatorio: $("recordatorio").checked
  };
  insertarCita(cita).then(() => {
    mostrarMensaje($("mensaje"),
      "Cita confirmada para "+nombreCompleto(cita)+": "+fechaLarga(cita.fecha)+" a las "+cita.hora+".", "ok");
    st.hora = null; st.dia = cita.fecha;
    limpiarFormulario();
    refrescarTodo();
  });
}

function iniciarFormulario(){
  $("selBarbero").addEventListener("change", e => {
    st.barbero = e.target.value; st.hora = null; renderProfesionales(); refrescarFormulario();
  });
  $("selServicio").addEventListener("change", e => {
    st.servicio = e.target.value || null; st.hora = null; marcarError("servicio", false); refrescarFormulario();
  });
  $("fecha").addEventListener("change", e => {
    st.fecha = e.target.value; st.hora = null; marcarError("fecha", false);
    if(st.fecha) st.dia = st.fecha;
    renderHoras(); renderResumen(); renderAgendaSemana();
  });
  $("horas").addEventListener("click", e => {
    const b = e.target.closest(".hora"); if(!b || b.disabled) return;
    st.hora = b.dataset.h; marcarError("hora", false); renderHoras(); renderResumen();
  });
  /* Al escribir en un campo con error, se le quita el rojo */
  document.querySelectorAll("#formCita .control, #acepta").forEach(el => {
    el.addEventListener("input", () => { const f = el.closest("[data-f]"); if(f) f.classList.remove("es-invalido"); });
  });

  $("formCita").addEventListener("submit", e => {
    e.preventDefault();
    mostrarMensaje($("mensaje"), "", "");
    const falla = validar();
    if(falla){
      mostrarMensaje($("mensaje"), "Revisa los campos marcados en rojo.", "error");
      const el = document.querySelector(`[data-f="${falla}"]`);
      if(el) el.scrollIntoView({behavior:"smooth", block:"center"});
      return;
    }
    registrarCita();
  });
}
