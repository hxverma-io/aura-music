import { EqualizerBand, Track } from '../types';

export const DEFAULT_EQ_BANDS_10: EqualizerBand[] = [
  { label: '31 Hz', freq: 31, gain: 0, type: 'lowshelf', q: 1.4 },
  { label: '63 Hz', freq: 63, gain: 0, type: 'peaking', q: 1.4 },
  { label: '125 Hz', freq: 125, gain: 0, type: 'peaking', q: 1.4 },
  { label: '250 Hz', freq: 250, gain: 0, type: 'peaking', q: 1.4 },
  { label: '500 Hz', freq: 500, gain: 0, type: 'peaking', q: 1.4 },
  { label: '1 kHz', freq: 1000, gain: 0, type: 'peaking', q: 1.4 },
  { label: '2 kHz', freq: 2000, gain: 0, type: 'peaking', q: 1.4 },
  { label: '4 kHz', freq: 4000, gain: 0, type: 'peaking', q: 1.4 },
  { label: '8 kHz', freq: 8000, gain: 0, type: 'peaking', q: 1.4 },
  { label: '16 kHz', freq: 16000, gain: 0, type: 'highshelf', q: 1.4 }
];

export const DEFAULT_EQ_BANDS_31: EqualizerBand[] = [
  { label: '20Hz', freq: 20, gain: 0, type: 'lowshelf', q: 4.3 },
  { label: '25Hz', freq: 25, gain: 0, type: 'peaking', q: 4.3 },
  { label: '31.5Hz', freq: 31.5, gain: 0, type: 'peaking', q: 4.3 },
  { label: '40Hz', freq: 40, gain: 0, type: 'peaking', q: 4.3 },
  { label: '50Hz', freq: 50, gain: 0, type: 'peaking', q: 4.3 },
  { label: '63Hz', freq: 63, gain: 0, type: 'peaking', q: 4.3 },
  { label: '80Hz', freq: 80, gain: 0, type: 'peaking', q: 4.3 },
  { label: '100Hz', freq: 100, gain: 0, type: 'peaking', q: 4.3 },
  { label: '125Hz', freq: 125, gain: 0, type: 'peaking', q: 4.3 },
  { label: '160Hz', freq: 160, gain: 0, type: 'peaking', q: 4.3 },
  { label: '200Hz', freq: 200, gain: 0, type: 'peaking', q: 4.3 },
  { label: '250Hz', freq: 250, gain: 0, type: 'peaking', q: 4.3 },
  { label: '315Hz', freq: 315, gain: 0, type: 'peaking', q: 4.3 },
  { label: '400Hz', freq: 400, gain: 0, type: 'peaking', q: 4.3 },
  { label: '500Hz', freq: 500, gain: 0, type: 'peaking', q: 4.3 },
  { label: '630Hz', freq: 630, gain: 0, type: 'peaking', q: 4.3 },
  { label: '800Hz', freq: 800, gain: 0, type: 'peaking', q: 4.3 },
  { label: '1kHz', freq: 1000, gain: 0, type: 'peaking', q: 4.3 },
  { label: '1.25k', freq: 1250, gain: 0, type: 'peaking', q: 4.3 },
  { label: '1.6k', freq: 1600, gain: 0, type: 'peaking', q: 4.3 },
  { label: '2kHz', freq: 2000, gain: 0, type: 'peaking', q: 4.3 },
  { label: '2.5k', freq: 2500, gain: 0, type: 'peaking', q: 4.3 },
  { label: '3.15k', freq: 3150, gain: 0, type: 'peaking', q: 4.3 },
  { label: '4kHz', freq: 4000, gain: 0, type: 'peaking', q: 4.3 },
  { label: '5kHz', freq: 5000, gain: 0, type: 'peaking', q: 4.3 },
  { label: '6.3k', freq: 6300, gain: 0, type: 'peaking', q: 4.3 },
  { label: '8kHz', freq: 8000, gain: 0, type: 'peaking', q: 4.3 },
  { label: '10kHz', freq: 10000, gain: 0, type: 'peaking', q: 4.3 },
  { label: '12.5k', freq: 12500, gain: 0, type: 'peaking', q: 4.3 },
  { label: '16kHz', freq: 16000, gain: 0, type: 'peaking', q: 4.3 },
  { label: '20kHz', freq: 20000, gain: 0, type: 'highshelf', q: 4.3 }
];

export const DEFAULT_EQ_BANDS: EqualizerBand[] = DEFAULT_EQ_BANDS_10;

export const EQ_PRESETS_10: Record<string, number[]> = {
  'Flat': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  'Karaoke Vocal Remover': [4, 3, 1, -8, -12, -12, -8, 2, 4, 4],
  'Bass Boost': [8, 6, 4, 2, 0, 0, -1, -1, -2, -2],
  'Rock & Metal': [5, 4, 2, -1, -2, 1, 3, 4, 5, 5],
  'Electronic & EDM': [6, 5, 3, 0, -1, 2, 4, 5, 6, 6],
  'Acoustic & Vocal': [-2, -1, 1, 3, 4, 4, 3, 2, 1, 0],
  'Bollywood Warmth': [4, 3, 1, 2, 3, 2, 1, 2, 3, 2],
  'Cyber Synthwave': [5, 4, 2, -1, -2, 2, 4, 6, 7, 7],
  'Hi-Res Audiophile': [1, 2, 1, 0, 0, 1, 2, 2, 3, 4],
  'Late Night / Sleep': [-4, -3, -1, 0, 0, -1, -2, -4, -6, -8]
};

export const EQ_PRESETS = EQ_PRESETS_10;

class AudioEngineService {
  private ctx: AudioContext | null = null;
  private audioElement: HTMLAudioElement | null = null;
  private sourceNode: MediaElementAudioSourceNode | null = null;
  private preampGainNode: GainNode | null = null;
  private eqFilters: BiquadFilterNode[] = [];
  private compressorNode: DynamicsCompressorNode | null = null;
  private masterGain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  private synthInterval: any = null;
  private isSynthPlaying: boolean = false;
  private speechSynth: SpeechSynthesis | null = typeof window !== 'undefined' && 'speechSynthesis' in window ? window.speechSynthesis : null;

  public init(audioEl: HTMLAudioElement) {
    this.audioElement = audioEl;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioContextClass();
      
      // Pre-amp gain node
      this.preampGainNode = this.ctx.createGain();
      this.preampGainNode.gain.value = 1.0;

      // Dynamics compressor node (for Loudness Normalization -14 LUFS target)
      this.compressorNode = this.ctx.createDynamicsCompressor();
      this.compressorNode.threshold.value = -24;
      this.compressorNode.knee.value = 30;
      this.compressorNode.ratio.value = 12;
      this.compressorNode.attack.value = 0.003;
      this.compressorNode.release.value = 0.25;

      // Master Gain
      this.masterGain = this.ctx.createGain();

      // Analyser
      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 256;
      this.analyser.smoothingTimeConstant = 0.8;

      // Equalizer Biquad Filters
      this.eqFilters = DEFAULT_EQ_BANDS_10.map(band => {
        const filter = this.ctx!.createBiquadFilter();
        filter.type = band.type;
        filter.frequency.value = band.freq;
        filter.gain.value = band.gain;
        filter.Q.value = band.q || 1.4;
        return filter;
      });

      // Routing: Preamp -> EQ Filters -> Compressor -> Master -> Analyser -> Destination
      let prevNode: AudioNode = this.preampGainNode;

      this.eqFilters.forEach((filter, idx) => {
        if (idx === 0) {
          prevNode.connect(filter);
        } else {
          this.eqFilters[idx - 1].connect(filter);
        }
      });

      prevNode = this.eqFilters[this.eqFilters.length - 1];
      prevNode.connect(this.compressorNode);
      this.compressorNode.connect(this.masterGain);
      this.masterGain.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);

      // Connect HTML5 audio element
      try {
        this.sourceNode = this.ctx.createMediaElementSource(audioEl);
        this.sourceNode.connect(this.preampGainNode);
      } catch (err) {
        console.warn('Media element source connection skipped or restricted:', err);
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

  public setPreampGain(dB: number) {
    if (this.preampGainNode && this.ctx) {
      const linear = Math.pow(10, dB / 20);
      this.preampGainNode.gain.setTargetAtTime(linear, this.ctx.currentTime, 0.05);
    }
  }

  public setLoudnessNormalization(enabled: boolean) {
    if (this.compressorNode && this.ctx) {
      if (enabled) {
        this.compressorNode.threshold.setTargetAtTime(-24, this.ctx.currentTime, 0.05);
        this.compressorNode.ratio.setTargetAtTime(12, this.ctx.currentTime, 0.05);
      } else {
        this.compressorNode.threshold.setTargetAtTime(0, this.ctx.currentTime, 0.05);
        this.compressorNode.ratio.setTargetAtTime(1, this.ctx.currentTime, 0.05);
      }
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

  public getAutoEqForTrack(track: Track): { presetName: string; gains: number[] } {
    const genre = (track.genre || '').toLowerCase();
    const mood = (track.mood || '').toLowerCase();

    if (genre.includes('bollywood') || genre.includes('punjabi')) {
      return { presetName: 'Bollywood Warmth', gains: EQ_PRESETS_10['Bollywood Warmth'] };
    }
    if (genre.includes('rock') || genre.includes('metal')) {
      return { presetName: 'Rock & Metal', gains: EQ_PRESETS_10['Rock & Metal'] };
    }
    if (genre.includes('synth') || genre.includes('cyber')) {
      return { presetName: 'Cyber Synthwave', gains: EQ_PRESETS_10['Cyber Synthwave'] };
    }
    if (genre.includes('electronic') || mood.includes('party')) {
      return { presetName: 'Electronic & EDM', gains: EQ_PRESETS_10['Electronic & EDM'] };
    }
    if (mood.includes('sleep') || mood.includes('chill') || genre.includes('lo-fi')) {
      return { presetName: 'Late Night / Sleep', gains: EQ_PRESETS_10['Late Night / Sleep'] };
    }
    return { presetName: 'Hi-Res Audiophile', gains: EQ_PRESETS_10['Hi-Res Audiophile'] };
  }

  public getAudioContext(): AudioContext | null {
    return this.ctx;
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

  // AI DJ Voice Announcement Engine
  public speakAiDj(text: string, onEnd?: () => void) {
    if (!this.speechSynth) {
      if (onEnd) onEnd();
      return;
    }
    try {
      this.speechSynth.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.05;

      const voices = this.speechSynth.getVoices();
      const preferredVoice = voices.find(v => v.lang.includes('en') || v.lang.includes('hi')) || voices[0];
      if (preferredVoice) utterance.voice = preferredVoice;

      if (onEnd) {
        utterance.onend = onEnd;
        utterance.onerror = onEnd;
      }
      this.speechSynth.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error:', e);
      if (onEnd) onEnd();
    }
  }

  public stopSpeech() {
    if (this.speechSynth) {
      this.speechSynth.cancel();
    }
  }

  // Procedural Audio Synthesizer fallback
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

      noteGain.gain.setValueAtTime(0.001, now);
      noteGain.gain.exponentialRampToValueAtTime(0.12, now + 0.05);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, now + (tempoMs / 1000) * 0.9);

      if (this.preampGainNode) {
        osc.connect(noteGain);
        noteGain.connect(this.preampGainNode);
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
