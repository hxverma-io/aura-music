import { EqualizerBand, Track } from '../types';

export const DEFAULT_EQ_BANDS: EqualizerBand[] = [
  { label: '60 Hz', freq: 60, gain: 0, type: 'lowshelf' },
  { label: '230 Hz', freq: 230, gain: 0, type: 'peaking' },
  { label: '910 Hz', freq: 910, gain: 0, type: 'peaking' },
  { label: '3.6 kHz', freq: 3600, gain: 0, type: 'peaking' },
  { label: '14 kHz', freq: 14000, gain: 0, type: 'highshelf' }
];

export const EQ_PRESETS: Record<string, number[]> = {
  'Flat': [0, 0, 0, 0, 0],
  'Bass Boost': [6, 4, 1, 0, -1],
  'Rock & Metal': [4, 2, -1, 3, 5],
  'Electronic': [5, 3, 0, 2, 4],
  'Acoustic & Vocal': [-2, 1, 4, 3, 2],
  'Cyber Synth': [4, 1, -2, 4, 6],
  'Late Night / Sleep': [-3, -1, 0, -2, -5]
};

class AudioEngineService {
  private ctx: AudioContext | null = null;
  private audioElement: HTMLAudioElement | null = null;
  private sourceNode: MediaElementAudioSourceNode | null = null;
  private eqFilters: BiquadFilterNode[] = [];
  private masterGain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  private synthInterval: any = null;
  private isSynthPlaying: boolean = false;

  public init(audioEl: HTMLAudioElement) {
    this.audioElement = audioEl;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioContextClass();
      
      // Master Gain
      this.masterGain = this.ctx.createGain();

      // Analyser
      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 256;
      this.analyser.smoothingTimeConstant = 0.8;

      // Equalizer Biquad Filters
      this.eqFilters = DEFAULT_EQ_BANDS.map(band => {
        const filter = this.ctx!.createBiquadFilter();
        filter.type = band.type;
        filter.frequency.value = band.freq;
        filter.gain.value = band.gain;
        return filter;
      });

      // Connect filters in series
      let prevNode: AudioNode | null = null;
      this.eqFilters.forEach((filter, index) => {
        if (index > 0 && prevNode) {
          prevNode.connect(filter);
        }
        prevNode = filter;
      });

      if (prevNode) {
        (prevNode as AudioNode).connect(this.masterGain);
      }
      this.masterGain.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);

      // Connect HTML5 audio element
      try {
        this.sourceNode = this.ctx.createMediaElementSource(audioEl);
        if (this.eqFilters.length > 0) {
          this.sourceNode.connect(this.eqFilters[0]);
        } else {
          this.sourceNode.connect(this.masterGain);
        }
      } catch (err) {
        console.warn('Media element source already connected or restricted:', err);
      }
    } catch (e) {
      console.warn('Web Audio API initialized in fallback mode', e);
    }
  }

  public ensureContext() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolume(volume: number) {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(Math.max(0, Math.min(1, volume)), this.ctx.currentTime);
    }
    if (this.audioElement) {
      this.audioElement.volume = Math.max(0, Math.min(1, volume));
    }
  }

  public setEQBandGain(index: number, gain: number) {
    if (this.eqFilters[index] && this.ctx) {
      this.eqFilters[index].gain.setTargetAtTime(gain, this.ctx.currentTime, 0.05);
    }
  }

  public applyEQPreset(gains: number[]) {
    gains.forEach((g, idx) => {
      this.setEQBandGain(idx, g);
    });
  }

  public getAnalyser(): AnalyserNode | null {
    return this.analyser;
  }

  public getFrequencyData(array: any) {
    if (this.analyser) {
      this.analyser.getByteFrequencyData(array);
    }
  }

  public getWaveformData(array: any) {
    if (this.analyser) {
      this.analyser.getByteTimeDomainData(array);
    }
  }

  // Realistic Procedural Synthesizer for audio fallback
  public startSynthPlayback(trackOrPreset?: Track | { type?: string; bpm?: number; baseFreq?: number }) {
    if (!this.ctx) return;
    this.ensureContext();
    this.stopSynthPlayback();
    this.isSynthPlaying = true;

    const synthType = (trackOrPreset as any)?.synthPreset?.type || (trackOrPreset as any)?.genre?.toLowerCase() || (trackOrPreset as any)?.type || 'synthwave';
    const bpm = (trackOrPreset as any)?.synthPreset?.bpm || (trackOrPreset as any)?.bpm || 110;
    const tempoMs = (60 / bpm) * 1000;

    const notesByPreset: Record<string, number[]> = {
      synthwave: [110, 130.81, 146.83, 164.81, 196.00, 220.00],
      ambient: [130.81, 164.81, 196.00, 246.94, 293.66],
      rock: [82.41, 110.00, 123.47, 146.83, 164.81],
      lofi: [130.81, 155.56, 174.61, 196.00, 220.00],
      energy: [73.42, 98.00, 110.00, 146.83, 174.61],
      bollywood: [130.81, 146.83, 164.81, 196.00, 220.00, 261.63],
      punjabi: [110, 130.81, 146.83, 174.61, 196.00],
      pop: [130.81, 164.81, 196.00, 220.00, 261.63]
    };

    const scale = notesByPreset[synthType] || notesByPreset.synthwave;
    let step = 0;

    this.synthInterval = setInterval(() => {
      if (!this.isSynthPlaying || !this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const noteGain = this.ctx.createGain();

      const freq = scale[step % scale.length] * (step % 4 === 0 ? 0.5 : (step % 3 === 0 ? 1.5 : 1));
      osc.type = synthType === 'synthwave' ? 'sawtooth' : (synthType === 'lofi' ? 'triangle' : 'sine');
      osc.frequency.setValueAtTime(freq, now);

      // Envelope
      noteGain.gain.setValueAtTime(0.001, now);
      noteGain.gain.exponentialRampToValueAtTime(0.12, now + 0.05);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, now + (tempoMs / 1000) * 0.9);

      if (this.eqFilters.length > 0) {
        osc.connect(noteGain);
        noteGain.connect(this.eqFilters[0]);
      } else if (this.masterGain) {
        osc.connect(noteGain);
        noteGain.connect(this.masterGain);
      }

      osc.start(now);
      osc.stop(now + (tempoMs / 1000));

      step++;
    }, tempoMs / 2);
  }

  public stopSynthPlayback() {
    this.isSynthPlaying = false;
    if (this.synthInterval) {
      clearInterval(this.synthInterval);
      this.synthInterval = null;
    }
  }
}

export const audioEngine = new AudioEngineService();
