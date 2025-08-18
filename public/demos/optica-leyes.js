document.addEventListener('DOMContentLoaded', () => {
  // --- Utilidades y constantes ---
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => document.querySelectorAll(s);
  const deg2rad = (d) => (d * Math.PI) / 180;
  const rad2deg = (r) => (r * 180) / Math.PI;
  const clamp = (x, a, b) => Math.min(Math.max(x, a), b);

  const MATERIALS = [
    { key: "air", name: "Aire", n: 1.0003 },
    { key: "water", name: "Agua", n: 1.333 },
    { key: "glycerin", name: "Glicerina", n: 1.473 },
    { key: "acrylic", name: "Acrílico (PMMA)", n: 1.49 },
    { key: "bk7", name: "Vidrio BK7 (crown)", n: 1.517 },
    { key: "quartz", name: "Cuarzo", n: 1.544 },
    { key: "sapphire", name: "Zafiro", n: 1.77 },
    { key: "diamond", name: "Diamante", n: 2.417 },
    { key: "custom", name: "Personalizado…", n: NaN },
  ];

  const DEFAULT_COLORS = {
    incident: "#00e5ff",
    reflected: "#b399ff",
    transmitted: "#34d399",
    interface: "#94a3b8",
  };

  // --- Referencias al DOM ---
  const canvas = $('#scene');
  const ctx = canvas.getContext('2d');
  const W = 980, H = 560;
  canvas.width = W; canvas.height = H;
  const yInterface = Math.round(H / 2);

  // Controles
  const topMatEl = $('#topMat'), botMatEl = $('#botMat');
  const nTopCustomEl = $('#nTopCustom'), nBotCustomEl = $('#nBotCustom');
  const fromTopToggle = $('#fromTopToggle');
  const angleDegEl = $('#angleDeg'), angleDegNumEl = $('#angleDegNum');
  const colorIncidentEl = $('#colorIncident'), colorReflectedEl = $('#colorReflected'), colorTransmittedEl = $('#colorTransmitted');
  const rayWidthEl = $('#rayWidth'), rayWidthValEl = $('#rayWidthVal');
  const showProtractorEl = $('#showProtractor'), showLabelsEl = $('#showLabels'), showArcsEl = $('#showArcs');
  const saveBtn = $('#saveBtn'), resetBtn = $('#resetBtn');
  
  // Lecturas
  const resThI = $('#resThI'), resThR = $('#resThR'), resThT = $('#resThT');
  const resThC = $('#resThC'), resThB = $('#resThB');
  const resR = $('#resR'), resT = $('#resT'), resTIR = $('#resTIR');

  // --- Estado de la aplicación ---
  let state = {};

  function resetState() {
    state = {
      topMat: 'acrylic',
      botMat: 'air',
      nTopCustom: 1.5,
      nBotCustom: 1.0,
      angleDeg: 30,
      fromTop: true,
      showProtractor: true,
      showLabels: true,
      showArcs: true,
      colors: { ...DEFAULT_COLORS },
      rayWidth: 2,
      pointX: W * 0.5,
    };
    updateUIFromState();
    draw();
  }

  // --- Lógica principal de dibujo ---
  function draw() {
    const {
      angleDeg, fromTop, colors, showProtractor, showLabels, showArcs, rayWidth, pointX
    } = state;

    const nTop = state.topMat === 'custom' ? state.nTopCustom : MATERIALS.find(m => m.key === state.topMat).n;
    const nBot = state.botMat === 'custom' ? state.nBotCustom : MATERIALS.find(m => m.key === state.botMat).n;
    const n1 = fromTop ? nTop : nBot;
    const n2 = fromTop ? nBot : nTop;

    // Cálculos ópticos
    const th1 = deg2rad(clamp(angleDeg, 0, 89.999));
    const sin2 = (n1 / n2) * Math.sin(th1);
    const TIR = Math.abs(sin2) > 1;
    const th2 = TIR ? NaN : Math.asin(sin2);
    const thCrit = n1 > n2 ? Math.asin(Math.min(1, n2 / n1)) : NaN;
    const thBrew = Math.atan(n2 / n1);

    let R = 1, T = 0;
    if (!TIR) {
      const c1 = Math.cos(th1), c2 = Math.cos(th2);
      const rs = (n1 * c1 - n2 * c2) / (n1 * c1 + n2 * c2);
      const rp = (n2 * c1 - n1 * c2) / (n2 * c1 + n1 * c2);
      R = 0.5 * (rs * rs + rp * rp);
      T = 1 - R;
    }

    // Limpiar lienzo
    ctx.clearRect(0, 0, W, H);

    // Fondos
    ctx.fillStyle = "rgba(93,211,255,0.06)";
    ctx.fillRect(0, 0, W, yInterface);
    ctx.fillStyle = "rgba(155,140,255,0.06)";
    ctx.fillRect(0, yInterface, W, H - yInterface);

    // Interfaz y normal
    ctx.strokeStyle = colors.interface; ctx.lineWidth = 1.25;
    ctx.beginPath(); ctx.moveTo(0, yInterface); ctx.lineTo(W, yInterface); ctx.stroke();
    ctx.setLineDash([6, 6]); ctx.strokeStyle = "rgba(255,255,255,0.35)";
    ctx.beginPath(); ctx.moveTo(pointX, 0); ctx.lineTo(pointX, H); ctx.stroke();
    ctx.setLineDash([]);

    if (showProtractor) drawProtractor(ctx, pointX, yInterface, 110);

    // Dibujo de rayos
    const len = Math.min(W, H) * 0.46;
    const sideIncident = fromTop ? "top" : "bottom";
    const sideOther = fromTop ? "bottom" : "top";

    const dI = dir(th1, sideIncident);
    const startI = { x: pointX - dI.dx * len, y: yInterface - dI.dy * len };
    arrow(startI.x, startI.y, pointX, yInterface, colors.incident, rayWidth);

    const dR = dir(th1, sideIncident);
    const endR = { x: pointX + dR.dx * len, y: yInterface + dR.dy * len };
    arrow(pointX, yInterface, endR.x, endR.y, colors.reflected, rayWidth);

    if (!TIR) {
      const dT = dir(Math.abs(th2), sideOther);
      const endT = { x: pointX + dT.dx * len, y: yInterface + dT.dy * len };
      arrow(pointX, yInterface, endT.x, endT.y, colors.transmitted, rayWidth);
    } else {
      ctx.fillStyle = "rgba(255,107,107,.6)";
      ctx.beginPath(); ctx.arc(pointX, yInterface, 9, 0, Math.PI * 2); ctx.fill();
    }

    if (showArcs) {
      if (fromTop) {
        drawAngleArc(ctx, pointX, yInterface, -Math.PI / 2, -th1, colors.incident);
        drawAngleArc(ctx, pointX, yInterface, -Math.PI / 2, +th1, colors.reflected);
        if (!TIR) drawAngleArc(ctx, pointX, yInterface, +Math.PI / 2, +Math.abs(th2), colors.transmitted);
      } else {
        drawAngleArc(ctx, pointX, yInterface, +Math.PI / 2, -th1, colors.incident);
        drawAngleArc(ctx, pointX, yInterface, +Math.PI / 2, +th1, colors.reflected);
        if (!TIR) drawAngleArc(ctx, pointX, yInterface, -Math.PI / 2, +Math.abs(th2), colors.transmitted);
      }
    }

    if (showLabels) {
      ctx.fillStyle = '#e5e7eb'; ctx.font = "14px ui-sans-serif, system-ui";
      ctx.fillText(`Medio superior (n=${nTop.toFixed(3)})`, 12, 22);
      ctx.fillText(`Medio inferior (n=${nBot.toFixed(3)})`, 12, H - 12);
      ctx.fillText("Incidente", startI.x + 8, startI.y + 12);
      ctx.fillText("Reflejado", endR.x - 70, endR.y + 12);
      if (!TIR) {
        const endT = dir(Math.abs(th2), sideOther);
        ctx.fillText("Transmitido", pointX + endT.dx*len - 70, yInterface + endT.dy*len - 12);
      }
    }

    updateReadout(angleDeg, th2, thCrit, thBrew, R, T, TIR);
  }

  // --- Funciones auxiliares de dibujo ---
  function dir(angle, side) {
    const dx = Math.sin(angle);
    const dy = (side === "top" ? -1 : 1) * Math.cos(angle);
    return { dx, dy };
  }

  function arrow(x1, y1, x2, y2, color, width) {
    ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = width;
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    const a = Math.atan2(y2 - y1, x2 - x1);
    const head = 10 + width * 1.2;
    ctx.beginPath(); ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - head * Math.cos(a - Math.PI / 6), y2 - head * Math.sin(a - Math.PI / 6));
    ctx.lineTo(x2 - head * Math.cos(a + Math.PI / 6), y2 - head * Math.sin(a + Math.PI / 6));
    ctx.closePath(); ctx.fill();
  }

  function drawProtractor(ctx, cx, cy, r) {
    ctx.save();
    ctx.strokeStyle = "rgba(255,255,255,0.25)"; ctx.fillStyle = "rgba(255,255,255,0.45)"; ctx.lineWidth = 1;
    const drawHalf = (sign) => {
      ctx.beginPath(); ctx.arc(cx, cy, r, (sign === -1 ? Math.PI : 0), (sign === -1 ? 2 * Math.PI : Math.PI), true); ctx.stroke();
      for (let d = 0; d <= 90; d += 5) {
        const a = (sign === -1 ? -Math.PI / 2 : Math.PI / 2) + deg2rad(d) * (sign === -1 ? -1 : 1);
        const long = d % 15 === 0 ? 10 : 5;
        const x1 = cx + Math.cos(a) * (r - long), y1 = cy + Math.sin(a) * (r - long);
        const x2 = cx + Math.cos(a) * r, y2 = cy + Math.sin(a) * r;
        ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
        if (d % 15 === 0) {
          const xt = cx + Math.cos(a) * (r + 14), yt = cy + Math.sin(a) * (r + 14);
          ctx.font = "10px ui-sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
          ctx.fillText(String(d), xt, yt);
        }
      }
    };
    drawHalf(-1); drawHalf(1);
    ctx.restore();
  }

  function drawAngleArc(ctx, cx, cy, base, delta, color) {
    const r = 38;
    ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(cx, cy, r, base, base + delta, delta < 0); ctx.stroke();
    const mid = base + delta / 2;
    const tx = cx + Math.cos(mid) * (r + 14), ty = cy + Math.sin(mid) * (r + 14);
    ctx.fillStyle = color; ctx.font = "12px ui-sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(`${Math.abs(rad2deg(delta)).toFixed(1)}°`, tx, ty);
    ctx.restore();
  }

  // --- Actualización de UI y eventos ---
  function updateUIFromState() {
    topMatEl.value = state.topMat;
    botMatEl.value = state.botMat;
    nTopCustomEl.value = state.nTopCustom;
    nBotCustomEl.value = state.nBotCustom;
    nTopCustomEl.style.display = state.topMat === 'custom' ? 'block' : 'none';
    nBotCustomEl.style.display = state.botMat === 'custom' ? 'block' : 'none';
    
    $$('#fromTopToggle button').forEach(b => b.classList.toggle('active', String(state.fromTop) === b.dataset.value));
    
    angleDegEl.value = state.angleDeg;
    angleDegNumEl.value = state.angleDeg;
    
    colorIncidentEl.value = state.colors.incident;
    colorReflectedEl.value = state.colors.reflected;
    colorTransmittedEl.value = state.colors.transmitted;
    
    rayWidthEl.value = state.rayWidth;
    rayWidthValEl.textContent = state.rayWidth;
    
    showProtractorEl.checked = state.showProtractor;
    showLabelsEl.checked = state.showLabels;
    showArcsEl.checked = state.showArcs;
  }

  function updateReadout(th1, th2, thCrit, thBrew, R, T, TIR) {
    const fmt = (v) => Number.isFinite(v) ? rad2deg(v).toFixed(1) : '—';
    resThI.textContent = th1.toFixed(1);
    resThR.textContent = th1.toFixed(1);
    resThT.textContent = Number.isFinite(th2) ? rad2deg(th2).toFixed(1) : '—';
    resThC.textContent = fmt(thCrit);
    resThB.textContent = fmt(thBrew);
    resR.textContent = (R * 100).toFixed(1);
    resT.textContent = (T * 100).toFixed(1);
    resTIR.textContent = TIR ? '— RIT' : '';
  }

  function setupEventListeners() {
    // Materiales
    [topMatEl, botMatEl].forEach(el => {
      el.addEventListener('change', (e) => {
        state[el.id.replace('El', '')] = e.target.value;
        updateUIFromState();
        draw();
      });
    });
    [nTopCustomEl, nBotCustomEl].forEach(el => {
      el.addEventListener('input', (e) => {
        state[el.id.replace('El', '')] = parseFloat(e.target.value) || 1;
        draw();
      });
    });

    // Controles
    fromTopToggle.addEventListener('click', (e) => {
      if (e.target.tagName === 'BUTTON') {
        state.fromTop = e.target.dataset.value === 'true';
        updateUIFromState();
        draw();
      }
    });
    angleDegEl.addEventListener('input', e => { state.angleDeg = parseFloat(e.target.value); updateUIFromState(); draw(); });
    angleDegNumEl.addEventListener('input', e => { state.angleDeg = parseFloat(e.target.value); updateUIFromState(); draw(); });
    rayWidthEl.addEventListener('input', e => { state.rayWidth = parseFloat(e.target.value); updateUIFromState(); draw(); });
    [colorIncidentEl, colorReflectedEl, colorTransmittedEl].forEach(el => {
      el.addEventListener('input', e => {
        state.colors[el.id.replace('color', '').toLowerCase()] = e.target.value;
        draw();
      });
    });
    [showProtractorEl, showLabelsEl, showArcsEl].forEach(el => {
      el.addEventListener('change', e => {
        state[el.id.replace('El', '')] = e.target.checked;
        draw();
      });
    });

    // Acciones
    resetBtn.addEventListener('click', resetState);
    saveBtn.addEventListener('click', () => {
      const url = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = url;
      a.download = `optica_sim.png`;
      a.click();
    });

    // Arrastrar punto de incidencia
    let dragging = false;
    canvas.addEventListener('mousedown', () => dragging = true);
    window.addEventListener('mouseup', () => dragging = false);
    window.addEventListener('mousemove', (e) => {
      if (!dragging) return;
      const rect = canvas.getBoundingClientRect();
      state.pointX = clamp(((e.clientX - rect.left) / rect.width) * W, 30, W - 30);
      draw();
    });
  }

  // --- Inicialización ---
  function init() {
    // Llenar selects de materiales
    const options = MATERIALS.map(m => `<option value="${m.key}">${m.name}${Number.isFinite(m.n) ? ` (n=${m.n})` : ''}</option>`).join('');
    topMatEl.innerHTML = options;
    botMatEl.innerHTML = options;

    resetState();
    setupEventListeners();
  }

  init();
});
