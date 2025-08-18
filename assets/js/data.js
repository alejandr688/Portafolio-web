/* Carga de datos desde JSON con fallback a seed en memoria
   - Evita problemas de CORS al abrir con file://
   - Todos los textos en español
*/

const PROJECTS_SEED = [
  {
    "title": "Espectroscopio casero con rejilla",
    "category": "Física/Óptica",
    "description": "Construcción y calibración de un espectroscopio con rejilla de difracción. Captura con cámara y análisis espectral en Python.",
    "tags": ["Python", "Óptica", "Seaborn", "Numpy"],
    "year": 2023,
    "metrics": { "rmse": 0.012, "views": 1240 },
    "links": { "github": "#", "demo": "#", "video": "#" },
    "images": ["assets/img/placeholder.svg"]
  },
  {
    "title": "Fotografía Schlieren con IA",
    "category": "Física/Óptica",
    "description": "Setup de Schlieren de bajo costo para visualizar gradientes térmicos. Segmentación asistida por visión por computadora.",
    "tags": ["Computer Vision", "OpenCV", "Python", "Óptica"],
    "year": 2024,
    "metrics": { "accuracy": 0.91, "views": 980 },
    "links": { "github": "#", "demo": "#", "video": "#" },
    "images": ["assets/img/placeholder.svg"]
  },
  {
    "title": "Kaggle: Global Student Perceptions of ChatGPT",
    "category": "Data Science",
    "description": "EDA y modelos para entender percepciones estudiantiles sobre ChatGPT. Visualizaciones, ingeniería de variables y evaluación.",
    "tags": ["Pandas", "Seaborn", "scikit-learn", "Python"],
    "year": 2023,
    "metrics": { "roc_auc": 0.84, "views": 2100 },
    "links": { "github": "#", "demo": "#", "video": "#" },
    "images": ["assets/img/placeholder.svg"]
  },
  {
    "title": "Contador de pasos con acelerómetro",
    "category": "Electrónica/IoT",
    "description": "Pedometer con Arduino + MPU6050. Filtro y conteo de eventos con umbrales adaptativos.",
    "tags": ["Arduino", "Señales", "C", "MPU6050"],
    "year": 2022,
    "metrics": { "accuracy": 0.93, "views": 640 },
    "links": { "github": "#", "demo": "#", "video": "#" },
    "images": ["assets/img/placeholder.svg"]
  },
  {
    "title": "Medidor UV con alertas de voz",
    "category": "Electrónica/IoT",
    "description": "Sensor UV con notificaciones de voz y registro de datos ambientales. Umbrales configurables.",
    "tags": ["IoT", "Sensores", "TTS", "Microcontroladores"],
    "year": 2022,
    "metrics": { "max_uv_index": 9.2, "views": 520 },
    "links": { "github": "#", "demo": "#", "video": "#" },
    "images": ["assets/img/placeholder.svg"]
  },
  {
    "title": "Portfolio Web",
    "category": "Web",
    "description": "Este sitio: HTML/CSS/JS vanilla, accesible, rápido y responsivo.",
    "tags": ["HTML", "CSS", "JavaScript"],
    "year": 2025,
    "metrics": { "lighthouse": 98, "views": 1 },
    "links": { "github": "#", "demo": "#", "video": "#" },
    "images": ["assets/img/placeholder.svg"]
  },
  {
    "title": "Leyes de reflexión y refracción (Óptica)",
    "category": "Física/Óptica",
    "description": "Demostración interactiva de las leyes de la reflexión y la refracción (Ley de Snell). Incluye visualización de rayos, cálculo de ángulo crítico y reflexión interna total para distintos índices de refracción.",
    "tags": ["Óptica", "Física", "Snell", "Simulación", "JavaScript"],
    "year": 2025,
    "metrics": { "casos": 120, "tirs_detectadas": 36 },
    "links": { "github": "#", "demo": "public/demos/optica-leyes.html", "video": "#" },
    "images": ["assets/img/placeholder.svg"]
  }
];

const POSTS_SEED = [
  {
    "title": "ANOVA en R: guía express para decidir",
    "tags": ["R", "Estadística"],
    "date": "2024-05-12",
    "excerpt": "Cuándo usar ANOVA y cómo interpretar sus resultados en pocos pasos.",
    "slug": "anova-r-guia-express"
  },
  {
    "title": "Pipelines con pandas para datos limpios",
    "tags": ["Python", "Data"],
    "date": "2024-09-03",
    "excerpt": "Estructura tus transformaciones con claridad y reproducibilidad.",
    "slug": "pipelines-pandas-datos-limpios"
  },
  {
    "title": "Schlieren 101: visualizando el aire",
    "tags": ["Óptica"],
    "date": "2023-11-20",
    "excerpt": "Fundamentos y tips prácticos para fotografía Schlieren casera.",
    "slug": "schlieren-101"
  }
];

const RESEARCH_SEED = [
  {
    "title": "Medición espectral con rejilla y cámara",
    "year": 2023,
    "abstract": "Prototipo de espectroscopio y validación con fuentes de referencia.",
    "pdfPath": "public/docs/paper_1.pdf"
  },
  {
    "title": "Visualización Schlieren asistida por IA",
    "year": 2024,
    "abstract": "Detección de gradientes térmicos y realce de bordes en video.",
    "pdfPath": "public/docs/paper_2.pdf"
  },
  {
    "title": "Análisis de percepciones estudiantiles sobre ChatGPT",
    "year": 2023,
    "abstract": "Encuestas globales y modelos para explorar actitudes y uso.",
    "pdfPath": "public/docs/paper_3.pdf"
  }
];

async function loadJSON(url, fallback) {
  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    return await res.json();
  } catch (err) {
    console.warn('Usando fallback para', url, err?.message || err);
    return fallback;
  }
}

window.DataAPI = {
  loadProjects() { return loadJSON('assets/data/projects.json', PROJECTS_SEED); },
  loadPosts() { return loadJSON('assets/data/posts.json', POSTS_SEED); },
  loadResearch() { return loadJSON('assets/data/research.json', RESEARCH_SEED); }
};
