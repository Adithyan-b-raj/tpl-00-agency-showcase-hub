/* ==========================================================================
   SHOWROOM STRUCTURE TESTS (Awwwards "Nominees" listing layout)
   Static assertions on markup, CSS, catalog, thumbnails and scripts.
   Visual checks are done separately with Playwright screenshots.
   ========================================================================== */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const PUB = path.join(ROOT, 'public');
let passed = 0;
let failed = 0;

function assert(cond, msg) {
  if (cond) { console.log('  PASS: ' + msg); passed++; }
  else { console.error('  FAIL: ' + msg); failed++; }
}
const read = (f) => fs.readFileSync(path.join(PUB, f), 'utf8');
const exists = (f) => fs.existsSync(path.join(PUB, f));

console.log('\nShowroom structure tests\n');

const html = read('index.html');
const css = read('showroom.css');
const catalog = JSON.parse(read('catalog.json'));
const allJs = ['showroom-app.js', 'showroom-gallery.js', 'whitelabel-studio.js', 'audio-haptics.js'].map(read).join('\n');

// 1. Catalog + thumbnails
assert(Array.isArray(catalog) && catalog.length === 18, 'catalog has 18 templates');
catalog.forEach(t => {
  const f = path.join(PUB, 'thumbs', t.id + '.jpg');
  const f2 = path.join(PUB, 'thumbs', t.id + '-440.jpg');
  assert(fs.existsSync(f) && fs.statSync(f).size > 10 * 1024, `thumb 880w exists and >10KB: ${t.id}`);
  assert(fs.existsSync(f2) && fs.statSync(f2).size > 4 * 1024, `thumb 440w exists: ${t.id}`);
});

// 2. Old approach removed
assert(!exists('card-mockups.js'), 'card-mockups.js removed');
assert(!/card-mockups|CardMockups|ambientCanvas/.test(html + allJs), 'no references to card mockups or ambient canvas');
['theme-tokens.css', 'hardware-frames.css', 'showroom-layout.css'].forEach(f => assert(!exists(f), `${f} removed`));

// 3. Typography: Inter Tight only
assert(/family=Inter\+Tight/.test(html), 'Inter Tight loaded from Google Fonts');
assert(!/Space Grotesk|Syne|JetBrains|Plus Jakarta|Space\+Grotesk/i.test(html + css + allJs), 'no other font families referenced');
assert(/--font-1:\s*'Inter Tight'/.test(css), 'font token is Inter Tight');

// 4. No hero / stats
assert(!/hero|telemetry|iridescent|bento-controls|exhibition-hero/i.test(html), 'no hero/telemetry markup');
assert(!/<h1/i.test(html), 'no h1 title block');

// 5. Header
const headerHtml = (html.match(/<header[\s\S]*?<\/header>/) || [''])[0];
const navLinks = (headerHtml.match(/class="nav-header-main__link/g) || []).length;
assert(navLinks === 3, 'header has exactly 3 plain text links (got ' + navLinks + ')');
assert(/Showroom/.test(headerHtml) && /Hardware Lab/.test(headerHtml) && /Personalize/.test(headerHtml), 'header links: Showroom, Hardware Lab, Personalize');
assert(/aria-label="Search"/.test(headerHtml), 'header has search icon button');
assert(/hamburgerBtn/.test(headerHtml), 'header has hamburger for mobile');
assert(!/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u.test(headerHtml), 'no emoji in header');
assert(!/pill|badge|kbd|telemetry/i.test(headerHtml), 'no pills/badges/kbd in header');
assert(/--header-height:\s*71px/.test(css), 'header height token 71px');
assert(/\.header-main__container\s*\{[^}]*flex-wrap:\s*nowrap/.test(css), 'header does not wrap');

// 6. Filter bar
assert(/--nf-height:\s*54px/.test(css) && /--nf-bg-1:\s*#ededed/.test(css) && /--nf-bg-2:\s*#f8f8f8/.test(css), 'nf tokens match reference');
assert(/--nf-bg-count:\s*#FF9667/i.test(css), 'accent #FF9667 used for count');
assert(/\.nav-filters__item\s*\{[^}]*height:\s*42px[^}]*padding-inline:\s*24px/.test(css), 'filter chip 42px / 24px padding');
assert((html.match(/data-menu="/g) || []).length === 3, 'three filter dropdowns (Category, Stack, Sort)');
assert(/id="resultCount"/.test(html) && /id="filterReset"/.test(html), 'count chip and reset exist');

// 7. Grid + card
assert(/<ul class="grid-elements" id="exhibitionGrid">/.test(html), 'grid is a <ul>');
assert(/class="col-3"/.test(read('showroom-app.js')), 'cards render as li.col-3');
assert(/repeat\(12,\s*1fr\)/.test(css), '12-column grid');
assert(/@media \(min-width: 1700px\) \{ \.col-3 \{ grid-column: span 3/.test(css), '4 columns on wide desktop');
assert(/aspect-ratio:\s*4 \/ 3/.test(css), 'card image 4:3');
['card-site', 'figure-rollover', 'figure-rollover__hover', 'figure-rollover__center', 'card-site__info', 'card-site__mark'].forEach(c =>
  assert(read('showroom-app.js').includes(c), `card markup uses .${c}`));
assert(/Mount in Studio/.test(read('showroom-app.js')), 'hover button says Mount in Studio');
assert(!/SLA|card-tech-chips|card-sla|features\.map/.test(read('showroom-app.js')), 'no SLA pills / feature lists / tech chips on cards');

// 7b. Empty state
assert(/empty-state/.test(read('showroom-app.js')) && /resetFilters/.test(read('showroom-app.js')), 'empty state with reset');

// 8. Theme: no dark / blue / cyan chrome
const darkBg = /background(-color)?:\s*#(0[0-9a-f]{5}|1[0-3][0-9a-f]{4})\b/i;
assert(!darkBg.test(css.replace(/rgba\([^)]*\)/g, '')), 'no dark theme backgrounds in CSS');
assert(!/#(06b6d4|0ea5e9|3b82f6|22d3ee|8b5cf6)/i.test(css), 'no blue/cyan/violet chrome in CSS');
assert(/body\s*\{[^}]*background:\s*var\(--bg-primary\)/.test(css) && /--bg-primary:\s*#f8f8f8/.test(css), 'page background is #f8f8f8');

// 9. Functionality kept
assert(/class MiniQRCode|const MiniQRCode/.test(allJs), 'QR engine present');
assert(/class BrandChameleonStudio/.test(allJs), 'Brand Chameleon drawer present');
assert(/class ShowroomAudioEngine|AudioContext/.test(allJs), 'audio engine present');
assert(/spotlight/i.test(html) && /openSpotlight/.test(html), 'spotlight palette present');
['singleHardwareChassis', 'splitStageContainer', 'btnPersonaAdmin', 'btnDevSplit', 'previewFrame'].forEach(id => assert(html.includes(id), `hardware lab element #${id}`));
['tpl', 'brand', 'primary', 'wa', 'tagline', 'logo', 'view', 'device'].forEach(p => assert(read('showroom-app.js').includes(`'${p}'`) || read('showroom-app.js').includes(`"${p}"`), `deep link param ?${p}`));
assert(!/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{2728}]/u.test(html + allJs.replace(/Hi,[^`]*/g, '')), 'no emoji in markup or UI scripts');

// 10. Responsive rules
['max-width: 900px', 'max-width: 1000px', 'max-width: 576px'].forEach(m => assert(css.includes(m), `breakpoint ${m}`));

console.log(`\nResult: ${passed} passed, ${failed} failed\n`);
process.exit(failed ? 1 : 0);
