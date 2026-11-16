'use client';

class SoundEffects {
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  // Campanitas celestiales navideñas
  playChime() {
    const ctx = this.getContext();
    if (!ctx) return;

    const notas = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5, E5, G5, C6, E6
    const ahora = ctx.currentTime;

    notas.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ahora + idx * 0.08);

      gain.gain.setValueAtTime(0, ahora + idx * 0.08);
      gain.gain.linearRampToValueAtTime(0.12, ahora + idx * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, ahora + idx * 0.08 + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ahora + idx * 0.08);
      osc.stop(ahora + idx * 0.08 + 1.3);
    });
  }

  // Sonido de rascado suave
  playScratch() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const bufferSize = ctx.sampleRate * 0.05; // 50ms de ruido
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.08;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 800;
      filter.Q.value = 1.2;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start();
    } catch (e) {
      // Ignorar si el audio no está iniciado aún
    }
  }

  // Fanfarria triunfal mágica (para canje de cupón o día 24)
  playFanfare() {
    const ctx = this.getContext();
    if (!ctx) return;

    const ahora = ctx.currentTime;
    const acordes = [
      { freq: 440, time: 0 },
      { freq: 554.37, time: 0.1 },
      { freq: 659.25, time: 0.2 },
      { freq: 880, time: 0.35 }
    ];

    acordes.forEach(({ freq, time }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ahora + time);

      gain.gain.setValueAtTime(0, ahora + time);
      gain.gain.linearRampToValueAtTime(0.18, ahora + time + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, ahora + time + 0.9);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ahora + time);
      osc.stop(ahora + time + 1.0);
    });
  }
}

export const sounds = new SoundEffects();
