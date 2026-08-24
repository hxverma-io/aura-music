import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Smartphone,
  Sparkles,
  ListMusic,
  Mic,
  Sliders,
  Wifi,
  Disc,
  CheckCircle2,
  Layers
} from 'lucide-react';
import { remoteSyncService, RemoteState } from '../services/remoteSyncService';
import { useAudio } from '../context/AudioContext';
import { SyncedLyricsView } from '../components/lyrics/SyncedLyricsView';

export const PhoneRemoteView: React.FC = () => {
  const audio = useAudio();
  const [remoteState, setRemoteState] = useState<RemoteState | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<'remote' | 'queue' | 'lyrics'>('remote');
  const [isListeningVoice, setIsListeningVoice] = useState(false);
  const [voiceFeedback, setVoiceFeedback] = useState<string | null>(null);

  // Sync state between AudioContext (main engine) and RemoteSyncService
  useEffect(() => {
    // Broadcast current audio state whenever it changes
    remoteSyncService.broadcastState({
      currentTrack: audio.currentTrack,
      isPlaying: audio.isPlaying,
      currentTime: audio.currentTime,
      duration: audio.duration,
      volume: audio.volume,
      isMuted: audio.isMuted,
      activeEQPreset: audio.activeEQPreset,
      queue: audio.queue,
      timestamp: Date.now()
    });
  }, [
    audio.currentTrack,
    audio.isPlaying,
    audio.currentTime,
    audio.duration,
    audio.volume,
    audio.isMuted,
    audio.activeEQPreset,
    audio.queue
  ]);

  // Subscribe to remote commands sent by remote UI (if running in separate tab/device)
  useEffect(() => {
    const unsubscribeCmd = remoteSyncService.onCommand(cmd => {
      if (cmd.command === 'PLAY') audio.resume();
      else if (cmd.command === 'PAUSE') audio.pause();
      else if (cmd.command === 'TOGGLE_PLAY') audio.togglePlay();
      else if (cmd.command === 'NEXT') audio.nextTrack();
      else if (cmd.command === 'PREV') audio.prevTrack();
      else if (cmd.command === 'SEEK' && typeof cmd.value === 'number') audio.seek(cmd.value);
      else if (cmd.command === 'SET_VOLUME' && typeof cmd.value === 'number') audio.setVolume(cmd.value);
      else if (cmd.command === 'SET_EQ' && typeof cmd.value === 'string') audio.applyEQPreset(cmd.value);
      else if (cmd.command === 'PLAY_TRACK' && cmd.value) audio.playTrack(cmd.value);
    });

    const unsubscribeState = remoteSyncService.onStateUpdate(state => {
      setRemoteState(state);
    });

    return () => {
      unsubscribeCmd();
      unsubscribeState();
    };
  }, [audio]);

  const track = audio.currentTrack || remoteState?.currentTrack || {
    title: 'Aura Music Engine',
    artist: 'Connect your Phone Remote',
    albumArt: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
    duration: 210
  };

  const isPlaying = audio.isPlaying ?? remoteState?.isPlaying ?? false;
  const currentTime = audio.currentTime ?? remoteState?.currentTime ?? 0;
  const duration = audio.duration || track.duration || 210;
  const volume = audio.volume ?? remoteState?.volume ?? 0.9;
  const isMuted = audio.isMuted ?? remoteState?.isMuted ?? false;
  const activeEQPreset = audio.activeEQPreset || remoteState?.activeEQPreset || 'Flat';

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Voice Command Trigger on Phone Remote
  const handleVoiceCommand = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceFeedback('Voice recognition not supported in this browser.');
      setTimeout(() => setVoiceFeedback(null), 3000);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      setIsListeningVoice(true);
      setVoiceFeedback('🎙️ Listening to voice command...');

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        setVoiceFeedback(`" ${transcript} "`);
        setIsListeningVoice(false);

        if (transcript.includes('play') || transcript.includes('start') || transcript.includes('chalao')) {
          remoteSyncService.sendCommand('PLAY');
          audio.resume();
        } else if (transcript.includes('pause') || transcript.includes('stop') || transcript.includes('roko')) {
          remoteSyncService.sendCommand('PAUSE');
          audio.pause();
        } else if (transcript.includes('next') || transcript.includes('agli')) {
          remoteSyncService.sendCommand('NEXT');
          audio.nextTrack();
        } else if (transcript.includes('previous') || transcript.includes('pichli')) {
          remoteSyncService.sendCommand('PREV');
          audio.prevTrack();
        }

        setTimeout(() => setVoiceFeedback(null), 3000);
      };

      recognition.onerror = () => {
        setIsListeningVoice(false);
        setVoiceFeedback('Could not hear command.');
        setTimeout(() => setVoiceFeedback(null), 3000);
      };

      recognition.start();
    } catch (e) {
      setIsListeningVoice(false);
    }
  };

  const handlePlayPause = () => {
    remoteSyncService.sendCommand('TOGGLE_PLAY');
    audio.togglePlay();
  };

  const handleNext = () => {
    remoteSyncService.sendCommand('NEXT');
    audio.nextTrack();
  };

  const handlePrev = () => {
    remoteSyncService.sendCommand('PREV');
    audio.prevTrack();
  };

  const handleEqPreset = (presetName: string) => {
    remoteSyncService.sendCommand('SET_EQ', presetName);
    audio.applyEQPreset(presetName);
  };

  return (
    <div
      style={{
        maxWidth: '480px',
        margin: '0 auto',
        minHeight: 'calc(100vh - 120px)',
        backgroundColor: 'var(--bg-surface)',
        borderRadius: '24px',
        border: '1px solid var(--border-color)',
        padding: '24px 20px',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Phone Remote Top Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Smartphone size={20} color="var(--color-primary)" />
          <span style={{ fontSize: '0.95rem', fontWeight: 800, letterSpacing: '0.5px' }}>
            AURA PHONE REMOTE
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10b981', padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700 }}>
          <Wifi size={12} />
          <span>LAN LIVE</span>
        </div>
      </div>

      {/* Sub Tabs: Remote | Queue | Lyrics */}
      <div style={{ display: 'flex', backgroundColor: 'var(--bg-elevated)', borderRadius: '14px', padding: '4px', marginBottom: '24px' }}>
        <button
          onClick={() => setActiveSubTab('remote')}
          style={{
            flex: 1,
            padding: '8px',
            borderRadius: '10px',
            border: 'none',
            backgroundColor: activeSubTab === 'remote' ? 'var(--color-primary)' : 'transparent',
            color: '#ffffff',
            fontWeight: 700,
            fontSize: '0.82rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px'
          }}
        >
          <Smartphone size={14} /> Controller
        </button>
        <button
          onClick={() => setActiveSubTab('queue')}
          style={{
            flex: 1,
            padding: '8px',
            borderRadius: '10px',
            border: 'none',
            backgroundColor: activeSubTab === 'queue' ? 'var(--color-primary)' : 'transparent',
            color: '#ffffff',
            fontWeight: 700,
            fontSize: '0.82rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px'
          }}
        >
          <ListMusic size={14} /> Queue ({audio.queue.length})
        </button>
        <button
          onClick={() => setActiveSubTab('lyrics')}
          style={{
            flex: 1,
            padding: '8px',
            borderRadius: '10px',
            border: 'none',
            backgroundColor: activeSubTab === 'lyrics' ? 'var(--color-primary)' : 'transparent',
            color: '#ffffff',
            fontWeight: 700,
            fontSize: '0.82rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px'
          }}
        >
          <Disc size={14} /> Synced Lyrics
        </button>
      </div>

      {voiceFeedback && (
        <div
          style={{
            backgroundColor: 'rgba(99, 102, 241, 0.2)',
            border: '1px solid var(--color-primary)',
            color: 'var(--color-primary)',
            padding: '10px 14px',
            borderRadius: '12px',
            fontSize: '0.85rem',
            fontWeight: 700,
            textAlign: 'center',
            marginBottom: '16px'
          }}
        >
          {voiceFeedback}
        </div>
      )}

      {/* Main Remote Tab */}
      {activeSubTab === 'remote' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
          {/* Vinyl Album Artwork */}
          <div
            style={{
              position: 'relative',
              width: '220px',
              height: '220px',
              borderRadius: '50%',
              overflow: 'hidden',
              boxShadow: isPlaying ? '0 0 40px rgba(99, 102, 241, 0.4)' : '0 10px 30px rgba(0, 0, 0, 0.5)',
              margin: '10px 0 24px 0',
              animation: isPlaying ? 'spin 12s linear infinite' : 'none',
              border: '6px solid var(--bg-elevated)'
            }}
          >
            <img
              src={track.albumArt}
              alt={track.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            {/* Center Vinyl Hole */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '36px',
                height: '36px',
                backgroundColor: 'var(--bg-main)',
                borderRadius: '50%',
                border: '4px solid rgba(255, 255, 255, 0.3)'
              }}
            />
          </div>

          {/* Track Details */}
          <div style={{ textAlign: 'center', marginBottom: '20px', width: '100%' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {track.title}
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              {track.artist}
            </p>
            <div style={{ marginTop: '8px', display: 'inline-flex', gap: '8px' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 800, padding: '3px 8px', borderRadius: '6px', backgroundColor: 'var(--color-primary)', color: '#ffffff' }}>
                FLAC 24-BIT / 192kHz
              </span>
              <span style={{ fontSize: '0.72rem', fontWeight: 800, padding: '3px 8px', borderRadius: '6px', backgroundColor: 'var(--bg-elevated)', color: 'var(--text-muted)' }}>
                EQ: {activeEQPreset}
              </span>
            </div>
          </div>

          {/* Seekbar */}
          <div style={{ width: '100%', marginBottom: '20px' }}>
            <input
              type="range"
              min="0"
              max={duration || 100}
              value={currentTime}
              onChange={e => {
                const targetSec = parseFloat(e.target.value);
                remoteSyncService.sendCommand('SEEK', targetSec);
                audio.seek(targetSec);
              }}
              style={{ width: '100%', accentColor: 'var(--color-primary)', cursor: 'pointer' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-subtle)', fontWeight: 700, marginTop: '6px' }}>
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Touch Playback Controls */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px', marginBottom: '24px' }}>
            <button
              onClick={handlePrev}
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: 'var(--bg-elevated)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-main)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <SkipBack size={22} />
            </button>

            <button
              onClick={handlePlayPause}
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-primary)',
                border: 'none',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 8px 24px rgba(99, 102, 241, 0.5)'
              }}
            >
              {isPlaying ? <Pause size={28} /> : <Play size={28} style={{ marginLeft: '4px' }} />}
            </button>

            <button
              onClick={handleNext}
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: 'var(--bg-elevated)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-main)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <SkipForward size={22} />
            </button>
          </div>

          {/* Quick Voice Command & Volume Controls */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '12px', width: '100%', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: 'var(--bg-elevated)', padding: '10px 16px', borderRadius: '14px' }}>
              <button onClick={() => audio.toggleMute()} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={e => {
                  const targetVol = parseFloat(e.target.value);
                  remoteSyncService.sendCommand('SET_VOLUME', targetVol);
                  audio.setVolume(targetVol);
                }}
                style={{ flex: 1, accentColor: 'var(--color-primary)', cursor: 'pointer' }}
              />
            </div>

            <button
              onClick={handleVoiceCommand}
              style={{
                backgroundColor: isListeningVoice ? '#ef4444' : 'var(--color-primary)',
                border: 'none',
                color: '#ffffff',
                padding: '0 16px',
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
            >
              <Mic size={18} /> Voice
            </button>
          </div>

          {/* EQ Preset Selector Pills */}
          <div style={{ width: '100%' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-subtle)', marginBottom: '8px', textTransform: 'uppercase' }}>
              Equalizer Quick Presets
            </div>
            <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
              {['Flat', 'Bass Boost', 'Rock & Metal', 'Electronic & EDM', 'Bollywood Warmth', 'Cyber Synthwave'].map(p => (
                <button
                  key={p}
                  onClick={() => handleEqPreset(p)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '20px',
                    border: '1px solid ' + (activeEQPreset === p ? 'var(--color-primary)' : 'var(--border-color)'),
                    backgroundColor: activeEQPreset === p ? 'var(--color-primary)' : 'var(--bg-elevated)',
                    color: activeEQPreset === p ? '#ffffff' : 'var(--text-muted)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    whiteSpace: 'nowrap',
                    cursor: 'pointer'
                  }}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Queue Sub Tab */}
      {activeSubTab === 'queue' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, overflowY: 'auto' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px' }}>
            PLAYBACK QUEUE ({audio.queue.length})
          </div>
          {audio.queue.map((t, idx) => {
            const isCurr = audio.currentTrack?.id === t.id;
            return (
              <div
                key={t.id + '-' + idx}
                onClick={() => {
                  remoteSyncService.sendCommand('PLAY_TRACK', t);
                  audio.playTrack(t, audio.queue);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  backgroundColor: isCurr ? 'rgba(99, 102, 241, 0.15)' : 'var(--bg-elevated)',
                  border: '1px solid ' + (isCurr ? 'var(--color-primary)' : 'var(--border-color)'),
                  padding: '10px 14px',
                  borderRadius: '12px',
                  cursor: 'pointer'
                }}
              >
                <img src={t.albumArt} alt={t.title} style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }} />
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: isCurr ? 'var(--color-primary)' : 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {t.title}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{t.artist}</div>
                </div>
                {isCurr && <CheckCircle2 size={18} color="var(--color-primary)" />}
              </div>
            );
          })}
        </div>
      )}

      {/* Synced Lyrics Sub Tab */}
      {activeSubTab === 'lyrics' && (
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <SyncedLyricsView track={audio.currentTrack} compact />
        </div>
      )}
    </div>
  );
};
