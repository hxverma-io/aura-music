import React from 'react';
import {
  Play,
  Pause,
  Shuffle,
  Heart,
  Download,
  Check,
  Loader2,
  Trash2,
  Share2,
  Pin,
  Users,
  Clock,
  Plus,
  ArrowLeft
} from 'lucide-react';
import { Playlist, Track } from '../../types';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { useAudio } from '../../context/AudioContext';

interface PlaylistDetailProps {
  playlist: Playlist;
  onBack?: () => void;
}

export const PlaylistDetail: React.FC<PlaylistDetailProps> = ({ playlist, onBack }) => {
  const {
    tracks,
    deletePlaylist,
    removeTrackFromPlaylist,
    togglePinPlaylist,
    reactToPlaylist,
    toggleLikeTrack,
    likedTrackIds,
    openArtistPage,
    downloadTrack,
    isTrackDownloaded,
    downloadingTrackIds
  } = useData();

  const { currentUser } = useAuth();
  const { currentTrack, isPlaying, playTrack, togglePlay } = useAudio();

  // Combine direct playlist tracks with global tracks by ID so songs NEVER disappear
  const playlistTracks: Track[] = (playlist.tracks && playlist.tracks.length > 0)
    ? playlist.tracks
    : tracks.filter(t => (playlist.trackIds || (playlist as any).track_ids || []).includes(t.id));

  const isPinned = playlist.isPinned || false;

  const totalSeconds = playlistTracks.reduce((acc, t) => acc + (t.duration || 210), 0);
  const totalMins = Math.floor(totalSeconds / 60);

  const isCurrentPlaylistPlaying =
    isPlaying && currentTrack && playlistTracks.some(t => t.id === currentTrack.id);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handlePlayAll = (shuffle: boolean = false) => {
    if (playlistTracks.length === 0) return;
    const list = shuffle ? [...playlistTracks].sort(() => Math.random() - 0.5) : playlistTracks;
    playTrack(list[0], list);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Back button */}
      {onBack && (
        <button
          onClick={onBack}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            fontSize: '0.9rem',
            width: 'fit-content'
          }}
        >
          <ArrowLeft size={18} /> Back to Playlists
        </button>
      )}

      {/* Hero Header */}
      <div
        style={{
          display: 'flex',
          gap: '32px',
          alignItems: 'flex-end',
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-xl)',
          padding: '32px',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <img
          src={playlist.coverArt || (playlist as any).cover_art || playlistTracks[0]?.albumArt || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80'}
          alt={playlist.title}
          style={{
            width: '190px',
            height: '190px',
            borderRadius: 'var(--radius-lg)',
            objectFit: 'cover',
            boxShadow: 'var(--shadow-lg)',
            flexShrink: 0
          }}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80';
          }}
        />

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--color-primary)' }}>
            {playlist.isAiGenerated ? '✨ AI Generated Playlist' : (playlist.isCollaborative ? '🤝 Collaborative Playlist' : 'Playlist')}
          </div>

          <h1 style={{ fontSize: '2.3rem', fontWeight: 800, lineHeight: 1.15 }}>{playlist.title}</h1>
          <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)' }}>{playlist.description}</p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.86rem', color: 'var(--text-subtle)', marginTop: '4px' }}>
            <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{playlist.creatorName || (playlist as any).user_id || 'Aura Curator'}</span>
            <span>•</span>
            <span>{playlistTracks.length} Songs</span>
            <span>•</span>
            <span>{totalMins} mins</span>
          </div>

          {/* Social Emoji Reactions Bar */}
          <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
            {['🔥', '❤️', '⚡', '🎧', '✨'].map(emoji => {
              const r = playlist.reactions?.find(item => item.emoji === emoji);
              const count = r ? r.count : 0;
              return (
                <button
                  key={emoji}
                  onClick={() => reactToPlaylist(playlist.id, emoji)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-pill)',
                    backgroundColor: r?.userReacted ? 'rgba(239, 35, 60, 0.2)' : 'var(--bg-surface)',
                    border: '1px solid ' + (r?.userReacted ? 'var(--color-primary)' : 'var(--border-color)'),
                    color: 'var(--text-main)',
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <span>{emoji}</span>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{count}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Action CTA Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button
          className="btn-play-hero"
          style={{ backgroundColor: 'var(--color-primary)', color: '#ffffff' }}
          onClick={() => {
            if (isCurrentPlaylistPlaying) {
              togglePlay();
            } else {
              handlePlayAll(false);
            }
          }}
        >
          {isCurrentPlaylistPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
          <span>{isCurrentPlaylistPlaying ? 'Pause' : 'Play All'}</span>
        </button>

        <button
          className="btn-secondary-hero"
          onClick={() => handlePlayAll(true)}
        >
          <Shuffle size={17} /> Shuffle
        </button>

        <button
          className="icon-circle-btn"
          onClick={() => togglePinPlaylist(playlist.id)}
          title={isPinned ? 'Unpin' : 'Pin to Library'}
          style={{ color: isPinned ? 'var(--color-primary)' : 'inherit' }}
        >
          <Pin size={18} />
        </button>

        {currentUser && (playlist.creatorId === currentUser.id || (playlist as any).user_id === currentUser.id) && (
          <button
            className="icon-circle-btn"
            onClick={async () => {
              if (confirm('Delete this playlist?')) {
                await deletePlaylist(playlist.id);
                if (onBack) onBack();
              }
            }}
            title="Delete Playlist"
            style={{ color: 'var(--color-primary)' }}
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>

      {/* Tracks Table */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {playlistTracks.length === 0 ? (
          <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--text-subtle)' }}>
            This playlist has no tracks yet. Explore songs and click "+ Add to Playlist".
          </div>
        ) : (
          playlistTracks.map((track, index) => {
            const isPlayingThis = currentTrack?.id === track.id && isPlaying;
            const isLiked = likedTrackIds.includes(track.id);
            const isDownloaded = isTrackDownloaded(track.id);
            const isDownloading = downloadingTrackIds.includes(track.id);

            return (
              <div
                key={track.id || index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '12px 18px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: isPlayingThis ? 'rgba(239, 35, 60, 0.08)' : 'var(--bg-card)',
                  border: '1px solid ' + (isPlayingThis ? 'var(--color-primary)' : 'var(--border-color)'),
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)'
                }}
                onClick={() => playTrack(track, playlistTracks)}
              >
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: isPlayingThis ? 'var(--color-primary)' : 'var(--text-subtle)', width: '22px' }}>
                  {index + 1}
                </span>

                <img
                  src={track.albumArt || 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800&auto=format&fit=crop&q=80'}
                  alt={track.title}
                  style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-xs)', objectFit: 'cover' }}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80';
                  }}
                />

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.92rem', fontWeight: 700, color: isPlayingThis ? 'var(--color-primary)' : 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {track.title}
                  </div>
                  <div
                    style={{ fontSize: '0.78rem', color: 'var(--text-muted)', cursor: 'pointer' }}
                    onClick={e => {
                      e.stopPropagation();
                      openArtistPage({ id: track.artistId || track.artist, name: track.artist });
                    }}
                  >
                    {track.artist}
                  </div>
                </div>

                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', minWidth: '140px' }}>
                  {track.album || 'Single'}
                </div>

                {/* 1-Click Download Button */}
                <button
                  onClick={e => {
                    e.stopPropagation();
                    downloadTrack(track);
                  }}
                  disabled={isDownloading}
                  style={{ background: 'none', border: 'none', color: isDownloaded ? 'var(--color-primary)' : 'var(--text-subtle)', cursor: 'pointer' }}
                  title={isDownloaded ? 'Downloaded to Device' : 'Download Audio to Device'}
                >
                  {isDownloading ? <Loader2 size={16} className="spin" /> : isDownloaded ? <Check size={16} /> : <Download size={16} />}
                </button>

                {/* Like */}
                <button
                  onClick={e => {
                    e.stopPropagation();
                    toggleLikeTrack(track);
                  }}
                  style={{ background: 'none', border: 'none', color: isLiked ? 'var(--color-primary)' : 'var(--text-subtle)', cursor: 'pointer' }}
                >
                  <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} />
                </button>

                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', minWidth: '40px', textAlign: 'right' }}>
                  {formatDuration(track.duration || 210)}
                </div>

                {!playlist.id.startsWith('pl-trending') && (
                  <button
                    onClick={async e => {
                      e.stopPropagation();
                      await removeTrackFromPlaylist(playlist.id, track.id);
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-subtle)',
                      cursor: 'pointer',
                      marginLeft: '6px',
                      padding: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 'var(--radius-xs)',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-primary)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-subtle)')}
                    title="Remove song from playlist"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
