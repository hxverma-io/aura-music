import React, { useState } from 'react';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Shuffle,
  Repeat,
  Repeat1,
  Maximize2,
  ListMusic,
  Heart,
  Sliders,
  RotateCcw,
  RotateCw,
  Clock,
  Gauge,
  Layers
} from 'lucide-react';
import { useAudio } from '../../context/AudioContext';
import { useData } from '../../context/DataContext';

export const FloatingDock: React.FC<{
  onOpenMultiRoom?: () => void;
  onOpenPhoneRemote?: () => void;
  onOpenShortcuts?: () => void;
}> = ({ onOpenMultiRoom, onOpenPhoneRemote, onOpenShortcuts }) => {
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [showSleepMenu, setShowSleepMenu] = useState(false);

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
    setIsFullscreenPlayer,
    setIsEqualizerOpen,
    setIsQueueOpen,
    isQueueOpen,
    isEqualizerOpen,
    playbackSpeed,
    setPlaybackSpeed,
    sleepTimerMinutes,
    setSleepTimer
  } = useAudio();

  const {
    toggleLikeTrack,
    likedTrackIds,
    downloadTrack,
    isTrackDownloaded,
    downloadingTrackIds,
    toastMessage
  } = useData();

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const isLiked = currentTrack ? likedTrackIds.includes(currentTrack.id) : false;
  const isDownloaded = currentTrack ? isTrackDownloaded(currentTrack.id) : false;
  const isDownloading = currentTrack ? downloadingTrackIds.includes(currentTrack.id) : false;

  return (
    <>
      {/* Toast Alert Notification */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            bottom: '90px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#11131c',
            border: '1px solid rgba(239, 35, 60, 0.4)',
            color: '#ffffff',
            padding: '8px 18px',
            borderRadius: '8px',
            fontSize: '0.84rem',
            fontWeight: 600,
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            zIndex: 1000,
            animation: 'slideUp 0.2s ease'
          }}
        >
          {toastMessage}
        </div>
      )}

      {/* Persistent Full-Width Audiophile Player Bar */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: '82px',
          backgroundColor: '#0a0b10',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 90,
          boxShadow: '0 -8px 30px rgba(0,0,0,0.6)'
        }}
      >
        {/* Continuous Ultra-Fluid Seekbar with 14px Hit Target */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '14px',
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            marginTop: '-6px'
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

        {/* Player Controls Inner Content */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 24px'
          }}
        >
          {/* Left: Track Information */}
          {currentTrack ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: '220px', maxWidth: '30%' }}>
              <img
                src={currentTrack.albumArt}
                alt={currentTrack.title}
                onClick={() => setIsFullscreenPlayer(true)}
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '6px',
                  objectFit: 'cover',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.4)'
                }}
              />

              <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, cursor: 'pointer' }} onClick={() => setIsFullscreenPlayer(true)}>
                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {currentTrack.title}
                </span>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {currentTrack.artist}
                </span>
              </div>

              <button
                onClick={() => toggleLikeTrack(currentTrack)}
                style={{ background: 'none', border: 'none', color: isLiked ? '#ef233c' : 'var(--text-subtle)', cursor: 'pointer', padding: '4px', marginLeft: '6px' }}
                title={isLiked ? 'Unlike' : 'Like'}
              >
                <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} />
              </button>
            </div>
          ) : (
            <div style={{ fontSize: '0.85rem', color: 'var(--text-subtle)' }}>
              No track playing
            </div>
          )}

          {/* Center: Playback Controls Hierarchy */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
              {/* Shuffle */}
              <button
                onClick={toggleShuffle}
                style={{ background: 'none', border: 'none', color: isShuffle ? '#ef233c' : 'var(--text-subtle)', cursor: 'pointer' }}
                title="Shuffle"
              >
                <Shuffle size={16} />
              </button>

              {/* 10s Backward */}
              <button
                onClick={() => seekBackward(10)}
                style={{ background: 'none', border: 'none', color: 'var(--text-subtle)', cursor: 'pointer' }}
                title="Rewind 10 seconds"
              >
                <RotateCcw size={15} />
              </button>

              {/* Previous */}
              <button
                onClick={prevTrack}
                style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer' }}
                title="Previous"
              >
                <SkipBack size={19} />
              </button>

              {/* Focal Play/Pause Button */}
              <button
                onClick={togglePlay}
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  backgroundColor: '#ef233c',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(239, 35, 60, 0.4)',
                  transition: 'transform 0.15s ease'
                }}
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" style={{ marginLeft: '2px' }} />}
              </button>

              {/* Next */}
              <button
                onClick={nextTrack}
                style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer' }}
                title="Next"
              >
                <SkipForward size={19} />
              </button>

              {/* 10s Forward */}
              <button
                onClick={() => seekForward(10)}
                style={{ background: 'none', border: 'none', color: 'var(--text-subtle)', cursor: 'pointer' }}
                title="Forward 10 seconds"
              >
                <RotateCw size={15} />
              </button>

              {/* Repeat / Replay Mode Button */}
              <button
                onClick={toggleRepeat}
                style={{
                  background: 'none',
                  border: 'none',
                  color: repeatMode !== 'off' ? '#ef233c' : 'var(--text-subtle)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center'
                }}
                title={repeatMode !== 'off' ? '🔁 Loop Active (Song loops endlessly)' : '➡️ Loop Off'}
              >
                <Repeat size={16} />
              </button>

              {/* Professional A-B Loop / Custom Range Loop Button */}
              <button
                onClick={toggleAbLoopStep}
                style={{
                  background: abRepeat.active ? 'rgba(239, 35, 60, 0.2)' : abRepeat.start !== null ? 'rgba(255, 215, 0, 0.2)' : 'none',
                  border: '1px solid ' + (abRepeat.active ? '#ef233c' : abRepeat.start !== null ? '#ffd700' : 'rgba(255,255,255,0.15)'),
                  color: abRepeat.active ? '#ef233c' : abRepeat.start !== null ? '#ffd700' : 'var(--text-subtle)',
                  borderRadius: '4px',
                  padding: '2px 6px',
                  cursor: 'pointer',
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  fontFamily: 'monospace',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '3px',
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
            </div>

            {/* Time Indicators */}
            <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', fontFamily: 'monospace' }}>
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>

          {/* Right: Secondary Controls (Speed, Sleep Timer, Volume, Queue, EQ, Fullscreen) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: '220px', justifyContent: 'flex-end' }}>
            {/* Playback Speed Selector */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: playbackSpeed !== 1.0 ? '#ef233c' : 'var(--text-subtle)',
                  cursor: 'pointer',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '2px'
                }}
                title="Playback Speed"
              >
                <Gauge size={15} />
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

            {/* Sleep Timer Menu */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowSleepMenu(!showSleepMenu)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: sleepTimerMinutes !== null ? '#ef233c' : 'var(--text-subtle)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '2px'
                }}
                title="Sleep Timer"
              >
                <Clock size={15} />
                {sleepTimerMinutes !== null && (
                  <span style={{ fontSize: '0.68rem', fontWeight: 800 }}>{sleepTimerMinutes}m</span>
                )}
              </button>

              {showSleepMenu && (
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
                  {[
                    { label: 'Off', val: null },
                    { label: '15 mins', val: 15 },
                    { label: '30 mins', val: 30 },
                    { label: '45 mins', val: 45 },
                    { label: '60 mins', val: 60 }
                  ].map(opt => (
                    <button
                      key={opt.label}
                      onClick={() => { setSleepTimer(opt.val); setShowSleepMenu(false); }}
                      style={{
                        background: sleepTimerMinutes === opt.val ? 'rgba(239,35,60,0.2)' : 'none',
                        color: sleepTimerMinutes === opt.val ? '#ef233c' : '#ffffff',
                        border: 'none',
                        padding: '4px 12px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        textAlign: 'left'
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Equalizer Toggle */}
            <button
              onClick={() => setIsEqualizerOpen(!isEqualizerOpen)}
              style={{ background: 'none', border: 'none', color: isEqualizerOpen ? '#ef233c' : 'var(--text-subtle)', cursor: 'pointer' }}
              title="Equalizer"
            >
              <Sliders size={16} />
            </button>

            {/* Queue Toggle */}
            <button
              onClick={() => setIsQueueOpen(!isQueueOpen)}
              style={{ background: 'none', border: 'none', color: isQueueOpen ? '#ef233c' : 'var(--text-subtle)', cursor: 'pointer' }}
              title="Queue"
            >
              <ListMusic size={17} />
            </button>

            {/* Volume Control Slider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button
                onClick={toggleMute}
                style={{ background: 'none', border: 'none', color: 'var(--text-subtle)', cursor: 'pointer' }}
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={e => setVolume(parseFloat(e.target.value))}
                style={{
                  width: '60px',
                  height: '3px',
                  accentColor: '#ef233c',
                  cursor: 'pointer'
                }}
              />
            </div>

            {/* Fullscreen Expand */}
            <button
              onClick={() => setIsFullscreenPlayer(true)}
              style={{ background: 'none', border: 'none', color: 'var(--text-subtle)', cursor: 'pointer' }}
              title="Fullscreen Audiophile View"
            >
              <Maximize2 size={15} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
