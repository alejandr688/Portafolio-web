# Portafolio de Alejandro Pérez Romero

Sitio estático rápido y totalmente responsivo construido solo con HTML, CSS y JavaScript (vanilla). UI en español.

## Cómo ejecutar
- Opción 1 (recomendada): abrir con un servidor local (evita restricciones de CORS al leer JSON).
  - Si tienes Python instalado: `python -m http.server` y abre `http://localhost:8000`.
  - O usa cualquier servidor estático (live-server, http-server, etc.).
- Opción 2: abrir directamente `index.html` en el navegador. Nota: algunos navegadores bloquean `fetch` de archivos locales. El sitio incluye "fallback" a datos embebidos para que funcione sin servidor, pero los cambios en JSON podrían no reflejarse sin un servidor local.

## Estructura
- /index.html (Inicio/Hero + destacados)
- /about.html (Sobre mí)
- /skills.html (Habilidades & Stack)
- /projects.html (Proyectos con filtros + búsqueda)
- /research.html (Investigación/Laboratorio, links a PDFs)
- /blog.html (Lista de notas)
- /talks.html (Charlas con iframes)
- /resume.html (CV & Logros con descarga)
- /contact.html (Contacto)
- /assets/css/styles.css (un solo CSS)
- /assets/js/app.js (componentes UI + utilidades)
- /assets/js/animations.js (microinteracciones y on-scroll)
- /assets/js/data.js (carga de datos desde JSON con fallback)
- /assets/data/projects.json, posts.json, research.json (contenido)
- /assets/img/** (imágenes optimizadas o placeholders SVG)
- /public/docs/** (PDFs, incluyendo CV placeholder)
- /robots.txt, /sitemap.xml, /favicon.svg

## Editar datos
- Edita los JSON en `assets/data/`.
- Campos esperados:
  - projects.json: `{ title, category, description, tags[], year, metrics, links { github, demo, video }, images[] }`
  - posts.json: `{ title, tags[], date, excerpt, slug }`
  - research.json: `{ title, year, abstract, pdfPath }`

## Agregar una página nueva
1) Crea el archivo HTML en la raíz.
2) Incluye `<link rel="stylesheet" href="./assets/css/styles.css">` y los scripts `app.js` y `animations.js` antes del cierre de `</body>`.
3) Agrega el enlace en la navegación (Navbar). La Navbar se inyecta automáticamente por `app.js`.

## Reemplazar imágenes/PDFs
- Coloca imágenes en `assets/img/`. Usa formatos modernos y `loading="lazy"`.
- Coloca PDFs en `public/docs/`. Actualiza rutas en `research.json` y `resume.html`.

## Accesibilidad y rendimiento
- Soporta `prefers-color-scheme` (oscuro/claro) y `prefers-reduced-motion`.
- Navegación por teclado, `focus-visible`, roles ARIA en componentes.
- Imágenes responsivas con `<picture>`, lazy-loading.

## Licencia y autoría
- Autor: Alejandro Pérez Romero
- Personaliza textos, proyectos y estilos a tu gusto.
