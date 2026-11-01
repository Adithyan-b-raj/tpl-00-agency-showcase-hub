/* ==========================================================================
   SHOWROOM GALLERY ENGINE
   View switching (listing / hardware lab), search spotlight, shortcuts.
   ========================================================================== */

class ShowroomGalleryEngine {
  constructor() {
    this.viewMode = 'exhibition'; // 'exhibition' | 'hardware'
    this.isSpotlightOpen = false;
    this.spotlightSelectedIdx = 0;
  }

  init() {
    this.setupGlobalShortcuts();
    this.setupSpotlightPalette();
  }

  setViewMode(mode, silent) {
    this.viewMode = mode;
    const exhibition = document.getElementById('viewExhibition');
    const hardware = document.getElementById('viewHardware');
    const isLab = mode === 'hardware';
    if (exhibition) exhibition.style.display = isLab ? 'none' : 'block';
    if (hardware) {
      hardware.style.display = isLab ? 'flex' : 'none';
      hardware.classList.toggle('is-on', isLab);
    }
    document.body.classList.toggle('is-lab', isLab);
    const bx = document.getElementById('btnViewExhibition');
    const bh = document.getElementById('btnViewHardware');
    if (bx) bx.classList.toggle('is-active', !isLab);
    if (bh) bh.classList.toggle('is-active', isLab);
    if (window.toggleMobileNav) window.toggleMobileNav(false);
    if (isLab) {
      if (window.activeDevice === 'split' && window.setDevice) window.setDevice('split');
      else if (window.updateStageIframe) window.updateStageIframe();
    }
    if (!silent && window.showroomAudio) window.showroomAudio.playDeviceSwitch();
  }

  mountTemplateInStage(templateId) {
    if (window.selectTemplate) window.selectTemplate(templateId, true);
    this.setViewMode('hardware', true);
    window.scrollTo(0, 0);
    if (window.showroomAudio) window.showroomAudio.playTemplateSelect();
  }

  /* ---------- Spotlight ---------- */
  setupSpotlightPalette() {
    const palette = document.getElementById('spotlightModal');
    const input = document.getElementById('spotlightInput');
    if (!palette || !input) return;

    input.addEventListener('input', () => this.renderSpotlightResults());
    input.addEventListener('keydown', (e) => {
      const items = document.querySelectorAll('.spotlight-result-item');
      if (e.key === 'Escape') { this.closeSpotlight(); return; }
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

  getQuickActions() {
    return [
      { id: 'cmd-exhibit', title: 'Go to Showroom' },
      { id: 'cmd-hardware', title: 'Go to Hardware Lab' },
      { id: 'cmd-desktop', title: 'Preview on desktop' },
      { id: 'cmd-tablet', title: 'Preview on tablet' },
      { id: 'cmd-mobile', title: 'Preview on mobile' },
      { id: 'cmd-split', title: 'Split view: customer and admin' },
      { id: 'cmd-customer', title: 'Show customer storefront' },
      { id: 'cmd-admin', title: 'Show owner admin' },
      { id: 'cmd-studio', title: 'Open Personalize' },
      { id: 'cmd-random', title: 'Open a random template' }
    ];
  }

  renderSpotlightResults() {
    const q = (document.getElementById('spotlightInput').value || '').toLowerCase().trim();
    const el = document.getElementById('spotlightResults');
    if (!el) return;
    const esc = window.esc || (s => s);

    const templateMatches = (window.catalog || []).filter(t => !q ||
      t.title.toLowerCase().includes(q) || t.category.toLowerCase().includes(q) ||
      (t.vibe || '').toLowerCase().includes(q) || (t.features && t.features.some(f => f.toLowerCase().includes(q)))
    ).slice(0, 7);
    const actionMatches = this.getQuickActions().filter(a => !q || a.title.toLowerCase().includes(q)).slice(0, 5);

    let html = '';
    if (templateMatches.length) {
      html += `<div class="spotlight-group">Templates</div>`;
      templateMatches.forEach(t => {
        html += `
          <div class="spotlight-result-item" data-type="template" data-id="${esc(t.id)}" onclick="showroomGallery.mountTemplateInStage('${esc(t.id)}'); showroomGallery.closeSpotlight();">
            <span class="card-site__mark" style="background:${esc(t.defaultPrimary || '#222')}"></span>
            <div class="spotlight-result-body">
              <div class="spotlight-result-title">${esc(t.title)}</div>
              <div class="spotlight-result-sub">${esc(t.category)}</div>
            </div>
            <span class="spotlight-hint">Open</span>
          </div>`;
      });
    }
    if (actionMatches.length) {
      html += `<div class="spotlight-group">Actions</div>`;
      actionMatches.forEach(a => {
        html += `
          <div class="spotlight-result-item" data-type="action" data-action="${a.id}" onclick="showroomGallery.executeAction('${a.id}'); showroomGallery.closeSpotlight();">
            <div class="spotlight-result-body"><div class="spotlight-result-title">${a.title}</div></div>
          </div>`;
      });
    }
    if (!templateMatches.length && !actionMatches.length) {
      html = `<div class="spotlight-empty">No results for "${esc(q)}"</div>`;
    }
    el.innerHTML = html;
    this.spotlightSelectedIdx = 0;
    this.highlightSpotlightItem(true);
  }

  highlightSpotlightItem(noScroll) {
    document.querySelectorAll('.spotlight-result-item').forEach((item, idx) => {
      item.classList.toggle('selected', idx === this.spotlightSelectedIdx);
      if (!noScroll && idx === this.spotlightSelectedIdx) item.scrollIntoView({ block: 'nearest' });
    });
  }

  executeAction(actionId) {
    const lab = (fn) => { this.setViewMode('hardware', true); fn(); };
    switch (actionId) {
      case 'cmd-exhibit': this.setViewMode('exhibition'); break;
      case 'cmd-hardware': this.setViewMode('hardware'); break;
      case 'cmd-desktop': lab(() => window.setDevice && window.setDevice('desktop')); break;
      case 'cmd-tablet': lab(() => window.setDevice && window.setDevice('tablet')); break;
      case 'cmd-mobile': lab(() => window.setDevice && window.setDevice('mobile')); break;
      case 'cmd-split': lab(() => window.setDevice && window.setDevice('split')); break;
      case 'cmd-customer': lab(() => window.setPersona && window.setPersona('customer')); break;
      case 'cmd-admin': lab(() => window.setPersona && window.setPersona('admin')); break;
      case 'cmd-studio': if (window.brandStudio) window.brandStudio.openDrawer(); break;
      case 'cmd-random': {
        const all = window.catalog || [];
        if (all.length) this.mountTemplateInStage(all[Math.floor(Math.random() * all.length)].id);
        break;
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
      if (e.key === 'Escape') {
        if (this.isSpotlightOpen) this.closeSpotlight();
        if (window.brandStudio) window.brandStudio.closeDrawer();
        if (window.closeFilterMenus) window.closeFilterMenus();
      }
    });
  }
}

window.showroomGallery = new ShowroomGalleryEngine();
document.addEventListener('DOMContentLoaded', () => window.showroomGallery.init());
