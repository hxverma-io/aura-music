import React, { useState } from 'react';
import { X, Plus, Check, Music, ListMusic, Sparkles } from 'lucide-react';
import { Track } from '../../types';
import { useData } from '../../context/DataContext';

interface AddToPlaylistModalProps {
  track: Track | null;
  isOpen: boolean;
  onClose: () => void;
}

export const AddToPlaylistModal: React.FC<AddToPlaylistModalProps> = ({ track, isOpen, onClose }) => {
  const { playlists, addTrackToPlaylist, removeTrackFromPlaylist, setIsCreatePlaylistModalOpen, setToastMessage } = useData();
  const [loadingPlaylistId, setLoadingPlaylistId] = useState<string | null>(null);

  if (!isOpen || !track) return null;

  const handleToggleTrack = async (playlistId: string, playlistTitle: string, isAlreadyIn: boolean) => {
    setLoadingPlaylistId(playlistId);
    try {
      if (isAlreadyIn) {
        await removeTrackFromPlaylist(playlistId, track.id);
        setToastMessage(`Removed "${track.title}" from ${playlistTitle}`);
      } else {
        await addTrackToPlaylist(playlistId, track);
        setToastMessage(`✓ Added "${track.title}" to ${playlistTitle}`);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingPlaylistId(null);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.82)',
        backdropFilter: 'blur(16px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        animation: 'fadeIn 0.2s ease'
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-color-strong)',
          borderRadius: 'var(--radius-xl)',
          width: '100%',
          maxWidth: '460px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 30px rgba(239, 35, 60, 0.15)',
          overflow: 'hidden',
          animation: 'scaleUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff' }}>Add to Playlist</h3>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Select a playlist to save this track
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Track Preview Header */}
        <div style={{ padding: '16px 24px', backgroundColor: 'var(--bg-surface)', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <img
            src={track.albumArt || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80'}
            alt={track.title}
            style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-xs)', objectFit: 'cover', border: '1px solid var(--border-color)' }}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80';
            }}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: '0.94rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {track.title}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {track.artist}
            </div>
          </div>
        </div>

        {/* Playlist Selection List */}
        <div style={{ maxHeight: '280px', overflowY: 'auto', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {playlists.length === 0 ? (
            <div style={{ padding: '30px 16px', textAlign: 'center', color: 'var(--text-subtle)' }}>
              <ListMusic size={32} style={{ opacity: 0.4, marginBottom: '8px' }} />
              <div>No playlists created yet.</div>
            </div>
          ) : (
            playlists.map(pl => {
              const isAlreadyIn = (pl.tracks && pl.tracks.some(t => t.id === track.id)) ||
                (pl.trackIds && pl.trackIds.includes(track.id)) ||
                ((pl as any).track_ids && (pl as any).track_ids.includes(track.id));
              const count = pl.tracks?.length || pl.trackIds?.length || (pl as any).track_ids?.length || 0;

              return (
                <div
                  key={pl.id}
                  onClick={() => handleToggleTrack(pl.id, pl.title, isAlreadyIn)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: isAlreadyIn ? 'rgba(239, 35, 60, 0.12)' : 'transparent',
                    border: '1px solid ' + (isAlreadyIn ? 'var(--color-primary)' : 'transparent'),
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                    <img
                      src={pl.coverArt || (pl as any).cover_art || pl.tracks?.[0]?.albumArt || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80'}
                      alt={pl.title}
                      style={{ width: '38px', height: '38px', borderRadius: 'var(--radius-xs)', objectFit: 'cover' }}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80';
                      }}
                    />
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {pl.title}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {count} songs
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: isAlreadyIn ? 'var(--color-primary)' : 'var(--bg-surface)',
                      border: '1px solid ' + (isAlreadyIn ? 'var(--color-primary)' : 'var(--border-color)'),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff',
                      flexShrink: 0
                    }}
                  >
                    {isAlreadyIn && <Check size={14} />}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Actions */}
        <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            onClick={() => {
              onClose();
              setIsCreatePlaylistModalOpen(true);
            }}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-primary)',
              fontWeight: 700,
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer'
            }}
          >
            <Plus size={16} /> + New Playlist
          </button>

          <button
            onClick={onClose}
            className="btn-play-hero"
            style={{ padding: '8px 22px', fontSize: '0.86rem', backgroundColor: 'var(--color-primary)', color: '#ffffff' }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
