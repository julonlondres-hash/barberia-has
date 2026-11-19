/* ==========================================================
   utilidades.js
   Funciones pequeñas que usan todos los demás archivos:
   fechas, horas, dinero, textos seguros y búsquedas.
   ========================================================== */

const $ = id => document.getElementById(id);   // atajo para getElementById

/* --- Fechas y horas --- */
function iso(d){                                // Date -> "2026-11-11"
  const z = n => String(n).padStart(2,"0");
  return d.getFullYear()+"-"+z(d.getMonth()+1)+"-"+z(d.getDate());
}
function parse(s){                              // "2026-11-11" -> Date
  const [y,m,d] = s.split("-").map(Number);
  return new Date(y,m-1,d);
}
function hm(min){                               // 570 -> "09:30"
  const z = n => String(n).padStart(2,"0");
  return z(Math.floor(min/60))+":"+z(min%60);
}
function toMin(h){                              // "09:30" -> 570
  const [a,b] = h.split(":").map(Number);
  return a*60+b;
}
function mayus(t){ return t.charAt(0).toUpperCase() + t.slice(1); }   // solo la primera letra
function fechaLarga(s){ return mayus(parse(s).toLocaleDateString("es-CO",{weekday:"long",day:"numeric",month:"long"})); }
function fechaCorta(s){ return mayus(parse(s).toLocaleDateString("es-CO",{weekday:"short",day:"numeric",month:"short"})); }

/* --- Textos --- */
function money(n){ return "RD"+Number(n).toLocaleString("es-CO"); }
function esc(s){                                // evita que un texto escrito rompa el HTML
  return String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
}
function digitos(s){ return (s||"").replace(/\D/g,""); }
function normalizar(s){                         // minúsculas y sin tildes, para buscar
  return String(s||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
}
function iniciales(nombre){
  const p = String(nombre||"").trim().split(/\s+/).filter(Boolean);
  return ((p[0]||"B")[0] + (p[1] ? p[1][0] : "")).toUpperCase();
}
function mostrarMensaje(el, texto, tipo){       // tipo: "ok" | "error" | ""
  el.className = "mensaje" + (tipo ? " mensaje--"+tipo : "");
  el.textContent = texto;
}

/* --- Buscar datos en las listas --- */
const svc = id => SERVICIOS.find(s => s.id === id);
const bar = id => BARBEROS.find(b => b.id === id);
function servicioDe(c){                         // si el servicio ya no existe, no se rompe
  return svc(c.servicio) || {id:c.servicio, nombre:"Servicio", grupo:"Barba y extras", min:30, precio:0};
}
function barberoDe(id){ return bar(id) || {id, nombre:"—", color:"#4b5563"}; }
function colorGrupo(g){ return COLOR_GRUPO[g] || "var(--cita-extra)"; }
function nombreCompleto(c){ return c.cliente || ((c.nombres||"")+" "+(c.apellidos||"")).trim(); }
