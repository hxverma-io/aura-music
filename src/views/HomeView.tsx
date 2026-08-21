import React from 'react';
import { HeroCarousel } from '../components/dashboard/HeroCarousel';
import { HorizontalTrackSlider } from '../components/dashboard/HorizontalTrackSlider';
import { TrackCard } from '../components/dashboard/TrackCard';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { aiMusicService } from '../services/aiService';
import { Sparkles, Wand2, Compass, Flame, Heart } from 'lucide-react';
import { Mood } from '../types';

export const HomeView: React.FC = () => {
  const {
    tracks,
    playlists,
    selectedMood,
    setSelectedMood,
    selectedGenre,
    setSelectedGenre,
    setSelectedPlaylist,
    setActiveTab,
    setIsAiPlaylistModalOpen
  } = useData();

  const { currentUser } = useAuth();

  // Personalized recommendations computed by AI service
  const aiRecommendations = React.useMemo(() => {
    return aiMusicService.getPersonalizedRecommendations(currentUser, tracks, 6);
  }, [currentUser, tracks]);

  // Filtered tracks based on current top pills
  const filteredTracks = React.useMemo(() => {
    return tracks.filter(t => {
      const matchGenre = selectedGenre === 'All' || t.genre === selectedGenre;
      const matchMood = selectedMood === 'All' || t.mood === selectedMood;
      return matchGenre && matchMood;
    });
  }, [tracks, selectedGenre, selectedMood]);

  const moodsList: { mood: Mood; icon: string }[] = [
    { mood: 'Chill', icon: '😌' },
    { mood: 'Energy', icon: '🔥' },
    { mood: 'Focus', icon: '💻' },
    { mood: 'Romantic', icon: '❤️' },
    { mood: 'Sleep', icon: '🌙' },
    { mood: 'Workout', icon: '🏋️' },
    { mood: 'Party', icon: '🎉' }
  ];

  return (
    <div className="content-body">
      {/* Hero Featured Banner */}
      <HeroCarousel tracks={tracks} />

      {/* Mood Quick Pills */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.2rem', fontWeight: 800 }}>Vibe & Mood Selector</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>• Instant AI Soundscape</span>
          </div>
          <button
            onClick={() => setIsAiPlaylistModalOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(239, 35, 60, 0.12)',
              border: '1px solid var(--color-primary)',
              color: 'var(--color-primary)',
              padding: '6px 14px',
              borderRadius: 'var(--radius-pill)',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            <Wand2 size={15} /> AI Playlist Generator
          </button>
        </div>

        <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '4px' }}>
          {moodsList.map(item => {
            const isActive = selectedMood === item.mood;
            return (
              <button
                key={item.mood}
                onClick={() => {
                  setSelectedMood(isActive ? 'All' : item.mood);
                  setSelectedGenre('All');
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 18px',
                  borderRadius: 'var(--radius-pill)',
                  backgroundColor: isActive ? 'var(--color-primary)' : 'var(--bg-card)',
                  color: isActive ? '#ffffff' : 'var(--text-main)',
                  border: '1px solid ' + (isActive ? 'var(--color-primary)' : 'var(--border-color)'),
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease',
                  boxShadow: isActive ? '0 4px 14px var(--color-primary-glow)' : 'none'
                }}
              >
                <span>{item.icon}</span>
                <span>{item.mood}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* "You Might Like" Section */}
      <HorizontalTrackSlider
        title={selectedMood !== 'All' ? `${selectedMood} Vibes for You` : (selectedGenre !== 'All' ? `${selectedGenre} Selections` : 'You Might Like')}
        tracks={filteredTracks.slice(0, 4)}
        onSeeAll={() => setActiveTab('explore')}
      />

      {/* AI Personalized Recommendation Section */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ padding: '6px', borderRadius: '50%', backgroundColor: 'rgba(239, 35, 60, 0.15)', color: 'var(--color-primary)' }}>
              <Sparkles size={18} />
            </div>
            <div>
              <h2 className="section-title">AI Personalized Recommendations</h2>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {currentUser?.favoriteGenres?.length
                  ? `Tuned dynamically to your listening taste: ${currentUser.favoriteGenres.join(', ')}`
                  : 'Curated mix of Hindi, Punjabi and Global trending hits'}
              </div>
            </div>
          </div>
          <span className="section-see-all" onClick={() => setActiveTab('ai-chat')}>
            Ask AI Assistant
          </span>
        </div>

        <div className="cards-slider">
          {aiRecommendations.map(({ track, reason }) => (
            <div key={track.id} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <TrackCard
                track={track}
                trackList={aiRecommendations.map(r => r.track)}
              />
              <span style={{ fontSize: '0.74rem', color: 'var(--text-subtle)', fontStyle: 'italic', padding: '0 4px' }}>
                💡 {reason}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Curated Playlists */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div className="section-header">
          <h2 className="section-title">Featured & Collaborative Playlists</h2>
          <span className="section-see-all" onClick={() => setActiveTab('playlists')}>
            View All Playlists
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '18px' }}>
          {playlists.slice(0, 4).map(pl => (
            <div
              key={pl.id}
              onClick={() => {
                setSelectedPlaylist(pl);
                setActiveTab('playlists');
              }}
              style={{
                display: 'flex',
                gap: '14px',
                padding: '12px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <img
                src={pl.coverArt || (pl as any).cover_art || pl.tracks?.[0]?.albumArt || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80'}
                alt={pl.title}
                style={{ width: '64px', height: '64px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {pl.title}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  By {pl.creatorName || 'Curator'}
                </div>
                <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                  {(pl.reactions || []).slice(0, 3).map((r, i) => (
                    <span key={i} style={{ fontSize: '0.74rem', color: 'var(--text-subtle)' }}>
                      {r.emoji} {r.count}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
