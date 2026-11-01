/* ==========================================================================
   WEB AUDIO HAPTIC ACOUSTICS ENGINE
   Lightweight inline Web Audio synthesis (< 3KB)
   Synthesizes tactile clicks, whooshes, and dual-tone harmonic chimes
   ========================================================================== */

class ShowroomAudioEngine {
  constructor() {
    this.ctx = null;
    this.muted = localStorage.getItem('showroom_audio_muted') === 'true';
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.initialized = true;
      }
    } catch (e) {
      console.warn('Web Audio not supported or blocked:', e);
    }
  }

  ensureContext() {
    this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    localStorage.setItem('showroom_audio_muted', this.muted);
    this.updateToggleButton();
    if (!this.muted) {
      this.playDeviceSwitch();
    }
    return this.muted;
  }

  updateToggleButton() {
    const btn = document.getElementById('audioToggleBtn');
    if (!btn) return;
    if (this.muted) {
      btn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M4 9v6h4l5 4V5L8 9H4z"/><path d="M17 9l5 6M22 9l-5 6"/></svg>';
      btn.classList.add('is-muted');
      btn.title = "Turn sound on";
    } else {
      btn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M4 9v6h4l5 4V5L8 9H4z"/><path d="M16.5 8.5a5 5 0 010 7M19 6a8.5 8.5 0 010 12"/></svg>';
      btn.classList.remove('is-muted');
      btn.title = "Mute sound";
    }
  }

  /* 1. Tactile 480 Hz Magnetic Click (Device Switcher) */
  playDeviceSwitch() {
    if (this.muted) return;
    this.ensureContext();
    if (!this.ctx) return;

    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(480, t);
      osc.frequency.exponentialRampToValueAtTime(120, t + 0.04);

      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.045);
    } catch (e) {}
  }

  /* 2. Smooth 660 Hz Whoosh (Template Selection) */
  playTemplateSelect() {
    if (this.muted) return;
    this.ensureContext();
    if (!this.ctx) return;

    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(660, t);
      osc.frequency.exponentialRampToValueAtTime(320, t + 0.12);

      gain.gain.setValueAtTime(0.18, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.13);
    } catch (e) {}
  }

  /* 3. Dual-Tone Harmonic Confirmation Chime (587 Hz [D5] -> 880 Hz [A5]) */
  playWhitelabelChime() {
    if (this.muted) return;
    this.ensureContext();
    if (!this.ctx) return;

    try {
      const t = this.ctx.currentTime;

      // Note 1: 587 Hz (D5)
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(587, t);
      gain1.gain.setValueAtTime(0.2, t);
      gain1.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
      osc1.connect(gain1);
      gain1.connect(this.ctx.destination);
      osc1.start(t);
      osc1.stop(t + 0.26);

      // Note 2: 880 Hz (A5) slightly delayed
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(880, t + 0.08);
      gain2.gain.setValueAtTime(0.22, t + 0.08);
      gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.38);
      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);
      osc2.start(t + 0.08);
      osc2.stop(t + 0.40);
    } catch (e) {}
  }

  /* 4. Crisp 800 Hz Command Palette Navigation Pip */
  playTick() {
    if (this.muted) return;
    this.ensureContext();
    if (!this.ctx) return;

    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(820, t);
      gain.gain.setValueAtTime(0.08, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.02);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.025);
    } catch (e) {}
  }
}

// Global audio engine singleton
window.showroomAudio = new ShowroomAudioEngine();
document.addEventListener('DOMContentLoaded', () => {
  window.showroomAudio.updateToggleButton();
  const unlockAudio = () => {
    window.showroomAudio.ensureContext();
    window.removeEventListener('pointerdown', unlockAudio);
    window.removeEventListener('keydown', unlockAudio);
  };
  window.addEventListener('pointerdown', unlockAudio);
  window.addEventListener('keydown', unlockAudio);
});
