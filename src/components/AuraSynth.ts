// Web Audio Engine for Aura Music AI
// Synthesizes focus sounds, beats, piano key frequencies, and applies real-time remix filters.

class AuraAudioEngine {
  private ctx: AudioContext | null = null;
  private primaryGain: GainNode | null = null;

  // Sound channels
  private rainNode: AudioNode | null = null;
  private rainGain: GainNode | null = null;

  private oceanNode: AudioNode | null = null;
  private oceanGain: GainNode | null = null;

  private fireGain: GainNode | null = null;
  private fireInterval: number | null = null;

  private brainwaveGain: GainNode | null = null;
  private brainOscL: OscillatorNode | null = null;
  private brainOscR: OscillatorNode | null = null;

  // Active track playback synthesizers (for simulating genuine custom synthesized tracks!)
  private beatInterval: number | null = null;
  private currentStep = 0;
  private isBpmPlaying = false;
  private currentBpm = 90;
  private onBeatCallback: ((step: number) => void) | null = null;

  // Remix filter nodes
  private lofiFilter: BiquadFilterNode | null = null;
  private nightcoreNode: GainNode | null = null; // Can simulate speed/pitch shifts
  private filterPump: GainNode | null = null; // For EDM sidechain volume puff

  init() {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.primaryGain = this.ctx.createGain();
      this.primaryGain.gain.setValueAtTime(0.8, this.ctx.currentTime);
      this.primaryGain.connect(this.ctx.destination);
      console.log("AudioContext successfully initialized.");
    } catch (e) {
      console.error("Web Audio API not supported in this browser.", e);
    }
  }

  setMusicVolume(volume: number) {
    if (!this.ctx) this.init();
    if (this.primaryGain) {
      this.primaryGain.gain.setValueAtTime(volume, this.ctx!.currentTime);
    }
  }

  private createNoiseBuffer(duration = 2.0): AudioBuffer {
    if (!this.ctx) this.init();
    const bufferSize = this.ctx!.sampleRate * duration;
    const buffer = this.ctx!.createBuffer(1, bufferSize, this.ctx!.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    return buffer;
  }

  // Focus Sounds
  setRainVolume(volume: number) {
    if (!this.ctx) this.init();
    const ctx = this.ctx!;
    if (!this.rainNode && volume > 0) {
      // Lazy init Rain Generator
      const noise = ctx.createBufferSource();
      noise.buffer = this.createNoiseBuffer(3.0);
      noise.loop = true;

      const rainFilter = ctx.createBiquadFilter();
      rainFilter.type = "lowpass";
      rainFilter.frequency.setValueAtTime(800, ctx.currentTime);

      this.rainGain = ctx.createGain();
      this.rainGain.gain.setValueAtTime(volume, ctx.currentTime);

      noise.connect(rainFilter);
      rainFilter.connect(this.rainGain);
      this.rainGain.connect(this.primaryGain!);
      noise.start();
      this.rainNode = noise;
    }

    if (this.rainGain) {
      this.rainGain.gain.setTargetAtTime(volume, ctx.currentTime, 0.1);
    }
  }

  setOceanVolume(volume: number) {
    if (!this.ctx) this.init();
    const ctx = this.ctx!;
    if (!this.oceanNode && volume > 0) {
      // Lazy init ocean waves (modulated noise filter sweeps)
      const noise = ctx.createBufferSource();
      noise.buffer = this.createNoiseBuffer(5.0);
      noise.loop = true;

      const bandpass = ctx.createBiquadFilter();
      bandpass.type = "bandpass";
      bandpass.frequency.setValueAtTime(400, ctx.currentTime);
      bandpass.Q.setValueAtTime(1.5, ctx.currentTime);

      // Create LFO
      const lfo = ctx.createOscillator();
      lfo.frequency.setValueAtTime(0.12, ctx.currentTime); // Slow wave cycle (8 seconds)

      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(250, ctx.currentTime); // sweep range

      this.oceanGain = ctx.createGain();
      this.oceanGain.gain.setValueAtTime(volume, ctx.currentTime);

      lfo.connect(lfoGain);
      lfoGain.connect(bandpass.frequency); // Modulate filter cutoff frequency
      noise.connect(bandpass);
      bandpass.connect(this.oceanGain);
      this.oceanGain.connect(this.primaryGain!);

      lfo.start();
      noise.start();
      this.oceanNode = noise;
    }

    if (this.oceanGain) {
      this.oceanGain.gain.setTargetAtTime(volume, ctx.currentTime, 0.2);
    }
  }

  setFireVolume(volume: number) {
    if (!this.ctx) this.init();
    const ctx = this.ctx!;
    if (!this.fireGain) {
      this.fireGain = ctx.createGain();
      this.fireGain.gain.setValueAtTime(volume, ctx.currentTime);
      this.fireGain.connect(this.primaryGain!);
    }

    this.fireGain.gain.setTargetAtTime(volume, ctx.currentTime, 0.1);

    if (volume > 0 && !this.fireInterval) {
      // Regularly trigger crackling sounds via highpass noise bursts
      this.fireInterval = window.setInterval(() => {
        if (!this.ctx || !this.fireGain || this.fireGain.gain.value <= 0.01) return;
        
        // Random occurrences
        if (Math.random() > 0.4) {
          const burst = this.ctx.createBufferSource();
          burst.buffer = this.createNoiseBuffer(0.04);

          const hpFilter = this.ctx.createBiquadFilter();
          hpFilter.type = "highpass";
          hpFilter.frequency.setValueAtTime(2500 + Math.random() * 3000, this.ctx.currentTime);

          const burstGain = this.ctx.createGain();
          burstGain.gain.setValueAtTime(Math.random() * 0.12, this.ctx.currentTime);

          burst.connect(hpFilter);
          hpFilter.connect(burstGain);
          burstGain.connect(this.fireGain);

          burst.start();
        }
      }, 80);
    } else if (volume <= 0 && this.fireInterval) {
      clearInterval(this.fireInterval);
      this.fireInterval = null;
    }
  }

  setBrainwaveVolume(volume: number) {
    if (!this.ctx) this.init();
    const ctx = this.ctx!;
    if (!this.brainOscL && volume > 0) {
      // Binaural alpha waves setup
      const pannerL = ctx.createStereoPanner();
      pannerL.pan.setValueAtTime(-1, ctx.currentTime);

      const pannerR = ctx.createStereoPanner();
      pannerR.pan.setValueAtTime(1, ctx.currentTime);

      this.brainOscL = ctx.createOscillator();
      this.brainOscL.type = "sine";
      this.brainOscL.frequency.setValueAtTime(200, ctx.currentTime); // Left Ear: 200 Hz

      this.brainOscR = ctx.createOscillator();
      this.brainOscR.type = "sine";
      this.brainOscR.frequency.setValueAtTime(210, ctx.currentTime); // Right Ear: 210 Hz (10 Hz Binaural beat!)

      this.brainwaveGain = ctx.createGain();
      this.brainwaveGain.gain.setValueAtTime(volume * 0.5, ctx.currentTime);

      this.brainOscL.connect(pannerL);
      this.brainOscR.connect(pannerR);
      pannerL.connect(this.brainwaveGain);
      pannerR.connect(this.brainwaveGain);
      this.brainwaveGain.connect(this.primaryGain!);

      this.brainOscL.start();
      this.brainOscR.start();
    }

    if (this.brainwaveGain) {
      this.brainwaveGain.gain.setTargetAtTime(volume * 0.4, ctx.currentTime, 0.15);
    }
  }

  setBinauralFrequencies(carrier: number, beat: number) {
    if (!this.ctx) this.init();
    const ctx = this.ctx!;
    if (this.brainOscL && this.brainOscR) {
      this.brainOscL.frequency.setTargetAtTime(carrier, ctx.currentTime, 0.15);
      this.brainOscR.frequency.setTargetAtTime(carrier + beat, ctx.currentTime, 0.15);
    }
  }

  // Play custom synthesizer note
  playSynthNote(freq: number, type: "sine" | "triangle" | "sawtooth" | "square" = "sine", duration = 0.5) {
    try {
      if (!this.ctx) this.init();
      const ctx = this.ctx!;
      if (ctx.state === "suspended") {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.primaryGain!);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      console.warn("Synth trigger failed - context state bias", e);
    }
  }

  // Beat Sequencer Simulation
  startBeatSequence(bpm: number, onBeat: (step: number) => void) {
    if (!this.ctx) this.init();
    this.currentBpm = bpm;
    this.onBeatCallback = onBeat;
    this.isBpmPlaying = true;
    this.currentStep = 0;

    const intervalMs = (60 / bpm / 4) * 1000; // Sixteenth notes
    if (this.beatInterval) clearInterval(this.beatInterval);

    this.beatInterval = window.setInterval(() => {
      if (!this.isBpmPlaying || !this.ctx) return;
      if (this.onBeatCallback) this.onBeatCallback(this.currentStep);
      this.currentStep = (this.currentStep + 1) % 16;
    }, intervalMs);
  }

  stopBeatSequence() {
    this.isBpmPlaying = false;
    if (this.beatInterval) {
      clearInterval(this.beatInterval);
      this.beatInterval = null;
    }
  }

  // Play standard synthetic drum sounds
  playKick() {
    if (!this.ctx) this.init();
    const ctx = this.ctx!;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.frequency.setValueAtTime(150, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

    gain.gain.setValueAtTime(0.4, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

    osc.connect(gain);
    gain.connect(this.primaryGain!);
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  }

  playSnare() {
    if (!this.ctx) this.init();
    const ctx = this.ctx!;
    const noise = ctx.createBufferSource();
    noise.buffer = this.createNoiseBuffer(0.15);

    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.setValueAtTime(1000, ctx.currentTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

    noise.connect(bp);
    bp.connect(gain);
    gain.connect(this.primaryGain!);

    noise.start();
  }

  playHihat() {
    if (!this.ctx) this.init();
    const ctx = this.ctx!;
    const noise = ctx.createBufferSource();
    noise.buffer = this.createNoiseBuffer(0.05);

    const hp = ctx.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.setValueAtTime(7000, ctx.currentTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

    noise.connect(hp);
    hp.connect(gain);
    gain.connect(this.primaryGain!);

    noise.start();
  }

  playMelodyBeep(freq: number) {
    this.playSynthNote(freq, "triangle", 0.15);
  }

  // Close context when disposing
  stopAll() {
    if (this.rainNode) {
      try { (this.rainNode as any).stop(); } catch (e) {}
      this.rainNode = null;
    }
    if (this.oceanNode) {
      try { (this.oceanNode as any).stop(); } catch (e) {}
      this.oceanNode = null;
    }
    if (this.brainOscL) {
      try { this.brainOscL.stop(); } catch (e) {}
      this.brainOscL = null;
    }
    if (this.brainOscR) {
      try { this.brainOscR.stop(); } catch (e) {}
      this.brainOscR = null;
    }
    if (this.fireInterval) {
      clearInterval(this.fireInterval);
      this.fireInterval = null;
    }
    this.stopBeatSequence();
  }
}

export const auraAudio = new AuraAudioEngine();
