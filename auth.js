/* ==========================================================
   auth.js
   Control de acceso: público vs administrador.
   - Público: solo Agendar + Mis citas (busca por doc o teléfono)
   - Admin: menú completo (Citas, Clientes, Configuración) y borrar
   ========================================================== */

function actualizarUIRoles(){
  const admin = esAdmin();

  /* Enlaces del menú */
  document.querySelectorAll(".menu__enlace").forEach(a => {
    const v = a.dataset.vista;
    if(v === "agendar" || v === "mis-citas"){
      a.hidden = false;
    } else if(v === "citas" || v === "clientes" || v === "config"){
      a.hidden = !admin;
    }
  });

  /* Botones de borrar citas solo para admin */
  document.querySelectorAll(".cita__borrar").forEach(b => {
    b.hidden = !admin;
  });

  /* Panel de agenda lateral: el público puede ver horarios ocupados
     (necesarios para no solapar), pero sin botón de borrar. */
  const btnBorrarAll = $("btnBorrarCitas");
  if(btnBorrarAll) btnBorrarAll.hidden = !admin;

  /* Indicador y botones de sesión */
  const ind = $("indicadorAdmin");
  if(ind){
    ind.hidden = !admin;
    ind.textContent = admin ? "Modo administrador" : "";
  }
  const btnLogin = $("btnLoginAdmin");
  const btnLogout = $("btnLogoutAdmin");
  if(btnLogin) btnLogin.hidden = admin;
  if(btnLogout) btnLogout.hidden = !admin;

  /* Si el usuario está en una vista de admin y cierra sesión, vuelve a agendar */
  if(!admin){
    const vistaActiva = document.querySelector(".vista:not([hidden])");
    if(vistaActiva && ["citas","clientes","config"].includes(vistaActiva.dataset.vista)){
      mostrarVista("agendar");
    }
  }
}

function iniciarAuth(){
  /* Login */
  $("btnLoginAdmin")?.addEventListener("click", () => {
    const pass = prompt("Contraseña de administrador:");
    if(pass === null) return;
    if(pass === ADMIN_PASSWORD){
      entrarAdmin();
      actualizarUIRoles();
      mostrarMensaje($("mensajeGlobal") || $("mensaje"), "Sesión de administrador iniciada.", "ok");
    } else {
      alert("Contraseña incorrecta.");
    }
  });

  /* Logout */
  $("btnLogoutAdmin")?.addEventListener("click", () => {
    salirAdmin();
    actualizarUIRoles();
    mostrarVista("agendar");
  });

  /* Buscar mis citas (público) */
  $("btnBuscarMisCitas")?.addEventListener("click", buscarMisCitas);
  $("buscarMisDoc")?.addEventListener("keydown", e => {
    if(e.key === "Enter"){ e.preventDefault(); buscarMisCitas(); }
  });
  $("buscarMisTel")?.addEventListener("keydown", e => {
    if(e.key === "Enter"){ e.preventDefault(); buscarMisCitas(); }
  });

  actualizarUIRoles();
}

function buscarMisCitas(){
  const doc = digitos($("buscarMisDoc")?.value || "");
  const tel = digitos($("buscarMisTel")?.value || "");
  const caja = $("listaMisCitas");
  if(!caja) return;

  if(!doc && !tel){
    caja.innerHTML = `<div class="vacio">Escribe tu documento o teléfono para ver tus citas.</div>`;
    return;
  }

  const lista = citas.filter(c => {
    const matchDoc = doc && digitos(c.doc) === doc;
    const matchTel = tel && digitos(c.tel).includes(tel);
    return matchDoc || matchTel;
  }).sort((a,b) => (a.fecha+a.hora).localeCompare(b.fecha+b.hora));

  if(!lista.length){
    caja.innerHTML = `<div class="vacio">No se encontraron citas con esos datos.</div>`;
    return;
  }

  const hoy = iso(new Date());
  const grupos = new Map();
  lista.forEach(c => {
    if(!grupos.has(c.fecha)) grupos.set(c.fecha, []);
    grupos.get(c.fecha).push(c);
  });

  caja.innerHTML = Array.from(grupos).map(([fecha, items]) => `
    <section class="grupo-fecha">
      <h3 class="grupo-fecha__titulo">${fechaLarga(fecha)}${fecha===hoy?" · hoy":""}</h3>
      <div class="grupo-fecha__citas">${items.map(c => tarjetaCitaPublica(c)).join("")}</div>
    </section>`).join("");
}

/* Tarjeta simplificada sin botón de borrar (para el público) */
function tarjetaCitaPublica(c){
  const s = servicioDe(c), b = barberoDe(c.barbero), nom = nombreCompleto(c);
  return `
    <article class="cita" style="background:${colorGrupo(s.grupo)}">
      <span class="cita__hora">${fechaCorta(c.fecha)} · ${c.hora} - ${hm(toMin(c.hora)+s.min)}</span>
      <strong class="cita__cliente">${esc(nom)}</strong>
      <span class="cita__servicio">${esc(s.nombre)}</span>
      <span class="cita__barbero">${esc(b.nombre)} · ${money(s.precio)}</span>
    </article>`;
}
