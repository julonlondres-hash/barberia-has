/* credensiales*/

const SUPABASE_URL = "https://rocnlsxkfdzscqobzyov.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_7rukYxWXspg0GosgvavD0w_AKFlb39u";

/* Contraseña del administrador*/
const ADMIN_PASSWORD = "admin123";


let sb = null;
try {
  if (typeof supabase !== "undefined" && SUPABASE_URL && !SUPABASE_URL.includes("TU-PROYECTO")) {
    sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
} catch (e) {
  console.warn("Supabase no disponible, se usará localStorage de respaldo.", e);
}
