import React, { useState } from 'react';
import {
  Play,
  Pause,
  Plus,
  Heart,
  Flame,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { Track } from '../../types';
import { useAudio } from '../../context/AudioContext';
import { useData } from '../../context/DataContext';

interface HeroCarouselProps {
  tracks: Track[];
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({ tracks }) => {
  const { currentTrack, isPlaying, playTrack, togglePlay } = useAudio();
  const { toggleLikeTrack, likedTrackIds, setIsCreatePlaylistModalOpen, addTrackToPlaylist, playlists } = useData();

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [toastMsg, setToastMsg] = useState<string>('');
  const featuredTracks = tracks.slice(0, 5);

  const activeHeroTrack = featuredTracks[currentIndex] || tracks[0];

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % featuredTracks.length);
  };

  const handlePrev = () => {
    setCurrentIndex(prev => (prev - 1 + featuredTracks.length) % featuredTracks.length);
  };

  if (!activeHeroTrack) return null;

  const isCurrentPlaying = currentTrack?.id === activeHeroTrack.id && isPlaying;
  const isLiked = likedTrackIds.includes(activeHeroTrack.id);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleAddToPlaylist = async () => {
    if (playlists.length > 0) {
      await addTrackToPlaylist(playlists[0].id, activeHeroTrack);
      setToastMsg(`Added to ${playlists[0].title}!`);
      setTimeout(() => setToastMsg(''), 2500);
    } else {
      setIsCreatePlaylistModalOpen(true);
    }
  };

  return (
    <div className="hero-banner-container">
      <img
        src={activeHeroTrack.albumArt || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&auto=format&fit=crop&q=80'}
        alt={activeHeroTrack.title}
        className="hero-banner-bg"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&auto=format&fit=crop&q=80';
        }}
      />
      <div className="hero-banner-overlay" />

      <div className="hero-content">
        {/* Trending Now Pill Badge */}
        <div className="hero-tag-trending">
          <Flame size={14} color="#f59e0b" />
          <span>Trending Spotlight</span>
        </div>

        {/* Title */}
        <h1 className="hero-title">{activeHeroTrack.title.toUpperCase()}</h1>

        {/* Metadata Row */}
        <div className="hero-meta-row">
          <span>{activeHeroTrack.year || 2024}</span>
          <span className="bullet">•</span>
          <span>{formatDuration(activeHeroTrack.duration || 210)}</span>
          <span className="bullet">•</span>
          <span>{activeHeroTrack.genre || 'Electronic'}</span>
          <span className="bullet">•</span>
          <span className="rating-chip">★ {activeHeroTrack.rating || 9.8}/10</span>
        </div>

        {/* Description */}
        <p className="hero-description">
          {activeHeroTrack.description || `${activeHeroTrack.title} by ${activeHeroTrack.artist}. Streamed globally with official high-definition audio.`}
        </p>

        {/* Hero Actions */}
        <div className="hero-actions">
          <button
            className="btn-play-hero"
            onClick={() => {
              if (currentTrack?.id === activeHeroTrack.id) {
                togglePlay();
              } else {
                playTrack(activeHeroTrack, featuredTracks);
              }
            }}
          >
            {isCurrentPlaying ? (
              <>
                <Pause size={18} fill="currentColor" /> Pause
              </>
            ) : (
              <>
                <Play size={18} fill="currentColor" /> Listen Now
              </>
            )}
          </button>

          <button
            className="btn-secondary-hero"
            onClick={handleAddToPlaylist}
          >
            <Plus size={17} /> Add to Playlist
          </button>

          <button
            className="icon-circle-btn"
            style={{
              backgroundColor: isLiked ? 'var(--color-primary)' : 'rgba(255, 255, 255, 0.1)',
              color: '#ffffff',
              borderColor: 'rgba(255, 255, 255, 0.2)'
            }}
            onClick={() => toggleLikeTrack(activeHeroTrack)}
            title={isLiked ? 'Unlike' : 'Like'}
          >
            <Heart size={18} fill={isLiked ? 'currentColor' : 'none'} />
          </button>

          {toastMsg && (
            <span style={{ fontSize: '0.82rem', color: '#10b981', fontWeight: 700, marginLeft: '8px' }}>
              ✓ {toastMsg}
            </span>
          )}
        </div>
      </div>

      {/* Carousel Navigation Arrows */}
      <div className="hero-arrows">
        <button
          className="hero-arrow-btn"
          onClick={handlePrev}
          aria-label="Previous featured track"
        >
          <ChevronUp size={20} />
        </button>
        <button
          className="hero-arrow-btn"
          onClick={handleNext}
          aria-label="Next featured track"
        >
          <ChevronDown size={20} />
        </button>
      </div>
    </div>
  );
};
