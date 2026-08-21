import React, { useState } from 'react';
import { Play } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { useAudio } from '../context/AudioContext';
import { TrackCard } from '../components/dashboard/TrackCard';
import { Genre } from '../types';

export const ExploreView: React.FC = () => {
  const {
    tracks,
    artists,
    searchQuery,
    selectedGenre,
    setSelectedGenre,
    toggleFollowArtist,
    openArtistPage
  } = useData();

  const { currentUser } = useAuth();
  const { playTrack } = useAudio();
  const [activeFilterTab, setActiveFilterTab] = useState<'all' | 'tracks' | 'artists'>('all');

  const genresList: { name: Genre | any; bg: string; icon: string }[] = [
    { name: 'Bollywood', bg: 'linear-gradient(135deg, #f12711 0%, #f5af19 100%)', icon: '🇮🇳' },
    { name: 'Punjabi', bg: 'linear-gradient(135deg, #ef233c 0%, #ff5e62 100%)', icon: '🔥' },
    { name: 'Pop', bg: 'linear-gradient(135deg, #7928ca 0%, #ff0080 100%)', icon: '🇬🇧' },
    { name: 'Synthwave', bg: 'linear-gradient(135deg, #4b6cb7 0%, #182848 100%)', icon: '🌆' },
    { name: 'Lo-Fi', bg: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)', icon: '☕' },
    { name: 'Rock', bg: 'linear-gradient(135deg, #8e2de2 0%, #4a00e0 100%)', icon: '⚡' },
    { name: 'Indie', bg: 'linear-gradient(135deg, #ff9966 0%, #ff5e62 100%)', icon: '🎸' },
    { name: 'Classical', bg: 'linear-gradient(135deg, #654ea3 0%, #eaafc8 100%)', icon: '🎻' }
  ];

  const query = searchQuery.toLowerCase().trim();

  const matchedTracks = tracks.filter(t => {
    const genreMatches = selectedGenre === 'All' || t.genre.toLowerCase() === (selectedGenre as string).toLowerCase();
    if (!genreMatches) return false;
    if (!query) return true;
    return (
      t.title.toLowerCase().includes(query) ||
      t.artist.toLowerCase().includes(query) ||
      t.genre.toLowerCase().includes(query) ||
      t.mood.toLowerCase().includes(query)
    );
  });

  const matchedArtists = artists.filter(a => {
    if (!query) return true;
    return (
      a.name.toLowerCase().includes(query) ||
      (a.genres || []).some(g => g.toLowerCase().includes(query)) ||
      (a.bio || '').toLowerCase().includes(query)
    );
  });

  return (
    <div className="content-body">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Explore & Smart Search</h1>
          <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            Discover Hindi, Punjabi & Global hits, verified artists, genres and soundscapes
          </div>
        </div>

        {/* Sub filter tabs */}
        <div style={{ display: 'flex', gap: '8px', backgroundColor: 'var(--bg-card)', padding: '4px', borderRadius: 'var(--radius-pill)', border: '1px solid var(--border-color)' }}>
          {(['all', 'tracks', 'artists'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveFilterTab(tab)}
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-pill)',
                backgroundColor: activeFilterTab === tab ? 'var(--color-primary)' : 'transparent',
                color: activeFilterTab === tab ? '#ffffff' : 'var(--text-muted)',
                border: 'none',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer',
                textTransform: 'capitalize'
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Genre Exploration Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <h2 className="section-title">Explore by Genre</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '14px' }}>
          {genresList.map(g => {
            const isSelected = selectedGenre === g.name;
            return (
              <div
                key={g.name}
                onClick={() => setSelectedGenre(isSelected ? 'All' : g.name)}
                style={{
                  height: '95px',
                  borderRadius: 'var(--radius-md)',
                  background: g.bg,
                  padding: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  boxShadow: 'var(--shadow-sm)',
                  border: isSelected ? '3px solid #ffffff' : '1px solid rgba(255, 255, 255, 0.1)',
                  transform: isSelected ? 'scale(1.03)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                <span style={{ fontSize: '1.4rem' }}>{g.icon}</span>
                <span style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff' }}>{g.name}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Search results: Tracks */}
      {(activeFilterTab === 'all' || activeFilterTab === 'tracks') && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div className="section-header">
            <h2 className="section-title">Tracks ({matchedTracks.length})</h2>
          </div>

          <div className="cards-slider">
            {matchedTracks.map(track => (
              <TrackCard key={track.id} track={track} trackList={matchedTracks} />
            ))}
          </div>
        </div>
      )}

      {/* Search results: Artists */}
      {(activeFilterTab === 'all' || activeFilterTab === 'artists') && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div className="section-header">
            <h2 className="section-title">Artists ({matchedArtists.length})</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
            {matchedArtists.map(artist => {
              const isFollowed = currentUser?.followedArtistIds?.includes(artist.id);

              return (
                <div
                  key={artist.id}
                  onClick={() => openArtistPage(artist)}
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    gap: '10px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <img
                    src={artist.avatar}
                    alt={artist.name}
                    style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--color-primary)' }}
                  />
                  <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-main)' }}>
                    {artist.name}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    {(artist.genres || []).join(' • ')}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
                    {(artist.monthlyListeners || 2000000).toLocaleString()} monthly listeners
                  </div>

                  <div style={{ display: 'flex', gap: '8px', marginTop: '6px', width: '100%' }}>
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        toggleFollowArtist(artist.id);
                      }}
                      style={{
                        flex: 1,
                        padding: '6px 12px',
                        borderRadius: 'var(--radius-pill)',
                        backgroundColor: isFollowed ? 'var(--bg-elevated)' : 'var(--color-primary)',
                        color: '#ffffff',
                        border: 'none',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      {isFollowed ? 'Following' : '+ Follow'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
