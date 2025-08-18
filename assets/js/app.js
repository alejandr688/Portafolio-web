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
    bindAnchorScrollSpy();
    bindCommonUI();
    routeInit();
  }

  // Navbar + Footer
  function injectLayout(){
    const navWrap = document.createElement('div');
    navWrap.className = 'navbar-wrap';
    navWrap.innerHTML = `
      <div class="navbar container" role="navigation" aria-label="Principal">
        <a class="brand" href="./index.html" aria-label="Alejandro Pérez Romero - Inicio">
          <span class="dot" aria-hidden="true"></span>
          <span>Alejandro Pérez Romero</span>
        </a>
        <nav class="nav" aria-label="Secciones">
          ${navLink('index.html','Inicio')}
          ${navLink('about.html','Sobre mí')}
          ${navLink('skills.html','Habilidades')}
          ${navLink('projects.html','Proyectos')}
          ${navLink('research.html','Investigación')}
          ${navLink('blog.html','Blog')}
          ${navLink('talks.html','Charlas')}
          ${navLink('resume.html','CV')}
          ${navLink('contact.html','Contacto')}
        </nav>
        <div class="nav-actions">
          <span class="badge section-indicator" id="sectionIndicator" aria-live="polite"></span>
          <button class="theme-toggle" title="Tema claro/oscuro" aria-label="Cambiar tema">🌓</button>
          <button class="scroll-top" title="Subir" aria-label="Volver arriba" style="display:none">↑</button>
        </div>
      </div>
      <div class="scroll-progress" aria-hidden="true"></div>
    `;
    document.body.prepend(navWrap);

    const footer = document.createElement('footer');
    footer.innerHTML = `
      <div class="container">
        <div>© ${new Date().getFullYear()} Alejandro Pérez Romero • Portafolio</div>
      </div>
    `;
    document.body.append(footer);

    // Active link
    const path = location.pathname.split('/').pop() || 'index.html';
    $$('.nav a').forEach(a=>{ if(a.getAttribute('href')===path) a.classList.add('active'); });

    // Scroll-to-top
    const topBtn = $('.scroll-top');
    window.addEventListener('scroll', ()=>{
      topBtn.style.display = (window.scrollY > 500) ? 'inline-flex' : 'none';
    });
    topBtn.addEventListener('click', ()=> window.scrollTo({top:0, behavior:'smooth'}));

    // Toast area
    const ta = document.createElement('div');
    ta.className = 'toast-area';
    document.body.append(ta);
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
    const btn = $('.theme-toggle');
    if(!btn) return;
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const saved = localStorage.getItem(key);
    const existing = document.documentElement.getAttribute('data-theme');
    const initial = saved || existing || (mql.matches ? 'dark' : 'light');
    setTheme(initial, false);
    btn.addEventListener('click', ()=> setTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark', true));
    if(!saved){
      // Si el usuario no ha elegido, seguir sistema
      try { mql.addEventListener('change', e => setTheme(e.matches ? 'dark' : 'light', false)); } catch{ /* Safari old */ }
    }

    function setTheme(mode, persist){
      document.documentElement.setAttribute('data-theme', mode);
      document.body && document.body.setAttribute('data-theme', mode);
      btn.setAttribute('aria-pressed', mode === 'dark' ? 'true' : 'false');
      btn.title = mode === 'dark' ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro';
      if(persist) localStorage.setItem(key, mode);
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

  // Enrutamiento simple por página
  function routeInit(){
    const page = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    if(page === 'projects.html') initProjectsPage();
    if(page === 'contact.html') initContactPage();
    if(page === 'blog.html') initBlogPage();
    if(page === 'research.html') initResearchPage();
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
    const grid = $('#projectsGrid');
    const searchInput = $('#search');
    const sortSel = $('#sort');
    const categories = ['Todos','Data Science','Física/Óptica','Electrónica/IoT','Web'];
    const catWrap = $('#catChips');
    const tagWrap = $('#tagChips');

    // Skeletons
    grid.innerHTML = new Array(6).fill(0).map(()=>`<div class="card project skeleton" style="height:220px"></div>`).join('');

    const data = await window.DataAPI.loadProjects();

    // Tags dinámicos
    const allTags = Array.from(new Set(data.flatMap(p=> p.tags || []))).sort();

    // Estado de filtros
    let state = { text:'', category:'Todos', tags:new Set(), sort:'recent' };

    // Render chips
    catWrap.innerHTML = categories.map(c=>`<button class="chip" data-cat="${c}">${c}</button>`).join('');
    tagWrap.innerHTML = allTags.map(t=>`<button class="chip" data-tag="${t}">${t}</button>`).join('');

    function applyFilters(){
      let items = data.slice();
      // texto
      if(state.text){
        const q = state.text.toLowerCase();
        items = items.filter(p=>
          p.title.toLowerCase().includes(q) ||
          (p.description||'').toLowerCase().includes(q) ||
          (p.tags||[]).some(t=> t.toLowerCase().includes(q))
        );
      }
      // categoría
      if(state.category && state.category!=='Todos') items = items.filter(p=> p.category===state.category);
      // tags
      if(state.tags.size) items = items.filter(p=> (p.tags||[]).some(t=> state.tags.has(t)) );
      // sort
      if(state.sort==='recent') items.sort((a,b)=> (b.year||0)-(a.year||0));
      if(state.sort==='az') items.sort((a,b)=> a.title.localeCompare(b.title));
      render(items);
    }

    function render(items){
      grid.innerHTML = items.map(p=> projectCard(p)).join('');
      // tilt
      $$('.card.project').forEach(c=> c.setAttribute('data-tilt',''));
    }

    function projectCard(p){
      const year = p.year ? `<span class="badge">${p.year}</span>` : '';
      const cat = p.category ? `<span class="badge">${p.category}</span>` : '';
      const img = (p.images && p.images[0]) || 'assets/img/placeholder.svg';
      const tags = (p.tags||[]).map(t=>`<span class="tag">${t}</span>`).join('');
      return `
        <article class="card project reveal" tabindex="0" role="button" aria-label="Ver ${p.title}">
          <picture>
            <img src="${img}" alt="${p.title}" loading="lazy" />
          </picture>
          <h3>${p.title}</h3>
          <div class="meta">${year} ${cat}</div>
          <p>${p.description||''}</p>
          <div class="tags">${tags}</div>
        </article>`;
    }

    // Eventos
    searchInput.addEventListener('input', debounce((e)=>{ state.text = e.target.value.trim(); applyFilters(); }, 150));
    sortSel.addEventListener('change', (e)=>{ state.sort = e.target.value; applyFilters(); });

    catWrap.addEventListener('click', (e)=>{
      const b = e.target.closest('[data-cat]'); if(!b) return;
      state.category = b.getAttribute('data-cat');
      $$('#catChips .chip').forEach(x=> x.classList.toggle('active', x===b));
      applyFilters();
    });

    tagWrap.addEventListener('click', (e)=>{
      const b = e.target.closest('[data-tag]'); if(!b) return;
      const t = b.getAttribute('data-tag');
      if(state.tags.has(t)) state.tags.delete(t); else state.tags.add(t);
      b.classList.toggle('active');
      applyFilters();
    });

    // Click para modal detalle
    grid.addEventListener('click', (e)=>{
      const card = e.target.closest('.card.project'); if(!card) return;
      const title = card.querySelector('h3').textContent;
      const project = data.find(p=> p.title===title);
      if(project) openModal(projectDetail(project));
    });

    function projectDetail(p){
      const imgs = (p.images||[]).map(src=> `<img src="${src}" alt="${p.title}" style="margin:.25rem 0; border-radius:8px;" loading="lazy" />`).join('');
      const links = ['github','demo','video'].map(k=> p.links?.[k] ? `<a class="btn secondary" href="${p.links[k]}" target="_blank" rel="noopener">${k}</a>` : '').join('');
      const metrics = p.metrics ? `<pre style="background:var(--card); padding:.5rem; border-radius:8px; overflow:auto">${JSON.stringify(p.metrics,null,2)}</pre>` : '';
      return `<div>
        <h3>${p.title}</h3>
        <p>${p.description||''}</p>
        <div style="display:flex; gap:.5rem; flex-wrap:wrap;">${(p.tags||[]).map(t=>`<span class='tag'>${t}</span>`).join('')}</div>
        <div style="margin:.5rem 0; display:grid; grid-template-columns:1fr; gap:.25rem;">${imgs}</div>
        ${metrics}
        <div style="display:flex; gap:.5rem; flex-wrap:wrap; margin-top:.5rem;">${links}</div>
      </div>`;
    }

    // Inicial
    // Select default category
    const firstCatBtn = $('#catChips .chip'); firstCatBtn && firstCatBtn.classList.add('active');
    applyFilters();
  }

  // Contacto
  function initContactPage(){
    const form = $('#contactForm'); if(!form) return;
    // Netlify Forms maneja la validación nativa del navegador y el envío del formulario.
    // No interceptamos el submit para no romper el procesamiento en el build de Netlify.
  }

  // Blog: lista de notas
  async function initBlogPage(){
    const list = document.querySelector('#postsList');
    if(!list) return;
    list.innerHTML = new Array(3).fill(0).map(()=>`<div class="card skeleton" style="height:110px"></div>`).join('');
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
    list.innerHTML = new Array(3).fill(0).map(()=>`<div class="card skeleton" style="height:90px"></div>`).join('');
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
})();
