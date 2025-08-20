/* Carga de datos desde JSON con fallback a seed en memoria
   - Evita problemas de CORS al abrir con file://
   - Todos los textos en español
*/

const PROJECTS_SEED = [
  {
    "title": "Leyes de reflexión y refracción (Óptica)",
    "category": "Física/Óptica",
    "description": "Demostración interactiva de las leyes de la reflexión y la refracción (Ley de Snell). Incluye visualización de rayos, cálculo de ángulo crítico y reflexión interna total para distintos índices de refracción.",
    "tags": ["Óptica", "Física", "Snell", "Simulación", "JavaScript"],
    "year": 2025,
    "metrics": { "casos": 120, "tirs_detectadas": 36 },
    "links": { 
      "report": "public/docs/reporte-optica.pdf", 
      "sim": "public/demos/optica-leyes.html",
      "github": "#",
      "video": "#"
    },
    "images": ["assets/img/Esquemapractica1.webp"]
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

const CERTIFICATES_SEED = [
  {
    "title": "Currículum Vitae",
    "path": "./public/docs/Alejandro_Perez_Romero_CV.pdf"
  },
  {
    "title": "Certificado de Idiomas",
    "path": "./public/docs/idiomas alejandro.pdf"
  },
  {
    "title": "Coursera: Understanding and Visualizing Data with Python",
    "path": "./public/docs/Coursera IVIAKDLVX4M8.pdf"
  },
  {
    "title": "Coursera: What is Data Science?",
    "path": "./public/docs/Coursera NJFONI0SH73M.pdf"
  },
  {
    "title": "Coursera: Data Science Tools",
    "path": "./public/docs/Coursera XENK764EJN0W.pdf"
  }
];

const TALKS_SEED = [
  {
    "title": "¿Qué son los números perfectos?",
    "videoId": "jCJtCNnuivQ"
  },
  {
    "title": "Tablero de ajedrez mermano",
    "videoId": "RfWKDlTj08c"
  },
  {
    "title": "Numeros sociables",
    "videoId": "5XS0kITyqu8"
  }
];

window.DataAPI = {
  loadProjects() { return Promise.resolve(PROJECTS_SEED); },
  loadPosts() { return loadJSON('assets/data/posts.json', POSTS_SEED); },
  loadResearch() { return loadJSON('assets/data/research.json', RESEARCH_SEED); },
  loadTalks() { return Promise.resolve(TALKS_SEED); },
  loadCertificates() { return Promise.resolve(CERTIFICATES_SEED); }
};
