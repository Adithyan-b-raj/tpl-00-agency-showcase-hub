/* ==========================================================================
   AWWWARDS NOMINEES 18 RICH VISUAL MOCKUP ENGINE
   Authentic visual representations for each of the 18 verticals:
   16:10 Cinema Ratio Preview • Zero Wall-of-Text • High-DPI Vector Artwork
   ========================================================================== */

const CardMockups = {
  getMockup(code, item) {
    const c = String(code);
    switch (c) {
      case '1.1': return this.mockupBoutique(item);
      case '1.2': return this.mockupStreetwear(item);
      case '1.3': return this.mockupCosmetics(item);
      case '1.4': return this.mockupQuickCommerce(item);
      case '1.5': return this.mockupB2BWholesale(item);
      case '2.1': return this.mockupAIBento(item);
      case '2.2': return this.mockupRealEstate(item);
      case '2.3': return this.mockupHardware(item);
      case '2.4': return this.mockupEventTicket(item);
      case '3.1': return this.mockupCreativeAgency(item);
      case '3.2': return this.mockupPhotography(item);
      case '3.3': return this.mockupArchitecture(item);
      case '4.1': return this.mockupRetailPOS(item);
      case '4.2': return this.mockupClinicSalon(item);
      case '4.3': return this.mockupCafeKOT(item);
      case '4.4': return this.mockupRepairTracker(item);
      case '5.1': return this.mockupWarehouseERP(item);
      case '5.2': return this.mockupHRMSPayroll(item);
      default: return this.mockupDefault(item);
    }
  },

  /* #1.1 Boutique & Ethnic Wear Lookbook + POS */
  mockupBoutique(item) {
    return `
      <div class="vmk-wrap vmk-boutique">
        <div class="vmk-boutique-grid">
          <div class="vmk-boutique-lookbook">
            <div class="vmk-boutique-tag">AUTHENTIC HANDLOOMS</div>
            <div class="vmk-boutique-garment">
              <svg viewBox="0 0 100 120" class="vmk-garment-svg">
                <path d="M30,20 L50,32 L70,20 L85,45 L72,52 L74,110 L26,110 L28,52 L15,45 Z" fill="#F76B6A" opacity="0.9"/>
                <path d="M42,27 C46,36 54,36 58,27" stroke="#FFF" stroke-width="2" fill="none"/>
                <line x1="50" y1="35" x2="50" y2="105" stroke="#FFF" stroke-dasharray="2,3" stroke-width="1.5" opacity="0.6"/>
              </svg>
            </div>
            <div class="vmk-boutique-item-title">Kaka Pure Cotton Kurthi</div>
            <div class="vmk-boutique-price-row">
              <span class="vmk-price">₹1,299</span>
              <span class="vmk-badge-gold">★ 4.9 (128)</span>
            </div>
          </div>
          <div class="vmk-boutique-side">
            <div class="vmk-side-box">
              <div class="vmk-mini-label">SELECT SIZE</div>
              <div class="vmk-size-row">
                <span class="vmk-size-chip">XS</span>
                <span class="vmk-size-chip">S</span>
                <span class="vmk-size-chip active">M</span>
                <span class="vmk-size-chip">L</span>
                <span class="vmk-size-chip">XL</span>
              </div>
              <div class="vmk-stock-warn">⚡ Only 4 left in size M</div>
            </div>
            <div class="vmk-receipt-snippet">
              <div class="vmk-receipt-header">COUNTER POS BILL</div>
              <div class="vmk-receipt-row"><span>1x Handloom Kurthi</span><span>₹1,299</span></div>
              <div class="vmk-receipt-row"><span>GST 5%</span><span>₹65</span></div>
              <div class="vmk-receipt-total"><span>PAID CASHFREE UPI</span><span>₹1,364</span></div>
              <div class="vmk-barcode-lines">||| | |||| || | |||| |||</div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  /* #1.2 Gen-Z Streetwear Drop & Anti-Bot Queue */
  mockupStreetwear(item) {
    return `
      <div class="vmk-wrap vmk-streetwear">
        <div class="vmk-street-header">
          <span class="vmk-street-brand">VORTEX // ARCHIVE</span>
          <span class="vmk-street-live">● DROP 04 LIVE</span>
        </div>
        <div class="vmk-street-main">
          <div class="vmk-street-headline">HEAVYWEIGHT 480GSM</div>
          <div class="vmk-flip-clock">
            <div class="vmk-flip-tile"><span class="vnum">02</span><span class="vlbl">DAYS</span></div>
            <span class="vsep">:</span>
            <div class="vmk-flip-tile"><span class="vnum">14</span><span class="vlbl">HRS</span></div>
            <span class="vsep">:</span>
            <div class="vmk-flip-tile"><span class="vnum">38</span><span class="vlbl">MIN</span></div>
            <span class="vsep">:</span>
            <div class="vmk-flip-tile"><span class="vnum">09</span><span class="vlbl">SEC</span></div>
          </div>
          <div class="vmk-antibot-bar">
            <span class="vmk-antibot-slider">
              <span class="vmk-slider-thumb">➔</span>
              <span class="vmk-slider-text">SLIDE TO RESERVE BATCH</span>
            </span>
          </div>
          <div class="vmk-street-tags">
            <span>LIMITED 250 PCS</span>
            <span>CUSTOM ACID WASH</span>
            <span>BOT GUARD v2.4</span>
          </div>
        </div>
      </div>
    `;
  },

  /* #1.3 Luxury Cosmetics & Skin Routine Quiz */
  mockupCosmetics(item) {
    return `
      <div class="vmk-wrap vmk-cosmetics">
        <div class="vmk-cosmetics-grid">
          <div class="vmk-cosmetics-bottle-card">
            <svg viewBox="0 0 100 130" class="vmk-bottle-svg">
              <!-- Serum Dropper Bottle -->
              <rect x="36" y="10" width="28" height="14" rx="3" fill="#D4AF37"/>
              <rect x="42" y="24" width="16" height="12" fill="#E2E8F0"/>
              <rect x="25" y="36" width="50" height="85" rx="10" fill="#4A5D4E"/>
              <!-- Serum Liquid level -->
              <rect x="28" y="55" width="44" height="63" rx="7" fill="#3D4D40"/>
              <rect x="32" y="65" width="36" height="35" rx="3" fill="#FFF" opacity="0.95"/>
              <text x="50" y="78" font-size="6" font-family="serif" text-anchor="middle" fill="#1C241E" font-weight="bold">AURA</text>
              <text x="50" y="86" font-size="4" font-family="sans-serif" text-anchor="middle" fill="#64748B">BAKUCHIOL</text>
              <text x="50" y="93" font-size="3.5" font-family="sans-serif" text-anchor="middle" fill="#10B981">100% BOTANICAL</text>
            </svg>
            <div class="vmk-cosmetics-name">Regenerative Youth Elixir</div>
            <div class="vmk-cosmetics-badge">CLINICALLY PROVEN</div>
          </div>
          <div class="vmk-cosmetics-info">
            <div class="vmk-quiz-card">
              <div class="vmk-quiz-title">3-STEP SKIN TYPE QUIZ</div>
              <div class="vmk-quiz-chips">
                <span class="vchip active">Hydration +92%</span>
                <span class="vchip">Barrier Repair</span>
                <span class="vchip">Vitamin C</span>
              </div>
            </div>
            <div class="vmk-inci-card">
              <div class="vmk-inci-title">CLINICAL INCI GLOSSARY</div>
              <div class="vmk-inci-row"><span>Bakuchiol (Natural Retinol)</span><strong>2.0%</strong></div>
              <div class="vmk-inci-row"><span>Phyto-Squalane (Olive)</span><strong>5.0%</strong></div>
              <div class="vmk-inci-row"><span>Centella Asiatica (Cica)</span><strong>10.0%</strong></div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  /* #1.4 Quick-Commerce & Dark Store Delivery */
  mockupQuickCommerce(item) {
    return `
      <div class="vmk-wrap vmk-quickcommerce">
        <div class="vmk-qc-top">
          <div class="vmk-qc-badge">⚡ 18 MIN DELIVERED</div>
          <div class="vmk-qc-loc">📍 Panampilly Dark Store #03</div>
        </div>
        <div class="vmk-qc-content">
          <div class="vmk-qc-item-card">
            <div class="vmk-qc-item-img">🥑</div>
            <div class="vmk-qc-item-info">
              <div class="vmk-qc-name">Hass Avocados (Grade A)</div>
              <div class="vmk-qc-pills">
                <span class="qp active">250g ₹89</span>
                <span class="qp">500g ₹165</span>
                <span class="qp">1kg ₹310</span>
              </div>
            </div>
          </div>
          <div class="vmk-qc-map-card">
            <div class="vmk-qc-map-head">
              <span class="pulse-beacon"></span>
              <span>Rider Arjun (Hero Splendor) • 320m away</span>
            </div>
            <div class="vmk-qc-route-viz">
              <svg viewBox="0 0 200 45" class="vmk-route-svg">
                <path d="M10,25 Q60,5 110,28 T190,20" stroke="#16A34A" stroke-width="3" stroke-dasharray="4,4" fill="none"/>
                <circle cx="10" cy="25" r="5" fill="#16A34A"/>
                <circle cx="110" cy="28" r="7" fill="#F59E0B"/>
                <text x="110" y="32" font-size="8" text-anchor="middle" fill="#000">🛵</text>
                <circle cx="190" cy="20" r="5" fill="#EF4444"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  /* #1.5 B2B Wholesale & Tabular Spec Matrix */
  mockupB2BWholesale(item) {
    return `
      <div class="vmk-wrap vmk-b2b">
        <div class="vmk-b2b-header">
          <span class="vmk-b2b-title">FASTENER CATALOG // SPEC MATRIX</span>
          <span class="vmk-b2b-gst">GSTIN 32AAACG0000A1Z5</span>
        </div>
        <table class="vmk-b2b-table">
          <thead>
            <tr><th>SKU</th><th>SPECIFICATION</th><th>MOQ</th><th>TIER 1 (100+)</th><th>TIER 3 (1000+)</th></tr>
          </thead>
          <tbody>
            <tr class="highlight">
              <td><strong>SS-304-M8</strong></td>
              <td>Hex Flange Bolt 40mm</td>
              <td>100 pcs</td>
              <td>₹14.20/pc</td>
              <td><span class="b2b-green">₹9.80/pc</span></td>
            </tr>
            <tr>
              <td>SS-316-M10</td>
              <td>Socket Head Cap Screw</td>
              <td>50 pcs</td>
              <td>₹28.50/pc</td>
              <td><span class="b2b-green">₹21.00/pc</span></td>
            </tr>
          </tbody>
        </table>
        <div class="vmk-b2b-footer-strip">
          <div class="b2b-tag">HSN CODE: 7318</div>
          <div class="b2b-tag">3-TIER VOLUME SLABS</div>
          <div class="b2b-proforma">⚡ 1-Click Proforma Invoice Generator</div>
        </div>
      </div>
    `;
  },

  /* #2.1 AI SaaS Bento & Interactive ROI Graph */
  mockupAIBento(item) {
    return `
      <div class="vmk-wrap vmk-bento-saas">
        <div class="vmk-saas-grid">
          <div class="vmk-saas-code">
            <div class="vmk-code-dots">
              <span class="cdot red"></span><span class="cdot amber"></span><span class="cdot green"></span>
              <span class="vmk-code-tab">agent-runtime.ts</span>
            </div>
            <pre class="vmk-code-block"><code><span class="kwd">import</span> { V8EdgeAgent } <span class="kwd">from</span> <span class="str">'@agency/v8'</span>;

<span class="kwd">export const</span> <span class="var">cluster</span> = <span class="kwd">new</span> V8EdgeAgent({
  <span class="prop">memory</span>: <span class="str">'128MB'</span>,
  <span class="prop">edgeLatency</span>: <span class="str">'11ms'</span>,
  <span class="prop">zeroColdStart</span>: <span class="kwd">true</span>
});</code></pre>
          </div>
          <div class="vmk-saas-stats">
            <div class="vmk-stat-metric">
              <span class="sval">$148,400</span>
              <span class="slbl">ANNUAL CLOUD SAVINGS</span>
            </div>
            <div class="vmk-mini-graph">
              <svg viewBox="0 0 120 40" class="vmk-graph-svg">
                <path d="M0,35 Q30,30 60,18 T120,4" stroke="#8B5CF6" stroke-width="2.5" fill="none"/>
                <path d="M0,35 Q30,30 60,18 T120,4 L120,40 L0,40 Z" fill="rgba(139, 92, 246, 0.15)"/>
              </svg>
            </div>
            <div class="vmk-stat-pill">⚡ 84% Cost Cut vs AWS</div>
          </div>
        </div>
      </div>
    `;
  },

  /* #2.2 Luxury Real Estate Villa & Diurnal Scrubber */
  mockupRealEstate(item) {
    return `
      <div class="vmk-wrap vmk-realestate">
        <div class="vmk-re-hero">
          <div class="vmk-re-title-block">
            <div class="vmk-re-pre">ARCHITECTURAL DIGEST CURATED</div>
            <div class="vmk-re-h1">THE WATERFRONT VILLA // 4BHK</div>
            <div class="vmk-re-meta">4,850 SQ.FT • PRIVATE PLUNGE POOL • KOCHI</div>
          </div>
          <div class="vmk-re-villa-render">
            <svg viewBox="0 0 140 70" class="vmk-villa-svg">
              <polygon points="10,55 50,55 50,25 25,15 10,25" fill="#E2E8F0"/>
              <polygon points="50,55 130,55 130,20 50,20" fill="#CBD5E1"/>
              <rect x="60" y="28" width="55" height="24" rx="2" fill="#0EA5E9" opacity="0.3"/>
              <polygon points="10,55 130,55 125,65 5,65" fill="#38BDF8" opacity="0.4"/>
            </svg>
          </div>
        </div>
        <div class="vmk-re-scrubber-bar">
          <span class="scrub-label">SUN-PATH LIGHTING:</span>
          <span class="scrub-pill">08:00 AM Dawn</span>
          <span class="scrub-pill">13:00 PM Zenith</span>
          <span class="scrub-pill active">18:30 PM Golden Hour ☀️</span>
        </div>
      </div>
    `;
  },

  /* #2.3 D2C Hardware & Planar Magnetic CAD */
  mockupHardware(item) {
    return `
      <div class="vmk-wrap vmk-hardware">
        <div class="vmk-cad-header">
          <span class="vmk-cad-title">SWISS CAD 360° // PLANAR DRIVER SPEC</span>
          <span class="vmk-cad-freq">5Hz - 54,000Hz (0.05% THD)</span>
        </div>
        <div class="vmk-cad-diagram">
          <svg viewBox="0 0 160 70" class="vmk-cad-svg">
            <circle cx="80" cy="35" r="30" stroke="#06B6D4" stroke-width="1.5" stroke-dasharray="2,2" fill="none"/>
            <circle cx="80" cy="35" r="22" stroke="#06B6D4" stroke-width="2" fill="none"/>
            <circle cx="80" cy="35" r="12" stroke="#CCFF00" stroke-width="2" fill="none"/>
            <circle cx="80" cy="35" r="4" fill="#06B6D4"/>
            <line x1="10" y1="35" x2="50" y2="35" stroke="#64748B" stroke-width="1"/>
            <line x1="110" y1="35" x2="150" y2="35" stroke="#64748B" stroke-width="1"/>
            <text x="25" y="30" font-size="6" fill="#94A3B8" font-family="monospace">NEODYMIUM N52</text>
            <text x="115" y="30" font-size="6" fill="#CCFF00" font-family="monospace">2μm DIAPHRAGM</text>
          </svg>
        </div>
        <div class="vmk-cad-footer">
          <span>EXPLODED 360° ACOUSTIC SCRUBBER</span>
          <span class="vmk-cad-tag">CNC ANODIZED ALUMINUM</span>
        </div>
      </div>
    `;
  },

  /* #2.4 Event Ticket & Holographic Admission Stub */
  mockupEventTicket(item) {
    return `
      <div class="vmk-wrap vmk-ticket">
        <div class="vmk-ticket-stub">
          <div class="vmk-stub-main">
            <div class="vmk-ticket-fest">AGENCY SUMMIT 2026</div>
            <div class="vmk-ticket-type">ALL-ACCESS VIP ADMISSION PASS</div>
            <div class="vmk-ticket-dates">NOV 14-16 • GRAND HYATT BALLROOM</div>
            <div class="vmk-ticket-hologram">★ AUTHENTICATED NFC STUB ★</div>
          </div>
          <div class="vmk-stub-perforation"></div>
          <div class="vmk-stub-qr">
            <div class="vmk-qr-box">
              <svg viewBox="0 0 40 40" class="vmk-qr-mini">
                <rect x="2" y="2" width="12" height="12" fill="#000"/>
                <rect x="5" y="5" width="6" height="6" fill="#FFF"/>
                <rect x="26" y="2" width="12" height="12" fill="#000"/>
                <rect x="29" y="5" width="6" height="6" fill="#FFF"/>
                <rect x="2" y="26" width="12" height="12" fill="#000"/>
                <rect x="5" y="29" width="6" height="6" fill="#FFF"/>
                <rect x="18" y="18" width="5" height="5" fill="#000"/>
                <rect x="26" y="26" width="8" height="8" fill="#000"/>
              </svg>
            </div>
            <div class="vmk-stub-code">#VIP-941</div>
          </div>
        </div>
      </div>
    `;
  },

  /* #3.1 Creative Agency Oversized Typographic Index */
  mockupCreativeAgency(item) {
    return `
      <div class="vmk-wrap vmk-agency-port">
        <div class="vmk-agency-header">
          <span>MONOLITH STUDIO</span>
          <span>CURATION // 2026</span>
        </div>
        <div class="vmk-agency-index">
          <div class="vmk-index-row active">
            <span class="idx-no">01</span>
            <span class="idx-title">KINETIC SPATIAL ENGINE</span>
            <span class="idx-cat">[WEBGL / THREE.JS]</span>
          </div>
          <div class="vmk-index-row">
            <span class="idx-no">02</span>
            <span class="idx-title">EDITORIAL BRUTALISM</span>
            <span class="idx-cat">[TYPOGRAPHY]</span>
          </div>
          <div class="vmk-index-row">
            <span class="idx-no">03</span>
            <span class="idx-title">AURA BOTANICA D2C</span>
            <span class="idx-cat">[ECOMMERCE]</span>
          </div>
        </div>
        <div class="vmk-agency-cursor-tip">
          <span class="cur-dot">✦</span> Floating Cursor Artwork Preview Active
        </div>
      </div>
    `;
  },

  /* #3.2 Photography Darkroom & Proofing Tray */
  mockupPhotography(item) {
    return `
      <div class="vmk-wrap vmk-photo">
        <div class="vmk-photo-masonry">
          <div class="photo-tile t1"><span class="photo-badge">EDITORIAL 01</span></div>
          <div class="photo-tile t2"><span class="photo-badge">PORTRAIT 02</span></div>
          <div class="photo-tile t3"><span class="photo-badge">RUNWAY 03</span></div>
        </div>
        <div class="vmk-proofing-bar">
          <div class="proofing-status">
            <span class="lock-icon">🔒</span>
            <span>Client Tray: <strong>142 of 300 Selected</strong></span>
          </div>
          <div class="proofing-pin-chips">
            <span class="pin-box">●</span><span class="pin-box">●</span><span class="pin-box">●</span><span class="pin-box">●</span>
            <span class="proofing-btn">DOWNLOAD HI-RES</span>
          </div>
        </div>
      </div>
    `;
  },

  /* #3.3 Architecture Studio Before/After Slider */
  mockupArchitecture(item) {
    return `
      <div class="vmk-wrap vmk-arch">
        <div class="vmk-arch-split">
          <div class="arch-half before">
            <span class="arch-tag">BEFORE: BARE CONCRETE</span>
          </div>
          <div class="arch-divider">
            <div class="arch-handle">❮ ❯</div>
          </div>
          <div class="arch-half after">
            <span class="arch-tag">AFTER: JAPANDI OAK & BRASS</span>
          </div>
        </div>
        <div class="vmk-boq-strip">
          <div class="boq-item"><span>ESTIMATED BOQ:</span> <strong>₹3,450 / sq.ft</strong></div>
          <div class="boq-item"><span>HANDOVER:</span> <strong>90-Day Guaranteed</strong></div>
          <div class="boq-item"><span class="boq-chip">3D BIM RECONCILIATION</span></div>
        </div>
      </div>
    `;
  },

  /* #4.1 Retail Barcode POS & 80mm Thermal Receipt */
  mockupRetailPOS(item) {
    return `
      <div class="vmk-wrap vmk-pos">
        <div class="vmk-pos-screen">
          <div class="vmk-pos-scanner-bar">
            <span class="scanner-dot"></span>
            <span>BARCODE SCANNER READY: <strong>890123456789</strong> [ENTER]</span>
          </div>
          <div class="vmk-pos-body">
            <div class="pos-cart-list">
              <div class="pos-cart-item"><span>1x Premium Linen Shirt</span><span>₹1,850</span></div>
              <div class="pos-cart-item"><span>2x Cotton Ankle Socks</span><span>₹380</span></div>
              <div class="pos-subtotal"><span>GST (12%): ₹267.60</span><span>Total: <strong>₹2,497.60</strong></span></div>
            </div>
            <div class="pos-thermal-tape">
              <div class="thermal-head">80mm THERMAL RECEIPT</div>
              <div class="thermal-barcode">||| |||| || | |||| |||</div>
              <div class="thermal-qr">📲 DYNAMIC UPI QR</div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  /* #4.2 Clinic & Salon Token TV Board */
  mockupClinicSalon(item) {
    return `
      <div class="vmk-wrap vmk-clinic">
        <div class="vmk-tv-board">
          <div class="tv-banner">
            <span class="tv-live-pill">● LIVE TOKEN QUEUE</span>
            <span class="tv-cabin">DOCTORS ACTIVE: 4</span>
          </div>
          <div class="tv-current-call">
            <div class="call-lead">NOW CALLING IN CABIN 1:</div>
            <div class="token-jumbo">#TK-18</div>
            <div class="doc-name">Dr. Anjali Menon, MD (Dental Surgeon)</div>
          </div>
          <div class="tv-waiting-row">
            <span class="wait-pill">Next: <strong>#TK-19</strong></span>
            <span class="wait-pill">In Triage: <strong>#TK-20</strong></span>
            <span class="wait-pill">Avg Wait: <strong>7 mins</strong></span>
          </div>
        </div>
      </div>
    `;
  },

  /* #4.3 Cafe QR Menu & Kitchen Display System */
  mockupCafeKOT(item) {
    return `
      <div class="vmk-wrap vmk-cafe">
        <div class="vmk-cafe-split">
          <div class="cafe-order-sheet">
            <div class="sheet-title">TABLE #04 LIVE ORDER</div>
            <div class="sheet-item"><span>2x Cortado (Oat Milk)</span><span>₹420</span></div>
            <div class="sheet-item"><span>1x Truffle Fries</span><span>₹280</span></div>
            <div class="sheet-item"><span>1x Basque Cheesecake</span><span>₹320</span></div>
            <div class="sheet-footer">TOTAL: <strong>₹1,020</strong></div>
          </div>
          <div class="cafe-kds">
            <div class="kds-head">
              <span>KDS SCREEN</span>
              <span class="kds-time">⏱️ 04:12m</span>
            </div>
            <div class="kds-card urgent">
              <div class="kds-ticket">#KOT-104 [TABLE 04]</div>
              <div class="kds-dish">2x Cortado • Oat</div>
              <div class="kds-dish">1x Truffle Fries</div>
              <span class="kds-status">PREPARING ON STATION 2</span>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  /* #4.4 Repair Tracker ESD Bench & 5-Stage Stepper */
  mockupRepairTracker(item) {
    return `
      <div class="vmk-wrap vmk-repair">
        <div class="vmk-repair-head">
          <span>ESD WORKBENCH DIAGNOSTICS</span>
          <span class="job-id">JOB #REP-8821 // MACBOOK PRO M2</span>
        </div>
        <div class="vmk-repair-stepper">
          <div class="step done"><span class="step-num">✓</span><span class="step-text">INTAKE</span></div>
          <div class="step-line active"></div>
          <div class="step done"><span class="step-num">✓</span><span class="step-text">DIAGNOSED</span></div>
          <div class="step-line active"></div>
          <div class="step current"><span class="step-num">●</span><span class="step-text">REPAIRING</span></div>
          <div class="step-line"></div>
          <div class="step pending"><span class="step-num">4</span><span class="step-text">QA PASS</span></div>
          <div class="step-line"></div>
          <div class="step pending"><span class="step-num">5</span><span class="step-text">PICKUP</span></div>
        </div>
        <div class="vmk-scope-box">
          <span class="scope-label">🔬 LEICA MICROSCOPE INSPECTION:</span>
          <span>PMIC Short Cleared • 3.3V Rail Restored</span>
        </div>
      </div>
    `;
  },

  /* #5.1 Warehouse Multi-Facility Bin Matrix */
  mockupWarehouseERP(item) {
    return `
      <div class="vmk-wrap vmk-warehouse">
        <div class="vmk-wh-top">
          <span>FACILITY: KOCHI LOGISTICS HUB A</span>
          <span class="wh-match">3-WAY MATCH VERIFIED</span>
        </div>
        <div class="vmk-rack-matrix">
          <div class="rack-row">
            <span class="bin-chip full">A-01 [98%]</span>
            <span class="bin-chip full">A-02 [100%]</span>
            <span class="bin-chip active">A-03 [84%]</span>
            <span class="bin-chip empty">A-04 [FREE]</span>
          </div>
          <div class="rack-row">
            <span class="bin-chip full">B-01 [92%]</span>
            <span class="bin-chip active">B-02 [75%]</span>
            <span class="bin-chip full">B-03 [100%]</span>
            <span class="bin-chip active">B-04 [40%]</span>
          </div>
        </div>
        <div class="vmk-wh-audit">
          <span>PO #9042 = GRN #8812 = INVOICE #INV-4412</span>
          <span class="audit-pass">✓ RECONCILED</span>
        </div>
      </div>
    `;
  },

  /* #5.2 HRMS & Payroll Heatmap & Form-16 */
  mockupHRMSPayroll(item) {
    return `
      <div class="vmk-wrap vmk-hrms">
        <div class="vmk-hrms-top">
          <span>HRMS ENTERPRISE PORTAL</span>
          <span class="hrms-active-users">342 EMPLOYEES CHECKED-IN</span>
        </div>
        <div class="vmk-attendance-heatmap">
          <div class="heatmap-title">30-DAY GEO-FENCE ATTENDANCE HEATMAP</div>
          <div class="heatmap-grid">
            <span class="hdot on"></span><span class="hdot on"></span><span class="hdot on"></span><span class="hdot on"></span><span class="hdot on"></span><span class="hdot off"></span><span class="hdot off"></span>
            <span class="hdot on"></span><span class="hdot on"></span><span class="hdot on"></span><span class="hdot on"></span><span class="hdot half"></span><span class="hdot off"></span><span class="hdot off"></span>
            <span class="hdot on"></span><span class="hdot on"></span><span class="hdot on"></span><span class="hdot on"></span><span class="hdot on"></span><span class="hdot off"></span><span class="hdot off"></span>
            <span class="hdot on"></span><span class="hdot on"></span><span class="hdot on"></span><span class="hdot on"></span><span class="hdot on"></span><span class="hdot off"></span><span class="hdot off"></span>
          </div>
        </div>
        <div class="vmk-payslip-strip">
          <div class="payslip-item"><span>STATUTORY PAYSLIP:</span> <strong>NET: ₹1,42,850</strong></div>
          <div class="payslip-words">"One Lakh Forty Two Thousand Eight Hundred Fifty Only"</div>
        </div>
      </div>
    `;
  },

  /* Default Mockup Fallback */
  mockupDefault(item) {
    return `
      <div class="vmk-wrap vmk-default">
        <div style="font-family:var(--font-display);font-size:16px;font-weight:700;color:#111;">${item.title}</div>
        <div style="font-size:12px;color:#666;margin-top:4px;">${item.vibe}</div>
      </div>
    `;
  }
};

window.CardMockups = CardMockups;
