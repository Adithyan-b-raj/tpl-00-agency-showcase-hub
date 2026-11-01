/* ==========================================================================
   BRAND CHAMELEON STUDIO & WHITE-LABEL ENGINE
   Sliding Drawer, Canvas Palette Extractor, Pure-JS SVG QR Generator,
   WhatsApp Pitch Builder, and Client Presentation Mode.
   ========================================================================== */

// Embedded Lightweight Pure-JS QR Code Engine for Crisp Scalable SVG
const MiniQRCode = (() => {
  const GF256_EXP = new Uint8Array(512);
  const GF256_LOG = new Uint8Array(256);
  let x = 1;
  for (let i = 0; i < 255; i++) {
    GF256_EXP[i] = x;
    GF256_EXP[i + 255] = x;
    GF256_LOG[x] = i;
    x <<= 1;
    if (x & 256) x ^= 0x11d;
  }

  function gfMul(a, b) {
    if (a === 0 || b === 0) return 0;
    return GF256_EXP[GF256_LOG[a] + GF256_LOG[b]];
  }

  function rsGeneratorPoly(degree) {
    let poly = [1];
    for (let i = 0; i < degree; i++) {
      const next = new Array(poly.length + 1).fill(0);
      for (let j = 0; j < poly.length; j++) {
        next[j] ^= gfMul(poly[j], GF256_EXP[i]);
        next[j + 1] ^= poly[j];
      }
      poly = next;
    }
    return poly;
  }

  function rsCalculateECC(data, eccLength) {
    const gen = rsGeneratorPoly(eccLength);
    const res = new Array(eccLength).fill(0);
    for (let i = 0; i < data.length; i++) {
      const coef = data[i] ^ res[0];
      res.shift();
      res.push(0);
      if (coef !== 0) {
        for (let j = 0; j < eccLength; j++) {
          res[j] ^= gfMul(gen[j + 1], coef);
        }
      }
    }
    return res;
  }

  const VERSIONS = [
    null,
    { ver: 1, size: 21, dataBytes: 19, eccBytes: 7, blocks: 1, align: [] },
    { ver: 2, size: 25, dataBytes: 34, eccBytes: 10, blocks: 1, align: [6, 18] },
    { ver: 3, size: 29, dataBytes: 55, eccBytes: 15, blocks: 1, align: [6, 22] },
    { ver: 4, size: 33, dataBytes: 80, eccBytes: 20, blocks: 1, align: [6, 26] },
    { ver: 5, size: 37, dataBytes: 108, eccBytes: 26, blocks: 1, align: [6, 30] },
    { ver: 6, size: 41, dataBytes: 136, eccBytes: 18, blocks: 2, align: [6, 34] },
    { ver: 7, size: 45, dataBytes: 156, eccBytes: 20, blocks: 2, align: [6, 22, 38] },
    { ver: 8, size: 49, dataBytes: 194, eccBytes: 24, blocks: 2, align: [6, 24, 42] },
    { ver: 9, size: 53, dataBytes: 232, eccBytes: 30, blocks: 2, align: [6, 26, 46] },
    { ver: 10, size: 57, dataBytes: 274, eccBytes: 18, blocks: 4, align: [6, 28, 50] }
  ];

  function getVersionForLength(byteLen) {
    for (let v = 1; v < VERSIONS.length; v++) {
      if (byteLen <= VERSIONS[v].dataBytes - 3) return VERSIONS[v];
    }
    return VERSIONS[VERSIONS.length - 1];
  }

  function encodeData(text, spec) {
    const bytes = new TextEncoder().encode(text);
    const bitStream = [];
    const pushBits = (val, length) => {
      for (let i = length - 1; i >= 0; i--) {
        bitStream.push((val >> i) & 1);
      }
    };

    pushBits(4, 4); // Byte mode
    pushBits(bytes.length, 8); // Char count
    for (const b of bytes) pushBits(b, 8);

    const totalDataBits = spec.dataBytes * 8;
    const padLen = Math.min(4, totalDataBits - bitStream.length);
    for (let i = 0; i < padLen; i++) bitStream.push(0);
    while (bitStream.length % 8 !== 0) bitStream.push(0);

    const dataBytes = [];
    for (let i = 0; i < bitStream.length; i += 8) {
      let b = 0;
      for (let j = 0; j < 8; j++) b = (b << 1) | bitStream[i + j];
      dataBytes.push(b);
    }

    const padBytes = [0xEC, 0x11];
    let padIdx = 0;
    while (dataBytes.length < spec.dataBytes) {
      dataBytes.push(padBytes[padIdx % 2]);
      padIdx++;
    }
    return dataBytes;
  }

  function generateMatrix(text) {
    const bytes = new TextEncoder().encode(text);
    const spec = getVersionForLength(bytes.length);
    const dataBytes = encodeData(text, spec);

    const blockSize = Math.floor(spec.dataBytes / spec.blocks);
    const eccSize = spec.eccBytes;
    const blocksData = [];
    const blocksEcc = [];

    for (let i = 0; i < spec.blocks; i++) {
      const slice = dataBytes.slice(i * blockSize, (i + 1) * blockSize);
      blocksData.push(slice);
      blocksEcc.push(rsCalculateECC(slice, eccSize));
    }

    const finalCodewords = [];
    for (let j = 0; j < blockSize; j++) {
      for (let i = 0; i < spec.blocks; i++) {
        finalCodewords.push(blocksData[i][j]);
      }
    }
    for (let j = 0; j < eccSize; j++) {
      for (let i = 0; i < spec.blocks; i++) {
        finalCodewords.push(blocksEcc[i][j]);
      }
    }

    const n = spec.size;
    const matrix = Array.from({ length: n }, () => new Array(n).fill(null));

    function placeFinder(row, col) {
      for (let r = 0; r < 7; r++) {
        for (let c = 0; c < 7; c++) {
          if (r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4)) {
            matrix[row + r][col + c] = 1;
          } else {
            matrix[row + r][col + c] = 0;
          }
        }
      }
      for (let r = -1; r <= 7; r++) {
        for (let c = -1; c <= 7; c++) {
          const mr = row + r;
          const mc = col + c;
          if (mr >= 0 && mr < n && mc >= 0 && mc < n) {
            if (matrix[mr][mc] === null) matrix[mr][mc] = 0;
          }
        }
      }
    }

    placeFinder(0, 0);
    placeFinder(0, n - 7);
    placeFinder(n - 7, 0);

    if (spec.align && spec.align.length > 0) {
      const coords = spec.align;
      for (const r of coords) {
        for (const c of coords) {
          if (matrix[r][c] !== null) continue;
          for (let dr = -2; dr <= 2; dr++) {
            for (let dc = -2; dc <= 2; dc++) {
              if (Math.abs(dr) === 2 || Math.abs(dc) === 2 || (dr === 0 && dc === 0)) {
                matrix[r + dr][c + dc] = 1;
              } else {
                matrix[r + dr][c + dc] = 0;
              }
            }
          }
        }
      }
    }

    for (let i = 8; i < n - 8; i++) {
      if (matrix[6][i] === null) matrix[6][i] = (i % 2 === 0) ? 1 : 0;
      if (matrix[i][6] === null) matrix[i][6] = (i % 2 === 0) ? 1 : 0;
    }

    matrix[4 * spec.ver + 9][8] = 1;

    for (let i = 0; i < 9; i++) {
      if (matrix[8][i] === null) matrix[8][i] = 0;
      if (matrix[i][8] === null) matrix[i][8] = 0;
    }
    for (let i = n - 8; i < n; i++) {
      if (matrix[8][i] === null) matrix[8][i] = 0;
      if (matrix[i][8] === null) matrix[i][8] = 0;
    }

    const bits = [];
    for (const byte of finalCodewords) {
      for (let i = 7; i >= 0; i--) bits.push((byte >> i) & 1);
    }

    let bitIdx = 0;
    let right = n - 1;
    let upward = true;

    while (right > 0) {
      if (right === 6) right--;
      const col1 = right;
      const col2 = right - 1;
      const rows = upward
        ? Array.from({ length: n }, (_, i) => n - 1 - i)
        : Array.from({ length: n }, (_, i) => i);

      for (const row of rows) {
        for (const col of [col1, col2]) {
          if (matrix[row][col] === null) {
            const rawBit = bitIdx < bits.length ? bits[bitIdx++] : 0;
            const mask = ((row + col) % 2 === 0) ? 1 : 0;
            matrix[row][col] = rawBit ^ mask;
          }
        }
      }
      upward = !upward;
      right -= 2;
    }

    const formatBits = [1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0];
    for (let i = 0; i < 6; i++) matrix[8][i] = formatBits[i];
    matrix[8][7] = formatBits[6];
    matrix[8][8] = formatBits[7];
    matrix[7][8] = formatBits[8];
    for (let i = 9; i < 15; i++) matrix[14 - i][8] = formatBits[i];
    for (let i = 0; i < 8; i++) matrix[n - 1 - i][8] = formatBits[i];
    for (let i = 8; i < 15; i++) matrix[8][n - 15 + i] = formatBits[i];

    return matrix;
  }

  function toSVG(text, size = 160, fg = '#FFFFFF', bg = 'transparent') {
    try {
      const matrix = generateMatrix(text);
      const n = matrix.length;
      const padding = 2;
      const totalDim = n + padding * 2;
      let path = '';

      for (let r = 0; r < n; r++) {
        for (let c = 0; c < n; c++) {
          if (matrix[r][c] === 1) {
            path += `M${c + padding},${r + padding}h1v1h-1z `;
          }
        }
      }

      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalDim} ${totalDim}" width="${size}" height="${size}" shape-rendering="crispEdges">
        ${bg !== 'transparent' ? `<rect width="${totalDim}" height="${totalDim}" fill="${bg}"/>` : ''}
        <path d="${path}" fill="${fg}"/>
      </svg>`;
    } catch (e) {
      console.error('QR Gen error:', e);
      return `<div style="color:var(--text-muted);font-size:11px;padding:20px;text-align:center;">QR Code generation preview</div>`;
    }
  }

  return { toSVG };
})();
if (typeof window !== 'undefined') window.MiniQRCode = MiniQRCode;

// Brand Chameleon Studio Class
class BrandChameleonStudio {
  constructor() {
    this.drawerEl = null;
    this.extractedColors = [];
    this.activePreset = null;
  }

  init() {
    this.drawerEl = document.getElementById('brandStudioDrawer');
    this.setupLogoExtractor();
  }

  openDrawer() {
    if (!this.drawerEl) this.drawerEl = document.getElementById('brandStudioDrawer');
    if (this.drawerEl) {
      this.drawerEl.classList.add('open');
      document.getElementById('brandStudioOverlay').classList.add('open');
      this.updateLiveOutputs();
      if (window.showroomAudio) window.showroomAudio.playDeviceSwitch();
    }
  }

  closeDrawer() {
    if (this.drawerEl) {
      this.drawerEl.classList.remove('open');
      document.getElementById('brandStudioOverlay').classList.remove('open');
    }
  }

  setupLogoExtractor() {
    const fileInput = document.getElementById('studioLogoFile');
    if (fileInput) {
      fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
          this.extractColorsFromImageSrc(event.target.result);
        };
        reader.readAsDataURL(file);
      });
    }

    const urlInput = document.getElementById('studioLogoUrl');
    if (urlInput) {
      urlInput.addEventListener('blur', () => {
        const url = urlInput.value.trim();
        if (url) this.extractColorsFromImageSrc(url);
      });
    }
  }

  extractColorsFromImageSrc(src) {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const w = 120;
        const h = 120;
        canvas.width = w;
        canvas.height = h;
        ctx.drawImage(img, 0, 0, w, h);

        const imgData = ctx.getImageData(0, 0, w, h).data;
        const colorBuckets = {};

        for (let i = 0; i < imgData.length; i += 4) {
          const r = imgData[i];
          const g = imgData[i + 1];
          const b = imgData[i + 2];
          const a = imgData[i + 3];

          // Skip transparent or near-black/near-white
          if (a < 128) continue;
          const brightness = (r * 299 + g * 587 + b * 114) / 1000;
          if (brightness < 20 || brightness > 240) continue;

          // Bucket to 16-step quantization
          const qr = Math.round(r / 24) * 24;
          const qg = Math.round(g / 24) * 24;
          const qb = Math.round(b / 24) * 24;
          const key = `${qr},${qg},${qb}`;
          colorBuckets[key] = (colorBuckets[key] || 0) + 1;
        }

        const sorted = Object.entries(colorBuckets).sort((a, b) => b[1] - a[1]);
        if (sorted.length > 0) {
          const [topKey] = sorted[0];
          const [r, g, b] = topKey.split(',').map(Number);
          const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
          this.applyColor(hex, 'Logo Extracted');
          const statusBadge = document.getElementById('extractorStatus');
          if (statusBadge) {
            statusBadge.innerHTML = `✓ Extracted primary <span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:${hex};vertical-align:middle;margin:0 4px;"></span> ${hex.toUpperCase()}`;
            statusBadge.style.color = 'var(--emerald-signal)';
          }
        }
      } catch (err) {
        console.warn('Canvas palette extraction restricted by CORS or invalid format:', err);
      }
    };
    img.src = src;
  }

  applyPreset(hex, label) {
    this.applyColor(hex, label);
    if (window.showroomAudio) window.showroomAudio.playTick();
  }

  applyColor(hex, label) {
    const clean = hex.startsWith('#') ? hex : '#' + hex;
    const picker = document.getElementById('studioPrimaryPicker');
    const textInput = document.getElementById('studioPrimary');
    if (picker) picker.value = clean;
    if (textInput) textInput.value = clean;
    this.updateLiveOutputs();
  }

  getStudioValues() {
    return {
      brand: (document.getElementById('studioBrand') ? document.getElementById('studioBrand').value.trim() : ''),
      wa: (document.getElementById('studioWa') ? document.getElementById('studioWa').value.trim() : ''),
      tagline: (document.getElementById('studioTagline') ? document.getElementById('studioTagline').value.trim() : ''),
      primary: (document.getElementById('studioPrimary') ? document.getElementById('studioPrimary').value.trim() : ''),
      logo: (document.getElementById('studioLogoUrl') ? document.getElementById('studioLogoUrl').value.trim() : '')
    };
  }

  updateLiveOutputs() {
    const vals = this.getStudioValues();
    const qs = new URLSearchParams();
    if (vals.brand) qs.set('brand', vals.brand);
    if (vals.tagline) qs.set('tagline', vals.tagline);
    if (vals.primary) qs.set('primary', vals.primary.replace(/^#/, ''));
    if (vals.wa) qs.set('wa', vals.wa.replace(/[^0-9]/g, ''));
    if (vals.logo) qs.set('logo', vals.logo);

    const qsStr = qs.toString();
    const custBase = window.getActiveBaseUrl ? window.getActiveBaseUrl('customer') : 'https://ecomtemplatecloudflare.pages.dev/';
    const adminBase = window.getActiveBaseUrl ? window.getActiveBaseUrl('admin') : 'https://ecomtemplatecloudflare.pages.dev/admin.html';

    const custUrl = qsStr ? `${custBase}?${qsStr}` : custBase;
    const admUrl = qsStr ? `${adminBase}?${qsStr}` : adminBase;

    const urlDisplay = document.getElementById('studioGeneratedUrl');
    if (urlDisplay) {
      urlDisplay.textContent = custUrl;
      urlDisplay.dataset.custUrl = custUrl;
      urlDisplay.dataset.admUrl = admUrl;
    }

    // Dynamic QR generation
    const qrContainer = document.getElementById('studioQrBox');
    if (qrContainer) {
      qrContainer.innerHTML = MiniQRCode.toSVG(custUrl, 150, '#FFFFFF', 'transparent');
    }

    // WhatsApp Pitch copy formatting
    const brandName = vals.brand || (window.selectedTemplate ? window.selectedTemplate.defaultBrand : 'Your Brand');
    const pitchText = `Hi! 👋\n\nHere is an exclusive interactive demo tailored specifically for *${brandName}*:\n\n🛍️ *Customer Storefront Prototype:* ${custUrl}\n⚙️ *Owner Admin & POS Command Center:* ${admUrl}\n\nTap to test live on your phone — sized products, order placement & POS counter!`;

    const waBtn = document.getElementById('studioSendWaBtn');
    if (waBtn) {
      const cleanWa = vals.wa ? vals.wa.replace(/[^0-9]/g, '') : '';
      waBtn.href = `https://wa.me/${cleanWa}?text=${encodeURIComponent(pitchText)}`;
      waBtn.dataset.pitch = pitchText;
    }
  }

  applyToHardwareStage() {
    const vals = this.getStudioValues();
    if (window.wlParams) {
      window.wlParams = vals;
    }
    const banner = document.getElementById('activeWlBanner');
    const label = document.getElementById('activeWlLabel');
    if (vals.brand) {
      if (banner) banner.classList.add('show');
      if (label) label.textContent = vals.brand;
    }

    if (window.updateStageIframe) window.updateStageIframe();
    if (window.showroomAudio) window.showroomAudio.playWhitelabelChime();
    this.closeDrawer();
  }

  launchPitchDeckMode() {
    const vals = this.getStudioValues();
    const custBase = window.getActiveBaseUrl ? window.getActiveBaseUrl('customer') : 'https://ecomtemplatecloudflare.pages.dev/';
    const qs = new URLSearchParams();
    if (vals.brand) qs.set('brand', vals.brand);
    if (vals.tagline) qs.set('tagline', vals.tagline);
    if (vals.primary) qs.set('primary', vals.primary.replace(/^#/, ''));
    if (vals.wa) qs.set('wa', vals.wa.replace(/[^0-9]/g, ''));
    if (vals.logo) qs.set('logo', vals.logo);

    const clientUrl = qs.toString() ? `${custBase}?${qs.toString()}` : custBase;
    
    // Open in clean presentation modal or new window with presentation banner
    const win = window.open(clientUrl, '_blank');
    if (win) win.focus();
  }

  copyStorefrontUrl(btn) {
    const url = document.getElementById('studioGeneratedUrl').dataset.custUrl || document.getElementById('studioGeneratedUrl').textContent;
    navigator.clipboard.writeText(url);
    this.flashButton(btn, '✓ Storefront Copied!');
  }

  copyAdminUrl(btn) {
    const url = document.getElementById('studioGeneratedUrl').dataset.admUrl;
    navigator.clipboard.writeText(url);
    this.flashButton(btn, '✓ Admin URL Copied!');
  }

  copyWhatsAppPitch(btn) {
    const pitch = document.getElementById('studioSendWaBtn').dataset.pitch;
    navigator.clipboard.writeText(pitch);
    this.flashButton(btn, '✓ Pitch Text Copied!');
  }

  flashButton(btn, tempText) {
    const old = btn.textContent;
    btn.textContent = tempText;
    if (window.showroomAudio) window.showroomAudio.playTick();
    setTimeout(() => { btn.textContent = old; }, 1600);
  }
}

window.brandStudio = new BrandChameleonStudio();
document.addEventListener('DOMContentLoaded', () => {
  window.brandStudio.init();
});
