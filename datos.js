/* 
   datos.js
   Información sosbre el sist3ma */

const BARBEROS = [
  {id:"camilo", nombre:"Camilo", color:"#4b5563"},
  {id:"diego",  nombre:"Diego",  color:"#8b5e3c"},
  {id:"jaime",  nombre:"Jaime",  color:"#3b6e8f"},
  {id:"angel",  nombre:"Ángel",  color:"#6b4f9e"}
];

/* Opciones de los filtros del catálogo */
const GRUPOS = ["Todos","Fade","Taper","Crop","Buzz","Barba y extras"];
const TIPOS_PELO = ["Todos","Liso","Rizado","Grueso"];

/* Color de la tarjeta de la cita según el grupo del servicio */
const COLOR_GRUPO = {
  "Fade":"var(--cita-fade)",
  "Taper":"var(--cita-taper)",
  "Crop":"var(--cita-crop)",
  "Buzz":"var(--cita-buzz)",
  "Barba y extras":"var(--cita-extra)"
};

/* Horario de atención en minutos desde las 00:00 (9:00 = 540) */
const HORARIO = {apertura:9*60, cierre:20*60, paso:30};

/* Ayudante para crear un corte con su foto: img/cortes/01.jpg, 02.jpg... */
function corte(num, nombre, grupo, pelo, min, precio, desc){
  const n = String(num).padStart(2,"0");
  return {id:"corte-"+n, nombre, grupo, pelo, min, precio, desc, img:"img/cortes/"+n+".jpg"};
}

const SERVICIOS = [
  /* Los 20 cortes de la imagen de referencia */
  corte(1,  "Fringe Crop Fade",           "Crop",  "Liso",   30, 800, "Flequillo corto y recto, con los lados en degradado."),
  corte(2,  "Curly High Fade",            "Fade",  "Rizado", 60, 750, "Rizos definidos arriba y degradado alto en los lados."),
  corte(3,  "High Top Fade",              "Fade",  "Grueso", 60, 900, "Volumen alto arriba con laterales rapados en degradado."),
  corte(4,  "Textured Crop",              "Crop",  "Liso",   30, 500, "Corte corto con textura arriba y lados degradados."),
  corte(5,  "Taper Fade (vista trasera)", "Taper", "Liso",   30, 650, "Degradado suave en nuca y patillas, se luce por detrás."),
  corte(6,  "Box Fade",                   "Fade",  "Liso",   60, 775, "Parte superior cuadrada con degradado marcado."),
  corte(7,  "Curly Low Fade",             "Fade",  "Rizado", 60, 800, "Rizos naturales con degradado bajo y limpio."),
  corte(8,  "Mid Skin Fade",              "Fade",  "Liso",   60, 24000, "Degradado medio que llega hasta la piel."),
  corte(9,  "Low Fade with Beard",        "Fade",  "Liso",   60, 950, "Degradado bajo combinado con barba perfilada."),
  corte(10, "Drop Fade (vista trasera)",  "Fade",  "Liso",   60, 1000, "Degradado que baja en curva detrás de la oreja."),
  corte(11, "Taper Fade",                 "Taper", "Liso",   30, 800, "Degradado clásico y discreto para el día a día."),
  corte(12, "Temp Fade (Temple Fade)",    "Fade",  "Liso",   30, 900, "Degradado solo en sienes y nuca con perfilado marcado."),
  corte(13, "Buzz Cut with Fade",         "Buzz",  "Liso",   30, 400, "Rapado corto con degradado en los costados."),
  corte(14, "Classic Taper Fade",         "Taper", "Liso",   30, 850, "Taper tradicional con largo medio arriba."),
  corte(15, "Skin Fade with Short Curls", "Fade",  "Rizado", 60, 600, "Degradado a piel con rizos cortos arriba."),
  corte(16, "Low Fade with Shape Up",     "Fade",  "Liso",   60, 650, "Degradado bajo con línea frontal perfilada."),
  corte(17, "Buzz Cut with Fade II",      "Buzz",  "Liso",   30, 700, "Variante del rapado con degradado más alto."),
  corte(18, "Pompadour Fade",             "Fade",  "Grueso", 60, 900, "Copete peinado hacia atrás con lados en degradado."),
  corte(19, "Shadow Fade",                "Fade",  "Liso",   60, 400, "Degradado suave que se difumina como una sombra."),
  corte(20, "Burst Fade",                 "Fade",  "Liso",   60, 500, "Degradado en semicírculo alrededor de la oreja."),

  /* Otros servicios (sin foto: la tarjeta muestra un icono) */
  {id:"clasico", nombre:"Corte de cabello clásico", grupo:"Barba y extras", pelo:null, min:60, precio:1000, antes:20000,
   etiqueta:"Descuento pagando en línea", desc:"Un corte de cabello tradicional con acabado limpio y estilo clásico.", img:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgkB29e1dYsINjbuXRL0NKSGPso5_8ifFZ5XqDDeLq5E-1ouy504hcHY7G&s=10"},
  {id:"barba", nombre:"Corte de barba", grupo:"Barba y extras", pelo:null, min:30, precio:700,
   desc:"Recorte y diseño de la barba según las preferencias del cliente, con afeitado de contornos.", img:"https://img.magnific.com/foto-gratis/hombre-joven-consiguiendo-su-barba-estilo-peluquero_23-2148985728.jpg?semt=ais_hybrid&w=740&q=80"},
  {id:"combo", nombre:"Lavado, hidratación y corte de barba", grupo:"Barba y extras", pelo:null,
   min:120, precio:500,
   desc:"Lavado, tratamiento hidratante y corte de barba completo.", img:"https://beauty.com.uy/cdn/shop/articles/Tutorial-para-lavar-tu-barba-como-se-debe.jpg?v=1563691904"},
  {id:"cejas", nombre:"Perfilado de cejas", grupo:"Barba y extras", pelo:null, min:30, precio:300,
   desc:"Perfilado y limpieza rápida de cejas.", img:"https://www.grupoalmagro.com/wp-content/uploads/2025/11/ChatGPT-Image-23-nov-2025-18_44_14.png"}
];

