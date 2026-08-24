import React, { useState } from 'react';
import {
  X,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Shuffle,
  Repeat,
  Repeat1,
  Volume2,
  VolumeX,
  Heart,
  Sliders,
  Moon,
  Mic,
  Download,
  Check,
  Loader2,
  RotateCcw,
  RotateCw,
  Gauge,
  Layers
} from 'lucide-react';
import { useAudio } from '../../context/AudioContext';
import { useData } from '../../context/DataContext';
import { AudioVisualizer } from './AudioVisualizer';
import { SyncedLyricsView } from '../lyrics/SyncedLyricsView';
import { SongDNACard } from './SongDNACard';

export const FullscreenPlayer: React.FC = () => {
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);

  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    togglePlay,
    nextTrack,
    prevTrack,
    seek,
    seekForward,
    seekBackward,
    volume,
    setVolume,
    isMuted,
    toggleMute,
    isShuffle,
    toggleShuffle,
    repeatMode,
    toggleRepeat,
    abRepeat,
    toggleAbLoopStep,
    audioQuality,
    isAiDjEnabled,
    setIsAiDjEnabled,
    sleepTimerMinutes,
    setSleepTimer,
    isFullscreenPlayer,
    setIsFullscreenPlayer,
    setIsEqualizerOpen,
    playbackSpeed,
    setPlaybackSpeed
  } = useAudio();

  const {
    toggleLikeTrack,
    likedTrackIds,
    downloadTrack,
    isTrackDownloaded,
    downloadingTrackIds
  } = useData();

  const [activeTabSub, setActiveTabSub] = useState<'lyrics' | 'visualizer'>('lyrics');
  const [isSleepMenuOpen, setIsSleepMenuOpen] = useState<boolean>(false);

  if (!isFullscreenPlayer || !currentTrack) return null;

  const isLiked = likedTrackIds.includes(currentTrack.id);
  const isDownloaded = isTrackDownloaded(currentTrack.id);
  const isDownloading = downloadingTrackIds.includes(currentTrack.id);

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const sleepOptions = [
    { label: 'Off', val: null },
    { label: '15 Mins', val: 15 },
    { label: '30 Mins', val: 30 },
    { label: '60 Mins', val: 60 }
  ];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: '#07080c',
        zIndex: 110,
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 40px 32px 40px',
        color: '#ffffff',
        animation: 'fadeIn 0.2s ease'
      }}
    >
      {/* Top Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '0.8rem', letterSpacing: '2px', fontWeight: 800, color: '#ef233c' }}>AURA</span>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-subtle)' }}>AUDIOPHILE SYSTEM</span>
        </div>

        {/* Minimal Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', fontFamily: 'monospace' }}>
            FLAC 24-BIT / 192kHz
          </span>

          <button
            onClick={() => setIsEqualizerOpen(true)}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            title="Equalizer"
          >
            <Sliders size={17} />
          </button>

          <button
            onClick={() => setIsFullscreenPlayer(false)}
            style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer' }}
            title="Close"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Main Grid: Left Artwork Anchor, Right Breathing Lyrics */}
      <div
        style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: 'minmax(300px, 380px) 1fr',
          gap: '56px',
          alignItems: 'center',
          minHeight: 0
        }}
      >
        {/* LEFT: Album Artwork & Track Info Anchor */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div
            style={{
              position: 'relative',
              width: '100%',
              aspectRatio: '1',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 24px 60px rgba(0, 0, 0, 0.75)'
            }}
          >
            <img
              src={currentTrack.albumArt}
              alt={currentTrack.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffffff', margin: 0, lineHeight: 1.2 }}>
              {currentTrack.title}
            </h2>
            <div style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 500 }}>
              {currentTrack.artist}
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-subtle)', marginTop: '2px' }}>
              {currentTrack.album || 'Single'} • {currentTrack.genre || 'Music'}
            </div>
          </div>

          {/* Song DNA Analysis Card */}
          <SongDNACard track={currentTrack} compact={true} />
        </div>

        {/* RIGHT: Breathing Lyrics Space */}
        <div style={{ height: '100%', minHeight: 0, display: 'flex', flexDirection: 'column' }}>
          <SyncedLyricsView track={currentTrack} />
        </div>
      </div>

      {/* Bottom Controls Bar inside Fullscreen View */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
        {/* Precise Seekbar with 16px Hit Area */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '16px',
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer'
          }}
        >
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '4px',
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              borderRadius: '2px'
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                bottom: 0,
                width: `${duration ? (currentTime / duration) * 100 : 0}%`,
                backgroundColor: '#ef233c',
                borderRadius: '2px'
              }}
            />
            {abRepeat.start !== null && (
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  left: `${(abRepeat.start / (duration || 1)) * 100}%`,
                  width: `${(Math.max(0, (abRepeat.end !== null ? abRepeat.end : currentTime) - abRepeat.start) / (duration || 1)) * 100}%`,
                  backgroundColor: 'rgba(255, 215, 0, 0.45)',
                  borderLeft: '2px solid #ffd700',
                  borderRight: abRepeat.end !== null ? '2px solid #ffd700' : 'none',
                  borderRadius: '2px',
                  pointerEvents: 'none'
                }}
              />
            )}
          </div>
          <input
            type="range"
            min="0"
            max={duration || 210}
            step="0.1"
            value={currentTime || 0}
            onChange={e => seek(parseFloat(e.target.value))}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              opacity: 0,
              cursor: 'pointer',
              margin: 0
            }}
          />
        </div>

        {/* Controls Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', fontFamily: 'monospace' }}>
            {formatTime(currentTime)}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <button onClick={toggleShuffle} style={{ background: 'none', border: 'none', color: isShuffle ? '#ef233c' : 'var(--text-subtle)', cursor: 'pointer' }} title="Shuffle">
              <Shuffle size={17} />
            </button>
            <button onClick={() => seekBackward(10)} style={{ background: 'none', border: 'none', color: 'var(--text-subtle)', cursor: 'pointer' }} title="Rewind 10s">
              <RotateCcw size={17} />
            </button>
            <button onClick={prevTrack} style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer' }} title="Previous">
              <SkipBack size={21} />
            </button>
            <button
              onClick={togglePlay}
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                backgroundColor: '#ef233c',
                color: '#ffffff',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 6px 20px rgba(239, 35, 60, 0.4)'
              }}
            >
              {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" style={{ marginLeft: '2px' }} />}
            </button>
            <button onClick={nextTrack} style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer' }} title="Next">
              <SkipForward size={21} />
            </button>
            <button onClick={() => seekForward(10)} style={{ background: 'none', border: 'none', color: 'var(--text-subtle)', cursor: 'pointer' }} title="Forward 10s">
              <RotateCw size={17} />
            </button>
            <button
              onClick={toggleRepeat}
              style={{ background: 'none', border: 'none', color: repeatMode !== 'off' ? '#ef233c' : 'var(--text-subtle)', cursor: 'pointer' }}
              title={repeatMode !== 'off' ? '🔁 Loop Active (Song loops endlessly)' : '➡️ Loop Off'}
            >
              <Repeat size={17} />
            </button>
            {/* Professional A-B Loop Button */}
            <button
              onClick={toggleAbLoopStep}
              style={{
                background: abRepeat.active ? 'rgba(239, 35, 60, 0.2)' : abRepeat.start !== null ? 'rgba(255, 215, 0, 0.2)' : 'none',
                border: '1px solid ' + (abRepeat.active ? '#ef233c' : abRepeat.start !== null ? '#ffd700' : 'rgba(255,255,255,0.15)'),
                color: abRepeat.active ? '#ef233c' : abRepeat.start !== null ? '#ffd700' : 'var(--text-subtle)',
                borderRadius: '4px',
                padding: '3px 8px',
                cursor: 'pointer',
                fontSize: '0.74rem',
                fontWeight: 800,
                fontFamily: 'monospace',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                transition: 'all 0.15s ease'
              }}
              title={
                abRepeat.active
                  ? `A-B Loop Active (${abRepeat.start?.toFixed(1)}s ➔ ${abRepeat.end?.toFixed(1)}s). Click to clear.`
                  : abRepeat.start !== null
                  ? `Point A set at ${abRepeat.start.toFixed(1)}s. Click to set Point B (Loop End).`
                  : 'A-B Loop: Click 1 to set Point A, Click 2 to set Point B.'
              }
            >
              {abRepeat.active ? (
                <span>A ── B</span>
              ) : abRepeat.start !== null ? (
                <span>A ── ?</span>
              ) : (
                <span>A-B</span>
              )}
            </button>
            {/* Speed Selector */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: playbackSpeed !== 1.0 ? '#ef233c' : 'var(--text-subtle)',
                  cursor: 'pointer',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '2px'
                }}
                title="Playback Speed"
              >
                <Gauge size={16} />
                <span>{playbackSpeed}x</span>
              </button>

              {showSpeedMenu && (
                <div style={{
                  position: 'absolute',
                  bottom: '36px',
                  right: 0,
                  backgroundColor: '#11131c',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '8px',
                  padding: '6px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.8)',
                  zIndex: 100
                }}>
                  {[0.5, 0.75, 1.0, 1.25, 1.5, 2.0].map(spd => (
                    <button
                      key={spd}
                      onClick={() => { setPlaybackSpeed(spd); setShowSpeedMenu(false); }}
                      style={{
                        background: playbackSpeed === spd ? 'rgba(239,35,60,0.2)' : 'none',
                        color: playbackSpeed === spd ? '#ef233c' : '#ffffff',
                        border: 'none',
                        padding: '4px 12px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        textAlign: 'left'
                      }}
                    >
                      {spd}x
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', fontFamily: 'monospace' }}>
            {formatTime(duration)}
          </div>
        </div>
      </div>
    </div>
  );
};
