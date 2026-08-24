import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Track, EqualizerBand, ABRepeat, LyricsResult, LyricsStatus } from '../types';
import { audioEngine, DEFAULT_EQ_BANDS_10, EQ_PRESETS_10 } from '../services/audioService';
import { api } from '../services/apiService';
import { resolveLyricsForTrack } from '../services/lyricsService';

interface AudioContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isShuffle: boolean;
  isSmartShuffle: boolean;
  repeatMode: 'off' | 'all' | 'one';
  abRepeat: ABRepeat;
  queue: Track[];
  queueIndex: number;
  playbackSpeed: number;
  audioQuality: '128k' | '256k' | 'lossless';
  eqBands: EqualizerBand[];
  activeEQPreset: string;
  preampDb: number;
  isLoudnessNormalized: boolean;
  crossfadeSeconds: number;
  isAiDjEnabled: boolean;
  isSpeakingAiDj: boolean;
  isFullscreenPlayer: boolean;
  isQueueOpen: boolean;
  isEqualizerOpen: boolean;
  sleepTimerMinutes: number | null;
  sleepTimerRemaining: number | null;
  activeLyricsIndex: number;
  activeLyricsResult: LyricsResult | null;
  activeLyricsStatus: LyricsStatus;
  reloadLyrics: () => Promise<void>;
  isKaraokeMode: boolean;
  toggleKaraokeMode: () => void;
  playTrack: (track: Track, newQueue?: Track[]) => void;
  togglePlay: () => void;
  pause: () => void;
  resume: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  seek: (seconds: number) => void;
  seekForward: (seconds?: number) => void;
  seekBackward: (seconds?: number) => void;
  setVolume: (vol: number) => void;
  toggleMute: () => void;
  toggleShuffle: () => void;
  toggleSmartShuffle: () => void;
  toggleRepeat: () => void;
  setAbStart: () => void;
  setAbEnd: () => void;
  clearAbRepeat: () => void;
  toggleAbLoopStep: () => void;
  addToQueue: (track: Track) => void;
  removeFromQueue: (index: number) => void;
  moveQueueItem: (fromIdx: number, toIdx: number) => void;
  clearQueue: () => void;
  setPlaybackSpeed: (speed: number) => void;
  setAudioQuality: (quality: '128k' | '256k' | 'lossless') => void;
  setEQBandGain: (index: number, gain: number) => void;
  applyEQPreset: (presetName: string) => void;
  autoEqForCurrentSong: () => void;
  setPreampDb: (dB: number) => void;
  setIsLoudnessNormalized: (normalized: boolean) => void;
  setCrossfadeSeconds: (secs: number) => void;
  setIsAiDjEnabled: (enabled: boolean) => void;
  setSleepTimer: (minutes: number | null) => void;
  setIsFullscreenPlayer: (open: boolean) => void;
  setIsQueueOpen: (open: boolean) => void;
  setIsEqualizerOpen: (open: boolean) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(210);
  const [volume, setVolumeState] = useState<number>(0.9);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isShuffle, setIsShuffle] = useState<boolean>(false);
  const [isSmartShuffle, setIsSmartShuffle] = useState<boolean>(true);
  const [repeatMode, setRepeatMode] = useState<'off' | 'all' | 'one'>('off');
  const [abRepeat, setAbRepeat] = useState<ABRepeat>({ active: false, start: null, end: null });
  const [queue, setQueue] = useState<Track[]>([]);
  const [queueIndex, setQueueIndex] = useState<number>(0);
  const [playbackSpeed, setPlaybackSpeedState] = useState<number>(1.0);
  const [audioQuality, setAudioQualityState] = useState<'128k' | '256k' | 'lossless'>('lossless');
  const [eqBands, setEqBands] = useState<EqualizerBand[]>(DEFAULT_EQ_BANDS_10);
  const [activeEQPreset, setActiveEQPreset] = useState<string>('Flat');
  const [preampDb, setPreampDbState] = useState<number>(0);
  const [isLoudnessNormalized, setIsLoudnessNormalizedState] = useState<boolean>(true);
  const [crossfadeSeconds, setCrossfadeSeconds] = useState<number>(3);
  const [isAiDjEnabled, setIsAiDjEnabled] = useState<boolean>(false);
  const [isSpeakingAiDj, setIsSpeakingAiDj] = useState<boolean>(false);
  const [isFullscreenPlayer, setIsFullscreenPlayer] = useState<boolean>(false);
  const [isQueueOpen, setIsQueueOpen] = useState<boolean>(false);
  const [isEqualizerOpen, setIsEqualizerOpen] = useState<boolean>(false);
  const [sleepTimerMinutes, setSleepTimerMinutes] = useState<number | null>(null);
  const [sleepTimerRemaining, setSleepTimerRemaining] = useState<number | null>(null);
  const [isKaraokeMode, setIsKaraokeMode] = useState<boolean>(false);
  const [activeLyricsResult, setActiveLyricsResult] = useState<LyricsResult | null>(null);

  const currentTrackIdRef = useRef<string | null>(null);

  // Automatically resolve lyrics whenever currentTrack changes
  useEffect(() => {
    if (!currentTrack) {
      currentTrackIdRef.current = null;
      setActiveLyricsResult(null);
      return;
    }

    currentTrackIdRef.current = currentTrack.id;

    // Immediately clear previous track's lyrics to avoid rendering old lyrics while loading new song
    setActiveLyricsResult({
      trackId: currentTrack.id,
      synced: false,
      verified: false,
      source: 'provider',
      status: 'loading',
      lines: []
    });

    const reqTrackId = currentTrack.id;
    resolveLyricsForTrack(currentTrack).then(res => {
      // Race Condition Protection: Only set lyrics if track hasn't changed during fetch
      if (currentTrackIdRef.current === reqTrackId) {
        setActiveLyricsResult(res);
      }
    });
  }, [currentTrack]);

  // OS Media Keys & Background Playback Integration (MediaSession API)
  useEffect(() => {
    if ('mediaSession' in navigator && currentTrack) {
      try {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: currentTrack.title,
          artist: currentTrack.artist,
          album: currentTrack.album || 'Aura Music',
          artwork: [{ src: currentTrack.albumArt, sizes: '512x512', type: 'image/jpeg' }]
        });

        navigator.mediaSession.setActionHandler('play', () => resume());
        navigator.mediaSession.setActionHandler('pause', () => pause());
        navigator.mediaSession.setActionHandler('previoustrack', () => prevTrack());
        navigator.mediaSession.setActionHandler('nexttrack', () => nextTrack());
        navigator.mediaSession.setActionHandler('seekbackward', () => seekBackward(10));
        navigator.mediaSession.setActionHandler('seekforward', () => seekForward(10));
      } catch (e) {}
    }
  }, [currentTrack]);

  // Save position to localStorage for seamless resume
  useEffect(() => {
    if (currentTrack && currentTime > 0) {
      localStorage.setItem('aura_last_track_id', currentTrack.id);
      localStorage.setItem('aura_last_position', currentTime.toString());
    }
  }, [currentTrack, currentTime]);

  const reloadLyrics = async () => {
    if (!currentTrack) return;
    const reqTrackId = currentTrack.id;
    const res = await resolveLyricsForTrack(currentTrack);
    if (currentTrackIdRef.current === reqTrackId) {
      setActiveLyricsResult(res);
    }
  };

  const toggleKaraokeMode = () => {
    setIsKaraokeMode(prev => {
      const next = !prev;
      if (next) {
        applyEQPreset('Karaoke Vocal Remover');
      } else {
        applyEQPreset('Flat');
      }
      return next;
    });
  };

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const sleepTimerRef = useRef<any>(null);
  const abRepeatRef = useRef<ABRepeat>(abRepeat);
  abRepeatRef.current = abRepeat;

  const repeatModeRef = useRef<'off' | 'all' | 'one'>('off');
  repeatModeRef.current = repeatMode;

  const queueRef = useRef<Track[]>([]);
  queueRef.current = queue;

  const queueIndexRef = useRef<number>(0);
  queueIndexRef.current = queueIndex;

  // Initialize Native Audio Element & Web Audio DSP Graph
  useEffect(() => {
    const audio = new Audio();
    audio.crossOrigin = 'anonymous';
    audio.preload = 'auto';
    audio.volume = volume;
    audioRef.current = audio;

    // Attach to Web Audio engine
    audioEngine.init(audio);

    const handleTimeUpdate = () => {
      if (audio.currentTime !== undefined && !isNaN(audio.currentTime)) {
        const cur = audio.currentTime;
        setCurrentTime(cur);

        // A-B Loop Check
        const ab = abRepeatRef.current;
        if (ab.active && ab.start !== null && ab.end !== null && cur >= ab.end) {
          audio.currentTime = ab.start;
        }

        // Single Track Infinite Replay Guard (Ensures 100% loop completion across all browsers)
        if (repeatModeRef.current === 'one' && audio.duration > 0 && cur >= audio.duration - 0.25) {
          audio.currentTime = 0;
          audio.play().catch(() => {});
        }
      }
    };

    const handleLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration) && audio.duration > 0) {
        setDuration(Math.floor(audio.duration));
      }
    };

    const handlePlay = () => {
      setIsPlaying(true);
      audioEngine.stopSynthPlayback();
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handleEnded = () => {
      const currentRepeat = repeatModeRef.current;
      const currentQ = queueRef.current;
      const currentIdx = queueIndexRef.current;

      if (currentRepeat === 'one') {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      } else if (currentRepeat === 'all' || currentIdx < currentQ.length - 1) {
        nextTrack();
      } else {
        setIsPlaying(false);
      }
    };

    const handleError = (e: any) => {
      console.warn('Audio stream playback error, engaging graceful fallback:', e);
      if (currentTrack) {
        audioEngine.startSynthPlayback(currentTrack);
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('durationchange', handleLoadedMetadata);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('durationchange', handleLoadedMetadata);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.pause();
      audioEngine.stopSynthPlayback();
    };
  }, []);

  // Sync HTML5 Native Audio element loop property with repeatMode
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.loop = (repeatMode === 'one');
    }
  }, [repeatMode]);

  // 60 FPS Continuous High-Precision Audio Time Tracker for Butter-Smooth Lyric Sync
  useEffect(() => {
    let animId: number;

    const tick = () => {
      if (audioRef.current && isPlaying) {
        const t = audioRef.current.currentTime;
        if (!isNaN(t)) {
          setCurrentTime(t);
        }
        animId = requestAnimationFrame(tick);
      }
    };

    if (isPlaying) {
      animId = requestAnimationFrame(tick);
    }

    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, [isPlaying]);

  // Sleep Timer countdown
  useEffect(() => {
    if (sleepTimerMinutes === null) {
      if (sleepTimerRef.current) clearInterval(sleepTimerRef.current);
      setSleepTimerRemaining(null);
      return;
    }

    setSleepTimerRemaining(sleepTimerMinutes * 60);

    sleepTimerRef.current = setInterval(() => {
      setSleepTimerRemaining(prev => {
        if (prev === null || prev <= 1) {
          clearInterval(sleepTimerRef.current);
          pause();
          setSleepTimerMinutes(null);
          return null;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (sleepTimerRef.current) clearInterval(sleepTimerRef.current);
    };
  }, [sleepTimerMinutes]);

  // Primary playback trigger
  const playTrack = (track: Track, newQueue?: Track[]) => {
    audioEngine.ensureContext();
    audioEngine.stopSynthPlayback();

    setCurrentTrack(track);
    setCurrentTime(0);
    setDuration(track.duration || 210);

    // Queue update
    if (newQueue && newQueue.length > 0) {
      setQueue(newQueue);
      const idx = newQueue.findIndex(t => t.id === track.id);
      setQueueIndex(idx !== -1 ? idx : 0);
    } else if (!queue.some(t => t.id === track.id)) {
      setQueue(prev => [...prev, track]);
      setQueueIndex(queue.length);
    } else {
      const idx = queue.findIndex(t => t.id === track.id);
      if (idx !== -1) setQueueIndex(idx);
    }

    // AI DJ Commentary Intro
    if (isAiDjEnabled) {
      setIsSpeakingAiDj(true);
      const speechText = `Up next on DJ Aura. Playing ${track.title} by ${track.artist}. Enjoy the sound.`;
      audioEngine.speakAiDj(speechText, () => {
        setIsSpeakingAiDj(false);
      });
    }

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = track.audioUrl;
      audioRef.current.playbackRate = playbackSpeed;
      audioRef.current.currentTime = 0;
      audioRef.current.loop = (repeatModeRef.current === 'one');
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.warn('Native playback error, triggering audio engine synthesizer:', err);
        audioEngine.startSynthPlayback(track);
        setIsPlaying(true);
      });
    }

    // Record history
    api.recordHistory(track.id, track, track.duration || 180).catch(() => {});
  };

  const togglePlay = () => {
    if (!currentTrack && queue.length > 0) {
      playTrack(queue[0]);
      return;
    }
    if (isPlaying) {
      pause();
    } else {
      resume();
    }
  };

  const pause = () => {
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
    }
    audioEngine.stopSynthPlayback();
    audioEngine.stopSpeech();
  };

  const resume = () => {
    audioEngine.ensureContext();
    if (audioRef.current && audioRef.current.src) {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        audioEngine.stopSynthPlayback();
      }).catch(() => {
        if (currentTrack) audioEngine.startSynthPlayback(currentTrack);
        setIsPlaying(true);
      });
    } else if (currentTrack) {
      playTrack(currentTrack);
    }
  };

  const nextTrack = () => {
    const currentQ = queueRef.current;
    if (currentQ.length === 0) return;
    let nextIdx = queueIndexRef.current + 1;
    if (isShuffle) {
      if (isSmartShuffle && currentTrack) {
        // Smart Shuffle: pick track with matching mood/genre first
        const matches = currentQ.filter(t => t.genre === currentTrack.genre || t.mood === currentTrack.mood);
        const targetTrack = matches.length > 0 ? matches[Math.floor(Math.random() * matches.length)] : currentQ[Math.floor(Math.random() * currentQ.length)];
        nextIdx = currentQ.findIndex(t => t.id === targetTrack.id);
      } else {
        nextIdx = Math.floor(Math.random() * currentQ.length);
      }
    } else if (nextIdx >= currentQ.length) {
      nextIdx = 0;
    }
    setQueueIndex(nextIdx);
    playTrack(currentQ[nextIdx], currentQ);
  };

  const prevTrack = () => {
    if (currentTime > 4) {
      seek(0);
      return;
    }
    const currentQ = queueRef.current;
    if (currentQ.length === 0) return;
    let prevIdx = queueIndexRef.current - 1;
    if (prevIdx < 0) prevIdx = currentQ.length - 1;
    setQueueIndex(prevIdx);
    playTrack(currentQ[prevIdx], currentQ);
  };

  const seek = (seconds: number) => {
    const clamped = Math.max(0, Math.min(duration || 9999, seconds));
    setCurrentTime(clamped);
    if (audioRef.current) {
      try {
        audioRef.current.currentTime = clamped;
      } catch (e) {}
    }
  };

  const seekForward = (seconds: number = 10) => {
    seek(currentTime + seconds);
  };

  const seekBackward = (seconds: number = 10) => {
    seek(currentTime - seconds);
  };

  const setVolume = (vol: number) => {
    const clamped = Math.max(0, Math.min(1, vol));
    setVolumeState(clamped);
    setIsMuted(clamped === 0);
    if (audioRef.current) {
      audioRef.current.volume = clamped;
      audioRef.current.muted = clamped === 0;
    }
    audioEngine.setVolume(clamped);
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      const targetVol = volume || 0.9;
      if (audioRef.current) {
        audioRef.current.muted = false;
        audioRef.current.volume = targetVol;
      }
      audioEngine.setVolume(targetVol);
    } else {
      setIsMuted(true);
      if (audioRef.current) {
        audioRef.current.muted = true;
      }
      audioEngine.setVolume(0);
    }
  };

  const toggleShuffle = () => {
    setIsShuffle(!isShuffle);
  };

  const toggleSmartShuffle = () => {
    setIsSmartShuffle(!isSmartShuffle);
  };

  const toggleRepeat = () => {
    setRepeatMode(prev => (prev === 'one' ? 'off' : 'one'));
  };

  const moveQueueItem = (fromIdx: number, toIdx: number) => {
    if (fromIdx < 0 || fromIdx >= queue.length || toIdx < 0 || toIdx >= queue.length) return;
    const updated = [...queue];
    const [item] = updated.splice(fromIdx, 1);
    updated.splice(toIdx, 0, item);
    setQueue(updated);
    if (fromIdx === queueIndex) {
      setQueueIndex(toIdx);
    }
  };

  const setPlaybackSpeed = (speed: number) => {
    setPlaybackSpeedState(speed);
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
  };

  // A-B Loop Controls
  const setAbStart = () => {
    setAbRepeat({ start: currentTime, end: null, active: false });
  };

  const setAbEnd = () => {
    if (abRepeat.start !== null && currentTime > abRepeat.start) {
      setAbRepeat({ start: abRepeat.start, end: currentTime, active: true });
    }
  };

  const clearAbRepeat = () => {
    setAbRepeat({ active: false, start: null, end: null });
  };

  const toggleAbLoopStep = () => {
    if (abRepeat.start === null) {
      // Step 1: Capture Point A
      setAbRepeat({ start: currentTime, end: null, active: false });
    } else if (!abRepeat.active || abRepeat.end === null) {
      // Step 2: Capture Point B (if currentTime > start)
      if (currentTime > abRepeat.start) {
        setAbRepeat({ start: abRepeat.start, end: currentTime, active: true });
      } else {
        // Restart Point A if currentTime < start
        setAbRepeat({ start: currentTime, end: null, active: false });
      }
    } else {
      // Step 3: Clear A-B Loop
      setAbRepeat({ active: false, start: null, end: null });
    }
  };

  const addToQueue = (track: Track) => {
    setQueue(prev => [...prev, track]);
  };

  const removeFromQueue = (index: number) => {
    setQueue(prev => prev.filter((_, i) => i !== index));
    if (index === queueIndex && queue.length > 1) {
      nextTrack();
    }
  };

  const clearQueue = () => {
    if (currentTrack) {
      setQueue([currentTrack]);
      setQueueIndex(0);
    } else {
      setQueue([]);
      setQueueIndex(0);
    }
  };

  const setAudioQuality = (quality: '128k' | '256k' | 'lossless') => {
    setAudioQualityState(quality);
  };

  const setEQBandGain = (index: number, gain: number) => {
    setEqBands(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], gain };
      return updated;
    });
    audioEngine.setEQBandGain(index, gain);
  };

  const applyEQPreset = (presetName: string) => {
    setActiveEQPreset(presetName);
    const gains = EQ_PRESETS_10[presetName] || EQ_PRESETS_10['Flat'];
    setEqBands(prev =>
      prev.map((band, idx) => ({ ...band, gain: gains[idx] ?? 0 }))
    );
    audioEngine.applyEQPreset(gains);
  };

  const autoEqForCurrentSong = () => {
    if (!currentTrack) return;
    const recommendation = audioEngine.getAutoEqForTrack(currentTrack);
    applyEQPreset(recommendation.presetName);
  };

  const setPreampDb = (dB: number) => {
    setPreampDbState(dB);
    audioEngine.setPreampGain(dB);
  };

  const setIsLoudnessNormalized = (normalized: boolean) => {
    setIsLoudnessNormalizedState(normalized);
    audioEngine.setLoudnessNormalization(normalized);
  };

  const setSleepTimer = (minutes: number | null) => {
    setSleepTimerMinutes(minutes);
  };

  const activeLyricsIndex = React.useMemo(() => {
    if (!currentTrack?.lyrics || currentTrack.lyrics.length === 0) return -1;
    let activeIdx = 0;
    currentTrack.lyrics.forEach((line, idx) => {
      const match = line.match(/\[(\d+):(\d+)\]/);
      if (match) {
        const lineSeconds = parseInt(match[1]) * 60 + parseInt(match[2]);
        if (currentTime >= lineSeconds) {
          activeIdx = idx;
        }
      }
    });
    return activeIdx;
  }, [currentTrack, currentTime]);

  return (
    <AudioContext.Provider
      value={{
        currentTrack,
        isPlaying,
        setIsPlaying,
        currentTime,
        duration,
        volume,
        isMuted,
        isShuffle,
        isSmartShuffle,
        repeatMode,
        abRepeat,
        queue,
        queueIndex,
        playbackSpeed,
        audioQuality,
        eqBands,
        activeEQPreset,
        preampDb,
        isLoudnessNormalized,
        crossfadeSeconds,
        isAiDjEnabled,
        isSpeakingAiDj,
        isFullscreenPlayer,
        isQueueOpen,
        isEqualizerOpen,
        sleepTimerMinutes,
        sleepTimerRemaining,
        activeLyricsIndex,
        activeLyricsResult,
        activeLyricsStatus: activeLyricsResult?.status || 'idle',
        reloadLyrics,
        isKaraokeMode,
        toggleKaraokeMode,
        playTrack,
        togglePlay,
        pause,
        resume,
        nextTrack,
        prevTrack,
        seek,
        seekForward,
        seekBackward,
        setVolume,
        toggleMute,
        toggleShuffle,
        toggleSmartShuffle,
        toggleRepeat,
        setAbStart,
        setAbEnd,
        clearAbRepeat,
        toggleAbLoopStep,
        addToQueue,
        removeFromQueue,
        moveQueueItem,
        clearQueue,
        setPlaybackSpeed,
        setAudioQuality,
        setEQBandGain,
        applyEQPreset,
        autoEqForCurrentSong,
        setPreampDb,
        setIsLoudnessNormalized,
        setCrossfadeSeconds,
        setIsAiDjEnabled,
        setSleepTimer,
        setIsFullscreenPlayer,
        setIsQueueOpen,
        setIsEqualizerOpen
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) throw new Error('useAudio must be used within an AudioProvider');
  return context;
};
