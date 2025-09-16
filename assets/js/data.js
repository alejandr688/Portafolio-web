/* Carga de datos desde JSON con fallback a seed en memoria
   - Evita problemas de CORS al abrir con file://
   - Todos los textos en español
*/

const OPTICS_PROJECTS_SEED = [
  {
    "title": "Leyes de reflexión y refracción",
    "category": "Óptica Geométrica",
    "description": "Proyecto integral sobre óptica geométrica que incluye un simulador interactivo de reflexión y refracción (Ley de Snell), un reporte de laboratorio con análisis físico, gráficas y datos en GitHub.",
    "tags": ["Óptica", "Física", "Snell", "Simulación", "JavaScript"],
    "year": 2025,
    "links": {
      "report": "./assets/pdf/Reporte_Óptica_Práctica_1.pdf",
      "sim": "./public/demos/optica-leyes.html",
      "github": "https://github.com/alejandr688/laboratorio-optica/tree/main/Practica1"
    },
    "images": ["./assets/img/Esquemapractica1.webp"]
  },
  {
    "title": "Simulación de un Interferómetro de Michelson",
    "category": "Óptica Ondulatoria",
    "description": "Visualización de patrones de interferencia y su cambio al variar la longitud de onda y la diferencia de caminos ópticos.",
    "tags": ["Óptica", "Interferencia", "Simulación", "Python"],
    "year": 2024,
    "links": { "github": "#" },
    "images": ["https://picsum.photos/seed/michelson/800/600"]
  },
  {
    "title": "Análisis de Difracción con Procesamiento de Imágenes",
    "category": "Óptica de Fourier",
    "description": "Análisis de patrones de difracción de una rendija usando Python y OpenCV para medir características del patrón.",
    "tags": ["Difracción", "OpenCV", "Python", "Procesamiento de Imágenes"],
    "year": 2023,
    "links": { "github": "#", "report": "#" },
    "images": ["https://picsum.photos/seed/diffraction/800/600"]
  }
];

const PROJECTS_SEED = [
  {
    "title": "Experimentos de Óptica",
    "category": "Física/Óptica",
    "description": "Una colección de simulaciones y análisis de fenómenos ópticos, desde la óptica geométrica hasta la ondulatoria y de Fourier.",
    "tags": ["Óptica", "Física", "Simulación"],
    "year": 2025,
    "links": {},
    "subcategoryPage": "optics.html",
    "images": ["./assets/img/experimentos_optica.webp"]
  },
  {
    "title": "Análisis de Datasets",
    "category": "Data Science",
    "description": "Análisis de diferentes datasets aplicando técnicas de data science: limpieza, EDA, visualización y modelos predictivos comparativos.",
    "tags": ["NLP", "Python", "D3.js", "API"],
    "year": 2025,
    "links": { 
      "github": "#"
    },
    "images": ["./assets/img/miniaturaanalisisdedatos_optimizado.webp"]
  },
  {
    "title": "Generador de Arte con Redes Neuronales",
    "category": "Inteligencia Artificial",
    "description": "Implementación de un modelo StyleGAN2 para generar retratos artísticos únicos, con una interfaz web para experimentar con los parámetros del modelo.",
    "tags": ["IA", "Deep Learning", "PyTorch", "React"],
    "year": 2023,
    "links": { 
      "github": "#",
      "sim": "#"
    },
    "images": ["https://picsum.photos/seed/stylegan/800/600"]
  },
  {
    "title": "Plataforma de E-learning Adaptativo",
    "category": "Desarrollo Web",
    "description": "Sistema de gestión de aprendizaje que personaliza el contenido para cada estudiante basándose en su rendimiento, utilizando algoritmos de recomendación.",
    "tags": ["Full-Stack", "Node.js", "Vue.js", "Machine Learning"],
    "year": 2024,
    "links": { 
      "github": "#"
    },
    "images": ["https://picsum.photos/seed/elearning/800/600"]
  },
  {
    "title": "Simulación de Dinámica de Fluidos (CFD)",
    "category": "Ingeniería",
    "description": "Simulación computacional para modelar el flujo de aire alrededor de un perfil alar, implementado en C++ con visualización en ParaView.",
    "tags": ["CFD", "C++", "Física", "Simulación"],
    "year": 2022,
    "links": { 
      "github": "#",
      "report": "#"
    },
    "images": ["https://picsum.photos/seed/cfd/800/600"]
  },
  {
    "title": "Detección de Anomalías en Series Temporales",
    "category": "Data Science",
    "description": "Detección de patrones inusuales en datos de sensores IoT utilizando modelos como LSTM y Isolation Forest para mantenimiento predictivo.",
    "tags": ["IoT", "TensorFlow", "Series Temporales"],
    "year": 2023,
    "links": { 
      "github": "#"
    },
    "images": ["https://picsum.photos/seed/iot/800/600"]
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
  loadOpticsProjects() { return Promise.resolve(OPTICS_PROJECTS_SEED); },
  loadPosts() { return loadJSON('assets/data/posts.json', POSTS_SEED); },
  loadResearch() { return loadJSON('assets/data/research.json', RESEARCH_SEED); },
  loadTalks() { return Promise.resolve(TALKS_SEED); },
  loadCertificates() { return Promise.resolve(CERTIFICATES_SEED); }
};
