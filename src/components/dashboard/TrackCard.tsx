import React, { useState } from 'react';
import { Play, Pause, Heart, Plus, Download, Check, Loader2 } from 'lucide-react';
import { Track } from '../../types';
import { useAudio } from '../../context/AudioContext';
import { useData } from '../../context/DataContext';

interface TrackCardProps {
  track: Track;
  trackList?: Track[];
}

export const TrackCard: React.FC<TrackCardProps> = ({ track, trackList }) => {
  const { currentTrack, isPlaying, playTrack, togglePlay } = useAudio();
  const {
    toggleLikeTrack,
    likedTrackIds,
    playlists,
    addTrackToPlaylist,
    setIsCreatePlaylistModalOpen,
    openArtistPage,
    downloadTrack,
    isTrackDownloaded,
    downloadingTrackIds,
    openAddToPlaylistModal
  } = useData();

  const [showPlaylistMenu, setShowPlaylistMenu] = useState<boolean>(false);
  const [addedToast, setAddedToast] = useState<string>('');

  const isCurrentPlaying = currentTrack?.id === track.id && isPlaying;
  const isLiked = likedTrackIds.includes(track.id);
  const isDownloaded = isTrackDownloaded(track.id);
  const isDownloading = downloadingTrackIds.includes(track.id);

  const handleCardClick = () => {
    if (currentTrack?.id === track.id) {
      togglePlay();
    } else {
      playTrack(track, trackList);
    }
  };

  const handleAddToPlaylist = async (playlistId: string, playlistTitle: string) => {
    await addTrackToPlaylist(playlistId, track);
    setShowPlaylistMenu(false);
    setAddedToast(`Added to ${playlistTitle}`);
    setTimeout(() => setAddedToast(''), 2000);
  };

  return (
    <div className="music-card" onClick={handleCardClick}>
      <img
        src={track.albumArt || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80'}
        alt={track.title}
        className="card-bg-img"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80';
        }}
      />
      <div className="card-gradient-overlay" />

      {/* Top Actions: Download, Add to Playlist & Like */}
      <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', gap: '6px', zIndex: 3 }}>
        {/* 1-Click Audio Download Button */}
        <button
          className={`card-like-btn ${isDownloaded ? 'liked' : ''}`}
          onClick={e => {
            e.stopPropagation();
            downloadTrack(track);
          }}
          disabled={isDownloading}
          title={isDownloaded ? 'Downloaded to Device (Click to re-download)' : 'Download Audio to Device'}
        >
          {isDownloading ? (
            <Loader2 size={13} className="spin" />
          ) : isDownloaded ? (
            <Check size={13} color="var(--color-primary)" />
          ) : (
            <Download size={13} />
          )}
        </button>

        {/* Add to Playlist Modal Trigger */}
        <button
          className="card-like-btn"
          onClick={e => {
            e.stopPropagation();
            openAddToPlaylistModal(track);
          }}
          title="Add to Playlist"
        >
          <Plus size={14} />
        </button>

        {/* Like */}
        <button
          className={`card-like-btn ${isLiked ? 'liked' : ''}`}
          onClick={e => {
            e.stopPropagation();
            toggleLikeTrack(track);
          }}
          title={isLiked ? 'Unlike' : 'Like'}
        >
          <Heart size={14} fill={isLiked ? 'var(--color-primary)' : 'none'} color={isLiked ? 'var(--color-primary)' : '#ffffff'} />
        </button>
      </div>

      {/* Add to Playlist Dropdown Menu */}
      {showPlaylistMenu && (
        <div
          onClick={e => e.stopPropagation()}
          style={{
            position: 'absolute',
            top: '44px',
            right: '10px',
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color-strong)',
            borderRadius: 'var(--radius-md)',
            padding: '8px',
            width: '190px',
            boxShadow: 'var(--shadow-lg)',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            gap: '4px'
          }}
        >
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-subtle)', textTransform: 'uppercase', padding: '4px 8px' }}>
            Add to Playlist
          </div>
          {playlists.length === 0 ? (
            <button
              onClick={() => {
                setShowPlaylistMenu(false);
                setIsCreatePlaylistModalOpen(true);
              }}
              style={{ padding: '6px 8px', background: 'none', border: 'none', color: 'var(--color-primary)', fontSize: '0.78rem', textAlign: 'left', cursor: 'pointer', fontWeight: 600 }}
            >
              + Create New Playlist
            </button>
          ) : (
            playlists.map(pl => (
              <button
                key={pl.id}
                onClick={() => handleAddToPlaylist(pl.id, pl.title)}
                style={{
                  padding: '6px 8px',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-main)',
                  fontSize: '0.78rem',
                  textAlign: 'left',
                  cursor: 'pointer',
                  borderRadius: 'var(--radius-xs)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {pl.title}
              </button>
            ))
          )}
        </div>
      )}

      {/* Added feedback pill */}
      {addedToast && (
        <div
          style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            backgroundColor: 'var(--color-primary)',
            color: '#ffffff',
            padding: '4px 10px',
            borderRadius: 'var(--radius-pill)',
            fontSize: '0.74rem',
            fontWeight: 700,
            zIndex: 3
          }}
        >
          ✓ {addedToast}
        </div>
      )}

      {/* Track Details */}
      <div className="card-details">
        <div className="card-title" title={track.title}>
          {track.title}
        </div>
        <div
          className="card-subtext"
          style={{ cursor: 'pointer' }}
          onClick={e => {
            e.stopPropagation();
            openArtistPage({ id: track.artistId || track.artist, name: track.artist, avatar: track.albumArt });
          }}
          title={`View ${track.artist}`}
        >
          {track.year || 2024} • <span style={{ textDecoration: 'underline' }}>{track.artist}</span>
        </div>
      </div>

      {/* Red Circular Play Button */}
      <button
        className="card-play-btn"
        onClick={e => {
          e.stopPropagation();
          handleCardClick();
        }}
        aria-label="Play track"
      >
        {isCurrentPlaying ? (
          <Pause size={17} fill="currentColor" />
        ) : (
          <Play size={17} fill="currentColor" style={{ marginLeft: '2px' }} />
        )}
      </button>
    </div>
  );
};
