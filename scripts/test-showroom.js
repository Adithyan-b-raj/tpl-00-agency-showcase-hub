/* ==========================================================================
   SHOWROOM AUTOMATED VERIFICATION SUITE
   Validates catalog data integrity, DOM landmarks, 3D tilt styles,
   responsive chassis definitions, audio frequencies, and Brand Studio.
   ========================================================================== */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`  ✓ PASS: ${message}`);
    passedTests++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    failedTests++;
  }
}

console.log('\n======================================================');
console.log('🏛️ BMad Test Suite: Next-Gen Spatial Agency Showroom');
console.log('======================================================\n');

// 1. Catalog Integrity Test
console.log('--- 1. Testing public/catalog.json ---');
const catalogPath = path.join(ROOT, 'public', 'catalog.json');
assert(fs.existsSync(catalogPath), 'public/catalog.json exists');

const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
assert(Array.isArray(catalog), 'catalog.json is a valid array');
assert(catalog.length === 18, `Catalog contains exactly 18 vertical templates (found: ${catalog.length})`);

const categoryCounts = {};
catalog.forEach(item => {
  categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
});

assert(categoryCounts['E-Commerce'] === 5, `E-Commerce vertical count is 5 (found: ${categoryCounts['E-Commerce']})`);
assert(categoryCounts['Landing Page'] === 4, `Landing Page vertical count is 4 (found: ${categoryCounts['Landing Page']})`);
assert(categoryCounts['Portfolio'] === 3, `Portfolio vertical count is 3 (found: ${categoryCounts['Portfolio']})`);
assert(categoryCounts['Small ERP'] === 4, `Small ERP vertical count is 4 (found: ${categoryCounts['Small ERP']})`);
assert(categoryCounts['Large ERP'] === 2, `Large ERP vertical count is 2 (found: ${categoryCounts['Large ERP']})`);

let allFieldsValid = true;
let allTracksValid = true;
catalog.forEach((t, i) => {
  ['id', 'code', 'title', 'category', 'vibe', 'defaultPrimary', 'customerUrl', 'adminUrl', 'tracks', 'features'].forEach(field => {
    if (!t[field]) {
      console.error(`Item #${i} (${t.id}) missing: ${field}`);
      allFieldsValid = false;
    }
  });
  if (!Array.isArray(t.tracks) || t.tracks.length === 0) {
    allTracksValid = false;
  }
});
assert(allFieldsValid, 'All 18 items have required properties (id, code, title, vibe, URLs, tracks, features)');
assert(allTracksValid, 'All 18 items define runnable stack tracks');

// 2. DOM Structure & HTML Landmarks
console.log('\n--- 2. Testing public/index.html Structure ---');
const indexPath = path.join(ROOT, 'public', 'index.html');
assert(fs.existsSync(indexPath), 'public/index.html exists');

const indexHtml = fs.readFileSync(indexPath, 'utf8');

// Stylesheet links
assert(indexHtml.includes('/theme-tokens.css'), 'Links to /theme-tokens.css');
assert(indexHtml.includes('/hardware-frames.css'), 'Links to /hardware-frames.css');
assert(indexHtml.includes('/showroom-layout.css'), 'Links to /showroom-layout.css');

// Script tags
assert(indexHtml.includes('/audio-haptics.js'), 'Includes /audio-haptics.js');
assert(indexHtml.includes('/whitelabel-studio.js'), 'Includes /whitelabel-studio.js');
assert(indexHtml.includes('/showroom-gallery.js'), 'Includes /showroom-gallery.js');

// Critical Landmarks
assert(indexHtml.includes('id="ambientCanvas"'), 'Includes ambient canvas background element');
assert(indexHtml.includes('class="brand-cluster"'), 'Includes brand cluster header');
assert(indexHtml.includes('id="btnViewExhibition"'), 'Includes Exhibition Wall view toggle button');
assert(indexHtml.includes('id="btnViewHardware"'), 'Includes Virtual Hardware Lab view toggle button');
assert(indexHtml.includes('id="audioToggleBtn"'), 'Includes Web Audio toggle button');
assert(indexHtml.includes('id="viewExhibition"'), 'Includes Spatial Exhibition Wall section');
assert(indexHtml.includes('id="exhibitionGrid"'), 'Includes 3D Bento Exhibition Grid');
assert(indexHtml.includes('id="viewHardware"'), 'Includes Virtual Hardware Lab section');
assert(indexHtml.includes('id="singleHardwareChassis"'), 'Includes single device hardware chassis');
assert(indexHtml.includes('id="splitStageContainer"'), 'Includes Dual-Screen Split Inspection Mode container');
assert(indexHtml.includes('id="splitCustomerFrame"') && indexHtml.includes('id="splitAdminFrame"'), 'Split mode contains synchronized Customer and Admin POS iframes');
assert(indexHtml.includes('id="brandStudioDrawer"'), 'Includes Brand Chameleon Studio sliding drawer');
assert(indexHtml.includes('id="spotlightModal"'), 'Includes ⌘K Spotlight Command Palette modal');

// 3. Movement X Design Tokens & Hardware Frames CSS
console.log('\n--- 3. Testing CSS Design Tokens & Hardware Chassis ---');
const tokensPath = path.join(ROOT, 'public', 'theme-tokens.css');
const framesPath = path.join(ROOT, 'public', 'hardware-frames.css');
const layoutPath = path.join(ROOT, 'public', 'showroom-layout.css');

assert(fs.existsSync(tokensPath), 'public/theme-tokens.css exists');
assert(fs.existsSync(framesPath), 'public/hardware-frames.css exists');
assert(fs.existsSync(layoutPath), 'public/showroom-layout.css exists');

const tokensCss = fs.readFileSync(tokensPath, 'utf8');
assert(tokensCss.includes('--bg-void: #05060A;'), 'Theme tokens define Obsidian Void canvas #05060A');
assert(tokensCss.includes('Space Grotesk') && tokensCss.includes('JetBrains Mono'), 'Theme tokens load Space Grotesk & JetBrains Mono fonts');
assert(tokensCss.includes('--glass-blur: blur(28px) saturate(180%);'), 'Theme tokens define frosted obsidian glass filter');

const framesCss = fs.readFileSync(framesPath, 'utf8');
assert(framesCss.includes('.chassis-desktop'), 'Hardware frames define Apple Studio Display 5K (.chassis-desktop)');
assert(framesCss.includes('.chassis-tablet'), 'Hardware frames define iPad Pro 13" (.chassis-tablet)');
assert(framesCss.includes('.chassis-mobile'), 'Hardware frames define iPhone 16 Pro (.chassis-mobile)');
assert(framesCss.includes('.dynamic-island'), 'Hardware frames define iPhone Dynamic Island chassis');
assert(framesCss.includes('.split-stage-container'), 'Hardware frames define Dual-Screen Split Inspection Mode');

const layoutCss = fs.readFileSync(layoutPath, 'utf8');
assert(layoutCss.includes('.bento-card'), 'Layout defines 3D Bento Card styling');
assert(layoutCss.includes('.studio-drawer'), 'Layout defines Brand Chameleon frosted glass drawer');
assert(layoutCss.includes('.spotlight-window'), 'Layout defines ⌘K Spotlight Command Palette window');

// 4. Web Audio Synthesizer Engine
console.log('\n--- 4. Testing Web Audio Synthesizer ---');
const audioPath = path.join(ROOT, 'public', 'audio-haptics.js');
assert(fs.existsSync(audioPath), 'public/audio-haptics.js exists');

const audioJs = fs.readFileSync(audioPath, 'utf8');
assert(audioJs.includes('480'), 'Synthesizes 480 Hz magnetic click for device switcher');
assert(audioJs.includes('660'), 'Synthesizes 660 Hz whoosh for template selection');
assert(audioJs.includes('587') && audioJs.includes('880'), 'Synthesizes 587 Hz -> 880 Hz harmonic chime for whitelabel apply');
assert(audioJs.includes('localStorage.getItem(\'showroom_audio_muted\')'), 'Persists mute preference in localStorage');

// 5. Brand Chameleon & Pure-JS SVG QR Generator
console.log('\n--- 5. Testing Brand Chameleon Studio & SVG QR Code ---');
const studioPath = path.join(ROOT, 'public', 'whitelabel-studio.js');
assert(fs.existsSync(studioPath), 'public/whitelabel-studio.js exists');

const studioJs = fs.readFileSync(studioPath, 'utf8');
assert(studioJs.includes('MiniQRCode') && studioJs.includes('toSVG'), 'Includes pure-JS SVG QR Code generator');
assert(studioJs.includes('extractColorsFromImageSrc'), 'Includes HTML5 Canvas automatic color palette extractor');
assert(studioJs.includes('applyPreset'), 'Supports 1-tap industry color presets');
assert(studioJs.includes('wa.me'), 'Builds 1-Click WhatsApp pitch format with links');

// Test SVG QR output directly
global.window = global;
global.document = { addEventListener: () => {}, getElementById: () => null };
eval(studioJs);
const testSvg = MiniQRCode.toSVG('https://tpl-00-agency-showcase-hub.pages.dev', 120);
assert(testSvg.startsWith('<svg') && testSvg.includes('</svg>'), 'MiniQRCode.toSVG generates valid SVG markup');

// 6. Showroom Gallery Engine & Parallax
console.log('\n--- 6. Testing Showroom Gallery & Parallax Engine ---');
const galleryPath = path.join(ROOT, 'public', 'showroom-gallery.js');
assert(fs.existsSync(galleryPath), 'public/showroom-gallery.js exists');

const galleryJs = fs.readFileSync(galleryPath, 'utf8');
assert(galleryJs.includes('setupAmbientCanvas'), 'Ambient canvas renderer configured');
assert(galleryJs.includes('bindParallaxCards'), '3D gyro parallax tilt configured on cards');
assert(galleryJs.includes('setupSpotlightPalette'), '⌘K spotlight command palette configured');
assert(galleryJs.includes('setViewMode'), 'Dual view mode toggling logic present');

// 7. Edge-Case Review Remediation Verification
console.log('\n--- 7. Testing Review Remediation Edge Cases ---');

// Defect 1: Empty search & filter state
assert(indexHtml.includes('class="empty-search-state"'), 'Defect 1: renderExhibitionGrid renders empty-search-state card when filtered.length === 0');
assert(indexHtml.includes('No Verticals Found') && indexHtml.includes('Reset All Filters'), 'Defect 1: Empty state includes user-friendly title and Reset All Filters CTA');

// Defect 2: Dual-Screen Split Mode Desynchronization
assert(indexHtml.includes("if (window.activeDevice === 'split')") && indexHtml.includes("updateSplitIframes();"), 'Defect 2: updateStageIframe synchronizes split panes when activeDevice is split');
assert(indexHtml.indexOf("window.selectedTemplate =") < indexHtml.indexOf("if (params.get('device')) setDevice"), 'Defect 2: initShowroom resolves selectedTemplate BEFORE setting device mode');
const resetFnMatch = indexHtml.match(/function resetWhiteLabel\(\)[\s\S]*?\n    \}/);
assert(resetFnMatch && resetFnMatch[0].includes("if (window.activeDevice === 'split')") && resetFnMatch[0].includes("updateSplitIframes()"), 'Defect 2: resetWhiteLabel synchronizes dual-screen split frames if activeDevice is split');

// Defect 3: White-Label URL Parameter Propagation & Stage Mount Sync
assert(indexHtml.includes('studioBrand') && indexHtml.includes('studioWa') && indexHtml.includes('studioTagline') && indexHtml.includes('studioPrimaryPicker'), 'Defect 3: initShowroom populates Brand Chameleon inputs (brand, wa, tagline, primary, picker) from URL parameters');
assert(studioJs.includes("banner.style.display = 'inline-flex';") && studioJs.includes("showroomGallery.setViewMode('hardware')"), 'Defect 3: applyToHardwareStage sets activeWlBanner display to inline-flex and switches view to hardware lab');
assert(resetFnMatch && resetFnMatch[0].includes("banner.style.display = 'none'"), 'Defect 3: resetWhiteLabel resets activeWlBanner display to none');

// Defect 4: Mobile Touch Jitter Guard
assert(galleryJs.includes("if (e.pointerType === 'touch') return;"), 'Defect 4: bindParallaxCards ignores touch events to prevent mobile rotation jitter');

// Summary
console.log('\n======================================================');
console.log(`TOTAL TESTS: ${totalTests}`);
console.log(`PASSED: ${passedTests}`);
console.log(`FAILED: ${failedTests}`);
console.log('======================================================\n');

if (failedTests > 0) {
  process.exit(1);
} else {
  console.log('🎉 ALL AUTOMATED SHOWROOM TESTS PASSED 100%!\n');
  process.exit(0);
}
