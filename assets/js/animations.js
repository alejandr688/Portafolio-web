/* Microinteracciones y animaciones on-scroll (sin librerías) */
(function(){
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // On-scroll reveal (con soporte para elementos insertados dinámicamente)
  const supportsIO = !reduceMotion && 'IntersectionObserver' in window;
  let io;

  function initReveal(){
    if (supportsIO) {
      io = new IntersectionObserver((entries)=>{
        entries.forEach(e=>{
          if (e.isIntersecting) {
            e.target.classList.add('in');
            io.unobserve(e.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -10% 0px' });
    }
    observeEls();
    // Observar futuras inserciones en el DOM para aplicar reveal
    const mo = new MutationObserver(()=> observeEls());
    mo.observe(document.body, { childList: true, subtree: true });
  }

  function observeEls(){
    const els = document.querySelectorAll('.reveal,[data-animate]');
    if (supportsIO) {
      els.forEach(el=>{
        if (!el.dataset.observed) {
          io.observe(el);
          el.dataset.observed = '1';
        }
      });
    } else {
      els.forEach(el=> el.classList.add('in'));
    }
  }

  initReveal();

  // Tilt leve en tarjetas
  if (!reduceMotion) {
    const tiltTargets = document.querySelectorAll('.card[data-tilt]');
    tiltTargets.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        const cx = e.clientX - r.left, cy = e.clientY - r.top;
        const rx = ((cy / r.height) - 0.5) * -6; // rotX
        const ry = ((cx / r.width) - 0.5) * 6;   // rotY
        card.style.transform = `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg)`;
      });
      card.addEventListener('mouseleave', ()=> {
        card.style.transform = 'perspective(700px) rotateX(0) rotateY(0)';
      });
    });
  }

  // Parallax sencillo en el hero
  const hero = document.querySelector('.hero[data-parallax]');
  if (hero && !reduceMotion) {
    const visual = hero.querySelector('.hero-visual');
    const onScroll = () => {
      const y = window.scrollY || window.pageYOffset;
      visual && (visual.style.transform = `translateY(${y * 0.15}px)`);
    };
    document.addEventListener('scroll', onScroll, { passive: true });
  }
})();
