/* ==========================================================
   vistas.js
   Las vistas "Citas programadas" y "Clientes".
   ========================================================== */

/* --- Citas programadas --- */
function renderCitasProgramadas(){
  const hoy = iso(new Date());
  const barbero = $("citasBarbero").value || "todos";
  const modo = $("citasModo").value || "proximas";

  let lista = citas.filter(c =>
    (barbero === "todos" || c.barbero === barbero) &&
    (modo === "todas" || (modo === "proximas" ? c.fecha >= hoy : c.fecha < hoy)));
  lista.sort((a,b) => (a.fecha+a.hora).localeCompare(b.fecha+b.hora));
  if(modo === "pasadas") lista.reverse();

  if(!lista.length){
    $("listaCitas").innerHTML = `<div class="vacio">No hay citas para mostrar con estos filtros.</div>`;
    return;
  }

  /* Agrupamos las citas por fecha */
  const grupos = new Map();
  lista.forEach(c => { if(!grupos.has(c.fecha)) grupos.set(c.fecha, []); grupos.get(c.fecha).push(c); });

  $("listaCitas").innerHTML = Array.from(grupos).map(([fecha, items]) => `
    <section class="grupo-fecha">
      <h3 class="grupo-fecha__titulo">${fechaLarga(fecha)}${fecha===hoy?" · hoy":""}</h3>
      <div class="grupo-fecha__citas">${items.map(c => tarjetaCita(c,false)).join("")}</div>
    </section>`).join("");
}

/* --- Clientes (se arman a partir de las citas registradas) --- */
function renderClientes(){
  const q = normalizar($("buscarCliente").value);
  const mapa = new Map();

  citas.slice().sort((a,b) => (a.fecha+a.hora).localeCompare(b.fecha+b.hora)).forEach(c => {
    const nombre = nombreCompleto(c);
    const clave = c.doc ? (c.tipoDoc||"")+c.doc : normalizar(nombre);
    const cli = mapa.get(clave) || {visitas:0, total:0};
    cli.nombre = nombre; cli.doc = c.doc ? (c.tipoDoc||"")+" "+c.doc : "";
    cli.tel = c.tel || cli.tel || ""; cli.correo = c.correo || cli.correo || "";
    cli.visitas++; cli.total += servicioDe(c).precio; cli.ultima = c.fecha;
    mapa.set(clave, cli);
  });

  const lista = Array.from(mapa.values())
    .filter(c => !q || normalizar(c.nombre+" "+c.doc+" "+c.tel).includes(q))
    .sort((a,b) => a.nombre.localeCompare(b.nombre));

  $("listaClientes").innerHTML = lista.length ? lista.map(c => `
    <article class="cliente">
      <div class="cliente__avatar">${esc(iniciales(c.nombre))}</div>
      <div class="cliente__info">
        <h3 class="cliente__nombre">${esc(c.nombre)}</h3>
        ${c.doc ? `<p class="cliente__dato">${esc(c.doc)}</p>` : ""}
        ${c.tel ? `<p class="cliente__dato">${esc(c.tel)}</p>` : ""}
        ${c.correo ? `<p class="cliente__dato">${esc(c.correo)}</p>` : ""}
        <div class="cliente__resumen">
          <span class="pastilla">${c.visitas} ${c.visitas===1?"cita":"citas"}</span>
          <span class="pastilla">Última: ${esc(fechaCorta(c.ultima))}</span>
          <span class="pastilla pastilla--pelo">${money(c.total)}</span>
        </div>
      </div>
    </article>`).join("")
    : `<div class="vacio">Todavía no hay clientes. Se crean solos al registrar una cita.</div>`;
}

function iniciarVistas(){
  $("citasBarbero").innerHTML = `<option value="todos">Todos los profesionales</option>` +
    BARBEROS.map(b => `<option value="${b.id}">${b.nombre}</option>`).join("");
  $("citasBarbero").addEventListener("change", renderCitasProgramadas);
  $("citasModo").addEventListener("change", renderCitasProgramadas);
  $("buscarCliente").addEventListener("input", renderClientes);
}
