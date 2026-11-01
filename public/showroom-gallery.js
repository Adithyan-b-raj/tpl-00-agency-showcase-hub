/* ==========================================================================
   AWWWARDS NOMINEES SHOWROOM: GALLERY & MICRO-INTERACTIONS ENGINE
   Editorial Light Ambient Mesh, 3D Gyro Parallax, Dual View Engine,
   and ⌘K Spotlight Command Palette.
   ========================================================================== */

class ShowroomGalleryEngine {
  constructor() {
    this.viewMode = 'exhibition'; // 'exhibition' | 'hardware'
    this.ambientCanvas = null;
    this.ambientCtx = null;
    this.particles = [];
    this.pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2, tx: window.innerWidth / 2, ty: window.innerHeight / 2 };
    this.animFrameId = null;
    this.isSpotlightOpen = false;
    this.spotlightSelectedIdx = 0;
  }

  init() {
    this.setupAmbientCanvas();
    this.setupGlobalShortcuts();
    this.setupSpotlightPalette();
  }

  /* -------------------------------------------------------------
     1. SUBTLE PORCELAIN AMBIENT MESH (<1% CPU)
     ------------------------------------------------------------- */
  setupAmbientCanvas() {
    this.ambientCanvas = document.getElementById('ambientCanvas');
    if (!this.ambientCanvas) return;
    this.ambientCtx = this.ambientCanvas.getContext('2d');

    const resize = () => {
      this.ambientCanvas.width = window.innerWidth;
      this.ambientCanvas.height = window.innerHeight;
      this.initParticles();
    };
    window.addEventListener('resize', resize);
    resize();

    window.addEventListener('pointermove', (e) => {
      this.pointer.tx = e.clientX;
      this.pointer.ty = e.clientY;
    });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        if (this.animFrameId) cancelAnimationFrame(this.animFrameId);
      } else {
        this.renderAmbient();
      }
    });

    this.renderAmbient();
  }

  initParticles() {
    const w = this.ambientCanvas.width;
    const h = this.ambientCanvas.height;
    const count = Math.min(28, Math.floor((w * h) / 45000));
    this.particles = [];

    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        radius: Math.random() * 1.5 + 0.8,
        alpha: Math.random() * 0.35 + 0.15,
        color: i % 3 === 0 ? '16, 185, 129' : (i % 3 === 1 ? '139, 92, 246' : '17, 17, 17')
      });
    }
  }

  renderAmbient() {
    if (!this.ambientCtx) return;
    const ctx = this.ambientCtx;
    const w = this.ambientCanvas.width;
    const h = this.ambientCanvas.height;

    // Smooth pointer lerp
    this.pointer.x += (this.pointer.tx - this.pointer.x) * 0.05;
    this.pointer.y += (this.pointer.ty - this.pointer.y) * 0.05;

    ctx.clearRect(0, 0, w, h);

    // Subtle pointer-following light diffusion
    const grad = ctx.createRadialGradient(
      this.pointer.x, this.pointer.y, 10,
      this.pointer.x, this.pointer.y, Math.max(w, h) * 0.45
    );
    grad.addColorStop(0, 'rgba(16, 185, 129, 0.03)');
    grad.addColorStop(0.5, 'rgba(139, 92, 246, 0.015)');
    grad.addColorStop(1, 'rgba(250, 250, 250, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Draw and connect particles
    const pLen = this.particles.length;
    for (let i = 0; i < pLen; i++) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = w;
      if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h;
      if (p.y > h) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color}, ${p.alpha})`;
      ctx.fill();

      // Hairline connection
      for (let j = i + 1; j < pLen; j++) {
        const p2 = this.particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(0, 0, 0, ${0.03 * (1 - dist / 120)})`;
          ctx.stroke();
        }
      }
    }

    this.animFrameId = requestAnimationFrame(() => this.renderAmbient());
  }

  /* -------------------------------------------------------------
     2. 3D GYRO PARALLAX TILT ON CARDS
     ------------------------------------------------------------- */
  bindParallaxCards() {
    const cards = document.querySelectorAll('.bento-card, .nominee-card');
    cards.forEach(card => {
      card.removeEventListener('pointermove', card._parallaxMove);
      card.removeEventListener('pointerleave', card._parallaxLeave);

      const move = (e) => {
        if (e.pointerType === 'touch') return;
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;

        const rotX = ((y - 0.5) * -8).toFixed(2);
        const rotY = ((x - 0.5) * 8).toFixed(2);

        card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px) scale3d(1.015, 1.015, 1.015)`;
      };

      const leave = () => {
        card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale3d(1, 1, 1)`;
      };

      card._parallaxMove = move;
      card._parallaxLeave = leave;

      card.addEventListener('pointermove', move);
      card.addEventListener('pointerleave', leave);
    });
  }

  /* -------------------------------------------------------------
     3. DUAL VIEW ENGINE (EXHIBITION WALL vs HARDWARE LAB)
     ------------------------------------------------------------- */
  setViewMode(mode) {
    this.viewMode = mode;
    const exhibitionSection = document.getElementById('viewExhibition');
    const hardwareSection = document.getElementById('viewHardware');
    const btnExhibition = document.getElementById('btnViewExhibition');
    const btnHardware = document.getElementById('btnViewHardware');

    if (mode === 'exhibition') {
      if (exhibitionSection) exhibitionSection.style.display = 'block';
      if (hardwareSection) hardwareSection.style.display = 'none';
      if (btnExhibition) btnExhibition.classList.add('active');
      if (btnHardware) btnHardware.classList.remove('active');
    } else {
      if (exhibitionSection) exhibitionSection.style.display = 'none';
      if (hardwareSection) hardwareSection.style.display = 'flex';
      if (btnExhibition) btnExhibition.classList.remove('active');
      if (btnHardware) btnHardware.classList.add('active');
    }

    if (window.showroomAudio) window.showroomAudio.playDeviceSwitch();
  }

  mountTemplateInStage(templateId) {
    if (window.selectTemplate) {
      window.selectTemplate(templateId, true);
    }
    this.setViewMode('hardware');
    if (window.showroomAudio) window.showroomAudio.playTemplateSelect();
  }

  /* -------------------------------------------------------------
     4. ⌘K SPOTLIGHT COMMAND PALETTE
     ------------------------------------------------------------- */
  setupSpotlightPalette() {
    const palette = document.getElementById('spotlightModal');
    const input = document.getElementById('spotlightInput');
    if (!palette || !input) return;

    input.addEventListener('input', () => {
      this.renderSpotlightResults();
    });

    input.addEventListener('keydown', (e) => {
      const items = document.querySelectorAll('.spotlight-result-item');
      if (!items.length) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        this.spotlightSelectedIdx = (this.spotlightSelectedIdx + 1) % items.length;
        this.highlightSpotlightItem();
        if (window.showroomAudio) window.showroomAudio.playTick();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        this.spotlightSelectedIdx = (this.spotlightSelectedIdx - 1 + items.length) % items.length;
        this.highlightSpotlightItem();
        if (window.showroomAudio) window.showroomAudio.playTick();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const activeItem = items[this.spotlightSelectedIdx];
        if (activeItem) activeItem.click();
      } else if (e.key === 'Escape') {
        this.closeSpotlight();
      }
    });
  }

  openSpotlight() {
    const modal = document.getElementById('spotlightModal');
    const input = document.getElementById('spotlightInput');
    if (!modal || !input) return;

    modal.classList.add('open');
    input.value = '';
    this.spotlightSelectedIdx = 0;
    this.renderSpotlightResults();
    setTimeout(() => input.focus(), 50);
    this.isSpotlightOpen = true;
    if (window.showroomAudio) window.showroomAudio.playDeviceSwitch();
  }

  closeSpotlight() {
    const modal = document.getElementById('spotlightModal');
    if (modal) modal.classList.remove('open');
    this.isSpotlightOpen = false;
  }

  renderSpotlightResults() {
    const q = (document.getElementById('spotlightInput').value || '').toLowerCase().trim();
    const resultsContainer = document.getElementById('spotlightResults');
    if (!resultsContainer) return;

    const allTemplates = window.catalog || [];
    let templateMatches = allTemplates.filter(t => {
      if (!q) return true;
      return t.title.toLowerCase().includes(q) ||
             t.code.includes(q) ||
             t.category.toLowerCase().includes(q) ||
             t.vibe.toLowerCase().includes(q) ||
             (t.features && t.features.some(f => f.toLowerCase().includes(q)));
    }).slice(0, 7);

    // Quick Command Actions
    const quickActions = [
      { id: 'cmd-exhibit', title: '🏛️ Switch to Nominees Exhibition Wall', action: () => { this.setViewMode('exhibition'); } },
      { id: 'cmd-hardware', title: '🖥️ Switch to Virtual Hardware Lab', action: () => { this.setViewMode('hardware'); } },
      { id: 'cmd-desktop', title: '🖥️ Apple Studio Display 5K View (Desktop)', action: () => { this.setViewMode('hardware'); if (window.setDevice) window.setDevice('desktop'); } },
      { id: 'cmd-tablet', title: '📱 iPad Pro 13" View (Tablet)', action: () => { this.setViewMode('hardware'); if (window.setDevice) window.setDevice('tablet'); } },
      { id: 'cmd-mobile', title: '📲 iPhone 16 Pro View (Mobile)', action: () => { this.setViewMode('hardware'); if (window.setDevice) window.setDevice('mobile'); } },
      { id: 'cmd-split', title: '⚡ Dual-Screen Split Inspection Mode (Customer + Admin POS)', action: () => { this.setViewMode('hardware'); if (window.setDevice) window.setDevice('split'); } },
      { id: 'cmd-customer', title: '🛍️ Switch to Customer Storefront View', action: () => { if (window.setPersona) window.setPersona('customer'); } },
      { id: 'cmd-admin', title: '⚙️ Switch to Owner Admin / POS View', action: () => { if (window.setPersona) window.setPersona('admin'); } },
      { id: 'cmd-studio', title: '✨ Open Brand Chameleon White-Label Studio', action: () => { if (window.brandStudio) window.brandStudio.openDrawer(); } },
      { id: 'cmd-random', title: '🎲 Spotlight: Jump to Random Vertical Template', action: () => {
        if (allTemplates.length) {
          const rand = allTemplates[Math.floor(Math.random() * allTemplates.length)];
          this.mountTemplateInStage(rand.id);
        }
      }}
    ];

    let actionMatches = quickActions.filter(a => {
      if (!q) return true;
      return a.title.toLowerCase().includes(q);
    }).slice(0, 4);

    let html = '';

    if (templateMatches.length > 0) {
      html += `<div style="padding: 6px 12px; font-size: 11px; font-weight: 700; color: #71717A; text-transform: uppercase;">Vertical Nominees (${templateMatches.length})</div>`;
      templateMatches.forEach((t, idx) => {
        html += `
          <div class="spotlight-result-item ${idx === 0 && actionMatches.length === 0 ? 'selected' : ''}" data-type="template" data-id="${t.id}" onclick="showroomGallery.mountTemplateInStage('${t.id}'); showroomGallery.closeSpotlight();">
            <span style="font-family: var(--font-mono); font-size: 11px; font-weight: 700; color: #111; margin-right: 8px;">#${t.code}</span>
            <div style="flex:1;">
              <div class="spotlight-result-title">${t.title}</div>
              <div class="spotlight-result-sub">${t.category} • ${t.vibe}</div>
            </div>
            <span style="font-family: var(--font-mono); font-size: 10px; color: #059669; font-weight: 600;">Mount ↵</span>
          </div>
        `;
      });
    }

    if (actionMatches.length > 0) {
      html += `<div style="padding: 6px 12px; font-size: 11px; font-weight: 700; color: #71717A; text-transform: uppercase; margin-top: 6px;">Hardware & Workspace Actions</div>`;
      actionMatches.forEach((a, idx) => {
        const isFirst = (templateMatches.length === 0 && idx === 0);
        html += `
          <div class="spotlight-result-item ${isFirst ? 'selected' : ''}" data-type="action" data-action="${a.id}" onclick="showroomGallery.executeAction('${a.id}'); showroomGallery.closeSpotlight();">
            <div style="flex:1;">
              <div class="spotlight-result-title">${a.title}</div>
            </div>
            <span style="font-family: var(--font-mono); font-size: 10px; color: #71717A;">Execute ↵</span>
          </div>
        `;
      });
    }

    if (!templateMatches.length && !actionMatches.length) {
      html = `<div style="padding: 32px; text-align: center; color: var(--text-muted); font-size: 13px;">No matching templates or commands found for "${q}"</div>`;
    }

    resultsContainer.innerHTML = html;
    this.spotlightSelectedIdx = 0;
  }

  highlightSpotlightItem() {
    const items = document.querySelectorAll('.spotlight-result-item');
    items.forEach((item, idx) => {
      item.classList.toggle('selected', idx === this.spotlightSelectedIdx);
      if (idx === this.spotlightSelectedIdx) {
        item.scrollIntoView({ block: 'nearest' });
      }
    });
  }

  executeAction(actionId) {
    if (actionId === 'cmd-exhibit') this.setViewMode('exhibition');
    else if (actionId === 'cmd-hardware') this.setViewMode('hardware');
    else if (actionId === 'cmd-desktop') { this.setViewMode('hardware'); if (window.setDevice) window.setDevice('desktop'); }
    else if (actionId === 'cmd-tablet') { this.setViewMode('hardware'); if (window.setDevice) window.setDevice('tablet'); }
    else if (actionId === 'cmd-mobile') { this.setViewMode('hardware'); if (window.setDevice) window.setDevice('mobile'); }
    else if (actionId === 'cmd-split') { this.setViewMode('hardware'); if (window.setDevice) window.setDevice('split'); }
    else if (actionId === 'cmd-customer') { if (window.setPersona) window.setPersona('customer'); }
    else if (actionId === 'cmd-admin') { if (window.setPersona) window.setPersona('admin'); }
    else if (actionId === 'cmd-studio') { if (window.brandStudio) window.brandStudio.openDrawer(); }
    else if (actionId === 'cmd-random') {
      const allTemplates = window.catalog || [];
      if (allTemplates.length) {
        const rand = allTemplates[Math.floor(Math.random() * allTemplates.length)];
        this.mountTemplateInStage(rand.id);
      }
    }
  }

  setupGlobalShortcuts() {
    window.addEventListener('keydown', (e) => {
      const tag = (e.target.tagName || '').toLowerCase();
      const isInput = tag === 'input' || tag === 'textarea';

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        this.isSpotlightOpen ? this.closeSpotlight() : this.openSpotlight();
        return;
      }

      if (e.key === '/' && !isInput && !this.isSpotlightOpen) {
        e.preventDefault();
        this.openSpotlight();
        return;
      }

      if (e.code === 'Space' && !isInput && !this.isSpotlightOpen) {
        e.preventDefault();
        const nextMode = this.viewMode === 'exhibition' ? 'hardware' : 'exhibition';
        this.setViewMode(nextMode);
        return;
      }

      if (e.key === 'Escape') {
        if (this.isSpotlightOpen) this.closeSpotlight();
        if (window.brandStudio) window.brandStudio.closeDrawer();
      }
    });
  }
}

window.showroomGallery = new ShowroomGalleryEngine();
document.addEventListener('DOMContentLoaded', () => {
  window.showroomGallery.init();
});
