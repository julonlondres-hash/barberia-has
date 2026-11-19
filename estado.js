/* ==========================================================
   estado.js
   Las variables "vivas" de la aplicación. Todos los archivos
   las leen y las modifican.
   ========================================================== */
let citas  = [];                 // se carga de forma asíncrona al arrancar
let config = {nombre:"Barbería Pro", logoUrl:""};

/* Lo que el usuario está eligiendo en el formulario */
const st = {
  barbero:  "camilo",
  servicio: null,
  fecha:    iso(new Date()),   // fecha de la cita nueva
  hora:     null,
  dia:      iso(new Date())    // día que se ve en la agenda
};

/* Filtros del catálogo */
const filtro = {grupo:"Todos", pelo:"Todos", texto:""};
