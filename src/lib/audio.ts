// Web Audio API Sound Synthesizer for Mechanical Keyboard & Game Effects
class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private soundVolume: number = 0.5;

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public setVolume(vol: number) {
    this.soundVolume = Math.max(0, Math.min(1, vol));
  }

  // Mechanical switch key press sound (rich click + thock)
  public playKeyStroke(isCorrect: boolean = true) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    if (isCorrect) {
      // 1. High-pitched switch click
      const clickOsc = this.ctx.createOscillator();
      const clickGain = this.ctx.createGain();
      clickOsc.type = 'triangle';
      
      // Randomize pitch slightly for organic typing feel
      const pitchVariation = 1200 + Math.random() * 300;
      clickOsc.frequency.setValueAtTime(pitchVariation, now);
      clickOsc.frequency.exponentialRampToValueAtTime(300, now + 0.025);

      clickGain.gain.setValueAtTime(0.18 * this.soundVolume, now);
      clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);

      clickOsc.connect(clickGain);
      clickGain.connect(this.ctx.destination);
      clickOsc.start(now);
      clickOsc.stop(now + 0.03);

      // 2. Low body "thock"
      const thockOsc = this.ctx.createOscillator();
      const thockGain = this.ctx.createGain();
      thockOsc.type = 'sine';
      thockOsc.frequency.setValueAtTime(180 + Math.random() * 30, now);
      thockOsc.frequency.exponentialRampToValueAtTime(60, now + 0.04);

      thockGain.gain.setValueAtTime(0.22 * this.soundVolume, now);
      thockGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      thockOsc.connect(thockGain);
      thockGain.connect(this.ctx.destination);
      thockOsc.start(now);
      thockOsc.stop(now + 0.045);
    } else {
      // Error dull buzz / clack
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.linearRampToValueAtTime(110, now + 0.07);

      gain.gain.setValueAtTime(0.25 * this.soundVolume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.08);
    }
  }

  // Combo streak chime
  public playStreakChime(comboLevel: number) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    const baseFreq = 523.25; // C5
    const multiplier = 1 + (comboLevel % 7) * 0.15;
    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq * multiplier, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * multiplier * 1.5, now + 0.12);

    gain.gain.setValueAtTime(0.12 * this.soundVolume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.16);
  }

  // Countdown beep for racing
  public playCountdown(isFinal: boolean = false) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    const freq = isFinal ? 880 : 440;
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.25 * this.soundVolume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + (isFinal ? 0.35 : 0.18));

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + (isFinal ? 0.36 : 0.19));
  }

  // Level Up fanfare chord
  public playLevelUp() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const now = this.ctx.currentTime + idx * 0.08;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.2 * this.soundVolume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.55);
    });
  }

  // Race Victory fanfare
  public playVictory() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const chords = [
      [587.33, 739.99, 880.0],  // D major
      [659.25, 830.61, 987.77], // E major
      [880.0, 1108.73, 1318.51] // A major
    ];

    chords.forEach((chord, step) => {
      chord.forEach((freq) => {
        if (!this.ctx) return;
        const now = this.ctx.currentTime + step * 0.16;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.18 * this.soundVolume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.65);
      });
    });
  }
}

export const sound = new SoundEngine();
