/* ==========================================================
   disponibilidad.js
   Aquí está la regla clave del proyecto:
   "Indicar cuándo un horario ya está ocupado".
   Dos citas del MISMO barbero se cruzan si una empieza antes
   de que la otra termine.
   ========================================================== */

function ocupado(fecha, barbero, inicio, duracion){
  return citas.some(c => {
    if(c.fecha !== fecha || c.barbero !== barbero) return false;
    const a = toMin(c.hora);              // cuándo empieza la cita guardada
    const b = a + servicioDe(c).min;      // cuándo termina
    return inicio < b && a < inicio + duracion;   // ¿se cruzan?
  });
}

/* Devuelve todas las horas del día con su estado: libre, ocupada o pasada */
function horasDelDia(fecha, barbero, servicio){
  const ahora = new Date();
  const esHoy = fecha === iso(ahora);
  const minAhora = ahora.getHours()*60 + ahora.getMinutes();
  const lista = [];
  for(let m = HORARIO.apertura; m + servicio.min <= HORARIO.cierre; m += HORARIO.paso){
    let estado = "libre";
    if(esHoy && m <= minAhora) estado = "pasada";
    else if(ocupado(fecha, barbero, m, servicio.min)) estado = "ocupada";
    lista.push({hora:hm(m), estado});
  }
  return lista;
}
