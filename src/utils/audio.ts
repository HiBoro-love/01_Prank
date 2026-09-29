/**
 * Web Audio API procedural dynamic soundtrack and sound effect synthesizer.
 * Dynamically adjusts musical key, harmonics, filter sweep, and intensity
 * according to current level (Stage 1 to 6).
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private currentStage: number = 1;

  // Background Drone & Harmonic Oscillators
  private baseOsc: OscillatorNode | null = null;
  private subOsc: OscillatorNode | null = null;
  private fifthOsc: OscillatorNode | null = null;
  private shimmerOsc: OscillatorNode | null = null;

  // Gains & Filters
  private masterBgGain: GainNode | null = null;
  private bgFilter: BiquadFilterNode | null = null;
  private lfo: OscillatorNode | null = null;
  private lfoGain: GainNode | null = null;

  private isPlayingBg: boolean = false;

  constructor() {
    // Lazy initialized on first user interaction
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.masterBgGain && this.ctx) {
      const target = muted ? 0 : this.getStageGain(this.currentStage);
      this.masterBgGain.gain.setTargetAtTime(target, this.ctx.currentTime, 0.2);
    }
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  private getStageGain(stage: number): number {
    switch (stage) {
      case 1:
        return 0.04;
      case 2:
        return 0.05;
      case 3:
        return 0.065;
      case 4:
        return 0.085;
      case 5:
        return 0.07;
      case 6:
        return 0.09;
      default:
        return 0.05;
    }
  }

  /**
   * Starts procedural background ambience with multi-oscillator chords
   */
  public startAmbient() {
    if (this.isPlayingBg) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      this.isPlayingBg = true;
      const t = this.ctx.currentTime;

      this.masterBgGain = this.ctx.createGain();
      this.masterBgGain.gain.setValueAtTime(
        this.isMuted ? 0 : this.getStageGain(this.currentStage),
        t
      );

      this.bgFilter = this.ctx.createBiquadFilter();
      this.bgFilter.type = 'lowpass';
      this.bgFilter.frequency.setValueAtTime(350, t);
      this.bgFilter.Q.setValueAtTime(3, t);

      // Root Base Drone
      this.baseOsc = this.ctx.createOscillator();
      this.baseOsc.type = 'sine';
      this.baseOsc.frequency.setValueAtTime(65.41, t); // C2

      // Sub-bass
      this.subOsc = this.ctx.createOscillator();
      this.subOsc.type = 'triangle';
      this.subOsc.frequency.setValueAtTime(32.7, t); // C1

      // Harmonic 5th
      this.fifthOsc = this.ctx.createOscillator();
      this.fifthOsc.type = 'sine';
      this.fifthOsc.frequency.setValueAtTime(98.0, t); // G2

      // Upper shimmer
      this.shimmerOsc = this.ctx.createOscillator();
      this.shimmerOsc.type = 'sine';
      this.shimmerOsc.frequency.setValueAtTime(261.63, t); // C4

      // LFO for breathing filter
      this.lfo = this.ctx.createOscillator();
      this.lfoGain = this.ctx.createGain();
      this.lfo.frequency.setValueAtTime(0.18, t);
      this.lfoGain.gain.setValueAtTime(100, t);
      this.lfo.connect(this.bgFilter.frequency);
      this.lfo.start();

      // Connect nodes
      this.baseOsc.connect(this.bgFilter);
      this.subOsc.connect(this.bgFilter);
      this.fifthOsc.connect(this.bgFilter);
      this.shimmerOsc.connect(this.bgFilter);

      this.bgFilter.connect(this.masterBgGain);
      this.masterBgGain.connect(this.ctx.destination);

      this.baseOsc.start();
      this.subOsc.start();
      this.fifthOsc.start();
      this.shimmerOsc.start();
    } catch {
      // Audio autoplay policy fallback
    }
  }

  /**
   * Dynamically adjusts music tone, harmonics, filter frequencies & intensity per stage
   */
  public updateStage(stage: number) {
    this.currentStage = stage;
    this.initContext();
    if (!this.isPlayingBg) {
      this.startAmbient();
    }
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const targetGain = this.isMuted ? 0 : this.getStageGain(stage);

    if (this.masterBgGain) {
      this.masterBgGain.gain.setTargetAtTime(targetGain, t, 0.4);
    }

    // Adapt music to the atmosphere of each stage
    switch (stage) {
      case 1:
        // C Minor Mysterious Dark Void
        this.baseOsc?.frequency.setTargetAtTime(65.41, t, 0.5); // C2
        this.fifthOsc?.frequency.setTargetAtTime(98.0, t, 0.5); // G2
        this.shimmerOsc?.frequency.setTargetAtTime(155.56, t, 0.5); // Eb3
        this.bgFilter?.frequency.setTargetAtTime(320, t, 0.6);
        if (this.lfo) this.lfo.frequency.setTargetAtTime(0.15, t, 0.5);
        break;

      case 2:
        // Ancient Vault: D Harmonic Tension
        this.baseOsc?.frequency.setTargetAtTime(73.42, t, 0.5); // D2
        this.fifthOsc?.frequency.setTargetAtTime(110.0, t, 0.5); // A2
        this.shimmerOsc?.frequency.setTargetAtTime(174.61, t, 0.5); // F3
        this.bgFilter?.frequency.setTargetAtTime(550, t, 0.6);
        if (this.lfo) this.lfo.frequency.setTargetAtTime(0.3, t, 0.5);
        break;

      case 3:
        // Deep Matrix Vortex: E Low Mystery with faster modulation
        this.baseOsc?.frequency.setTargetAtTime(82.41, t, 0.5); // E2
        this.fifthOsc?.frequency.setTargetAtTime(123.47, t, 0.5); // B2
        this.shimmerOsc?.frequency.setTargetAtTime(196.0, t, 0.5); // G3
        this.bgFilter?.frequency.setTargetAtTime(750, t, 0.6);
        if (this.lfo) this.lfo.frequency.setTargetAtTime(0.5, t, 0.5);
        break;

      case 4:
        // Stargate Event Horizon: Intense F# Pulsing Energy
        this.baseOsc?.frequency.setTargetAtTime(92.5, t, 0.4); // F#2
        this.fifthOsc?.frequency.setTargetAtTime(138.59, t, 0.4); // C#3
        this.shimmerOsc?.frequency.setTargetAtTime(277.18, t, 0.4); // C#4
        this.bgFilter?.frequency.setTargetAtTime(1200, t, 0.4);
        if (this.lfo) this.lfo.frequency.setTargetAtTime(1.2, t, 0.3); // High energy pulse
        break;

      case 5:
        // Celestial Sacred Lotus: Peaceful Golden A Major
        this.baseOsc?.frequency.setTargetAtTime(110.0, t, 0.8); // A2
        this.fifthOsc?.frequency.setTargetAtTime(164.81, t, 0.8); // E3
        this.shimmerOsc?.frequency.setTargetAtTime(277.18, t, 0.8); // C#4
        this.bgFilter?.frequency.setTargetAtTime(1600, t, 0.8);
        if (this.lfo) this.lfo.frequency.setTargetAtTime(0.1, t, 0.8); // Slow gentle breath
        break;

      case 6:
        // Grand Finale Celebration: Bright, Upbeat, Funky Disco Harmony (C Major / G Major)
        this.baseOsc?.frequency.setTargetAtTime(130.81, t, 0.3); // C3
        this.fifthOsc?.frequency.setTargetAtTime(196.0, t, 0.3); // G3
        this.shimmerOsc?.frequency.setTargetAtTime(329.63, t, 0.3); // E4
        this.bgFilter?.frequency.setTargetAtTime(2400, t, 0.3);
        if (this.lfo) this.lfo.frequency.setTargetAtTime(2.0, t, 0.3); // Bouncy celebration rhythm
        break;
    }
  }

  /**
   * Mysterious tactile click with high-tech resonance
   */
  public playClick() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(520, t);
    osc.frequency.exponentialRampToValueAtTime(140, t + 0.12);

    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.12);
  }

  /**
   * Heavy cinematic bass drop & mysterious energy whoosh
   */
  public playCinematicWhoosh() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(180, t);
    osc.frequency.exponentialRampToValueAtTime(35, t + 0.8);

    gain.gain.setValueAtTime(0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.9);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.9);

    // Filtered noise for air whoosh
    const bufferSize = this.ctx.sampleRate * 0.7;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(300, t);
    filter.frequency.exponentialRampToValueAtTime(1400, t + 0.35);
    filter.frequency.exponentialRampToValueAtTime(200, t + 0.7);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.25, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.7);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);
    noise.start(t);
    noise.stop(t + 0.7);
  }

  /**
   * Unlock & magical crystal shatter sound
   */
  public playUnlockShatter() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const freqs = [587.33, 880, 1174.66, 1760]; // D chord
    freqs.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t + idx * 0.05);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, t + idx * 0.05 + 0.4);

      gain.gain.setValueAtTime(0.18, t + idx * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.05 + 0.5);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t + idx * 0.05);
      osc.stop(t + idx * 0.05 + 0.5);
    });
  }

  /**
   * Fake-out comical glitch record scratch / trombone fail sound
   */
  public playComicalFakeout() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const notes = [
      { f: 311.13, duration: 0.25 }, // Eb4
      { f: 293.66, duration: 0.25 }, // D4
      { f: 277.18, duration: 0.25 }, // C#4
      { f: 261.63, duration: 0.6, slide: true }, // C4 waah waah
    ];

    let offset = 0;
    notes.forEach((n) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(n.f, t + offset);
      if (n.slide) {
        osc.frequency.exponentialRampToValueAtTime(220, t + offset + n.duration);
      }

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(700, t + offset);
      filter.frequency.linearRampToValueAtTime(1400, t + offset + n.duration * 0.5);
      filter.frequency.linearRampToValueAtTime(500, t + offset + n.duration);

      gain.gain.setValueAtTime(0.18, t + offset);
      gain.gain.linearRampToValueAtTime(0.001, t + offset + n.duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t + offset);
      osc.stop(t + offset + n.duration);

      offset += n.duration * 0.85;
    });
  }

  /**
   * Divine celestial angelic harp / chords for Stage 5
   */
  public playCelestialChords() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const chords = [440, 554.37, 659.25, 880, 1108.73, 1318.51];
    chords.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t + idx * 0.08);

      gain.gain.setValueAtTime(0.15, t + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.08 + 1.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t + idx * 0.08);
      osc.stop(t + idx * 0.08 + 1.2);
    });
  }

  /**
   * Troll celebratory airhorn / victory party fanfare
   */
  public playTrollCelebration() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;

    const fanfare = [
      { f: 523.25, delay: 0, dur: 0.15 },
      { f: 523.25, delay: 0.15, dur: 0.15 },
      { f: 523.25, delay: 0.3, dur: 0.15 },
      { f: 659.25, delay: 0.45, dur: 0.3 },
      { f: 783.99, delay: 0.75, dur: 0.2 },
      { f: 1046.5, delay: 0.95, dur: 0.8 },
    ];

    fanfare.forEach((n) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(n.f, t + n.delay);

      gain.gain.setValueAtTime(0.25, t + n.delay);
      gain.gain.exponentialRampToValueAtTime(0.001, t + n.delay + n.dur);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t + n.delay);
      osc.stop(t + n.delay + n.dur);
    });
  }
}

export const soundEngine = new SoundEngine();
