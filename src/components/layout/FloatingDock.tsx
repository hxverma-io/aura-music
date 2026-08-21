import React from 'react';
import {
  Home,
  Heart,
  Download,
  Bell,
  Radio,
  Sliders,
  Sparkles,
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
  Check,
  Loader2
} from 'lucide-react';
import { useAudio } from '../../context/AudioContext';
import { useData } from '../../context/DataContext';
import { ActiveTab } from '../../types';

export const FloatingDock: React.FC = () => {
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
    setIsFullscreenPlayer,
    setIsEqualizerOpen,
    setIsQueueOpen,
    isQueueOpen,
    isEqualizerOpen
  } = useAudio();

  const {
    activeTab,
    setActiveTab,
    setSelectedPlaylist,
    setSelectedArtist,
    downloadTrack,
    isTrackDownloaded,
    downloadingTrackIds,
    toastMessage,
    toggleLikeTrack,
    likedTrackIds
  } = useData();

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleTab = (tab: ActiveTab) => {
    setSelectedPlaylist(null);
    setSelectedArtist(null);
    setActiveTab(tab);
  };

  const isDownloaded = currentTrack ? isTrackDownloaded(currentTrack.id) : false;
  const isDownloading = currentTrack ? downloadingTrackIds.includes(currentTrack.id) : false;
  const isLiked = currentTrack ? likedTrackIds.includes(currentTrack.id) : false;

  return (
    <>
      {/* Toast Alert Notification */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            bottom: '92px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'rgba(20, 22, 28, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid var(--color-primary)',
            color: '#ffffff',
            padding: '10px 20px',
            borderRadius: 'var(--radius-pill)',
            fontSize: '0.86rem',
            fontWeight: 700,
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.6), 0 0 20px var(--color-primary-glow)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            animation: 'slideUp 0.25s ease'
          }}
        >
          {toastMessage}
        </div>
      )}

      <div className="floating-bottom-dock">
        {/* Dock Navigation Icons */}
        <button
          className={`dock-icon-btn ${activeTab === 'home' ? 'active-red' : ''}`}
          onClick={() => handleTab('home')}
          title="Home"
          aria-label="Home"
        >
          <Home size={20} />
        </button>

        <button
          className={`dock-icon-btn ${activeTab === 'favorites' ? 'active-red' : ''}`}
          onClick={() => handleTab('favorites')}
          title="Liked Songs"
          aria-label="Favorites"
        >
          <Heart size={20} fill={activeTab === 'favorites' ? 'currentColor' : 'none'} />
        </button>

        <button
          className={`dock-icon-btn ${activeTab === 'playlists' ? 'active-red' : ''}`}
          onClick={() => handleTab('playlists')}
          title="Playlists & Downloads"
          aria-label="Playlists"
        >
          <ListMusic size={20} />
        </button>

        <button
          className={`dock-icon-btn ${activeTab === 'ai-chat' ? 'active-red' : ''}`}
          onClick={() => handleTab('ai-chat')}
          title="AI Assistant"
          aria-label="AI Assistant"
        >
          <Sparkles size={20} />
        </button>

        <button
          className={`dock-icon-btn ${isEqualizerOpen ? 'active-red' : ''}`}
          onClick={() => setIsEqualizerOpen(!isEqualizerOpen)}
          title="Equalizer"
          aria-label="Equalizer"
        >
          <Sliders size={20} />
        </button>

        <div className="dock-divider" />

        {/* Mini Player Controls inside Dock */}
        {currentTrack ? (
          <div className="dock-player-preview">
            <img
              src={currentTrack.albumArt || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80'}
              alt={currentTrack.title}
              className="dock-player-thumb"
              style={{ cursor: 'pointer' }}
              onClick={() => setIsFullscreenPlayer(true)}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80';
              }}
            />

            <div
              className="dock-player-meta"
              style={{ cursor: 'pointer' }}
              onClick={() => setIsFullscreenPlayer(true)}
            >
              <div className="dock-player-title" title={currentTrack.title}>{currentTrack.title}</div>
              <div className="dock-player-artist">{currentTrack.artist}</div>
            </div>

            <div className="dock-player-controls">
              {/* Like current track */}
              <button
                onClick={() => toggleLikeTrack(currentTrack)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: isLiked ? 'var(--color-primary)' : 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '4px'
                }}
                title={isLiked ? 'Unlike' : 'Like'}
              >
                <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} />
              </button>

              {/* Download Current Track */}
              <button
                onClick={() => downloadTrack(currentTrack)}
                disabled={isDownloading}
                style={{
                  background: 'none',
                  border: 'none',
                  color: isDownloaded ? 'var(--color-primary)' : 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '4px'
                }}
                title={isDownloaded ? 'Downloaded to Device (Click to re-download)' : 'Download Audio to Device'}
              >
                {isDownloading ? <Loader2 size={16} className="spin" /> : isDownloaded ? <Check size={16} /> : <Download size={16} />}
              </button>

              {/* Shuffle */}
              <button
                onClick={toggleShuffle}
                style={{
                  background: 'none',
                  border: 'none',
                  color: isShuffle ? 'var(--color-primary)' : 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '4px'
                }}
                title={isShuffle ? 'Shuffle On' : 'Shuffle Off'}
              >
                <Shuffle size={16} />
              </button>

              {/* Prev Track */}
              <button
                onClick={prevTrack}
                style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer', padding: '4px' }}
                title="Previous"
              >
                <SkipBack size={18} />
              </button>

              {/* Play/Pause Button */}
              <button
                className="dock-play-toggle-btn"
                onClick={togglePlay}
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause size={17} fill="currentColor" /> : <Play size={17} fill="currentColor" />}
              </button>

              {/* Next Track */}
              <button
                onClick={nextTrack}
                style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer', padding: '4px' }}
                title="Next"
              >
                <SkipForward size={18} />
              </button>

              {/* Repeat Button */}
              <button
                onClick={toggleRepeat}
                style={{
                  background: 'none',
                  border: 'none',
                  color: repeatMode !== 'off' ? 'var(--color-primary)' : 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '4px',
                  position: 'relative'
                }}
                title={`Repeat: ${repeatMode === 'off' ? 'Off' : (repeatMode === 'all' ? 'All Songs' : 'Current Song')}`}
              >
                {repeatMode === 'one' ? <Repeat1 size={17} /> : <Repeat size={17} />}
              </button>
            </div>

            {/* Seekbar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '6px' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', minWidth: '28px' }}>
                {formatTime(currentTime)}
              </span>
              <input
                type="range"
                min="0"
                max={duration || 210}
                value={currentTime || 0}
                onChange={e => seek(parseFloat(e.target.value))}
                style={{
                  width: '100px',
                  height: '4px',
                  accentColor: 'var(--color-primary)',
                  cursor: 'pointer'
                }}
              />
              <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', minWidth: '28px' }}>
                {formatTime(duration)}
              </span>
            </div>

            {/* Volume Control */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginLeft: '6px' }}>
              <button
                onClick={toggleMute}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
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
                  width: '55px',
                  height: '4px',
                  accentColor: 'var(--color-primary)',
                  cursor: 'pointer'
                }}
              />
            </div>

            {/* Queue Drawer Toggle */}
            <button
              onClick={() => setIsQueueOpen(!isQueueOpen)}
              style={{
                background: 'none',
                border: 'none',
                color: isQueueOpen ? 'var(--color-primary)' : 'var(--text-muted)',
                cursor: 'pointer',
                marginLeft: '4px'
              }}
              title="Queue"
            >
              <ListMusic size={17} />
            </button>

            {/* Fullscreen Expand */}
            <button
              onClick={() => setIsFullscreenPlayer(true)}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginLeft: '2px' }}
              title="Fullscreen Player"
            >
              <Maximize2 size={16} />
            </button>
          </div>
        ) : (
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', padding: '0 12px' }}>
            Select any song to start listening with sound
          </div>
        )}
      </div>
    </>
  );
};
