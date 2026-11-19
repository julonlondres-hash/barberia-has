/* ==========================================================
   agenda.js
   El panel oscuro de la derecha (semana + citas del día) y la
   tarjeta de color de cada cita, que se reutiliza en la vista
   "Citas programadas".
   ========================================================== */

/* HTML de una cita. conFecha = true muestra también el día */
function tarjetaCita(c, conFecha){
  const s = servicioDe(c), b = barberoDe(c.barbero), nom = nombreCompleto(c);
  const filas = [
    c.doc       ? ["Documento", (c.tipoDoc||"")+" "+c.doc] : null,
    c.tel       ? ["Teléfono", c.tel] : null,
    c.correo    ? ["Correo", c.correo] : null,
    c.direccion ? ["Dirección", c.direccion] : null,
    c.pago      ? ["Pago", c.pago] : null,
    c.notas     ? ["Notas", c.notas] : null
  ].filter(Boolean);

  return `
    <article class="cita" style="background:${colorGrupo(s.grupo)}">
      <span class="cita__hora">${conFecha ? fechaCorta(c.fecha)+" · " : ""}${c.hora} - ${hm(toMin(c.hora)+s.min)}</span>
      <strong class="cita__cliente">${esc(nom)}</strong>
      <span class="cita__servicio">${esc(s.nombre)}</span>
      <span class="cita__barbero">${esc(b.nombre)} · ${money(s.precio)}</span>
      ${filas.length ? `<details class="cita__detalle"><summary>Datos del cliente</summary>
        <dl class="cita__datos">${filas.map(f => `<dt>${f[0]}</dt><dd>${esc(f[1])}</dd>`).join("")}</dl></details>` : ""}
      ${esAdmin() ? `<button type="button" class="cita__borrar" data-id="${c.id}" aria-label="Cancelar cita de ${esc(nom)}">✕</button>` : ""}
    </article>`;
}

function renderAgendaSemana(){
  const d = parse(st.dia);
  $("agendaMes").textContent = mayus(d.toLocaleDateString("es-CO",{month:"long", year:"numeric"}));

  const lunes = new Date(d);
  lunes.setDate(d.getDate() - ((d.getDay()+6) % 7));
  const nombres = ["Lun","Mar","Mié","Jue","Vie","Sáb","Dom"];
  $("agendaSemana").innerHTML = nombres.map((n,i) => {
    const x = new Date(lunes); x.setDate(lunes.getDate()+i);
    const k = iso(x);
    return `<button type="button" class="agenda__dia ${k===iso(new Date())?"agenda__dia--hoy":""}"
      data-d="${k}" aria-pressed="${k===st.dia}"><span>${n}</span><b class="agenda__numero">${x.getDate()}</b></button>`;
  }).join("");

  const lista = citas.filter(c => c.fecha === st.dia).sort((a,b) => a.hora.localeCompare(b.hora));
  $("agendaTitulo").textContent = fechaLarga(st.dia)+" · "+lista.length+(lista.length===1?" cita":" citas");
  $("agendaCitas").innerHTML = lista.length
    ? lista.map(c => tarjetaCita(c,false)).join("")
    : `<div class="agenda__vacia">No hay citas programadas para este día.</div>`;
}

function moverSemana(n){
  const d = parse(st.dia); d.setDate(d.getDate()+7*n);
  st.dia = iso(d); renderAgendaSemana();
}

function iniciarAgenda(){
  $("agendaSemana").addEventListener("click", e => {
    const b = e.target.closest(".agenda__dia"); if(!b) return;
    st.dia = b.dataset.d; renderAgendaSemana();
  });
  $("semanaAnterior").addEventListener("click", () => moverSemana(-1));
  $("semanaSiguiente").addEventListener("click", () => moverSemana(1));

  /* Cancelar una cita: solo administrador. Funciona en agenda y en "Citas programadas" */
  document.addEventListener("click", e => {
    const b = e.target.closest(".cita__borrar"); if(!b) return;
    if(!esAdmin()){ alert("Solo el administrador puede cancelar citas."); return; }
    const c = citas.find(x => x.id === b.dataset.id);
    if(c && confirm("¿Cancelar la cita de "+nombreCompleto(c)+"?")){
      eliminarCita(c.id).then(() => refrescarTodo());
    }
  });
}
