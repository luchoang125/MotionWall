// Synthesized Web Audio API sound generator for ambient cosmic & cyber live wallpaper audio
class SoundEngine {
  private ctx: AudioContext | null = null;
  private osc1: OscillatorNode | null = null;
  private osc2: OscillatorNode | null = null;
  private filter: BiquadFilterNode | null = null;
  private gainNode: GainNode | null = null;
  private isPlaying: boolean = false;

  private init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
  }

  public playAmbient(type: 'cosmic' | 'cyber' | 'relax' = 'cosmic', volume = 0.25) {
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      this.stop();

      const now = this.ctx.currentTime;
      this.gainNode = this.ctx.createGain();
      this.gainNode.gain.setValueAtTime(0.001, now);
      this.gainNode.gain.exponentialRampToValueAtTime(volume, now + 2);

      this.filter = this.ctx.createBiquadFilter();
      this.filter.type = 'lowpass';
      this.filter.frequency.setValueAtTime(450, now);

      this.osc1 = this.ctx.createOscillator();
      this.osc2 = this.ctx.createOscillator();

      if (type === 'cyber') {
        this.osc1.type = 'sawtooth';
        this.osc2.type = 'sine';
        this.osc1.frequency.setValueAtTime(55, now); // A1
        this.osc2.frequency.setValueAtTime(110.5, now); // A2 slight detune
        this.filter.frequency.setValueAtTime(600, now);
      } else if (type === 'relax') {
        this.osc1.type = 'sine';
        this.osc2.type = 'triangle';
        this.osc1.frequency.setValueAtTime(65.4, now); // C2
        this.osc2.frequency.setValueAtTime(130.8, now); // C3
        this.filter.frequency.setValueAtTime(320, now);
      } else {
        // cosmic
        this.osc1.type = 'sine';
        this.osc2.type = 'sine';
        this.osc1.frequency.setValueAtTime(43.65, now); // F1 deep fundamental
        this.osc2.frequency.setValueAtTime(87.6, now); // Binaural beat ~0.3Hz
        this.filter.frequency.setValueAtTime(380, now);
      }

      this.osc1.connect(this.filter);
      this.osc2.connect(this.filter);
      this.filter.connect(this.gainNode);
      this.gainNode.connect(this.ctx.destination);

      this.osc1.start(now);
      this.osc2.start(now);
      this.isPlaying = true;
    } catch {
      // Audio autoplay policy or unsupported
    }
  }

  public stop() {
    if (this.gainNode && this.ctx) {
      try {
        const now = this.ctx.currentTime;
        this.gainNode.gain.linearRampToValueAtTime(0.0001, now + 0.8);
        setTimeout(() => {
          this.osc1?.stop();
          this.osc2?.stop();
          this.osc1?.disconnect();
          this.osc2?.disconnect();
          this.osc1 = null;
          this.osc2 = null;
          this.isPlaying = false;
        }, 850);
      } catch {
        this.isPlaying = false;
      }
    }
  }

  public toggle(type: 'cosmic' | 'cyber' | 'relax' = 'cosmic'): boolean {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.playAmbient(type);
      return true;
    }
  }

  public isAudioActive(): boolean {
    return this.isPlaying;
  }

  // Short haptic / sound feedback click
  public playClick() {
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(200, this.ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch {
      // ignore
    }
  }
}

export const soundEngine = new SoundEngine();

export const triggerHaptic = (style: 'light' | 'medium' | 'heavy' = 'light') => {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      if (style === 'light') navigator.vibrate(12);
      else if (style === 'medium') navigator.vibrate([18, 30, 18]);
      else navigator.vibrate(45);
    } catch {
      // Haptics not allowed or unsupported
    }
  }
};
