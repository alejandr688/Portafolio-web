/*
  App UI: Navbar, tema, progreso de scroll, tooltips, toasts, modales, lightbox.
  Páginas: proyectos (filtros/búsqueda/orden), contacto (validación).
*/
(function(){
  const $ = sel => document.querySelector(sel);
  const $$ = sel => Array.from(document.querySelectorAll(sel));

  document.addEventListener('DOMContentLoaded', init);

  function init(){
    injectLayout();
    bindTheme();
    bindScrollProgress();
    bindSectionIndicator();
    // bindAnchorScrollSpy();
    bindCommonUI();
    bindRotatingTexts();
    bindSearchButton();
    routeInit();
  }

  // Sidebar + Footer + App Shell
  function injectLayout(){
    // Construye el shell con sidebar
    const shell = document.createElement('div');
    shell.className = 'app-shell';
    shell.innerHTML = `
      <aside class="sidebar" id="sidebar" role="navigation" aria-label="Principal">
        <div class="sidebar-header">
          <a class="brand" href="./index.html" aria-label="Alejandro Pérez Romero - Inicio">
            <span class="dot" aria-hidden="true"></span>
            <span>Alejandro Pérez Romero</span>
          </a>
          <div class="sidebar-controls">
            <button class="theme-toggle" title="Tema claro/oscuro" aria-label="Cambiar tema">🌓</button>
            <button class="desktop-collapse" aria-label="Ocultar menú" aria-controls="sidebar" aria-expanded="true">⮜</button>
            <button class="sidebar-toggle" aria-label="Cerrar menú" aria-expanded="true" aria-controls="sidebar">✕</button>
          </div>
        </div>
        <nav class="sidebar-nav" aria-label="Secciones">
          ${navLink('index.html','Inicio')}
          ${navLink('about.html','Sobre mí')}
          ${navLink('skills.html','Habilidades')}
          ${navLink('projects.html','Proyectos')}
          ${navLink('research.html','Investigación')}
          ${navLink('blog.html','Blog')}
          ${navLink('talks.html','Mi Canal')}
          ${navLink('certificates.html','Certificados')}
          ${navLink('resume.html','CV')}
          ${navLink('contact.html','Contacto')}
        </nav>
        <div class="sidebar-footer">
          <span class="badge section-indicator" id="sectionIndicator" aria-live="polite"></span>
        </div>
      </aside>
      <div class="overlay" id="overlay" tabindex="-1" aria-hidden="true"></div>
      <div class="app-content" id="appContent">
        <header class="app-header">
          <a class="brand" href="./index.html" aria-label="Alejandro Pérez Romero - Inicio">
            <span class="dot"></span>
            <span>Alejandro Pérez Romero</span>
          </a>
          <div class="header-actions">
            <button class="theme-toggle" title="Tema claro/oscuro" aria-label="Cambiar tema">🌓</button>
            <button class="sidebar-trigger" aria-label="Abrir menú" aria-expanded="false" aria-controls="sidebar">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            </button>
          </div>
        </header>
        <div class="scroll-progress" aria-hidden="true"></div>
        <button class="scroll-top" title="Subir" aria-label="Volver arriba">↑</button>
      </div>`;
    // Insertar shell y mover contenido existente dentro de app-content
    const existing = Array.from(document.body.children);
    document.body.prepend(shell);
    const contentHost = shell.querySelector('#appContent');
    existing.forEach(el => {
      if (el.matches('script')) return;
      if (el === shell) return;
      contentHost.append(el);
    });
    // Footer dentro del contenido
    const footer = document.createElement('footer');
    footer.innerHTML = `
      <div class="container">
        <div>© ${new Date().getFullYear()} Alejandro Pérez Romero • Portafolio</div>
      </div>`;
    contentHost.append(footer);
    // Área de toasts (flotante)
    const ta = document.createElement('div');
    ta.className = 'toast-area';
    document.body.append(ta);
    // Dock (escritorio) para mostrar nombre y reabrir la sidebar cuando esté colapsada
    const dock = document.createElement('div');
    dock.className = 'sidebar-dock';
    dock.id = 'sidebarDock';
    dock.setAttribute('aria-hidden','true');
    dock.innerHTML = `
      <a class="brand" href="./index.html" aria-label="Alejandro Pérez Romero - Inicio">
        <span class="dot" aria-hidden="true"></span>
        <span>Alejandro Pérez Romero</span>
      </a>
      <button class="dock-toggle" aria-label="Mostrar menú" aria-controls="sidebar" aria-expanded="false">☰</button>
    `;
    document.body.append(dock);
    // Toggle sidebar + overlay
    const trigger = document.querySelector('.sidebar-trigger');
    const closeBtn = shell.querySelector('.sidebar-toggle');
    const desktopBtn = shell.querySelector('.desktop-collapse');
    const overlay = shell.querySelector('#overlay');
    function setOpen(open){
      document.body.classList.toggle('nav-open', !!open);
      trigger && trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
      closeBtn && closeBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (overlay) {
        if (open) overlay.removeAttribute('aria-hidden');
        else overlay.setAttribute('aria-hidden','true');
      }
    }
    trigger && trigger.addEventListener('click', ()=> setOpen(!document.body.classList.contains('nav-open')));
    closeBtn && closeBtn.addEventListener('click', ()=> setOpen(false));
    overlay && overlay.addEventListener('click', ()=> setOpen(false));
    document.addEventListener('keydown', (e)=>{ if(e.key==='Escape') setOpen(false); });

    // Colapso en escritorio (no móvil)
    const mqlDesktop = window.matchMedia('(min-width: 901px)');
    const dockToggle = dock.querySelector('.dock-toggle');
    function setDesktopCollapsed(collapsed){
      if(!mqlDesktop.matches){
        document.body.classList.remove('sidebar-collapsed');
        desktopBtn && desktopBtn.setAttribute('aria-expanded','true');
        dockToggle && dockToggle.setAttribute('aria-expanded','false');
        dock && dock.setAttribute('aria-hidden','true');
        return;
      }
      document.body.classList.toggle('sidebar-collapsed', !!collapsed);
      const expanded = !collapsed;
      desktopBtn && desktopBtn.setAttribute('aria-expanded', expanded ? 'true' : 'false');
      dockToggle && dockToggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
      dock && dock.setAttribute('aria-hidden', expanded ? 'true' : 'false');
    }
    desktopBtn && desktopBtn.addEventListener('click', ()=> setDesktopCollapsed(true));
    dockToggle && dockToggle.addEventListener('click', ()=> setDesktopCollapsed(false));
    try { mqlDesktop.addEventListener('change', ()=> setDesktopCollapsed(false)); } catch{}
    // Estado inicial
    setDesktopCollapsed(false);
    // Enlace activo
    const path = location.pathname.split('/').pop() || 'index.html';
    $$('.sidebar-nav a').forEach(a=>{ if(a.getAttribute('href')===path) a.classList.add('active'); });
    // Scroll-to-top
    const topBtn = shell.querySelector('.scroll-top');
    window.addEventListener('scroll', ()=>{
      if(topBtn) topBtn.style.display = (window.scrollY > 500) ? 'inline-flex' : 'none';
    }, { passive: true });
    topBtn && topBtn.addEventListener('click', ()=> window.scrollTo({top:0, behavior:'smooth'}));
  }

  function navLink(href, label){
    return `<a href="./${href}">${label}</a>`;
  }

  // Indicador de sección activa dentro de la página
  function bindSectionIndicator(){
    const indicator = document.getElementById('sectionIndicator');
    if(!indicator) return;
    const sections = Array.from(document.querySelectorAll('main section'));
    if(!sections.length) return;
    const getTitle = (s)=> (s.querySelector('h1,h2,h3')?.textContent || '').trim();
    const io = new IntersectionObserver((entries)=>{
      // Selecciona el más visible
      const vis = entries.filter(e=> e.isIntersecting).sort((a,b)=> b.intersectionRatio - a.intersectionRatio);
      if(vis[0]) indicator.textContent = getTitle(vis[0].target);
    }, { threshold: [0.15, 0.4, 0.7], rootMargin: '-10% 0px -60% 0px' });
    sections.forEach(s=> io.observe(s));
    // Inicial
    indicator.textContent = getTitle(sections[0]);
  }

  // Tema claro/oscuro
  function bindTheme(){
    const key = 'apr_theme';
    const buttons = $$('.theme-toggle');
    if(!buttons.length) return;

    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const saved = localStorage.getItem(key);
    const existing = document.documentElement.getAttribute('data-theme');
    const initial = saved || existing || (mql.matches ? 'dark' : 'light');

    function setTheme(mode, persist){
      document.documentElement.setAttribute('data-theme', mode);
      document.body && document.body.setAttribute('data-theme', mode);
      buttons.forEach(btn => {
        btn.setAttribute('aria-pressed', mode === 'dark' ? 'true' : 'false');
        btn.title = mode === 'dark' ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro';
      });
      if(persist) localStorage.setItem(key, mode);
    }

    setTheme(initial, false);

    buttons.forEach(btn => {
      btn.addEventListener('click', ()=> {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        setTheme(currentTheme === 'dark' ? 'light' : 'dark', true);
      });
    });

    if(!saved){
      try { 
        mql.addEventListener('change', e => setTheme(e.matches ? 'dark' : 'light', false));
      } catch{ /* Safari old */ }
    }
  }

  // Progreso de scroll
  function bindScrollProgress(){
    const bar = $('.scroll-progress');
    const onScroll = () => {
      const scrolled = document.documentElement.scrollTop || document.body.scrollTop;
      const height = (document.documentElement.scrollHeight - document.documentElement.clientHeight);
      const p = Math.min(100, (scrolled / height) * 100);
      bar.style.width = p + '%';
    };
    document.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // UI común: ripple, tooltips
  function bindCommonUI(){
    // Ripple para botones
    document.addEventListener('click', (e)=>{
      const btn = e.target.closest('.btn');
      if(!btn) return;
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size/2) + 'px';
      ripple.style.top  = (e.clientY - rect.top  - size/2) + 'px';
      btn.appendChild(ripple);
      setTimeout(()=> ripple.remove(), 600);
    });

    // Tooltips [data-tip]
    let tipEl = null;
    document.addEventListener('mouseover', (e)=>{
      const t = e.target.closest('[data-tip]');
      if(!t) return;
      tipEl = document.createElement('div');
      tipEl.className = 'tooltip';
      tipEl.textContent = t.getAttribute('data-tip');
      document.body.appendChild(tipEl);
    });
    document.addEventListener('mousemove', (e)=>{
      if(!tipEl) return;
      tipEl.style.left = (e.clientX + 12) + 'px';
      tipEl.style.top  = (e.clientY + 12) + 'px';
    });
    document.addEventListener('mouseout', ()=>{ if(tipEl){ tipEl.remove(); tipEl=null; } });
  }
  
  // Textos rotativos periódicos (toasts amables)
  function bindRotatingTexts(){
    const msgs = [
      '✨ Esto está muy cool.',
      '💡 Explora mis proyectos en Física/Óptica.',
      '🚀 Data + Ciencia: combinación poderosa.',
      '🧠 Pasa por el blog para aprender más.',
      '📄 ¿Ya viste mi CV en Certificados?',
      '🎥 Checa mi canal en Talks.'
    ];
    try {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReduced) return;
    } catch{}
    let i = 0; let shown = 0; const maxShows = 5; const interval = 24000;
    const tick = ()=>{
      if (document.hidden) return; // no interrumpir cuando la pestaña no está visible
      toast(msgs[i % msgs.length], 'base');
      i++; shown++;
      if (shown >= maxShows) clearInterval(timer);
    };
    const timer = setInterval(tick, interval);
    setTimeout(tick, 4000);
  }

  // Enrutamiento simple por página
  function routeInit(){
    const page = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    if(page === 'projects.html') initProjectsPage();
    if(page === 'optics.html') initOpticsPage();
    if(page === 'contact.html') initContactPage();
    if(page === 'blog.html') initBlogPage();
    if(page === 'research.html') initResearchPage();
    if(page === 'talks.html') initTalksPage();
    if(page === 'certificates.html') initCertificatesPage();
  }

  // Toast API
  function toast(msg, type='base'){
    const area = $('.toast-area');
    const el = document.createElement('div');
    el.className = 'toast ' + (type || '');
    el.role = 'status';
    el.textContent = msg;
    area.appendChild(el);
    setTimeout(()=> el.remove(), 3500);
  }

  // Debounce helper
  function debounce(fn, ms){ let t; return (...args)=>{ clearTimeout(t); t=setTimeout(()=>fn.apply(null,args), ms); }; }

  // Modal accesible + Lightbox
  function openModal(contentHTML){
    let backdrop = $('#modal-backdrop');
    if(!backdrop){
      backdrop = document.createElement('div');
      backdrop.id = 'modal-backdrop';
      backdrop.className = 'modal-backdrop';
      backdrop.innerHTML = `<div class="modal" role="dialog" aria-modal="true"><header><h3>Detalle</h3><button class="btn secondary" data-modal-close>✕</button></header><div class="content"></div></div>`;
      document.body.appendChild(backdrop);
    }
    backdrop.querySelector('.content').innerHTML = contentHTML;
    backdrop.setAttribute('open', '');

    const dialog = backdrop.querySelector('.modal');
    const closeBtn = backdrop.querySelector('[data-modal-close]');
    const prevFocus = document.activeElement;

    const close = ()=> {
      backdrop.removeAttribute('open');
      document.removeEventListener('keydown', escHandler);
      document.removeEventListener('keydown', trapHandler, true);
      prevFocus && prevFocus.focus && prevFocus.focus();
    };
    backdrop.addEventListener('click', (e)=>{ if(e.target===backdrop) close(); });
    closeBtn.addEventListener('click', close, { once:true });
    document.addEventListener('keydown', escHandler);

    // Focus trap
    const focusables = dialog.querySelectorAll('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
    const first = focusables[0] || closeBtn;
    const last = focusables[focusables.length-1] || closeBtn;
    first && first.focus();
    function trapHandler(e){
      if(e.key !== 'Tab') return;
      const active = document.activeElement;
      if(e.shiftKey && active === first){ e.preventDefault(); last.focus(); }
      else if(!e.shiftKey && active === last){ e.preventDefault(); first.focus(); }
    }
    document.addEventListener('keydown', trapHandler, true);

    function escHandler(e){ if(e.key==='Escape'){ close(); } }

    // Lightbox desde imágenes del contenido del modal
    const content = backdrop.querySelector('.content');
    content.addEventListener('click', (e)=>{
      const img = e.target.closest('img');
      if(!img) return;
      const imgs = Array.from(content.querySelectorAll('img'));
      const sources = imgs.map(i=> i.currentSrc || i.src).filter(Boolean);
      const start = Math.max(0, imgs.indexOf(img));
      if(sources.length) openLightbox(sources, start);
    });
  }

  // Lightbox accesible con navegación
  function openLightbox(sources, startIndex=0){
    let lb = document.getElementById('lightbox');
    if(!lb){
      lb = document.createElement('div');
      lb.id = 'lightbox';
      lb.className = 'lightbox-backdrop';
      lb.innerHTML = `
        <div class="lightbox" role="dialog" aria-modal="true" aria-label="Galería">
          <button class="btn secondary lb-close" aria-label="Cerrar">✕</button>
          <button class="btn secondary lb-prev" aria-label="Anterior">◀</button>
          <button class="btn secondary lb-next" aria-label="Siguiente">▶</button>
          <div class="lb-stage"><img alt="Imagen de proyecto" /></div>
        </div>`;
      document.body.appendChild(lb);
    }
    const imgEl = lb.querySelector('.lb-stage img');
    const closeBtn = lb.querySelector('.lb-close');
    const prevBtn = lb.querySelector('.lb-prev');
    const nextBtn = lb.querySelector('.lb-next');
    let i = startIndex;
    function show(){ imgEl.src = sources[i]; }
    function prev(){ i = (i - 1 + sources.length) % sources.length; show(); }
    function next(){ i = (i + 1) % sources.length; show(); }
    function close(){ lb.removeAttribute('open'); document.removeEventListener('keydown', onKey); }
    function onKey(e){
      if(e.key==='Escape') return close();
      if(e.key==='ArrowLeft') return prev();
      if(e.key==='ArrowRight') return next();
    }
    lb.setAttribute('open','');
    show();
    prevBtn.onclick = prev; nextBtn.onclick = next; closeBtn.onclick = close;
    lb.addEventListener('click', (e)=>{ if(e.target===lb) close(); });
    document.addEventListener('keydown', onKey);
  }

  // Projects Page
  async function initProjectsPage(){
    const projectsGrid = document.getElementById('projectsGrid');
    const searchInput = document.getElementById('search');
    const sortSelect = document.getElementById('sort');

    if (!projectsGrid) return;

    const urlParams = new URLSearchParams(window.location.search);
    let activeSkill = urlParams.get('skill') || '';
    let searchTerm = '';
    let sortBy = 'recent';

    const projectsData = await window.DataAPI.loadProjects();

    function projectCard(p, index) {
      const img = (p.images && p.images[0]) || 'assets/img/placeholder.svg';
      const cat = p.category ? `<span class="project-card-category">${p.category}</span>` : '';
      
      // Asignar clases de tamaño basadas en el índice para un layout variado
      const sizeClasses = [
        'size-large',
        'size-small',
        'size-small',
        'size-medium',
        'size-small',
        'size-medium',
      ];
      const sizeClass = sizeClasses[index % sizeClasses.length] || 'size-small';

      const content = `
        <div class="project-card-content">
          <h3>${p.title}</h3>
          ${cat}
        </div>
      `;

      const bgImg = `<img class="project-card-bg" src="${img}" alt="" aria-hidden="true" loading="lazy">`;

      // El modal se abrirá con la descripción detallada
      const detailContent = `
        <h2>${p.title}</h2>
        <div class="meta"><span class="badge">${p.year}</span> <span class="badge">${p.category}</span></div>
        <img src="${img}" alt="${p.title}" />
        <p>${p.description || ''}</p>
        <div class="tags">${(p.tags || []).map(t => `<span class="tag">${t}</span>`).join('')}</div>
        <div class="project-actions">
          ${p.links.report ? `<a href="${p.links.report}" class="btn secondary" target="_blank" rel="noopener">Ver Reporte</a>` : ''}
          ${p.links.sim ? `<a href="${p.links.sim}" class="btn secondary">Simulación</a>` : ''}
          ${p.links.video ? `<a href="${p.links.video}" class="btn secondary" target="_blank" rel="noopener">Video</a>` : ''}
          ${p.links.github ? `<a href="${p.links.github}" class="btn secondary" target="_blank" rel="noopener">GitHub</a>` : ''}
        </div>
      `;

      if (p.subcategoryPage) {
        const link = document.createElement('a');
        link.href = p.subcategoryPage;
        link.className = `project-card reveal ${sizeClass}`;
        link.setAttribute('aria-label', `Ver categoría ${p.title}`);
        link.innerHTML = bgImg + content;
        return link;
      } else {
        const article = document.createElement('article');
        article.className = `project-card reveal ${sizeClass}`;
        article.setAttribute('tabindex', '0');
        article.setAttribute('role', 'button');
        article.setAttribute('aria-label', `Ver detalle de ${p.title}`);
        article.innerHTML = bgImg + content;
        article.addEventListener('click', () => openModal(detailContent));
        article.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openModal(detailContent);
          }
        });
        return article;
      }
    }

    function render() {
      let filtered = [...projectsData];

      // Filter by skill
      if (activeSkill) {
        filtered = filtered.filter(p => 
          p.tags && p.tags.some(t => t.toLowerCase() === activeSkill.toLowerCase())
        );
      }

      // Filter by search term
      if (searchTerm) {
        const lowerTerm = searchTerm.toLowerCase();
        filtered = filtered.filter(p =>
          p.title.toLowerCase().includes(lowerTerm) ||
          (p.description && p.description.toLowerCase().includes(lowerTerm)) ||
          (p.tags && p.tags.some(t => t.toLowerCase().includes(lowerTerm)))
        );
      }

      // Sort
      if (sortBy === 'az') {
        filtered.sort((a, b) => a.title.localeCompare(b.title));
      } else { // 'recent'
        filtered.sort((a, b) => (b.year || 0) - (a.year || 0));
      }

      projectsGrid.innerHTML = ''; // Limpiar grid
      if (filtered.length > 0) {
        filtered.forEach((p, index) => {
          projectsGrid.appendChild(projectCard(p, index));
        });
      } else {
        projectsGrid.innerHTML = `<p class="empty-state">No se encontraron proyectos con los filtros seleccionados.</p>`;
      }
    }

    // Event Listeners
    if (searchInput) {
      searchInput.addEventListener('input', debounce((e) => {
        searchTerm = e.target.value.trim();
        render();
      }, 200));
    }

    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        sortBy = e.target.value;
        render();
      });
    }

    function setupSkillFilter() {
      const existingStatus = document.querySelector('.filter-status');
      if (existingStatus) existingStatus.remove();

      if (activeSkill) {
        const filterStatus = document.createElement('div');
        filterStatus.className = 'filter-status';
        filterStatus.innerHTML = `
          Mostrando proyectos con: <span class="tag">${activeSkill}</span>
          <button class="btn-clear-filter" title="Quitar filtro">&times;</button>
        `;
        
        const controls = document.querySelector('.project-filters');
        if (controls) {
          controls.insertAdjacentElement('afterend', filterStatus);
        } else {
          projectsGrid.before(filterStatus);
        }

        filterStatus.querySelector('.btn-clear-filter').addEventListener('click', () => {
          activeSkill = '';
          const url = new URL(window.location);
          url.searchParams.delete('skill');
          window.history.pushState({}, '', url);
          filterStatus.remove();
          render();
        });
      }
    }

    // Initial Render
    setupSkillFilter();
    render();
  }

  // Optics Page (similar to Projects)
  async function initOpticsPage() {
    const projectsGrid = document.getElementById('projectsGrid');
    if (!projectsGrid) return;

    const projectsData = await window.DataAPI.loadOpticsProjects();

    function projectCard(p, index) {
      const img = (p.images && p.images[0]) || 'assets/img/placeholder.svg';
      const cat = p.category ? `<span class="project-card-category">${p.category}</span>` : '';
      const sizeClasses = ['size-large', 'size-small', 'size-small', 'size-medium', 'size-small', 'size-medium'];
      const sizeClass = sizeClasses[index % sizeClasses.length] || 'size-small';

      const content = `
        <div class="project-card-content">
          <h3>${p.title}</h3>
          ${cat}
        </div>
      `;
      const bgImg = `<img class=\"project-card-bg\" src=\"${img}\" alt=\"\" aria-hidden=\"true\" loading=\"lazy\">`;

      const detailContent = `
        <h2>${p.title}</h2>
        <div class="meta"><span class="badge">${p.year}</span> <span class="badge">${p.category}</span></div>
        <img src="${img}" alt="${p.title}" />
        <p>${p.description || ''}</p>
        <div class="tags">${(p.tags || []).map(t => `<span class="tag">${t}</span>`).join('')}</div>
        <div class="project-actions">
          ${p.links.report ? `<a href="${p.links.report}" class="btn secondary" target="_blank" rel="noopener">Ver Reporte</a>` : ''}
          ${p.links.sim ? `<a href="${p.links.sim}" class="btn secondary" target="_blank" rel="noopener">Simulación</a>` : ''}
          ${p.links.video ? `<a href="${p.links.video}" class="btn secondary" target="_blank" rel="noopener">Video</a>` : ''}
          ${p.links.github ? `<a href="${p.links.github}" class="btn secondary" target="_blank" rel="noopener">GitHub</a>` : ''}
        </div>
      `;

      const article = document.createElement('article');
      article.className = `project-card reveal ${sizeClass}`;
      article.setAttribute('tabindex', '0');
      article.setAttribute('role', 'button');
      article.setAttribute('aria-label', `Ver detalle de ${p.title}`);
      article.innerHTML = bgImg + content;
      article.addEventListener('click', () => openModal(detailContent));
      article.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openModal(detailContent);
        }
      });
      return article;
    }

    function render() {
      projectsGrid.innerHTML = '';
      if (projectsData.length > 0) {
        projectsData.forEach((p, index) => {
          projectsGrid.appendChild(projectCard(p, index));
        });
      } else {
        projectsGrid.innerHTML = `<p class="empty-state">No se encontraron proyectos en esta sección.</p>`;
      }
    }

    render();
  }

  // Contacto
  function initContactPage(){
    const form = $('#contactForm'); if(!form) return;
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const status = form.querySelector('button[type=submit]');
      const data = new FormData(form);
      status.disabled = true;
      status.textContent = 'Enviando...';
      try {
        const res = await fetch(form.action, {
          method: 'POST',
          body: data,
          headers: { 'Accept': 'application/json' }
        });
        if (res.ok) {
          toast('¡Mensaje enviado con éxito!', 'success');
          form.reset();
        } else {
          const err = await res.json();
          toast(`Error: ${err.error || 'No se pudo enviar.'}`, 'error');
        }
      } catch (err) {
        toast('Error de red. Intenta de nuevo.', 'error');
      } finally {
        status.disabled = false;
        status.textContent = 'Enviar';
      }
    });
  }

  // Blog: lista de notas
  async function initBlogPage(){
    const list = document.querySelector('#postsList');
    if(!list) return;
    list.innerHTML = new Array(3).fill(0).map(()=>`<div class="card skeleton h-110"></div>`).join('');
    const posts = await window.DataAPI.loadPosts();
    list.innerHTML = posts.map(p=>{
      const tags = (p.tags||[]).map(t=>`<span class="tag">${t}</span>`).join('');
      return `<article class="card reveal">
        <h3>${p.title}</h3>
        <div class="meta"><span>${new Date(p.date).toLocaleDateString()}</span></div>
        <p>${p.excerpt||''}</p>
        <div class="tags">${tags}</div>
      </article>`;
    }).join('');
  }

  // Research: lista con PDFs
  async function initResearchPage(){
    const list = document.querySelector('#researchList');
    if(!list) return;
    list.innerHTML = new Array(3).fill(0).map(()=>`<div class="card skeleton h-90"></div>`).join('');
    const items = await window.DataAPI.loadResearch();
    list.innerHTML = items.map(r=>`
      <article class="card reveal">
        <div class="meta"><span class="badge">${r.year||''}</span></div>
        <h3>${r.title}</h3>
        <p>${r.abstract||''}</p>
        <a class="btn secondary" href="${r.pdfPath}" target="_blank" rel="noopener">Ver PDF</a>
      </article>
    `).join('');
  }
  // Talks: videos de YouTube
  // Certificates: PDFs
  async function initCertificatesPage(){
    const list = document.querySelector('#certificatesGrid');
    if(!list) return;
    const items = await window.DataAPI.loadCertificates();
    list.innerHTML = items.map(c=>`
      <article class="card reveal">
        <h3>${c.title}</h3>
        <div class="embed embed-4x3 embed-card embed-white">
          <iframe src="${c.path}#toolbar=0&navpanes=0&scrollbar=0" width="100%" height="100%" title="${c.title}" frameborder="0" loading="lazy"></iframe>
        </div>
        <a class="btn secondary" href="${c.path}" target="_blank" rel="noopener">Ver Completo</a>
      </article>
    `).join('');
  }
  // Talks: videos de YouTube
  async function initTalksPage(){
    const list = document.querySelector('#talksGrid');
    if(!list) return;
    const items = await window.DataAPI.loadTalks();
    list.innerHTML = items.map(t=>`
      <article class="card reveal">
        <h3>${t.title}</h3>
        <div class="embed embed-16x9 embed-card embed-dark">
          <iframe width="100%" height="100%" src="https://www.youtube.com/embed/${t.videoId}" title="${t.title}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe>
        </div>
      </article>
    `).join('');
  }

  function bindSearchButton() {
    const searchInput = $('#searchInput');
    const searchButton = $('.search-button');
    let highlightedElements = [];
    let currentHighlightIndex = -1;

    if (!searchInput || !searchButton) return;

    window.toggleSearch = () => {
      searchInput.classList.toggle('active');
      if (searchInput.classList.contains('active')) {
        searchInput.focus();
      } else {
        clearHighlights();
      }
    };

    searchInput.addEventListener('input', debounce(e => {
      searchInCurrentSection(e.target.value.trim());
    }, 200));

    searchInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (highlightedElements.length > 0) {
          currentHighlightIndex = (currentHighlightIndex + 1) % highlightedElements.length;
          navigateToHighlight(currentHighlightIndex);
        }
      }
      if (e.key === 'Escape') {
        window.toggleSearch();
      }
    });

    function navigateToHighlight(index) {
      $$('mark.active-highlight').forEach(el => el.classList.remove('active-highlight'));
      const currentHighlight = highlightedElements[index];
      if (currentHighlight) {
        currentHighlight.classList.add('active-highlight');
        currentHighlight.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }
    }

    function searchInCurrentSection(term) {
      clearHighlights();
      if (!term) return;

      const sections = $$('section[aria-labelledby]');
      const visibleSections = [];
      const windowHeight = window.innerHeight;

      for (const section of sections) {
        const rect = section.getBoundingClientRect();
        if (rect.top < windowHeight && rect.bottom > 0) {
          visibleSections.push(section);
        }
      }

      if (visibleSections.length > 0) {
        visibleSections.forEach(section => searchInAllElements(section, term));
      }
    }

    function searchInAllElements(context, term) {
      const treeWalker = document.createTreeWalker(context, NodeFilter.SHOW_TEXT, null, false);
      const nodes = [];
      while (treeWalker.nextNode()) {
        const node = treeWalker.currentNode;
        if (node.parentNode.nodeName === 'SCRIPT' || node.parentNode.nodeName === 'STYLE' || node.parentNode.nodeName === 'MARK') continue;
        if (node.textContent.trim().length > 0) nodes.push(node);
      }

      const regex = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');

      nodes.forEach(node => {
        const matches = [...node.textContent.matchAll(regex)];
        if (matches.length > 0) {
          let lastIndex = 0;
          const fragment = document.createDocumentFragment();

          matches.forEach(match => {
            const index = match.index;
            const before = node.textContent.slice(lastIndex, index);
            if (before) fragment.appendChild(document.createTextNode(before));

            const mark = document.createElement('mark');
            mark.textContent = match[0];
            fragment.appendChild(mark);
            highlightedElements.push(mark);

            lastIndex = index + match[0].length;
          });

          const after = node.textContent.slice(lastIndex);
          if (after) fragment.appendChild(document.createTextNode(after));

          node.parentNode.replaceChild(fragment, node);
        }
      });
    }

    function clearHighlights() {
      highlightedElements = [];
      currentHighlightIndex = -1;
      const marks = $$('mark');
      marks.forEach(mark => {
        const parent = mark.parentNode;
        parent.replaceChild(document.createTextNode(mark.textContent), mark);
        parent.normalize();
      });
    }
  }

})();
