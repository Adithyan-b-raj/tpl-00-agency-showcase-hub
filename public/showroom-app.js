/* ==========================================================================
   SHOWROOM APP CONTROLLER
   Catalog listing (filters, sort, cards), Hardware Lab stage, white-label
   params. Deep links: ?tpl ?brand ?primary ?wa ?tagline ?logo ?view=admin ?device
   ========================================================================== */

window.catalog = [];
window.activeCategory = 'All';
window.activeTrackFilter = 'All';
window.activeSort = 'default';
window.selectedTemplate = null;
window.selectedTrackIndex = 0;
window.activePersona = 'customer'; // 'customer' | 'admin'
window.activeDevice = 'desktop';   // 'desktop' | 'tablet' | 'mobile' | 'split' | 'full'
window.wlParams = { brand: '', wa: '', tagline: '', primary: '', logo: '' };

const CATEGORIES = ['All', 'E-Commerce', 'Landing Page', 'Portfolio', 'Small ERP', 'Large ERP'];
const TRACKS = ['All', 'Cloudflare Edge', 'WooCommerce', 'Shopify', 'Self-Hosted Docker'];
const TRACK_LABELS = { 'All': 'All stacks', 'Cloudflare Edge': 'Cloudflare Edge', 'WooCommerce': 'WooCommerce', 'Shopify': 'Shopify', 'Self-Hosted Docker': 'Docker' };
const SORTS = [
  { id: 'default', label: 'Featured' },
  { id: 'name', label: 'Name A-Z' },
  { id: 'category', label: 'Category' },
  { id: 'stacks', label: 'Most stacks' }
];

const ICON_ARROW = '<svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
const ICON_EXT = '<svg viewBox="0 0 24 24"><path d="M7 17L17 7M8 7h9v9"/></svg>';

function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }

async function initShowroom() {
  try {
    const res = await fetch('/catalog.json');
    window.catalog = await res.json();
  } catch (err) {
    console.error('Failed to load /catalog.json', err);
  }

  const params = new URLSearchParams(window.location.search);
  ['brand', 'wa', 'tagline', 'primary', 'logo'].forEach(k => { if (params.get(k)) window.wlParams[k] = params.get(k); });
  if (params.get('view') === 'admin') window.activePersona = 'admin';

  window.selectedTemplate = window.catalog.find(t => t.id === params.get('tpl')) || window.catalog[0];

  const setVal = (id, v) => { const el = document.getElementById(id); if (el && v) el.value = v; };
  setVal('studioBrand', window.wlParams.brand);
  setVal('studioWa', window.wlParams.wa);
  setVal('studioTagline', window.wlParams.tagline);
  setVal('studioLogoUrl', window.wlParams.logo);
  if (window.wlParams.primary) {
    const hex = window.wlParams.primary.startsWith('#') ? window.wlParams.primary : '#' + window.wlParams.primary;
    setVal('studioPrimary', hex);
    setVal('studioPrimaryPicker', hex);
  }
  if (window.wlParams.brand) showWlBanner(window.wlParams.brand);

  buildFilterMenus();
  bindFilterMenus();
  renderExhibitionGrid();
  renderLabTemplateList();
  if (window.selectedTemplate) selectTemplate(window.selectedTemplate.id, false);
  setPersona(window.activePersona, true);

  if (params.get('device')) setDevice(params.get('device'));
  if (params.get('mode') === 'hardware' || params.get('tpl') || params.get('device') || params.get('view') === 'admin') {
    showroomGallery.setViewMode('hardware', true);
  }
  if (window.showroomAudio) window.showroomAudio.updateToggleButton();
}

function showWlBanner(label) {
  const banner = document.getElementById('activeWlBanner');
  const lbl = document.getElementById('activeWlLabel');
  if (banner) banner.style.display = 'inline-flex';
  if (lbl) lbl.textContent = label;
}

/* ---------- Mobile nav ---------- */
function toggleMobileNav(force) {
  const nav = document.getElementById('mainNav');
  const btn = document.getElementById('hamburgerBtn');
  if (!nav) return;
  const open = typeof force === 'boolean' ? force : !nav.classList.contains('is-open');
  nav.classList.toggle('is-open', open);
  if (btn) btn.setAttribute('aria-expanded', String(open));
}
window.toggleMobileNav = toggleMobileNav;

/* ---------- Filter dropdown menus ---------- */
function countFor(kind, value) {
  return window.catalog.filter(t => {
    if (kind === 'category') {
      const okT = window.activeTrackFilter === 'All' || (t.tracks || []).some(x => x.name === window.activeTrackFilter);
      return okT && (value === 'All' || t.category === value);
    }
    const okC = window.activeCategory === 'All' || t.category === window.activeCategory;
    return okC && (value === 'All' || (t.tracks || []).some(x => x.name === value));
  }).length;
}

function buildFilterMenus() {
  const mk = (kind, id, items, active, labelFn, handler) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.innerHTML = items.map(it => {
      const val = typeof it === 'string' ? it : it.id;
      const cnt = kind === 'sort' ? '' : `<span class="nav-filters__subcount">${countFor(kind, val)}</span>`;
      return `<button class="nav-filters__subitem ${val === active ? 'is-active' : ''}" data-kind="${kind}" data-value="${esc(val)}"><span>${esc(labelFn(it))}</span>${cnt}</button>`;
    }).join('');
  };
  mk('category', 'menuCategory', CATEGORIES, window.activeCategory, c => c === 'All' ? 'All categories' : c);
  mk('track', 'menuTrack', TRACKS, window.activeTrackFilter, t => TRACK_LABELS[t]);
  mk('sort', 'menuSort', SORTS, window.activeSort, s => s.label);

  const setLbl = (id, text, isSet) => {
    const span = document.getElementById(id);
    if (!span) return;
    span.textContent = text;
    span.parentElement.classList.toggle('is-set', isSet);
  };
  setLbl('lblCategory', window.activeCategory === 'All' ? 'Category' : window.activeCategory, window.activeCategory !== 'All');
  setLbl('lblTrack', window.activeTrackFilter === 'All' ? 'Stack' : TRACK_LABELS[window.activeTrackFilter], window.activeTrackFilter !== 'All');
  const sort = SORTS.find(s => s.id === window.activeSort);
  setLbl('lblSort', window.activeSort === 'default' ? 'Sort' : sort.label, window.activeSort !== 'default');
}

function bindFilterMenus() {
  document.querySelectorAll('.nav-filters__item').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const wasOpen = btn.classList.contains('is-open');
      closeFilterMenus();
      if (!wasOpen) btn.classList.add('is-open');
      if (window.showroomAudio) window.showroomAudio.playTick();
    });
  });
  document.querySelectorAll('.nav-filters__sublist').forEach(list => {
    list.addEventListener('click', e => {
      const b = e.target.closest('.nav-filters__subitem');
      if (!b) return;
      const v = b.dataset.value;
      if (b.dataset.kind === 'category') window.activeCategory = v;
      else if (b.dataset.kind === 'track') window.activeTrackFilter = v;
      else window.activeSort = v;
      closeFilterMenus();
      buildFilterMenus();
      renderExhibitionGrid();
      renderLabTemplateList();
      if (window.showroomAudio) window.showroomAudio.playTick();
    });
  });
  document.addEventListener('click', e => { if (!e.target.closest('.nav-filters__dropdown')) closeFilterMenus(); });
}

function closeFilterMenus() {
  document.querySelectorAll('.nav-filters__item.is-open').forEach(b => b.classList.remove('is-open'));
}
window.closeFilterMenus = closeFilterMenus;

function resetFilters() {
  window.activeCategory = 'All';
  window.activeTrackFilter = 'All';
  window.activeSort = 'default';
  buildFilterMenus();
  renderExhibitionGrid();
  renderLabTemplateList();
}
window.resetFilters = resetFilters;
window.setCategory = (c) => { window.activeCategory = c; buildFilterMenus(); renderExhibitionGrid(); renderLabTemplateList(); };
window.setTrackFilter = (t) => { window.activeTrackFilter = t; buildFilterMenus(); renderExhibitionGrid(); };

function getFilteredCatalog() {
  let list = window.catalog.filter(item => {
    const okC = window.activeCategory === 'All' || item.category === window.activeCategory;
    const okT = window.activeTrackFilter === 'All' || (item.tracks || []).some(t => t.name === window.activeTrackFilter);
    return okC && okT;
  });
  if (window.activeSort === 'name') list = list.slice().sort((a, b) => a.title.localeCompare(b.title));
  else if (window.activeSort === 'category') list = list.slice().sort((a, b) => a.category.localeCompare(b.category));
  else if (window.activeSort === 'stacks') list = list.slice().sort((a, b) => (b.tracks || []).length - (a.tracks || []).length);
  return list;
}

/* ---------- Card grid ---------- */
function renderExhibitionGrid() {
  const grid = document.getElementById('exhibitionGrid');
  if (!grid) return;
  const filtered = getFilteredCatalog();

  const cnt = document.getElementById('resultCount');
  if (cnt) cnt.textContent = filtered.length;
  const reset = document.getElementById('filterReset');
  if (reset) reset.hidden = window.activeCategory === 'All' && window.activeTrackFilter === 'All' && window.activeSort === 'default';

  if (filtered.length === 0) {
    grid.innerHTML = `<li class="empty-state"><h3>No templates found</h3><p>Nothing matches the selected filters.</p><button class="button button--dark" onclick="resetFilters()">Reset filters</button></li>`;
    return;
  }

  grid.innerHTML = filtered.map((item, idx) => {
    const color = item.defaultPrimary || '#222';
    const n = (item.tracks || []).length;
    return `
      <li class="col-3">
        <article class="card-site" data-id="${esc(item.id)}">
          <figure class="figure-rollover" onclick="showroomGallery.mountTemplateInStage('${esc(item.id)}')">
            <img class="figure-rollover__file" src="/thumbs/${esc(item.id)}-440.jpg" srcset="/thumbs/${esc(item.id)}-440.jpg 440w, /thumbs/${esc(item.id)}.jpg 880w" sizes="(max-width: 576px) 100vw, (max-width: 900px) 50vw, (max-width: 1270px) 33vw, 25vw" width="440" height="330" alt="${esc(item.title)} screenshot" loading="${idx < 8 ? 'eager' : 'lazy'}" decoding="async">
            <div class="figure-rollover__hover">
              <div class="figure-rollover__left">
                <div class="figure-rollover__row"><small>${esc(item.category)}</small></div>
                <div class="figure-rollover__row"><h3>${esc(item.title)}</h3></div>
              </div>
              <div class="figure-rollover__center">
                <button class="button" type="button" tabindex="-1">Mount in Studio ${ICON_ARROW}</button>
              </div>
              <div class="figure-rollover__right">
                <a class="button button--round" href="${esc(item.customerUrl)}" target="_blank" rel="noopener" title="Open live demo" aria-label="Open ${esc(item.title)} live demo" onclick="event.stopPropagation()">${ICON_EXT}</a>
              </div>
            </div>
          </figure>
          <div class="card-site__info">
            <div class="card-site__left">
              <span class="card-site__mark" style="background:${esc(color)}"></span>
              <h3 class="card-site__title" title="${esc(item.title)}">${esc(item.title)}</h3>
            </div>
            <div class="card-site__right">
              <span class="badge badge--cat">${esc(item.category)}</span>
              <span class="badge">${n} ${n === 1 ? 'stack' : 'stacks'}</span>
            </div>
          </div>
        </article>
      </li>`;
  }).join('');
}

/* ---------- Hardware Lab ---------- */
function renderLabTemplateList() {
  const listEl = document.getElementById('labTemplateList');
  if (!listEl) return;
  const q = (document.getElementById('labSearchInput') ? document.getElementById('labSearchInput').value : '').toLowerCase().trim();
  const filtered = window.catalog.filter(item => {
    const okC = window.activeCategory === 'All' || item.category === window.activeCategory;
    const okQ = !q || item.title.toLowerCase().includes(q) || item.category.toLowerCase().includes(q) || (item.vibe || '').toLowerCase().includes(q);
    return okC && okQ;
  });
  const c = document.getElementById('labDrawerCount');
  if (c) c.textContent = filtered.length;
  listEl.innerHTML = filtered.map(item => {
    const isActive = window.selectedTemplate && window.selectedTemplate.id === item.id;
    return `
      <button class="lab-tpl-item ${isActive ? 'active' : ''}" onclick="selectTemplate('${esc(item.id)}', true)">
        <span class="card-site__mark" style="background:${esc(item.defaultPrimary || '#222')}"></span>
        <span class="lab-tpl-text"><div class="lab-tpl-title">${esc(item.title)}</div><div class="lab-tpl-sub">${esc(item.category)}</div></span>
      </button>`;
  }).join('');
}

function selectTemplate(tplId, resetTrack) {
  const found = window.catalog.find(t => t.id === tplId);
  if (!found) return;
  window.selectedTemplate = found;
  if (resetTrack) window.selectedTrackIndex = 0;
  const titleEl = document.getElementById('studioTargetTplName');
  if (titleEl) titleEl.textContent = found.title;
  renderLabTemplateList();
  renderStackTabs();
  updateStageIframe();
  if (window.brandStudio) window.brandStudio.updateLiveOutputs();
}

function renderStackTabs() {
  const tabsEl = document.getElementById('labStackTabs');
  if (!tabsEl || !window.selectedTemplate || !window.selectedTemplate.tracks) return;
  tabsEl.innerHTML = window.selectedTemplate.tracks.map((tr, idx) =>
    `<button class="lab-stack-tab ${idx === window.selectedTrackIndex ? 'active' : ''}" onclick="selectTrack(${idx})">${esc(tr.label)}</button>`
  ).join('');
  const t = window.selectedTemplate.tracks[window.selectedTrackIndex] || window.selectedTemplate.tracks[0];
  const infoEl = document.getElementById('labStackInfo');
  if (infoEl && t) infoEl.textContent = `${t.stack || t.label} · ${t.repo}`;
}

function selectTrack(idx) {
  window.selectedTrackIndex = idx;
  renderStackTabs();
  updateStageIframe();
  if (window.showroomAudio) window.showroomAudio.playTick();
}

function setPersona(persona, silent) {
  window.activePersona = persona;
  const c = document.getElementById('btnPersonaCustomer');
  const a = document.getElementById('btnPersonaAdmin');
  if (c) c.classList.toggle('active', persona === 'customer');
  if (a) a.classList.toggle('active', persona === 'admin');
  updateStageIframe();
  if (!silent && window.showroomAudio) window.showroomAudio.playDeviceSwitch();
}

function setDevice(device) {
  window.activeDevice = device;
  const chassis = document.getElementById('singleHardwareChassis');
  const split = document.getElementById('splitStageContainer');
  ['Desktop', 'Tablet', 'Mobile', 'Split', 'Full'].forEach(d => {
    const btn = document.getElementById('btnDev' + d);
    if (btn) btn.classList.toggle('active', d.toLowerCase() === device);
  });
  if (device === 'split') {
    if (chassis) chassis.style.display = 'none';
    if (split) split.classList.add('active');
    updateSplitIframes();
  } else {
    if (split) split.classList.remove('active');
    if (chassis) {
      chassis.style.display = 'flex';
      chassis.className = 'hardware-chassis chassis-' + device;
    }
    updateStageIframe();
  }
  if (window.showroomAudio) window.showroomAudio.playDeviceSwitch();
}

function buildWhiteLabelQueryString() {
  const qs = new URLSearchParams();
  const p = window.wlParams;
  if (p.brand) qs.set('brand', p.brand);
  if (p.tagline) qs.set('tagline', p.tagline);
  if (p.primary) qs.set('primary', p.primary.replace(/^#/, ''));
  if (p.wa) qs.set('wa', p.wa.replace(/[^0-9]/g, ''));
  if (p.logo) qs.set('logo', p.logo);
  return qs.toString();
}

function getActiveBaseUrl(forPersona) {
  if (!window.selectedTemplate) return 'https://ecomtemplatecloudflare.pages.dev/';
  const track = (window.selectedTemplate.tracks && window.selectedTemplate.tracks[window.selectedTrackIndex]) || {};
  if (forPersona === 'admin') return track.adminUrl || window.selectedTemplate.adminUrl || 'https://ecomtemplatecloudflare.pages.dev/admin.html';
  return track.customerUrl || window.selectedTemplate.customerUrl || 'https://ecomtemplatecloudflare.pages.dev/';
}
window.getActiveBaseUrl = getActiveBaseUrl;

function updateStageIframe() {
  if (window.activeDevice === 'split') updateSplitIframes();
  // Only load iframes once the lab is actually shown, to keep the listing light
  if (!window.labOpened && !(window.showroomGallery && window.showroomGallery.viewMode === 'hardware')) return;
  const baseUrl = getActiveBaseUrl(window.activePersona);
  const qs = buildWhiteLabelQueryString();
  const finalUrl = qs ? `${baseUrl}?${qs}` : baseUrl;
  const frame = document.getElementById('previewFrame');
  if (frame && frame.dataset.src !== finalUrl && window.activeDevice !== 'split') {
    frame.dataset.src = finalUrl;
    frame.src = finalUrl;
  }
  const urlText = document.getElementById('browserUrlText');
  if (urlText) urlText.textContent = finalUrl;
  const directBtn = document.getElementById('labDirectLinkBtn');
  if (directBtn) directBtn.href = finalUrl;
  const badge = document.getElementById('browserStatusBadge');
  if (badge) badge.textContent = window.activePersona === 'admin' ? 'Owner Admin' : 'Customer';
}
window.updateStageIframe = updateStageIframe;

function updateSplitIframes() {
  if (!window.labOpened && !(window.showroomGallery && window.showroomGallery.viewMode === 'hardware')) return;
  const qs = buildWhiteLabelQueryString();
  const custBase = getActiveBaseUrl('customer');
  const admBase = getActiveBaseUrl('admin');
  const custFinal = qs ? `${custBase}?${qs}` : custBase;
  const admFinal = qs ? `${admBase}?${qs}` : admBase;
  const cf = document.getElementById('splitCustomerFrame');
  const af = document.getElementById('splitAdminFrame');
  if (cf && cf.dataset.src !== custFinal) { cf.dataset.src = custFinal; cf.src = custFinal; }
  if (af && af.dataset.src !== admFinal) { af.dataset.src = admFinal; af.src = admFinal; }
  const cd = document.getElementById('splitCustomerDirectLink');
  const ad = document.getElementById('splitAdminDirectLink');
  if (cd) cd.href = custFinal;
  if (ad) ad.href = admFinal;
}

function resetWhiteLabel() {
  window.wlParams = { brand: '', wa: '', tagline: '', primary: '', logo: '' };
  const banner = document.getElementById('activeWlBanner');
  if (banner) banner.style.display = 'none';
  ['studioBrand', 'studioWa', 'studioTagline', 'studioLogoUrl'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
  const picker = document.getElementById('studioPrimaryPicker');
  const primaryInput = document.getElementById('studioPrimary');
  if (picker) picker.value = '#222222';
  if (primaryInput) primaryInput.value = '#222222';

  const baseUrl = getActiveBaseUrl(window.activePersona);
  const frame = document.getElementById('previewFrame');
  if (frame && window.showroomGallery.viewMode === 'hardware') { frame.dataset.src = baseUrl + '?reset_wl=1'; frame.src = baseUrl + '?reset_wl=1'; }
  const urlText = document.getElementById('browserUrlText');
  if (urlText) urlText.textContent = baseUrl;
  if (window.activeDevice === 'split') updateSplitIframes();
  if (window.brandStudio) window.brandStudio.updateLiveOutputs();
  if (window.showroomAudio) window.showroomAudio.playDeviceSwitch();
}

document.addEventListener('DOMContentLoaded', initShowroom);
