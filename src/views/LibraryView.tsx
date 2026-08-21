import React, { useState } from 'react';
import {
  Plus,
  Wand2,
  Heart,
  Download,
  Trash2,
  Play,
  Check,
  HardDrive,
  Sparkles
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { useAudio } from '../context/AudioContext';
import { PlaylistDetail } from '../components/playlist/PlaylistDetail';
import { offlineService } from '../services/offlineService';

export const LibraryView: React.FC = () => {
  const {
    playlists,
    likedTracks,
    downloadedTracks,
    downloadedRecords,
    removeDownloadedTrack,
    artists,
    selectedPlaylist,
    setSelectedPlaylist,
    setIsCreatePlaylistModalOpen,
    setIsAiPlaylistModalOpen,
    openArtistPage
  } = useData();

  const { currentUser } = useAuth();
  const { playTrack } = useAudio();
  const [activeTabSub, setActiveTabSub] = useState<'playlists' | 'liked' | 'downloads' | 'artists'>('playlists');

  if (selectedPlaylist) {
    return (
      <div className="content-body">
        <PlaylistDetail playlist={selectedPlaylist} onBack={() => setSelectedPlaylist(null)} />
      </div>
    );
  }

  const followedArtists = artists.filter(a => currentUser?.followedArtistIds?.includes(a.id));

  // Calculate total offline storage size
  const totalOfflineBytes = downloadedRecords.reduce((acc, r) => acc + (r.sizeBytes || 0), 0);
  const formattedStorage = offlineService.formatBytes(totalOfflineBytes);

  return (
    <div className="content-body">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Your Music Library</h1>
          <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            Playlists, favorites, offline cached audio and personal collections
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            className="btn-secondary-hero"
            onClick={() => setIsAiPlaylistModalOpen(true)}
            style={{ fontSize: '0.85rem', padding: '8px 18px' }}
          >
            <Wand2 size={16} color="var(--color-primary)" /> AI Playlist
          </button>
          <button
            className="btn-play-hero"
            onClick={() => setIsCreatePlaylistModalOpen(true)}
            style={{ fontSize: '0.85rem', padding: '8px 20px', backgroundColor: 'var(--color-primary)', color: '#ffffff' }}
          >
            <Plus size={16} /> New Playlist
          </button>
        </div>
      </div>

      {/* Sub Tabs */}
      <div style={{ display: 'flex', gap: '12px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', overflowX: 'auto' }}>
        <button
          onClick={() => setActiveTabSub('playlists')}
          style={{
            background: 'none',
            border: 'none',
            color: activeTabSub === 'playlists' ? 'var(--color-primary)' : 'var(--text-muted)',
            fontWeight: 700,
            fontSize: '0.95rem',
            cursor: 'pointer',
            borderBottom: activeTabSub === 'playlists' ? '2px solid var(--color-primary)' : 'none',
            paddingBottom: '6px',
            whiteSpace: 'nowrap'
          }}
        >
          All Playlists ({playlists.length})
        </button>

        <button
          onClick={() => setActiveTabSub('downloads')}
          style={{
            background: 'none',
            border: 'none',
            color: activeTabSub === 'downloads' ? 'var(--color-primary)' : 'var(--text-muted)',
            fontWeight: 700,
            fontSize: '0.95rem',
            cursor: 'pointer',
            borderBottom: activeTabSub === 'downloads' ? '2px solid var(--color-primary)' : 'none',
            paddingBottom: '6px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            whiteSpace: 'nowrap'
          }}
        >
          <Download size={16} /> Offline Downloads ({downloadedRecords.length})
        </button>

        <button
          onClick={() => setActiveTabSub('liked')}
          style={{
            background: 'none',
            border: 'none',
            color: activeTabSub === 'liked' ? 'var(--color-primary)' : 'var(--text-muted)',
            fontWeight: 700,
            fontSize: '0.95rem',
            cursor: 'pointer',
            borderBottom: activeTabSub === 'liked' ? '2px solid var(--color-primary)' : 'none',
            paddingBottom: '6px',
            whiteSpace: 'nowrap'
          }}
        >
          Liked Songs ({likedTracks.length})
        </button>

        <button
          onClick={() => setActiveTabSub('artists')}
          style={{
            background: 'none',
            border: 'none',
            color: activeTabSub === 'artists' ? 'var(--color-primary)' : 'var(--text-muted)',
            fontWeight: 700,
            fontSize: '0.95rem',
            cursor: 'pointer',
            borderBottom: activeTabSub === 'artists' ? '2px solid var(--color-primary)' : 'none',
            paddingBottom: '6px',
            whiteSpace: 'nowrap'
          }}
        >
          Followed Artists ({followedArtists.length})
        </button>
      </div>

      {/* Offline Downloads Tab */}
      {activeTabSub === 'downloads' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Storage & Play All Banner */}
          <div
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color-strong)',
              borderRadius: 'var(--radius-xl)',
              padding: '24px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '16px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ padding: '14px', borderRadius: '50%', backgroundColor: 'rgba(239, 35, 60, 0.15)', color: 'var(--color-primary)' }}>
                <HardDrive size={28} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>SimpMusic / Echo In-App Offline Cache</h3>
                <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  {downloadedRecords.length} Songs Cached in IndexedDB • Total Storage: <strong style={{ color: '#ffffff' }}>{formattedStorage}</strong>
                </div>
              </div>
            </div>

            {downloadedTracks.length > 0 && (
              <button
                className="btn-play-hero"
                onClick={() => playTrack(downloadedTracks[0], downloadedTracks)}
                style={{ padding: '10px 24px', backgroundColor: 'var(--color-primary)', color: '#ffffff', fontSize: '0.9rem' }}
              >
                <Play size={16} fill="currentColor" /> Play All Offline
              </button>
            )}
          </div>

          {/* List of Offline Cached Tracks */}
          {downloadedRecords.length === 0 ? (
            <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--text-subtle)' }}>
              <Download size={40} style={{ opacity: 0.3, marginBottom: '12px' }} />
              <div>No downloaded songs found in offline storage.</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                Click the <strong>Download</strong> icon on any song to save it for offline playback & direct device download!
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {downloadedRecords.map((rec, idx) => {
                const track = rec.track;
                return (
                  <div
                    key={rec.id}
                    onClick={() => playTrack(track, downloadedTracks)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      padding: '12px 18px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'var(--bg-card)',
                      border: '1px solid var(--border-color)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-subtle)', width: '20px' }}>
                      {idx + 1}
                    </span>
                    <img
                      src={track.albumArt || 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800&auto=format&fit=crop&q=80'}
                      alt={track.title}
                      style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-xs)', objectFit: 'cover' }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>{track.title}</span>
                        <span style={{ fontSize: '0.68rem', padding: '2px 6px', borderRadius: 'var(--radius-pill)', backgroundColor: 'rgba(239, 35, 60, 0.15)', color: 'var(--color-primary)', fontWeight: 700 }}>
                          OFFLINE CACHED
                        </span>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {track.artist} • {rec.sizeBytes ? offlineService.formatBytes(rec.sizeBytes) : '2.8 MB'}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <button
                        className="continue-play-btn"
                        onClick={e => {
                          e.stopPropagation();
                          playTrack(track, downloadedTracks);
                        }}
                        style={{ color: 'var(--color-primary)' }}
                        title="Play offline"
                      >
                        <Play size={16} fill="currentColor" />
                      </button>

                      <button
                        onClick={e => {
                          e.stopPropagation();
                          removeDownloadedTrack(rec.id);
                        }}
                        style={{ background: 'none', border: 'none', color: 'var(--text-subtle)', cursor: 'pointer', padding: '6px' }}
                        title="Remove from offline cache"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Playlists Tab */}
      {activeTabSub === 'playlists' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
          {/* Liked Songs Special Card */}
          <div
            onClick={() => setActiveTabSub('liked')}
            style={{
              height: '240px',
              borderRadius: 'var(--radius-lg)',
              background: 'linear-gradient(135deg, #ef233c 0%, #7928ca 100%)',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-md)',
              position: 'relative'
            }}
          >
            <div style={{ padding: '12px', borderRadius: '50%', backgroundColor: 'rgba(255, 255, 255, 0.2)', width: 'fit-content' }}>
              <Heart size={28} color="#ffffff" fill="#ffffff" />
            </div>

            <div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff' }}>Liked Songs</h3>
              <p style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.85)', marginTop: '4px' }}>
                {likedTracks.length} auto-saved favorites
              </p>
            </div>
          </div>

          {/* Offline Downloads Special Card */}
          <div
            onClick={() => setActiveTabSub('downloads')}
            style={{
              height: '240px',
              borderRadius: 'var(--radius-lg)',
              background: 'linear-gradient(135deg, #1f232d 0%, #0d0f14 100%)',
              border: '1px solid var(--border-color)',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-md)',
              position: 'relative'
            }}
          >
            <div style={{ padding: '12px', borderRadius: '50%', backgroundColor: 'rgba(239, 35, 60, 0.15)', color: 'var(--color-primary)', width: 'fit-content' }}>
              <Download size={28} />
            </div>

            <div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff' }}>Offline Downloads</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                {downloadedRecords.length} songs saved to device
              </p>
            </div>
          </div>

          {/* Regular Playlists */}
          {playlists.map(pl => {
            const isPinned = pl.isPinned || false;
            const trackCount = pl.tracks?.length || pl.trackIds?.length || (pl as any).track_ids?.length || 0;
            return (
              <div
                key={pl.id}
                onClick={() => setSelectedPlaylist(pl)}
                style={{
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  position: 'relative'
                }}
              >
                {isPinned && (
                  <div style={{ position: 'absolute', top: '12px', right: '12px', zIndex: 2, padding: '4px 8px', borderRadius: 'var(--radius-pill)', backgroundColor: 'var(--color-primary)', color: '#ffffff', fontSize: '0.7rem', fontWeight: 700 }}>
                    PINNED
                  </div>
                )}

                <img
                  src={pl.coverArt || (pl as any).cover_art || pl.tracks?.[0]?.albumArt || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80'}
                  alt={pl.title}
                  style={{ width: '100%', height: '150px', borderRadius: 'var(--radius-md)', objectFit: 'cover' }}
                />

                <div>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {pl.title}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {trackCount} Songs • {pl.creatorName || 'Curator'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Liked Songs List Tab */}
      {activeTabSub === 'liked' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {likedTracks.length === 0 ? (
            <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--text-subtle)' }}>
              You haven't liked any songs yet. Click the heart icon on any track to save it here!
            </div>
          ) : (
            likedTracks.map((track, idx) => (
              <div
                key={track.id || idx}
                onClick={() => playTrack(track, likedTracks)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '12px 18px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  cursor: 'pointer'
                }}
              >
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-subtle)', width: '20px' }}>
                  {idx + 1}
                </span>
                <img
                  src={track.albumArt || 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800&auto=format&fit=crop&q=80'}
                  alt={track.title}
                  style={{ width: '42px', height: '42px', borderRadius: 'var(--radius-xs)', objectFit: 'cover' }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{track.title}</div>
                  <div
                    style={{ fontSize: '0.8rem', color: 'var(--text-muted)', cursor: 'pointer' }}
                    onClick={e => {
                      e.stopPropagation();
                      openArtistPage({ id: track.artistId || track.artist, name: track.artist });
                    }}
                  >
                    {track.artist}
                  </div>
                </div>
                <span style={{ color: 'var(--color-primary)', fontSize: '0.8rem', fontWeight: 600 }}>{track.genre || 'Music'}</span>
              </div>
            ))
          )}
        </div>
      )}

      {/* Followed Artists Tab */}
      {activeTabSub === 'artists' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
          {followedArtists.length === 0 ? (
            <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--text-subtle)', gridColumn: '1 / -1' }}>
              You are not following any artists yet. Explore and follow your favorite artists!
            </div>
          ) : (
            followedArtists.map(artist => (
              <div
                key={artist.id}
                onClick={() => openArtistPage(artist)}
                style={{
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '20px',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer'
                }}
              >
                <img src={artist.avatar} alt={artist.name} style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover' }} />
                <div style={{ fontWeight: 800, fontSize: '1rem' }}>{artist.name}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{artist.genres.join(', ')}</div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
