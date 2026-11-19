

const CLAVE_CITAS  = "barberia_citas_v1";
const CLAVE_CONFIG = "barberia_config_v1";
const CLAVE_ADMIN  = "barberia_admin_v1";

/* ---------- utilidades locales (respaldo) ---------- */
function leerJSON(clave, defecto){
  try{ const t = localStorage.getItem(clave); return t ? JSON.parse(t) : defecto; }
  catch(e){ return defecto; }
}
function escribirJSON(clave, valor){
  try{ localStorage.setItem(clave, JSON.stringify(valor)); return true; }
  catch(e){ return false; }
}

function filaACita(r){
  return {
    id: r.id,
    nombres: r.nombres || "",
    apellidos: r.apellidos || "",
    tipoDoc: r.tipo_doc || "CC",
    doc: r.doc || "",
    nacimiento: r.nacimiento || "",
    tel: r.tel || "",
    correo: r.correo || "",
    direccion: r.direccion || "",
    origen: r.origen || "",
    servicio: r.servicio,
    barbero: r.barbero,
    fecha: r.fecha,
    hora: r.hora,
    pago: r.pago || "efectivo",
    notas: r.notas || "",
    recordatorio: !!r.recordatorio
  };
}

function citaAFila(c){
  return {
    id: c.id,
    nombres: c.nombres || "",
    apellidos: c.apellidos || "",
    tipo_doc: c.tipoDoc || "CC",
    doc: c.doc || "",
    nacimiento: c.nacimiento || "",
    tel: c.tel || "",
    correo: c.correo || "",
    direccion: c.direccion || "",
    origen: c.origen || "",
    servicio: c.servicio,
    barbero: c.barbero,
    fecha: c.fecha,
    hora: c.hora,
    pago: c.pago || "efectivo",
    notas: c.notas || "",
    recordatorio: !!c.recordatorio
  };
}


async function cargarCitas(){
  if(sb){
    try{
      const { data, error } = await sb.from("citas").select("*").order("fecha").order("hora");
      if(error) throw error;
      return (data || []).map(filaACita);
    }catch(e){
      console.warn("Error cargando citas de Supabase, usando localStorage:", e);
    }
  }
  const d = leerJSON(CLAVE_CITAS, []);
  return Array.isArray(d) ? d : [];
}

async function guardarCitas(){
  escribirJSON(CLAVE_CITAS, citas);
  return true;
}

async function insertarCita(cita){
  if(sb){
    try{
      const { error } = await sb.from("citas").insert(citaAFila(cita));
      if(error) throw error;
    }catch(e){
      console.warn("Error insertando en Supabase:", e);
      alert("No se pudo guardar en el servidor. Se guardó localmente.");
    }
  }
  citas.push(cita);
  escribirJSON(CLAVE_CITAS, citas);
}

async function eliminarCita(id){
  if(sb){
    try{
      const { error } = await sb.from("citas").delete().eq("id", id);
      if(error) throw error;
    }catch(e){
      console.warn("Error eliminando en Supabase:", e);
      alert("No se pudo borrar en el servidor. Se borró localmente.");
    }
  }
  citas = citas.filter(x => x.id !== id);
  escribirJSON(CLAVE_CITAS, citas);
}

async function borrarTodasCitas(){
  if(sb){
    try{
      const { error } = await sb.from("citas").delete().neq("id", "");
      if(error) throw error;
    }catch(e){
      console.warn("Error borrando todas en Supabase:", e);
    }
  }
  citas = [];
  escribirJSON(CLAVE_CITAS, citas);
}

/* ---------- Config (Estandarizado con logo_url) ---------- */
async function cargarConfig(){
  if(sb){
    try{
      const { data, error } = await sb.from("config").select("*").eq("id", 1).maybeSingle();
      if(error) throw error;
      if(data){
        return { nombre: data.nombre || "Barbería Pro", logo_url: data.logo_url || "" };
      }
    }catch(e){
      console.warn("Error cargando config de Supabase:", e);
    }
  }
  // Respaldo local adaptado a logo_url
  const local = leerJSON(CLAVE_CONFIG, { nombre: "Barbería Pro", logo_url: "" });
  return {
    nombre: local.nombre || "Barbería Pro",
    logo_url: local.logo_url || local.logoUrl || ""
  };
}

async function guardarConfig(){
  if(sb){
    try{
      const { error } = await sb.from("config").upsert({
        id: 1,
        nombre: config.nombre,
        logo_url: config.logo_url || "", 
        actualizado: new Date().toISOString()
      });
      if(error) throw error;
    }catch(e){
      console.warn("Error guardando config en Supabase:", e);
    }
  }
  escribirJSON(CLAVE_CONFIG, config);
}

function esAdmin(){
  return sessionStorage.getItem(CLAVE_ADMIN) === "1";
}
function entrarAdmin(){
  sessionStorage.setItem(CLAVE_ADMIN, "1");
}
function salirAdmin(){
  sessionStorage.removeItem(CLAVE_ADMIN);
}