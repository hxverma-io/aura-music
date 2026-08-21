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
  Sparkles,
  Download,
  Check,
  Loader2
} from 'lucide-react';
import { useAudio } from '../../context/AudioContext';
import { useData } from '../../context/DataContext';
import { AudioVisualizer } from './AudioVisualizer';

export const FullscreenPlayer: React.FC = () => {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    togglePlay,
    nextTrack,
    prevTrack,
    seek,
    volume,
    setVolume,
    isMuted,
    toggleMute,
    isShuffle,
    toggleShuffle,
    repeatMode,
    toggleRepeat,
    audioQuality,
    sleepTimerMinutes,
    setSleepTimer,
    activeLyricsIndex,
    isFullscreenPlayer,
    setIsFullscreenPlayer,
    setIsEqualizerOpen
  } = useAudio();

  const {
    toggleLikeTrack,
    likedTrackIds,
    setActiveTab,
    downloadTrack,
    isTrackDownloaded,
    downloadingTrackIds
  } = useData();

  const [activeTabSub, setActiveTabSub] = useState<'visualizer' | 'lyrics'>('lyrics');
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
    { label: '15 Minutes', val: 15 },
    { label: '30 Minutes', val: 30 },
    { label: '45 Minutes', val: 45 },
    { label: '60 Minutes', val: 60 }
  ];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(8, 9, 13, 0.97)',
        backdropFilter: 'blur(30px)',
        zIndex: 110,
        display: 'flex',
        flexDirection: 'column',
        padding: '32px 48px',
        color: '#ffffff',
        animation: 'fadeIn 0.25s ease'
      }}
    >
      {/* Top Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--color-primary)', fontWeight: 700 }}>
            Playing from Aura Studio
          </div>
          <span style={{ color: 'var(--border-color-strong)' }}>•</span>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{currentTrack.album || 'Single'}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {/* 1-Click Download Button */}
          <button
            className="icon-circle-btn"
            onClick={() => downloadTrack(currentTrack)}
            disabled={isDownloading}
            title={isDownloaded ? 'Downloaded to Device (Click to re-download)' : 'Download Audio to Device'}
            style={{ color: isDownloaded ? 'var(--color-primary)' : '#ffffff' }}
          >
            {isDownloading ? <Loader2 size={18} className="spin" /> : isDownloaded ? <Check size={18} /> : <Download size={18} />}
          </button>

          {/* Quality Tag */}
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              padding: '4px 10px',
              borderRadius: 'var(--radius-pill)',
              backgroundColor: 'rgba(239, 35, 60, 0.15)',
              border: '1px solid var(--color-primary)',
              color: 'var(--color-primary)'
            }}
          >
            {audioQuality.toUpperCase()} 24-BIT FLAC
          </span>

          {/* Equalizer */}
          <button
            className="icon-circle-btn"
            onClick={() => setIsEqualizerOpen(true)}
            title="Equalizer"
          >
            <Sliders size={18} />
          </button>

          {/* Sleep Timer */}
          <div style={{ position: 'relative' }}>
            <button
              className="icon-circle-btn"
              onClick={() => setIsSleepMenuOpen(!isSleepMenuOpen)}
              title="Sleep Timer"
              style={{ color: sleepTimerMinutes ? 'var(--color-primary)' : 'inherit' }}
            >
              <Moon size={18} />
            </button>
            {isSleepMenuOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: '48px',
                  right: 0,
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-color-strong)',
                  borderRadius: 'var(--radius-md)',
                  padding: '8px',
                  width: '150px',
                  boxShadow: 'var(--shadow-lg)',
                  zIndex: 120
                }}
              >
                {sleepOptions.map(opt => (
                  <button
                    key={opt.label}
                    onClick={() => {
                      setSleepTimer(opt.val);
                      setIsSleepMenuOpen(false);
                    }}
                    style={{
                      display: 'block',
                      width: '100%',
                      textAlign: 'left',
                      padding: '8px 12px',
                      background: sleepTimerMinutes === opt.val ? 'var(--color-primary)' : 'transparent',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: 'var(--radius-xs)',
                      cursor: 'pointer',
                      fontSize: '0.84rem'
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Close button */}
          <button
            className="icon-circle-btn"
            onClick={() => setIsFullscreenPlayer(false)}
            aria-label="Close fullscreen"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Main Player Core */}
      <div
        style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: 'minmax(320px, 450px) 1fr',
          gap: '50px',
          alignItems: 'center',
          minHeight: 0
        }}
      >
        {/* Left: Album Artwork & Spectrum */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
          <div
            style={{
              position: 'relative',
              width: '320px',
              height: '320px',
              borderRadius: 'var(--radius-xl)',
              overflow: 'hidden',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8), 0 0 35px var(--color-primary-glow)',
              border: '2px solid rgba(255, 255, 255, 0.12)'
            }}
          >
            <img
              src={currentTrack.albumArt || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80'}
              alt={currentTrack.title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80';
              }}
            />
          </div>

          <AudioVisualizer isPlaying={isPlaying} type="bars" width={320} height={50} />
        </div>

        {/* Right: Synced Lyrics or Dynamic Visualizer */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-xl)',
            padding: '24px 32px',
            overflow: 'hidden'
          }}
        >
          {/* Sub Header Switcher */}
          <div style={{ display: 'flex', gap: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '14px', marginBottom: '20px' }}>
            <button
              onClick={() => setActiveTabSub('lyrics')}
              style={{
                background: 'none',
                border: 'none',
                color: activeTabSub === 'lyrics' ? 'var(--color-primary)' : 'var(--text-muted)',
                fontWeight: 700,
                fontSize: '1rem',
                cursor: 'pointer',
                borderBottom: activeTabSub === 'lyrics' ? '2px solid var(--color-primary)' : 'none',
                paddingBottom: '4px'
              }}
            >
              Synchronized Lyrics
            </button>
            <button
              onClick={() => setActiveTabSub('visualizer')}
              style={{
                background: 'none',
                border: 'none',
                color: activeTabSub === 'visualizer' ? 'var(--color-primary)' : 'var(--text-muted)',
                fontWeight: 700,
                fontSize: '1rem',
                cursor: 'pointer',
                borderBottom: activeTabSub === 'visualizer' ? '2px solid var(--color-primary)' : 'none',
                paddingBottom: '4px'
              }}
            >
              Waveform Visualizer
            </button>
          </div>

          {activeTabSub === 'lyrics' ? (
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                paddingRight: '12px'
              }}
            >
              {currentTrack.lyrics && currentTrack.lyrics.length > 0 ? (
                currentTrack.lyrics.map((line, idx) => {
                  const isActive = idx === activeLyricsIndex;
                  const cleanText = line.replace(/\[\d+:\d+\]\s*/, '');
                  return (
                    <div
                      key={idx}
                      style={{
                        fontSize: isActive ? '1.5rem' : '1.15rem',
                        fontWeight: isActive ? 800 : 500,
                        color: isActive ? '#ffffff' : 'var(--text-subtle)',
                        textShadow: isActive ? '0 0 20px var(--color-primary)' : 'none',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer'
                      }}
                      onClick={() => {
                        const match = line.match(/\[(\d+):(\d+)\]/);
                        if (match) {
                          seek(parseInt(match[1]) * 60 + parseInt(match[2]));
                        }
                      }}
                    >
                      {cleanText}
                    </div>
                  );
                })
              ) : (
                <div style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: '40px' }}>
                  High-Fidelity 256kbps Direct Audio Stream • Synchronized Acoustic Flow
                </div>
              )}
            </div>
          ) : (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
              <AudioVisualizer isPlaying={isPlaying} type="wave" width={550} height={180} />
              <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Spatial Stereo Processing • 48 kHz High Precision Audio
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Controls */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '1.7rem', fontWeight: 800 }}>{currentTrack.title}</h2>
            <div style={{ fontSize: '1rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              {currentTrack.artist} • {currentTrack.genre} • {currentTrack.mood} Mode
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              className="icon-circle-btn"
              onClick={() => toggleLikeTrack(currentTrack)}
              style={{ color: isLiked ? 'var(--color-primary)' : '#ffffff' }}
            >
              <Heart size={20} fill={isLiked ? 'currentColor' : 'none'} />
            </button>
            <button
              className="icon-circle-btn"
              onClick={() => {
                setIsFullscreenPlayer(false);
                setActiveTab('ai-chat');
              }}
              title="Ask AI about this song"
            >
              <Sparkles size={20} color="var(--color-primary)" />
            </button>
          </div>
        </div>

        {/* Seekbar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', minWidth: '40px' }}>
            {formatTime(currentTime)}
          </span>
          <input
            type="range"
            min="0"
            max={duration || 100}
            value={currentTime || 0}
            onChange={e => seek(parseFloat(e.target.value))}
            style={{
              flex: 1,
              height: '6px',
              accentColor: 'var(--color-primary)',
              cursor: 'pointer'
            }}
          />
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', minWidth: '40px' }}>
            {formatTime(duration)}
          </span>
        </div>

        {/* Control Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '14px' }}>
            <button
              onClick={toggleShuffle}
              style={{
                background: 'none',
                border: 'none',
                color: isShuffle ? 'var(--color-primary)' : 'var(--text-muted)',
                cursor: 'pointer'
              }}
              title="Shuffle"
            >
              <Shuffle size={20} />
            </button>
            <button
              onClick={toggleRepeat}
              style={{
                background: 'none',
                border: 'none',
                color: repeatMode !== 'off' ? 'var(--color-primary)' : 'var(--text-muted)',
                cursor: 'pointer'
              }}
              title={`Repeat: ${repeatMode === 'off' ? 'Off' : (repeatMode === 'all' ? 'All' : 'One')}`}
            >
              {repeatMode === 'one' ? <Repeat1 size={20} /> : <Repeat size={20} />}
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <button
              onClick={prevTrack}
              style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer' }}
            >
              <SkipBack size={26} />
            </button>

            <button
              onClick={togglePlay}
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-primary)',
                color: '#ffffff',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-glow)',
                transition: 'transform 0.15s ease'
              }}
            >
              {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" style={{ marginLeft: '4px' }} />}
            </button>

            <button
              onClick={nextTrack}
              style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer' }}
            >
              <SkipForward size={26} />
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={toggleMute}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={e => setVolume(parseFloat(e.target.value))}
              style={{
                width: '110px',
                height: '5px',
                accentColor: 'var(--color-primary)',
                cursor: 'pointer'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
